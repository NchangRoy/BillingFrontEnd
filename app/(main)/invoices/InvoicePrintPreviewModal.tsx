'use client';

import React from 'react';
import { Truck, Package, MapPin, User, Calendar, ClipboardCheck, Phone } from 'lucide-react';
import { UpdatedFactureResponse } from '@/src/api/models/UpdatedFactureResponse';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: UpdatedFactureResponse;
  onConfirmPrint: () => void;
}

const DeliveryNotePrintPreviewModal = ({ isOpen, onClose, data, onConfirmPrint }: PrintPreviewProps) => {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '---';

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-5xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Preview Header */}
        <div className="bg-white px-8 py-4 border-b flex justify-between items-center no-print">
          <div>
            <h2 className="text-blue-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <Truck size={14} /> Delivery Note Preview
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Verify logistics & quantities for dispatch</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all">
              Back to Editor
            </button>
            <button onClick={onConfirmPrint} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-transform active:scale-95">
              Confirm & Print BL
            </button>
          </div>
        </div>

        {/* Scrollable Viewport */}
        <div className="overflow-y-auto p-4 md:p-12 flex justify-center bg-gray-200/40 custom-scrollbar">
          
          <div className="origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform">
            
            {/* A4 Paper Sheet */}
            <div id="print-area" className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl flex flex-col text-slate-800 relative">
              
              {/* Branding Header */}
              <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-10">
                <div>
                  <div className="h-16 w-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-3xl shadow-lg">
                    <Package size={32} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Bon de Livraison</h1>
                  <div className="mt-4 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Document Ref</p>
                    <p className="text-sm font-black text-blue-600 uppercase">{data.deliveryNoteNumber || '---'}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-2">SO Reference: {data.SaleOrderNumber || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-black text-sm text-slate-900 uppercase mb-2">Your Business Name</p>
                  <address className="text-[10px] text-gray-500 leading-relaxed not-italic">
                    Logistics Hub - Zone Industrielle<br />
                    Douala, Cameroon<br />
                    <span className="font-bold text-gray-400">Warehouse ID:</span> WH-001<br />
                    <span className="font-bold text-gray-400">Dispatch:</span> +237 600 000 000
                  </address>
                </div>
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest border-l-2 border-blue-600 pl-3">Delivery To</p>
                  <p className="text-base font-black text-slate-900 mb-1">{data.recipientName || data.nomClient}</p>
                  <div className="flex gap-2 items-start text-xs text-gray-500 leading-relaxed">
                    <MapPin size={12} className="mt-0.5 shrink-0 text-blue-400" />
                    <span>{data.recipientAddress || "Standard Delivery Address"}</span>
                  </div>
                  <div className="flex gap-2 items-center text-xs text-gray-500 mt-2">
                    <Phone size={12} className="text-blue-400" />
                    <span>{data.recipientPhone || "No contact provided"}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="space-y-3 w-full max-w-[200px] bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center border-b border-white pb-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Delivery Date</span>
                      <span className="text-[11px] font-black text-slate-800">{formatDate(data.deliveryDate)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white pb-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Carrier</span>
                      <span className="text-[11px] font-black text-blue-600 uppercase">{data.deliveryAgency || 'Internal Fleet'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Status</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black uppercase">Pending Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table: Item List Only (Financials Hidden) */}
              <div className="flex-grow">
                <table className="w-full mb-8 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b-2 border-slate-200">
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-left">Line</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-left">Description of Goods</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center w-24">Unit</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center w-32">Qty Shipped</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center w-32">Qty Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.lines?.map((item, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 text-[10px] text-slate-400 font-mono">{String(i + 1).padStart(2, '0')}</td>
                        <td className="py-4 px-4">
                          <p className="text-xs font-bold text-slate-700">{item.description}</p>
                          <p className="text-[9px] text-gray-400 italic">SKU: {item.idProduit?.split('-')[0]}</p>
                        </td>
                        <td className="py-4 px-4 text-center text-xs text-slate-500 uppercase font-bold">Unit</td>
                        <td className="py-4 px-4 text-center text-sm font-black text-slate-900 bg-slate-50/50">{item.quantity}</td>
                        <td className="py-4 px-4 border-l border-slate-100">
                            <div className="mx-auto w-12 h-6 border-b border-dotted border-slate-300"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legal & Signatures Section (Crucial for BL) */}
              <div className="mt-8 pt-8 border-t-2 border-slate-100">
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <ClipboardCheck size={12} /> Warehouse Release
                    </p>
                    <div className="h-24 border border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-end justify-center pb-2">
                       <span className="text-[8px] text-slate-300 uppercase font-bold">Storekeeper Signature</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Truck size={12} /> Carrier/Driver
                    </p>
                    <div className="h-24 border border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-end justify-center pb-2">
                       <span className="text-[8px] text-slate-300 uppercase font-bold">Driver Name & ID</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <User size={12} /> Customer Receipt
                    </p>
                    <div className="h-24 border-2 border-slate-200 rounded-xl bg-white shadow-inner flex items-end justify-center pb-2">
                       <span className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Confirm Quantity Received</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Terms of Acceptance</p>
                    <p className="text-[9px] text-gray-400 leading-relaxed italic">
                        {data.termsAndConditions || "I hereby certify that the goods listed above have been received in good condition and in the quantities specified. Any discrepancy must be reported immediately on this document."}
                    </p>
                </div>
              </div>

              <div className="mt-auto pt-10 text-center">
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                  Dispatch Verified • System Pro Logistics • {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNotePrintPreviewModal;