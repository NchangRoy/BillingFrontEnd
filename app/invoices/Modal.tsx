'use client'

import React from 'react';
import { LigneFactureResponse } from '@/src/api';
import { 
  X, 
  Receipt, 
  Calculator, 
  Landmark 
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void; // Combined control
  data?: LigneFactureResponse;
}

const formatCurrency = (amount?: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount || 0);

const LineDetailModal = ({ isOpen, setOpen, data }: ModalProps) => {
  // Guard clause: Don't render if not open or no data
  if (!isOpen || !data) return null;

  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1";
  const sectionTitle = "text-[11px] font-black text-secondary-mid uppercase mb-4 flex items-center gap-2 tracking-wider";

  return (
    <div className="fixed  inset-0 z-[100] flex right-0 bottom-0 p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-900/20">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Line Item Details</h2>
              <p className="text-xs text-gray-500 font-medium">Ref: {data.idLigne || 'System Generated'}</p>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8">
          
          {/* Section 1: Product Identification */}
          <div>
            <p className={labelClass}>Description & Product</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {data.description || data.nomProduit || "Generic Service/Product"}
            </h3>
            {data.idProduit && (
              <p className="text-xs text-gray-400 mt-1 font-medium italic underline decoration-secondary-mid/30">
                SKU: {data.idProduit}
              </p>
            )}
          </div>

          {/* Section 2: Financial Breakdown */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className={sectionTitle}>
              <Calculator size={14} /> Pricing Breakdown
            </h4>
            <div className="grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <p className={labelClass}>Quantity</p>
                <p className="text-xl font-black text-gray-800 tracking-tighter">{data.quantite}</p>
              </div>
              <div>
                <p className={labelClass}>Unit Price</p>
                <p className="text-sm font-bold text-gray-700">{formatCurrency(data.prixUnitaire)}</p>
              </div>
              <div>
                <p className={labelClass}>Taxable</p>
                <div className="mt-1">
                  {data.isTaxLine ? (
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-tighter">Tax Applied</span>
                  ) : (
                    <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">Tax Exempt</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Accounting Impact */}
          <div>
            <h4 className={sectionTitle}>
              <Landmark size={14} /> Accounting impact
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-100 bg-white">
                <p className={labelClass}>Debit (Dr)</p>
                <p className="text-lg font-bold text-emerald-600 tracking-tight">{formatCurrency(data.debit)}</p>
              </div>
              <div className="p-4 rounded-2xl border border-gray-100 bg-white">
                <p className={labelClass}>Credit (Cr)</p>
                <p className="text-lg font-bold text-rose-600 tracking-tight">{formatCurrency(data.credit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-gray-900 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Line Total (TTC)</p>
            <p className="text-2xl font-black text-white tracking-tight">
              {formatCurrency(data.montantTotal)}
            </p>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineDetailModal;