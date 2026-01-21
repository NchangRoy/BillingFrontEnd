'use client'

import React, { useState } from 'react'
import QuotationTable from '@/app/(main)/quotations/QuotationTable'
import { DevisResponse } from '@/src/api'
import { Plus, Search, Filter } from 'lucide-react'

interface Props {
  quotations: DevisResponse[];
  name: string;
}

const QuotationsTab = ({ quotations, name }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Basic filtering logic
  const filteredQuotations = quotations.filter(q => 
    q.numeroDevis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.montantTTC?.toString().includes(searchQuery)
  );

  // Quick Stats
  const stats = {
    sent: quotations.filter(q => q.statut === DevisResponse.statut.ENVOYE).length,
    draft: quotations.filter(q => q.statut === DevisResponse.statut.BROUILLON).length,
    // Assuming you might have an 'ACCEPTED' status later
    accepted: 0 
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Tab Sub-Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-primary)]">Customer Quotations</h3>
          <p className="text-xs text-[var(--color-secondary-gray)] font-medium">
            Manage and track all estimates sent to {name}
          </p>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary-mid)] text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all shadow-md shadow-[var(--color-secondary-mid)]/20"
        >
          <Plus size={16} /> New Quotation
        </button>
      </div>

      {/* Internal Search/Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference or amount..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-secondary-background)] border border-[var(--color-secondary-light)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-secondary-mid)] transition-colors text-gray-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button className="px-3 py-2 border border-[var(--color-secondary-light)] rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="text-gray-500" size={18} />
        </button>
      </div>

      {/* Table Section */}
      <div className="border border-[var(--color-secondary-light)] rounded-xl overflow-hidden bg-white shadow-sm">
        <QuotationTable data={filteredQuotations} />
        
        {filteredQuotations.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm italic bg-gray-50/50">
            No quotations match your search criteria.
          </div>
        )}
      </div>

      {/* Quick Summary Footer */}
      <div className="mt-4 flex gap-6 px-2">
        <SummaryItem color="bg-emerald-500" label="Accepted" count={stats.accepted} />
        <SummaryItem color="bg-blue-500" label="Sent" count={stats.sent} />
        <SummaryItem color="bg-gray-300" label="Draft" count={stats.draft} />
      </div>
    </div>
  )
}

const SummaryItem = ({ color, label, count }: { color: string, label: string, count: number }) => (
  <div className="flex gap-2 items-center">
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
      {label}: {count}
    </span>
  </div>
)

export default QuotationsTab;