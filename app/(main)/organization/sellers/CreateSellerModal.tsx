"use client";

import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UserPlus, Save, Users, Mail } from "lucide-react";
import { SellerAdminService, ApiError } from "@/src/src2/api";
import { listOrganizationEmployees, createSellerFromEmployee, OrganizationEmployeeResponse } from "@/src/api/sellerEmployees";
import { getStoredSeller } from "@/src/api/session";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (created: boolean) => void;
}

type Mode = "EMPLOYEE" | "INVITE";
type SalesPersonnelRole = 'POS_SELLER' | 'SELLER' | 'AGENCY_MANAGER';

const ROLE_OPTIONS: { value: SalesPersonnelRole; label: string; description: string }[] = [
  { value: "POS_SELLER", label: "POS Seller", description: "Point-of-sale checkout only" },
  { value: "SELLER", label: "Seller", description: "Standard sales personnel" },
  { value: "AGENCY_MANAGER", label: "Agency Manager", description: "Manages an agency's sellers and sessions" },
];

const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

const RoleGrid = ({ role, onChange }: { role: SalesPersonnelRole; onChange: (role: SalesPersonnelRole) => void }) => (
  <div className="space-y-2">
    <label className={label}>Role</label>
    <div className="grid grid-cols-3 gap-3">
      {ROLE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`text-left p-3 rounded-xl border-2 transition-all ${
            role === option.value
              ? "border-secondary-mid bg-secondary-super-light/50"
              : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <p className="text-sm font-black text-secondary">{option.label}</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{option.description}</p>
        </button>
      ))}
    </div>
  </div>
);

const extractErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? (error.body?.message ?? error.message) : fallback;

const CreateSellerModal = ({ isOpen, onClose }: Props) => {
  const [mode, setMode] = useState<Mode>("EMPLOYEE");
  const [isSaving, setIsSaving] = useState(false);

  // Invite-new mode state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<SalesPersonnelRole>("SELLER");

  // Add-from-employee mode state
  const [employees, setEmployees] = useState<OrganizationEmployeeResponse[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employeeRole, setEmployeeRole] = useState<SalesPersonnelRole>("SELLER");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMode("EMPLOYEE");
      setInviteEmail("");
      setInviteRole("SELLER");
      setSelectedEmployeeId("");
      setEmployeeRole("SELLER");
      setEmployeesError(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== "EMPLOYEE") return;
    const org = getStoredSeller();
    if (!org?.organizationId) return;
    setIsLoadingEmployees(true);
    setEmployeesError(null);
    listOrganizationEmployees(org.organizationId)
      .then(setEmployees)
      .catch((error) => setEmployeesError(extractErrorMessage(error, "Failed to load employees.")))
      .finally(() => setIsLoadingEmployees(false));
  }, [isOpen, mode]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId]
  );

  const handleSaveInvite = async () => {
    const seller = getStoredSeller();
    if (!seller?.organizationId) return;

    setIsSaving(true);
    try {
      const res = await SellerAdminService.create1({
        email: inviteEmail,
        role: inviteRole,
        organizationId: seller.organizationId,
        organizationName: seller.organizationName || undefined,
      });
      toast.success(`Sales personnel invited — an email with their login credentials has been sent. POS PIN: ${res.pin}`, { duration: 15000 });
      onClose(true);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to create seller. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFromEmployee = async () => {
    const seller = getStoredSeller();
    if (!seller?.organizationId || !selectedEmployee) return;

    setIsSaving(true);
    try {
      const res = await createSellerFromEmployee({
        email: selectedEmployee.email || "",
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        role: employeeRole,
        organizationId: seller.organizationId,
        organizationName: seller.organizationName || undefined,
      });
      toast.success(`${selectedEmployee.firstName} ${selectedEmployee.lastName} added as a seller — active immediately. POS PIN: ${res.pin}`, { duration: 15000 });
      onClose(true);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to add seller. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const canSaveEmployee = !!selectedEmployee && !selectedEmployee.alreadySeller;
  const canSaveInvite = /\S+@\S+\.\S+/.test(inviteEmail);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">New Sales Personnel</h2>
              <p className="text-xs text-gray-400 font-bold">Add an existing employee, or invite someone new</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* MODE TABS */}
        <div className="px-8 pt-5 bg-white shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-gray-50 border border-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMode("EMPLOYEE")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                mode === "EMPLOYEE" ? "bg-white shadow-sm text-secondary-mid" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Users size={14} /> Add from Employee
            </button>
            <button
              type="button"
              onClick={() => setMode("INVITE")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                mode === "INVITE" ? "bg-white shadow-sm text-secondary-mid" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Mail size={14} /> Invite Seller
            </button>
          </div>
        </div>

        {/* BODY */}
        {mode === "EMPLOYEE" ? (
          <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
            <div className="space-y-2">
              <label className={label}>Employee</label>
              <select
                className={`${inputWrapper} appearance-none cursor-pointer`}
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={isLoadingEmployees || !!employeesError}
              >
                <option value="">{isLoadingEmployees ? "Loading employees…" : "Select an employee…"}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} disabled={emp.alreadySeller}>
                    {emp.firstName} {emp.lastName} — {emp.email}{emp.alreadySeller ? " (already a seller)" : ""}
                  </option>
                ))}
              </select>
              {employeesError && (
                <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {employeesError}
                </p>
              )}
              {!isLoadingEmployees && !employeesError && employees.length === 0 && (
                <p className="text-xs text-gray-400 font-medium px-1">No employees found for this organization.</p>
              )}
            </div>

            {selectedEmployee && (
              <>
                <RoleGrid role={employeeRole} onChange={setEmployeeRole} />
                <p className="text-xs text-gray-400 font-medium bg-secondary-super-light/50 rounded-xl px-4 py-3">
                  This person already has Kernel login credentials — they'll be added as a seller and marked <span className="font-black text-secondary-mid">active</span> immediately. No invitation email is sent.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
            <div className="space-y-2">
              <label className={label}>Email</label>
              <div className={inputWrapper}>
                <input
                  type="email"
                  placeholder="seller@yowyob.com"
                  className={inputStyle}
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>

            <RoleGrid role={inviteRole} onChange={setInviteRole} />

            <p className="text-xs text-gray-400 font-medium bg-secondary-super-light/50 rounded-xl px-4 py-3">
              This person will be invited into the organization and their seller account will be marked <span className="font-black text-secondary-mid">pending</span> until they accept. An invitation email with login credentials will be sent to this address.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
          >
            Discard
          </button>
          {mode === "EMPLOYEE" ? (
            <button
              onClick={handleSaveFromEmployee}
              disabled={isSaving || !canSaveEmployee}
              className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              <Save size={18} />
              {isSaving ? "ADDING…" : "ADD SELLER"}
            </button>
          ) : (
            <button
              onClick={handleSaveInvite}
              disabled={isSaving || !canSaveInvite}
              className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              <Save size={18} />
              {isSaving ? "INVITING…" : "INVITE SALES PERSONNEL"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSellerModal;
