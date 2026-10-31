"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UserCog, Save, RefreshCw, KeyRound } from "lucide-react";
import { ApiError, SellerAdminService, SellerListItemResponse } from "@/src/src2/api";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (updated: boolean) => void;
  seller: SellerListItemResponse | null;
}

const ROLE_OPTIONS = [
  { value: "POS_SELLER", label: "POS Seller" },
  { value: "SELLER", label: "Seller" },
  { value: "AGENCY_MANAGER", label: "Agency Manager" },
];

const UpdateInfoModal = ({ isOpen, onClose, seller }: Props) => {
  const [role, setRole] = useState("SELLER");
  const [pin, setPin] = useState<string | null>(null);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [isRegeneratingPin, setIsRegeneratingPin] = useState(false);

  useEffect(() => {
    if (!isOpen || !seller) return;
    document.body.style.overflow = "hidden";
    setRole(seller.role || "SELLER");
    setPin(seller.pin ?? null);
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, seller]);

  const roleChanged = seller ? role !== (seller.role || "SELLER") : false;

  const handleSaveRole = async () => {
    if (!seller?.id || !roleChanged) return;
    setIsSavingRole(true);
    try {
      await SellerAdminService.updateRole(seller.id, { role });
      toast.success("Role updated successfully.");
      onClose(true);
    } catch (error) {
      const message = error instanceof ApiError ? (error.body?.message ?? error.message) : "Failed to update role. Please try again.";
      toast.error(message);
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleRegeneratePin = async () => {
    if (!seller?.id) return;
    setIsRegeneratingPin(true);
    try {
      const res = await SellerAdminService.regeneratePin(seller.id);
      setPin(res.pin ?? null);
      toast.success(`New POS PIN generated: ${res.pin}`, { duration: 15000 });
    } catch (error) {
      const message = error instanceof ApiError ? (error.body?.message ?? error.message) : "Failed to regenerate PIN. Please try again.";
      toast.error(message);
    } finally {
      setIsRegeneratingPin(false);
    }
  };

  if (!isOpen || !seller) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => onClose(pin !== (seller.pin ?? null))} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <UserCog size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Update Info</h2>
              <p className="text-xs text-gray-400 font-bold">{[seller.firstName, seller.lastName].filter(Boolean).join(" ") || seller.email}</p>
            </div>
          </div>
          <button onClick={() => onClose(pin !== (seller.pin ?? null))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {/* Role */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Role</p>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PIN */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">POS Quick-Login PIN</p>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <KeyRound size={16} className="text-secondary-mid" />
                <span className="font-mono font-black text-lg text-secondary-mid tracking-widest">
                  {pin || "-"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRegeneratePin}
                disabled={isRegeneratingPin}
                className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-secondary-mid hover:text-secondary-mid text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <RefreshCw size={13} className={isRegeneratingPin ? "animate-spin" : ""} />
                {isRegeneratingPin ? "Regenerating…" : "Regenerate"}
              </button>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-2">Regenerating immediately replaces the current PIN — the old one stops working right away.</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => onClose(pin !== (seller.pin ?? null))}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveRole}
            disabled={isSavingRole || !roleChanged}
            className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
          >
            <Save size={18} />
            {isSavingRole ? "SAVING…" : "SAVE ROLE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfoModal;
