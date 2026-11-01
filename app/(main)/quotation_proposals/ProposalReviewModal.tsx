'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ClipboardList, Calculator, Tag, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { QuotationProposalsService } from '@/src/src2/api';
import SummaryCard from '@/components/SummaryCard';

interface ProposalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: any;
  onDecided: (id: string, statut: string, commentary?: string) => void;
}

const ProposalReviewModal: React.FC<ProposalReviewModalProps> = ({ isOpen, onClose, proposal, onDecided }) => {
  const [commentary, setCommentary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !proposal) return null;

  const isPending = proposal.statut === 'BROUILLON';

  const handleDecision = async (accept: boolean) => {
    setIsSubmitting(true);
    try {
      if (accept) {
        await QuotationProposalsService.accept(proposal.idProposal, { commentary: commentary || undefined });
        toast.success('Proposal accepted.');
        onDecided(proposal.idProposal, 'ACCEPTED', commentary || undefined);
      } else {
        await QuotationProposalsService.reject(proposal.idProposal, { commentary: commentary || undefined });
        toast.success('Proposal rejected.');
        onDecided(proposal.idProposal, 'REJECTED', commentary || undefined);
      }
      onClose();
    } catch (err) {
      toast.error('Failed to record your decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end items-stretch">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Proposal {proposal.numeroProposal}</h2>
              <p className="text-xs text-gray-400 font-bold">{proposal.nomClient}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Product</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-center">Tier</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-center">Qty</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(proposal.lignesProposal ?? []).map((line: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">{line.nomProduit}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{line.idProduit}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase">
                        {line.saleSize}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-600">{line.quantite}</td>
                    <td className="px-6 py-4 text-right font-black text-secondary">{line.montantTotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SummaryCard title="Total HT" value={proposal.montantHT} icon={<Calculator />} variant="default" />
            <SummaryCard title="VAT" value={proposal.montantTVA} icon={<Tag />} variant="emerald" />
            <SummaryCard title="Total TTC" value={proposal.montantTTC} icon={<Receipt />} variant="dark" />
          </div>

          {proposal.commentary && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Client's Note</p>
              <p className="text-sm text-amber-800">{proposal.commentary}</p>
            </div>
          )}

          {isPending && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Feedback for the client (optional)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm"
                rows={3}
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                placeholder="e.g. Approved — will be converted to a formal quotation shortly."
              />
            </div>
          )}
        </div>

        {isPending && (
          <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => handleDecision(false)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-black text-sm transition-all"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              onClick={() => handleDecision(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-lg transition-all"
            >
              <CheckCircle2 size={16} /> Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalReviewModal;
