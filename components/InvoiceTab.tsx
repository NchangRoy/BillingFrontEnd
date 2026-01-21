'use client'

import React, { useState } from 'react'
import { FactureResponse } from '@/src/api' // Ensure this path matches your API types
import { Plus, Search, Filter, Receipt } from 'lucide-react'
import InvoiceTable from '@/app/invoices/InvoiceTable' // Assuming you have or will create this

interface Props {
  invoices: FactureResponse[];
  name: string;
}

const InvoicesTab = ({ invoices, name }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering logic for Invoices
  const filteredInvoices = invoices.filter(f => 
    f.numeroFacture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.referenceCommande?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.montantTTC?.toString().includes(searchQuery)
  );

  // Financial Stats for Invoices
  const stats = {
    paid: invoices.filter(f => f.etat === FactureResponse.etat.PAYE).length,
    pending: invoices.filter(f => 
      f.etat === FactureResponse.etat.ENVOYE || 
      f.etat === FactureResponse.etat.PARTIELLEMENT_PAYE
    ).length,
    overdue: invoices.filter(f => f.etat === FactureResponse.etat.EN_RETARD).length,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Tab Sub-Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-primary)]">Customer Invoices</h3>
          <p className="text-xs text-[var(--color-secondary-gray)] font-medium">
            Track billing history and payment status for {name}
          </p>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary-mid)] text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all shadow-md shadow-[var(--color-secondary-mid)]/20"
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice #, Order Ref, or amount..." 
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
        {filteredInvoices.length > 0 ? (
          <InvoiceTable data={filteredInvoices} />
        ) : (
          <div className="py-16 text-center bg-gray-50/30">
            <Receipt className="mx-auto text-gray-300 mb-3 opacity-50" size={40} />
            <p className="text-gray-400 text-sm italic">No invoices found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Status Summary Footer */}
      <div className="mt-4 flex flex-wrap gap-6 px-2">
        <SummaryItem color="bg-emerald-500" label="Paid" count={stats.paid} />
        <SummaryItem color="bg-amber-500" label="Pending / Partial" count={stats.pending} />
        <SummaryItem color="bg-rose-500" label="Overdue" count={stats.overdue} />
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

export default InvoicesTab;