'use client';

import React, { useState, useRef } from 'react';
import { UpdatedDevisResponse } from '@/src/api/models/UpdatedDevisResponse';

type PrintFormat = 'A4' | 'Thermal';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: UpdatedDevisResponse;
  onConfirmPrint: () => void;
}

const PrintPreviewModal = ({ isOpen, onClose, data, onConfirmPrint }: PrintPreviewProps) => {
  const [format, setFormat] = useState<PrintFormat>('A4');
  const [isSending, setIsSending] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null); 

  if (!isOpen) return null;

  // --- Backend Integration Logic ---
  const handleSendToBackend = async () => {
    if (!printAreaRef.current) return;
    
    setIsSending(true);
    try {
      const htmlContent = printAreaRef.current.innerHTML;
      
      const payload = {
        documentReference: data.numeroDevis,
        documentType: 'QUOTATION',
        format: format,
        htmlContent: htmlContent,
        clientId: data.idClient,
      };

      const response = await fetch('/api/documents/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Document successfully sent to server!");
      }
    } catch (error) {
      console.error("Error sending to backend:", error);
      alert("Error occurred while sending to server.");
    } finally {
      setIsSending(false);
    }
  };

  const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.devise || 'XAF',
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : '---';

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-5xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Preview Header & Format Selector */}
        <div className="bg-white px-8 py-4 border-b flex justify-between items-center no-print">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-primary font-black uppercase text-xs tracking-widest">Print Format</h2>
              <div className="flex gap-2 mt-2 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFormat('A4')}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${format === 'A4' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  Standard A4
                </button>
                <button 
                  onClick={() => setFormat('Thermal')}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${format === 'Thermal' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  Receipt (80mm)
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Close
            </button>
            <button 
              onClick={handleSendToBackend}
              disabled={isSending}
              className="px-5 py-2.5 border border-secondary-mid text-secondary-mid rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send By Email'}
            </button>
            <button 
              onClick={onConfirmPrint} 
              className="px-8 py-2.5 bg-secondary-mid hover:bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
            >
              Print Now
            </button>
          </div>
        </div>

        {/* Scrollable Viewport */}
        <div className="overflow-y-auto p-4 md:p-12 flex justify-center bg-gray-200/40 custom-scrollbar">
          <div ref={printAreaRef} id="print-area" className="origin-top transition-all duration-300">
            
            {format === 'A4' ? (
              /* --- A4 TEMPLATE (English) --- */
              <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl flex flex-col text-slate-800">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                  <div>
                    <div className="h-12 w-12 bg-slate-900 rounded-xl mb-4 flex items-center justify-center text-white font-black text-xl">
                      {data.nomClient?.charAt(0) || 'Q'}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">QUOTATION</h1>
                    <p className="text-xs font-black text-slate-700 mt-2">{data.numeroDevis}</p>
                  </div>
                  <div className="text-right text-[10px] text-gray-500">
                    <p className="font-black text-slate-900 uppercase">Your Business Name</p>
                    <p>123 Business Avenue, Douala</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                   <div>
                     <p className="text-[10px] font-black text-secondary-mid uppercase mb-2">Bill To</p>
                     <p className="text-sm font-black text-slate-900">{data.nomClient}</p>
                     <p className="text-xs text-gray-500">{data.adresseClient}</p>
                   </div>
                   <div className="text-right space-y-1 text-xs">
                     <p><span className="text-gray-400 font-bold uppercase text-[9px]">Issue Date:</span> {formatDate(data.dateCreation)}</p>
                     <p><span className="text-gray-400 font-bold uppercase text-[9px]">Expiry Date:</span> {formatDate(data.dateValidite)}</p>
                   </div>
                </div>

                <table className="w-full mb-8">
                  <thead className="bg-slate-900 text-white text-[9px] uppercase tracking-widest">
                    <tr>
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-center">Qty</th>
                      <th className="py-2 px-4 text-right">Unit Price</th>
                      <th className="py-2 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.lignesDevis?.map((ligne, i) => (
                      <tr key={i} className="text-xs">
                        <td className="py-3 px-4 font-bold">{ligne.description}</td>
                        <td className="py-3 px-4 text-center">{ligne.quantite}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(ligne.prixUnitaire)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(ligne.montantTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-auto border-t pt-8 flex justify-end">
                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between"><span>Subtotal (Excl. Tax)</span><span>{formatCurrency(data.montantHT)}</span></div>
                    {data.applyVat && <div className="flex justify-between"><span>VAT (19.25%)</span><span>{formatCurrency(data.montantTVA)}</span></div>}
                    <div className="flex justify-between font-black text-lg pt-2 border-t"><span>Total Amount</span><span>{formatCurrency(data.applyVat ? data.montantTTC : data.montantHT)}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              /* --- THERMAL TICKET TEMPLATE (English) --- */
              <div 
                className="bg-white w-[80mm] p-4 shadow-2xl flex flex-col text-black"
                style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '12px' }}
              >
                <div className="text-center border-b border-dashed border-black pb-4 mb-4">
                  <p className="font-bold text-lg uppercase">Your Business</p>
                  <p className="text-[10px]">Douala, Cameroon</p>
                  <p className="text-[10px]">Tel: +237 000 000 000</p>
                </div>

                <div className="mb-4 text-[10px] space-y-1 uppercase">
                  <p><strong>Ref:</strong> {data.numeroDevis}</p>
                  <p><strong>Date:</strong> {formatDate(data.dateCreation)}</p>
                  <p><strong>Client:</strong> {data.nomClient?.slice(0, 20)}</p>
                </div>

                <div className="border-b border-dashed border-black mb-2"></div>
                <div className="space-y-3 mb-4">
                  {data.lignesDevis?.map((ligne, i) => (
                    <div key={i}>
                      <p className="font-bold uppercase">{ligne.description}</p>
                      <div className="flex justify-between text-[11px]">
                        <span>{ligne.quantite} x {formatCurrency(ligne.prixUnitaire)}</span>
                        <span>{formatCurrency(ligne.montantTotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-dashed border-black mb-2"></div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>SUBTOTAL:</span>
                    <span>{formatCurrency(data.montantHT)}</span>
                  </div>
                  {data.applyVat && (
                    <div className="flex justify-between">
                      <span>TAX:</span>
                      <span>{formatCurrency(data.montantTVA)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(data.applyVat ? data.montantTTC : data.montantHT)}</span>
                  </div>
                </div>

                <div className="text-center mt-8 pt-4 border-t border-dashed border-black text-[9px] italic uppercase">
                  <p>Thank you for your business</p>
                  <p>System Pro v2.0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #print-area { 
            scale: 1 !important; 
            box-shadow: none !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            margin: ${format === 'A4' ? '10mm' : '0'};
            size: ${format === 'A4' ? 'A4' : '80mm 200mm'};
          }
        }
      `}</style>
    </div>
  );
};

export default PrintPreviewModal;