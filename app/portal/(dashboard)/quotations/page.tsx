"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { PortalApi } from "@/src/api/portalApi";
import { getPortalSession, getOrganizationName } from "@/src/api/portalSession";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import QuotationActionModal from "./QuotationActionModal";

const COLUMNS = ["Quotation #", "Organization", "Date", "Status", "Total", ""];

const VISIBLE_STATUSES = new Set(["ENVOYE", "ACCEPTE", "REFUSE"]);

export default function PortalQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const session = getPortalSession();

  useEffect(() => {
    PortalApi.getQuotations()
      .then(setQuotations)
      .catch((err) => console.error("Failed to load quotations", err))
      .finally(() => setLoading(false));
  }, []);

  const visibleQuotations = quotations.filter((q) => VISIBLE_STATUSES.has(q.statut));

  const handleStatusChange = (id: string, status: string) => {
    setQuotations((prev) => prev.map((q) => (q.idDevis === id ? { ...q, statut: status } : q)));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">Quotations</h1>
        <p className="text-secondary-gray text-sm font-medium">Quotations issued to your account.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {COLUMNS.map((col) => (
                <th key={col} className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <TableSkeleton cols={COLUMNS.length} />
            ) : visibleQuotations.length === 0 ? (
              <EmptyState title="No quotations yet" message="Quotations sent to you will appear here." />
            ) : (
              visibleQuotations.map((q) => (
                <tr
                  key={q.idDevis}
                  onClick={() => setSelected(q)}
                  className="group hover:bg-secondary-mid/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-black text-gray-900 whitespace-nowrap">{q.numeroDevis}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                    {getOrganizationName(session, q.organizationId)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                    {q.dateCreation ? new Date(q.dateCreation).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter uppercase inline-flex items-center gap-1 ${
                      q.statut === 'ACCEPTE' ? 'bg-emerald-50 text-emerald-600' :
                      q.statut === 'REFUSE' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {q.statut === 'ACCEPTE' ? <CheckCircle2 size={10} /> : q.statut === 'REFUSE' ? <XCircle size={10} /> : <Clock size={10} />}
                      {q.statut?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-black text-gray-900">
                      {q.montantTTC?.toLocaleString()} <span className="text-[10px] text-gray-400 uppercase">{q.devise || 'XAF'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(q); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-secondary-mid bg-secondary-super-light hover:bg-secondary-mid hover:text-white transition-all"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <QuotationActionModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        quotation={selected}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
