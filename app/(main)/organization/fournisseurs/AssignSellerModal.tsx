"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UserCheck, Save } from "lucide-react";
import { FournisseurResponse, ProducerAssignmentsService, SellerAdminService, SellerListItemResponse } from "@/src/src2/api";
import { getStoredSeller } from "@/src/api/session";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  fournisseur: FournisseurResponse | null;
  onClose: (updated: boolean) => void;
}

const AssignSellerModal = ({ isOpen, fournisseur, onClose }: Props) => {
  const [sellers, setSellers] = useState<SellerListItemResponse[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const org = getStoredSeller();
    if (!org?.organizationId || !fournisseur?.idFournisseur) return;

    setLoading(true);
    Promise.all([
      SellerAdminService.getAll1(org.organizationId),
      ProducerAssignmentsService.getForFournisseur(fournisseur.idFournisseur, org.organizationId).catch(() => null),
    ])
      .then(([sellersRes, currentAssignment]) => {
        setSellers(sellersRes);
        setSelectedSellerId(currentAssignment?.sellerId || "");
      })
      .catch(() => toast.error("Failed to load sellers."))
      .finally(() => setLoading(false));
  }, [isOpen, fournisseur]);

  if (!isOpen || !fournisseur) return null;

  const handleSave = async () => {
    const org = getStoredSeller();
    if (!org?.organizationId || !fournisseur.idFournisseur || !selectedSellerId) return;
    const seller = sellers.find((s) => s.id === selectedSellerId);

    setIsSaving(true);
    try {
      await ProducerAssignmentsService.assign({
        fournisseurId: fournisseur.idFournisseur,
        sellerId: selectedSellerId,
        sellerName: seller?.username,
        organizationId: org.organizationId,
      });
      toast.success(`${fournisseur.raisonSociale || fournisseur.username} assigned to ${seller?.username}.`);
      onClose(true);
    } catch (error) {
      toast.error("Failed to assign seller. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <UserCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-tight">Assign Seller</h2>
              <p className="text-xs text-gray-400 font-bold">{fournisseur.raisonSociale || fournisseur.username}</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Manager (Seller)</label>
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400 font-bold">Loading sellers...</div>
          ) : (
            <select
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-secondary-mid focus:bg-white transition-all"
            >
              <option value="">Select a seller...</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.username} {s.role ? `(${s.role.replace(/_/g, " ")})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedSellerId}
            className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            <Save size={18} />
            {isSaving ? "SAVING…" : "ASSIGN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSellerModal;
