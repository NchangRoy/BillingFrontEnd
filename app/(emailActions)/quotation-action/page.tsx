'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, Edit3, XCircle, AlertTriangle, 
  ArrowLeft, Save, RefreshCw, Trash2, ChevronRight, Info
} from 'lucide-react';
import { MOCK_QUOTATIONS, UpdatedDevisResponse } from '@/src/api/models/UpdatedDevisResponse';

export default function QuotationActionPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; token?: string }>;
}) {
  const { action, token } = use(searchParams);
  
  const originalQuotation = useMemo(() => 
    MOCK_QUOTATIONS.find(q => q.idDevis === "DV-2026-001"), 
  []);

  const [quotation, setQuotation] = useState<UpdatedDevisResponse | undefined>(
    JSON.parse(JSON.stringify(originalQuotation))
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const updateField = (index: number, field: 'quantite' | 'prixUnitaire', value: number) => {
    if (!quotation || !quotation.lignesDevis) return;
    const newLines = [...quotation.lignesDevis];
    newLines[index] = {
      ...newLines[index],
      [field]: value,
      montantTotal: field === 'quantite' 
        ? value * (newLines[index].prixUnitaire || 0)
        : (newLines[index].quantite || 0) * value
    };
    setQuotation({ ...quotation, lignesDevis: newLines });
  };

  const currentStatus = action === 'accept' ? 'APPROVED' : action === 'reject' ? 'DECLINED' : 'REVISION';

  if (!token || !quotation || !originalQuotation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <AlertTriangle className="mb-4 text-amber-500" size={40} />
        <p className="font-medium">Session expired or invalid token.</p>
        <Link href="/" className="mt-4 text-blue-600 flex items-center gap-2 text-sm">
          <ArrowLeft size={14}/> Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-slate-900">
      {/* 1. HIGH-DENSITY TOP NAV */}
      <header className="h-14 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-black text-xs">Y</div>
             <span className="font-bold tracking-tight text-sm">YOWYOB <span className="text-slate-500 font-normal">| DEVIS</span></span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden md:block" />
          <nav className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span>CLIENT PORTAL</span>
            <ChevronRight size={12} />
            <span className="text-white">QUOTATION {quotation.numeroDevis}</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
           <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
             action === 'accept' ? 'bg-emerald-500/20 text-emerald-400' : 
             action === 'reject' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
           }`}>
             {currentStatus}
           </span>
        </div>
      </header>

      {/* 2. SUB-HEADER / CONTEXT BAR */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-3">
            {action === 'modify' ? <Edit3 size={20} className="text-blue-600"/> : <CheckCircle size={20} className="text-emerald-500"/>}
            {quotation.numeroDevis}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Created on {new Date(quotation.dateCreation!).toLocaleDateString()} • Valid until {new Date(quotation.dateValidite!).toLocaleDateString()}
          </p>
        </div>
        
        {action === 'modify' && (
          <div className="flex items-center gap-3">
             <div className="text-right mr-4">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Grand Total</span>
                <span className="text-xl font-black text-slate-900">
                  {quotation.lignesDevis?.reduce((acc, curr) => acc + (curr.montantTotal || 0), 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">{quotation.devise}</span>
                </span>
             </div>
             <button 
              onClick={() => setIsUpdating(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded shadow-sm font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
             >
              {isUpdating ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>}
              Apply Revisions
             </button>
          </div>
        )}
      </div>

      {/* 3. MAIN FULL-WIDTH CONTENT */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {action === 'modify' ? (
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
                <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <th className="py-4 px-6 text-left w-1/3">Item Details</th>
                  <th className="py-4 px-6 text-left">Unit Price ({quotation.devise})</th>
                  <th className="py-4 px-6 text-center w-32">Quantity</th>
                  <th className="py-4 px-6 text-right w-40">Subtotal</th>
                  <th className="py-4 px-6 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.lignesDevis?.map((line, idx) => {
                  const originalLine = originalQuotation.lignesDevis?.[idx];
                  const isPriceChanged = line.prixUnitaire !== originalLine?.prixUnitaire;

                  return (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="font-semibold text-slate-900">{line.nomProduit}</div>
                        <div className="text-xs text-slate-500 truncate max-w-md">{line.description}</div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                           <div className="relative group/price">
                              {isPriceChanged && (
                                <span className="absolute -top-4 left-0 text-[9px] text-red-500 line-through font-bold">
                                  {originalLine?.prixUnitaire?.toLocaleString()}
                                </span>
                              )}
                              <input 
                                type="number"
                                value={line.prixUnitaire}
                                onChange={(e) => updateField(idx, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                                className={`w-28 bg-white border h-9 px-3 rounded text-sm font-bold transition-all focus:ring-1 ${
                                  isPriceChanged ? 'border-blue-300 bg-blue-50/50 text-blue-700' : 'border-slate-200'
                                }`}
                              />
                           </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <input 
                          type="number" 
                          value={line.quantite}
                          onChange={(e) => updateField(idx, 'quantite', parseInt(e.target.value) || 0)}
                          className="w-20 h-9 border border-slate-200 rounded text-center font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="py-5 px-6 text-right font-black text-slate-900 tabular-nums">
                        {line.montantTotal?.toLocaleString()}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md text-center">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${action === 'accept' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                 {action === 'accept' ? <CheckCircle size={32}/> : <XCircle size={32}/>}
               </div>
               <h2 className="text-2xl font-bold mb-2">Transaction {action === 'accept' ? 'Approved' : 'Declined'}</h2>
               <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">"{currentStatus === 'APPROVED' ? 'Final invoice is being generated.' : 'This record has been archived for your reference.'}"</p>
               <Link href="/" className="px-6 py-2 border border-slate-200 rounded text-sm font-bold hover:bg-slate-50 transition-colors">
                  Return to Dashboard
               </Link>
            </div>
          </div>
        )}

        {/* 4. SYSTEM LOG / FOOTER (Optional but professional) */}
        {action === 'modify' && (
          <footer className="border-t border-slate-200 bg-slate-50 p-4 shrink-0 flex items-center gap-4 text-slate-500">
             <Info size={14} className="text-blue-500"/>
             <p className="text-[10px] font-medium uppercase tracking-tight">Changes made here will notify the account manager to regenerate the PDF. All edits are logged.</p>
          </footer>
        )}
      </main>
    </div>
  );
}