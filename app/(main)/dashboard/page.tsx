'use client'

import React from 'react'
import { 
  TrendingUp, 
  ReceiptLong, 
  AccessTime, 
  CheckCircle,
  MoreVert,
  ArrowUpward,
  FilterList
} from "@mui/icons-material";

// --- Metric Card ---
const StatCard = ({ title, value, icon: Icon, trend, isPositive }: any) => (
  <div className="bg-white p-5 rounded-xl border border-[var(--color-secondary-light)] shadow-sm transition-all hover:border-[var(--color-secondary-mid)]/20 hover:shadow-md group">
    <div className="flex justify-between items-start">
      <div className="bg-[var(--color-secondary-super-light)] p-2 rounded-lg group-hover:bg-[var(--color-secondary-mid)] transition-colors">
        <Icon className="text-[var(--color-secondary-mid)] group-hover:text-white" fontSize="small" />
      </div>
      {trend && (
        <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-600' : 'text-[var(--color-secondary-gray)]'}`}>
          {isPositive && <ArrowUpward fontSize="inherit" className="mr-0.5" />}
          {trend}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-[var(--color-secondary-gray)] uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-black text-[var(--color-primary)] mt-0.5 tracking-tight">{value}</h3>
    </div>
  </div>
);

const ProfessionalDashboard = () => {
  return (
    <div className="w-full p-8 min-h-screen bg-[var(--color-secondary-background)] text-[var(--color-primary)] font-sans">
      
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-secondary-light)] pb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Executive Dashboard</h1>
          <p className="text-[var(--color-secondary-gray)] text-sm mt-0.5 font-medium italic">Reporting Period: Dec 1 — Dec 19, 2025</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-secondary-light)] rounded-lg text-sm font-bold text-[var(--color-secondary-gray)] hover:bg-[var(--color-secondary-super-light)] hover:text-[var(--color-secondary-mid)] transition-colors">
            <FilterList fontSize="small" /> Filters
          </button>
          <button className="px-5 py-2 bg-[var(--color-secondary-mid)] text-white rounded-lg text-sm font-bold hover:bg-[var(--color-primary)] transition-all shadow-md shadow-[var(--color-secondary-mid)]/30">
            Export Data
          </button>
        </div>
      </header>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Gross Revenue" value="4,250,000 XAF" icon={TrendingUp} trend="12.5" isPositive />
        <StatCard title="Pending Receivables" value="890,500 XAF" icon={AccessTime} trend="3.2" />
        <StatCard title="Invoices Issued" value="128" icon={ReceiptLong} />
        <StatCard title="Collection Rate" value="94.2%" icon={CheckCircle} trend="0.8" isPositive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Data Table */}
        <section className="lg:col-span-8 border border-[var(--color-secondary-light)] bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--color-secondary-super-light)] flex justify-between items-center">
            <h3 className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest">Recent Transactions</h3>
            <button className="text-[var(--color-secondary-gray)] hover:text-[var(--color-secondary-mid)] transition-colors">
              <MoreVert fontSize="small" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-secondary-background)]">
                <tr className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary-gray)] border-b border-[var(--color-secondary-light)]">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Counterparty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-secondary-super-light)] text-sm font-medium">
                {[
                  { ref: 'INV-2025-092', name: 'Alpha Solutions', status: 'Settled', amount: '150,000 XAF', color: 'text-[var(--color-secondary-gray)] bg-gray-50 border-gray-100' },
                  { ref: 'INV-2025-093', name: 'Jean-Pierre Tech', status: 'Pending', amount: '45,200 XAF', color: 'text-[var(--color-secondary-mid)] bg-[var(--color-secondary-super-light)] border-[var(--color-secondary-mid)]/10' },
                  { ref: 'INV-2025-094', name: 'Global Logistics', status: 'Overdue', amount: '230,000 XAF', color: 'text-rose-700 bg-rose-50 border-rose-100' },
                  { ref: 'INV-2025-095', name: 'Espace Bâtiment', status: 'Settled', amount: '85,000 XAF', color: 'text-[var(--color-secondary-gray)] bg-gray-50 border-gray-100' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--color-secondary-super-light)]/40 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-xs text-[var(--color-secondary-gray)]">{row.ref}</td>
                    <td className="px-6 py-4 font-bold text-[var(--color-primary)]">{row.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[var(--color-primary)] group-hover:text-[var(--color-secondary-mid)] transition-colors">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar Analytics */}
        <section className="lg:col-span-4 space-y-6">
          <div className="p-6 border border-[var(--color-secondary-light)] rounded-xl bg-white shadow-sm">
            <h3 className="text-xs font-black text-[var(--color-primary)] mb-6 uppercase tracking-widest border-b border-[var(--color-secondary-super-light)] pb-2">Revenue Breakdown</h3>
            <div className="space-y-5">
              {[
                { label: 'Services', value: 75, color: 'bg-[var(--color-primary)]' },
                { label: 'Products', value: 20, color: 'bg-[var(--color-secondary-mid)]' },
                { label: 'Other', value: 5, color: 'bg-[var(--color-secondary-gray)]' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] font-bold text-[var(--color-secondary-gray)] mb-2 uppercase tracking-wide">
                    <span>{item.label}</span>
                    <span className="text-[var(--color-primary)] font-black">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-secondary-super-light)] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[var(--color-primary)] rounded-xl text-white shadow-xl shadow-[var(--color-primary)]/30 border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-secondary-super-light)]/60 mb-2">System Authority</h4>
            <p className="text-sm font-medium text-white/90 mb-6 leading-relaxed">Automated reconciliation protocols are operating at maximum efficiency.</p>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary-mid)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary-mid)] shadow-[0_0_8px_var(--color-secondary-mid)]"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary-super-light)]">Active Connection</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default ProfessionalDashboard;