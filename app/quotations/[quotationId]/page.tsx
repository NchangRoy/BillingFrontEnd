'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DevisResponse } from '@/src/api'
import TableHeader from '@/components/TableHeader'
import TableRow from '@/components/TableRow'
import Field from '../../../components/Field'
import Modal from './Modal'
import { 
  AttachMoney, 
  Event, 
  Person, 
  InfoOutlined,
  ReceiptLongOutlined 
} from "@mui/icons-material";

// --- Helpers ---
const formatCurrency = (amount?: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount || 0);

const formatDate = (dateString?: string) => 
  dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '---';

enum Tabs {
  MAIN = "main",
  HISTORY = "history"
}

// --- Sub-Component 1: SummaryCards ---
const SummaryCards = ({ data }: { data: DevisResponse }) => {
  const getStatusStyles = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'accepte': return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'refuse': return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-secondary-super-light text-secondary-mid border-secondary-light/30";
    }
  };

  // Centered items and larger padding to fix the "hanging" feel
  const cardBase = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md";
  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* Total Amount Card */}
      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Total Amount</p>
          <p className="text-2xl font-black text-primary tracking-tighter leading-tight">
            {formatCurrency(data.montantTotal)}
          </p>
        </div>
        <div className="w-12 h-12 bg-secondary-super-light rounded-xl flex items-center justify-center">
          <AttachMoney className="text-secondary-mid !text-2xl" />
        </div>
      </div>

      {/* Status Card */}
      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Current Status</p>
          <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${getStatusStyles(data.statut)}`}>
            {data.statut || 'N/A'}
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
          <InfoOutlined className="text-gray-400 !text-2xl" />
        </div>
      </div>

      {/* Issued Date Card */}
      <div className={cardBase}>
        <div>
          <p className={labelStyle}>Issued On</p>
          <p className="text-lg font-extrabold text-gray-700 leading-tight">
            {formatDate(data.dateCreation)}
          </p>
        </div>
        <div className="w-12 h-12 bg-secondary-super-light/40 rounded-xl flex items-center justify-center">
          <Event className="text-secondary-mid !text-2xl" />
        </div>
      </div>

      {/* Client Reference Card */}
      <div className={cardBase}>
        <div className="max-w-[70%]">
          <p className={labelStyle}>Client Ref</p>
          <p className="text-lg font-extrabold text-gray-700 truncate leading-tight">
            {data.idClient || 'N/A'}
          </p>
        </div>
        <div className="w-12 h-12 bg-secondary-super-light/40 rounded-xl flex items-center justify-center">
          <Person className="text-secondary-mid !text-2xl" />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component 2: MainTabContent ---
const MainTabContent = ({ data, onAddLine }: { data: DevisResponse, onAddLine: () => void }) => {
  const QuotationGeneralLabels: Record<string, string> = {
    idDevis: "Quotation ID",
    numeroDevis: "Quotation No.",
    dateCreation: "Created Date",
    dateValidite: "Expiry Date",
    type: "Category",
    nomClient: "Client Name",
    referenceExterne: "External Ref",
  };

  const QuotationLineLabels: Record<string, string> = {
    description: "Description",
    quantite: "Qty",
    prixUnitaire: "Price",
    montantTotal: "Total",
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <SummaryCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Details */}
        <section className="lg:col-span-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-6 bg-secondary-mid rounded-full" />
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">General Details</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(QuotationGeneralLabels).map(([key, label]) => (
              <Field key={key} fieldName={label} value={(data as any)[key]} />
            ))}
          </div>
        </section>

        {/* Right Section: Table */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
            <div>
              <h3 className="text-sm font-black text-primary uppercase tracking-widest">Line Items</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Itemized services</p>
            </div>
            <button 
              onClick={onAddLine} 
              className='px-5 py-2.5 bg-secondary-mid text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary-mid/20 hover:scale-[1.02] transition-all'
            >
              + Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <TableHeader columns={Object.values(QuotationLineLabels)} />
              <tbody className="divide-y divide-gray-50">
                {data.lignesDevis?.map((ligne, idx) => (
                  <TableRow key={idx} properties={Object.keys(QuotationLineLabels)} dataObject={ligne} />
                ))}
              </tbody>
            </table>
            {(!data.lignesDevis || data.lignesDevis.length === 0) && (
              <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-[0.2em] text-[10px]">No items listed</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const QuotationDetails = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.MAIN);
  const [mainContent, setMainContent] = useState<DevisResponse>({
    idDevis: "---",
    numeroDevis: "---",
    statut: DevisResponse.statut.BROUILLON,
    montantTotal: 0,
    lignesDevis: []
  });

  useEffect(() => {
    const saved = localStorage.getItem("quotation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const data = Array.isArray(parsed) ? (parsed[0] || parsed) : parsed;
        setMainContent(data);
      } catch (e) {
        console.error("Local Storage Parse Error", e);
      }
    }
  }, []);

  const handleConvertToInvoice = () => {
    const invoiceData = {
      ...mainContent,
      idFacture: `INV-${mainContent.idDevis}`,
      numeroFacture: `FAC-${mainContent.numeroDevis}`,
      dateFacturation: new Date().toISOString(),
      etat: "BROUILLON",
      lignesFacture: mainContent.lignesDevis,
    };
    localStorage.setItem("invoice_from_quotation", JSON.stringify(invoiceData));
    router.push('/dashboard/invoices/new');
  };

  return (
    <div className='max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-gray-50/20'>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter">Quotation View</h1>
          <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase tracking-[0.3em]">
            Reference <span className="text-secondary-mid">#{mainContent.numeroDevis}</span>
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleConvertToInvoice}
             className="flex items-center gap-2 px-6 py-3 bg-secondary-mid text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary-mid/20 hover:bg-primary transition-all active:scale-95"
           >
            <ReceiptLongOutlined sx={{ fontSize: 18 }} /> Convert to Invoice
           </button>
           
           <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:border-secondary-mid transition-all shadow-sm">
            Print PDF
           </button>
        </div>
      </header>

      <nav className='flex gap-10 border-b border-gray-100 mb-10'>
        {Object.values(Tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 ${
              activeTab === tab 
                ? "border-secondary-mid text-secondary-mid" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className='w-full'>
        {activeTab === Tabs.MAIN ? (
          <MainTabContent data={mainContent} onAddLine={() => setShowForm(true)} />
        ) : (
          <div className="p-20 text-center text-gray-300 bg-white rounded-2xl border border-dashed border-gray-200 font-bold uppercase tracking-[0.2em] text-xs">
            History tracking is currently disabled.
          </div>
        )}
      </main>

      {showForm && (
        <Modal 
          showForm={showForm} 
          setshowForm={setShowForm} 
          mainContent={mainContent} 
          setMainContent={setMainContent} 
        />
      )}
    </div>
  )
}

export default QuotationDetails;