'use client'

import React, { useState, useEffect } from 'react'
import { FactureResponse } from '@/src/api' 
import TableHeader from '@/components/TableHeader'
import TableRow from '@/components/TableRow'
import Field from '@/components/Field'
import { 
  AttachMoney, 
  Event, 
  Person, 
  AccountBalanceWallet,
  Print,
  Add
} from "@mui/icons-material";

// --- Helpers ---
const formatCurrency = (amount?: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount || 0);

const formatDate = (dateString?: string) => 
  dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '---';

enum Tabs {
  MAIN = "main",
  PAYMENTS = "payments",
  STORE_CREDIT="store credit",
  DELIVERY_NOTE="delivery note"

}

// --- Labels & Initial State ---
const BillGeneralLabels: Record<string, string> = {
  idFacture: "Bill ID",
  numeroFacture: "Bill No.",
  dateFacturation: "Bill Date",
  dateEcheance: "Due Date",
  referenceCommande: "Order Ref",
  nomClient: "Client",
};

const BillLineLabels: Record<string, string> = {
  description: "Description",
  quantite: "Qty",
  prixUnitaire: "Unit Price",
  montantTotal: "Total",
};

const INITIAL_MOCK_BILL: FactureResponse = {
    idFacture: "---",
    numeroFacture: "---",
    etat: FactureResponse.etat.BROUILLON,
    montantTotal: 0,
    montantRestant: 0,
    lignesFacture: [],
};

// --- Sub-Component 1: SummaryCards ---
const SummaryCards = ({ data }: { data: FactureResponse }) => {
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case FactureResponse.etat.PAYE: return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case FactureResponse.etat.EN_RETARD: return "bg-rose-50 text-rose-700 border-rose-100";
      case FactureResponse.etat.PARTIELLEMENT_PAYE: return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const cardBase = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md";
  const labelStyle = "text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Total Bill</p>
          <p className="text-2xl font-black text-gray-800 tracking-tight">{formatCurrency(data.montantTotal)}</p>
        </div>
        <div className="p-2 bg-secondary-mid/10 rounded-xl"><AttachMoney className="text-secondary-mid" fontSize="small" /></div>
      </div>

      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Balance Due</p>
          <p className={`text-2xl font-black tracking-tight ${data.montantRestant && data.montantRestant > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
            {formatCurrency(data.montantRestant)}
          </p>
        </div>
        <div className="p-2 bg-orange-50 rounded-xl"><AccountBalanceWallet className="text-orange-500" fontSize="small" /></div>
      </div>

      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Due Date</p>
          <p className="text-lg font-bold text-gray-700">{formatDate(data.dateEcheance)}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-xl"><Event className="text-blue-500" fontSize="small" /></div>
      </div>

      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Current Status</p>
          <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border tracking-wide uppercase ${getStatusStyles(data.etat)}`}>
            {data.etat || 'UNKNOWN'}
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-xl"><Person className="text-gray-400" fontSize="small" /></div>
      </div>
    </div>
  );
};

// --- Sub-Component 2: MainTabContent ---
const MainTabContent = ({ data }: { data: FactureResponse }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-secondary-mid rounded-full" />
          Bill Information
        </h3>
        <div className="space-y-5">
          {Object.entries(BillGeneralLabels).map(([key, label]) => (
            <Field key={key} fieldName={label} value={(data as any)[key]} />
          ))}
        </div>
      </section>

      <section className="bg-emerald-900 p-6 rounded-2xl text-white shadow-xl shadow-emerald-900/20">
        <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Total Payable</p>
        <h2 className="text-3xl font-black">{formatCurrency(data.montantTotal)}</h2>
        <div className="mt-4 pt-4 border-t border-emerald-800 flex justify-between text-sm">
          <span className="opacity-70">Tax (TVA)</span>
          <span className="font-bold">{formatCurrency(data.montantTVA || 0)}</span>
        </div>
      </section>
    </div>

    <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 tracking-tight">Items & Services</h3>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
          {data.lignesFacture?.length || 0} Items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader columns={Object.values(BillLineLabels)} />
          <tbody className="divide-y divide-gray-50">
            {data.lignesFacture?.map((ligne, idx) => (
              <TableRow key={idx} properties={Object.keys(BillLineLabels)} dataObject={ligne} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-100">
        <div className="flex flex-col items-end gap-2">
          <div className="flex justify-between w-64 text-sm">
            <span className="text-gray-400">VAT (TVA)</span>
            <span className="font-bold text-gray-700">{formatCurrency(data.montantTVA)}</span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-gray-200 mt-2">
            <span className="font-bold text-gray-900">Total TTC</span>
            <span className="font-black text-xl text-secondary-mid">{formatCurrency(data.montantTTC)}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// --- Main Page Component ---
const BillDetails = () => {
  const [mainContent, setMainContent] = useState<FactureResponse>(INITIAL_MOCK_BILL);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.MAIN);

  useEffect(() => {
    const saved = localStorage.getItem("invoice");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const data = Array.isArray(parsed) ? (parsed[0] || INITIAL_MOCK_BILL) : parsed;
        setMainContent(data);
      } catch (e) {
        console.error("Local Storage Parse Error", e);
      }
    }
  }, []);

  return (
    <div className='max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-gray-50/20'>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">
            <span>Billing</span> / <span>Invoice Details</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {mainContent.numeroFacture}
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Print fontSize="small" /> Print
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary-mid text-white rounded-xl text-sm font-bold shadow-lg shadow-secondary-mid/30 hover:opacity-90 transition-all">
            <Add fontSize="small" /> New Payment
           </button>
        </div>
      </header>

      <SummaryCards data={mainContent} />

      {/* Tab Navigation */}
      <nav className='flex gap-8 border-b border-gray-200 mb-8'>
        {Object.values(Tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
              activeTab === tab 
                ? "border-secondary-mid text-secondary-mid" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="w-full">
        {activeTab === Tabs.MAIN ? (
          <MainTabContent data={mainContent} />
        ) : (
          <div className="p-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
            {activeTab === Tabs.PAYMENTS 
              ? "No payment records found for this invoice." 
              : "No history logs available."}
          </div>
        )}
      </main>
    </div>
  )
}

export default BillDetails;