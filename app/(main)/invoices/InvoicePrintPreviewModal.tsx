'use client';

import React from 'react';
import { UpdatedFactureResponse, FactureResponse } from '@/src/api/models/UpdatedFactureResponse';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: UpdatedFactureResponse;
  onConfirmPrint: () => void;
}

const InvoicePrintPreviewModal = ({ isOpen, onClose, data, onConfirmPrint }: PrintPreviewProps) => {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '---';

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Preview Header */}
        <div className="bg-white px-8 py-4 border-b border-slate-100 flex justify-between items-center no-print">
          <div>
            <h2 className="text-blue-600 font-black uppercase text-xs tracking-widest">Tax Invoice Preview</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Official financial document for payment collection</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
              Back to Editor
            </button>
            <button onClick={onConfirmPrint} className="px-8 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-transform active:scale-95">
              Confirm & Print Invoice
            </button>
          </div>
        </div>

        {/* Scrollable Viewport */}
        <div className="overflow-y-auto p-4 md:p-12 flex justify-center bg-slate-50 custom-scrollbar">
          <div className="origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform">
            
            {/* A4 Paper Sheet */}
            <div id="print-area" className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl flex flex-col text-slate-900 relative">
              
              {/* Branding & Status Stamp */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10 relative">
                <div>
                  <div className="h-16 w-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-3xl shadow-lg uppercase">
                    {data.nomClient?.charAt(0) || 'I'}
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Invoice</h1>
                  <div className="mt-4 flex gap-8">
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Invoice No</p>
                      <p className="text-sm font-black text-blue-600">{data.numeroFacture || 'DRAFT-INV'}</p>
                    </div>
                    {data.vosRef && (
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Client Ref</p>
                        <p className="text-sm font-black text-slate-900">{data.vosRef}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Status Stamp */}
                <div className="absolute right-[250px] top-10 -rotate-12 opacity-20 pointer-events-none">
                    <div className={`border-4 px-6 py-2 rounded-xl text-4xl font-black uppercase ${data.etat === FactureResponse.etat.PAYE ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'}`}>
                        {data.etat}
                    </div>
                </div>
                
                <div className="text-right">
                  <p className="font-black text-sm text-slate-900 uppercase mb-2">Your Business Entity</p>
                  <address className="text-[10px] text-slate-400 leading-relaxed not-italic">
                    Tax ID: RC/DLA/2024/B/123<br />
                    Main Avenue, 4th Floor<br />
                    Douala, Cameroon
                  </address>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest border-l-2 border-blue-600 pl-3">Bill To</p>
                  <p className="text-base font-black text-slate-900 mb-1">{data.nomClient}</p>
                  <p className="text-xs text-slate-500 leading-relaxed w-3/4">{data.adresseClient || "No address"}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{data.telephoneClient} • {data.emailClient}</p>
                </div>
                
                <div className="flex justify-end">
                  <div className="space-y-3 w-full max-w-[200px]">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Billing Date</span>
                      <span className="text-xs font-black text-slate-900">{formatDate(data.dateFacturation)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Due Date</span>
                      <span className="text-xs font-black text-red-600">{formatDate(data.dateEcheance)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Payment</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase">{data.modeReglement}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="flex-grow">
                <table className="w-full mb-8 border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-left rounded-l-lg">Services / Products</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">Qty</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-right">Unit Price</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-right rounded-r-lg">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.lignesFacture?.map((line, i) => (
                      <tr key={i} className="break-inside-avoid">
                        <td className="py-5 px-4">
                          <p className="text-xs font-bold text-slate-900">{line.nomProduit || 'Item'}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">{line.description}</p>
                        </td>
                        <td className="py-5 px-4 text-center text-xs font-black text-slate-600">{line.quantite}</td>
                        <td className="py-5 px-4 text-right text-xs font-bold text-slate-900">{line.prixUnitaire?.toLocaleString()}</td>
                        <td className="py-5 px-4 text-right text-xs font-black text-slate-900">{line.montantTotal?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="mt-8 pt-8 border-t-2 border-slate-100">
                <div className="flex justify-between">
                  <div className="w-1/2">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Payment Instructions</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-600 leading-relaxed italic">
                            {data.notes || "Please include the invoice number as reference for bank transfers. Payment is required by the due date mentioned above."}
                        </p>
                    </div>
                  </div>

                  <div className="w-72 space-y-2">
                    <div className="flex justify-between items-center px-4 text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Total HT</span>
                      <span className="font-bold text-slate-900">{data.montantHT?.toLocaleString()} {data.devise}</span>
                    </div>
                    {data.applyVat && (
                      <div className="flex justify-between items-center px-4 text-xs">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">TVA (19.25%)</span>
                        <span className="font-bold text-slate-900">{data.montantTVA?.toLocaleString()} {data.devise}</span>
                      </div>
                    )}
                    {(data.remiseGlobaleMontant ?? 0) > 0 && (
                      <div className="flex justify-between items-center px-4 text-xs text-red-600">
                        <span className="font-bold uppercase text-[10px]">Discount ({data.remiseGlobalePourcentage}%)</span>
                        <span className="font-bold">-{data.remiseGlobaleMontant?.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Final Amount TTC</span>
                        <span className="text-[10px] font-bold bg-blue-500 px-2 py-0.5 rounded">{data.devise}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-3">
                        <span className="text-3xl font-black">{data.finalAmount?.toLocaleString()}</span>
                      </div>
                      
                      {/* Balance Due Section */}
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-[9px] font-bold uppercase text-blue-400">Balance Due</span>
                        <span className={`text-sm font-black ${data.montantRestant === 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                            {data.montantRestant === 0 ? 'FULLY PAID' : `${data.montantRestant?.toLocaleString()} ${data.devise}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10 text-center">
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.4em]">
                  Tax Invoice • Secure Document • {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintPreviewModal;