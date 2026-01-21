"use client";

import React from "react";
import { FournisseurCreateRequest } from "@/src/api";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  initialData?: Partial<FournisseurCreateRequest>;
  onSubmit?: (payload: FournisseurCreateRequest) => void;
}

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const SupplierFormModal = ({ isOpen, onClose, initialData, onSubmit }: Props) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const payload: FournisseurCreateRequest = {
      username: raw.username as string,
      categorie: raw.categorie as string,
      siteWeb: (raw.siteWeb as string) || undefined,
      adresse: raw.adresse as string,
      telephone: (raw.telephone as string) || undefined,
      email: (raw.email as string) || undefined,
      typeFournisseur: raw.typeFournisseur as FournisseurCreateRequest.typeFournisseur,
      raisonSociale: (raw.raisonSociale as string) || undefined,
      numeroTva: (raw.numeroTva as string) || undefined,
      codeFournisseur: (raw.codeFournisseur as string) || undefined,
      limiteCredit: raw.limiteCredit ? Number(raw.limiteCredit) : undefined,
      actif: raw.actif === "on",
      ntva: raw.ntva === "on",
    };

    if (onSubmit) onSubmit(payload);
    onClose(false); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-end p-6 pointer-events-none animate-in fade-in duration-300">
      {/* Click-outside area */}
      <div className="absolute inset-0 pointer-events-auto" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col pointer-events-auto animate-in slide-in-from-right-10 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <div>
            <h2 className="text-secondary text-lg font-black tracking-tight leading-none">
              {isEditing ? "Edit Supplier" : "New Supplier"}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">
               {isEditing ? `Vendor: ${initialData.username}` : "Register New Vendor"}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => onClose(false)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseIcon className="text-gray-400" fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            
            <div className="md:col-span-2 border-b border-gray-50 pb-1">
              <h3 className="text-secondary-mid text-[10px] font-black uppercase tracking-widest">1. Supplier Identity</h3>
            </div>

            <div>
              <label className={labelStyles}>Username *</label>
              <input required type="text" name="username" defaultValue={initialData?.username} className={inputStyles} placeholder="vendor_unique_name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyles}>Category</label>
                <select required name="categorie" defaultValue={initialData?.categorie || ""} className={inputStyles}>
                  <option value="" disabled>Select...</option>
                  <option value="Grossiste">Grossiste</option>
                  <option value="Détaillant">Détaillant</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>Type</label>
                <select required name="typeFournisseur" defaultValue={initialData?.typeFournisseur || ""} className={inputStyles}>
                  {Object.values(FournisseurCreateRequest.typeFournisseur).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 border-b border-gray-50 pb-1 mt-2">
              <h3 className="text-secondary-mid text-[10px] font-black uppercase tracking-widest">2. Business Details</h3>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>Raison Sociale</label>
              <input type="text" name="raisonSociale" defaultValue={initialData?.raisonSociale} className={inputStyles} placeholder="Legal company name" />
            </div>

            <div>
              <label className={labelStyles}>Supplier Code</label>
              <input type="text" name="codeFournisseur" defaultValue={initialData?.codeFournisseur} className={inputStyles} placeholder="SUP-001" />
            </div>

            <div>
              <label className={labelStyles}>VAT Number</label>
              <input type="text" name="numeroTva" defaultValue={initialData?.numeroTva} className={inputStyles} placeholder="Tax ID" />
            </div>

            <div>
              <label className={labelStyles}>Credit Limit</label>
              <input type="number" name="limiteCredit" defaultValue={initialData?.limiteCredit} className={inputStyles} />
            </div>

            <div>
              <label className={labelStyles}>Website</label>
              <input type="url" name="siteWeb" defaultValue={initialData?.siteWeb} className={inputStyles} placeholder="https://..." />
            </div>

            <div className="md:col-span-2 border-b border-gray-50 pb-1 mt-2">
              <h3 className="text-secondary-mid text-[10px] font-black uppercase tracking-widest">3. Contact Info</h3>
            </div>

            <div>
              <label className={labelStyles}>Email Address</label>
              <input type="email" name="email" defaultValue={initialData?.email} className={inputStyles} />
            </div>

            <div>
              <label className={labelStyles}>Phone Number</label>
              <input type="tel" name="telephone" defaultValue={initialData?.telephone} className={inputStyles} />
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>Full Address *</label>
              <input required name="adresse" defaultValue={initialData?.adresse} className={inputStyles} />
            </div>

            <div className="flex gap-6 mt-2 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="actif" defaultChecked={initialData?.actif ?? true} className="w-4 h-4 accent-secondary-mid" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Active Supplier</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="ntva" defaultChecked={initialData?.ntva} className="w-4 h-4 accent-secondary-mid" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">VAT Exempt</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end border-t border-gray-50 pt-6">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-secondary-mid hover:bg-secondary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md shadow-secondary-mid/10"
            >
              {isEditing ? "Update Supplier" : "Register Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierFormModal;