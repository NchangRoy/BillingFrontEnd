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
  <div className="bg-white p-5 rounded-xl border border-[#E9BBAD] shadow-sm transition-all hover:border-[#C75735]/40">
    <div className="flex justify-between items-start">
      <div className="bg-[#FAEEEB] p-2 rounded-lg border border-[#E9BBAD]/30">
        <Icon className="text-[#73321F]" fontSize="small" />
      </div>
      {trend && (
        <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-600' : 'text-gray-400'}`}>
          {isPositive && <ArrowUpward fontSize="inherit" className="mr-0.5" />}
          {trend}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-black text-[#73321F] mt-0.5 tracking-tight">{value}</h3>
    </div>
  </div>
);

const ProfessionalDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-[#FAEEEB]/30 text-gray-900 font-sans">
      
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-[#E9BBAD]/30 pb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#73321F] tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">Reporting Period: Dec 1 — Dec 19, 2025</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E9BBAD] rounded-lg text-sm font-bold text-[#73321F] hover:bg-[#FAEEEB] transition-colors">
            <FilterList fontSize="small" /> Filters
          </button>
          <button className="px-5 py-2 bg-[#C75735] text-white rounded-lg text-sm font-bold hover:bg-[#73321F] transition-all shadow-md shadow-[#C75735]/20">
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
        <section className="lg:col-span-8 border border-[#E9BBAD]/40 bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#FAEEEB] flex justify-between items-center">
            <h3 className="text-xs font-black text-[#73321F] uppercase tracking-widest">Recent Transactions</h3>
            <button className="text-gray-300 hover:text-[#C75735]"><MoreVert fontSize="small" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#FAEEEB]/50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-[#73321F]/60 border-b border-[#FAEEEB]">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Counterparty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAEEEB] text-sm font-medium">
                {[
                  { ref: 'INV-2025-092', name: 'Alpha Solutions', status: 'Settled', amount: '150,000 XAF', color: 'text-gray-600 bg-gray-100 border-gray-200' },
                  { ref: 'INV-2025-093', name: 'Jean-Pierre Tech', status: 'Pending', amount: '45,200 XAF', color: 'text-[#C75735] bg-[#FAEEEB] border-[#E9BBAD]' },
                  { ref: 'INV-2025-094', name: 'Global Logistics', status: 'Overdue', amount: '230,000 XAF', color: 'text-rose-700 bg-rose-50 border-rose-100' },
                  { ref: 'INV-2025-095', name: 'Espace Bâtiment', status: 'Settled', amount: '85,000 XAF', color: 'text-gray-600 bg-gray-100 border-gray-200' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAEEEB]/20 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{row.ref}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{row.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[#73321F]">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar Analytics */}
        <section className="lg:col-span-4 space-y-6">
          <div className="p-6 border border-[#E9BBAD]/30 rounded-xl bg-white">
            <h3 className="text-xs font-black text-[#73321F] mb-6 uppercase tracking-widest">Revenue Breakdown</h3>
            <div className="space-y-5">
              {[
                { label: 'Services', value: 75, color: 'bg-[#73321F]' },
                { label: 'Products', value: 20, color: 'bg-[#C75735]' },
                { label: 'Other', value: 5, color: 'bg-[#E9BBAD]' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    <span>{item.label}</span>
                    <span className="text-[#73321F]">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAEEEB] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#73321F] rounded-xl text-white shadow-xl shadow-[#73321F]/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E9BBAD] mb-2">System Authority</h4>
            <p className="text-sm font-medium opacity-90 mb-6 leading-relaxed">Automated reconciliation protocols are operating at maximum efficiency.</p>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E9BBAD] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E9BBAD]"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Active Connection</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default ProfessionalDashboard;