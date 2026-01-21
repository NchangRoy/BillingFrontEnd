"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DevisResponse } from '@/src/api';
import TableHeader from '@/components/TableHeader';
import TableRow from '@/components/TableRow';
import Modal from './Modal';
import PrintPreviewModal from '../PrintPreviewModal';
import { 
  AttachMoney, 
  Event, 
  Person, 
  InfoOutlined,
  ReceiptLongOutlined,
  BusinessCenterOutlined,
  TagOutlined,Print
} from "@mui/icons-material";

//print handler


// --- Helpers ---
const formatCurrency = (amount?: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount || 0);

const formatDate = (dateString?: string) => 
  dateString ? new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '---';

enum Tabs {
  MAIN = "Overview",
  HISTORY = "Activity Log"
}

// --- Detail Item Component ---
const DetailItem = ({ label, value, icon: Icon }: { label: string, value?: string, icon: any }) => (
  <div className="group flex flex-col space-y-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      <Icon sx={{ fontSize: 14 }} className="text-gray-300 group-hover:text-secondary-mid" />
      {label}
    </div>
    <p className="text-xs font-black text-primary truncate pl-5">{value || "---"}</p>
  </div>
);

// --- Sub-Component 1: SummaryCards ---
const SummaryCards = ({ data }: { data: DevisResponse }) => {
  // Use useMemo for total calculation to keep it optimized
  const total = useMemo(() => {
    return data.lignesDevis?.reduce((sum, item) => sum + (item.montantTotal || 0), 0) || 0;
  }, [data.lignesDevis]);

  const getStatusStyles = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'accepte': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'refuse': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  const cardBase = "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:border-secondary-light/50";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className={`${cardBase} border-l-4 border-l-secondary-mid`}>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
          <p className="text-xl font-black text-primary tracking-tight">{formatCurrency(total)}</p>
        </div>
        <div className="w-10 h-10 bg-secondary-super-light rounded-xl flex items-center justify-center text-secondary-mid">
          <AttachMoney />
        </div>
      </div>

      <div className={cardBase}>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${getStatusStyles(data.statut)}`}>
            {data.statut || 'BROUILLON'}
          </span>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
          <InfoOutlined />
        </div>
      </div>

      <div className={cardBase}>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created</p>
          <p className="text-sm font-black text-gray-700">{formatDate(data.dateCreation)}</p>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          <Event />
        </div>
      </div>

      <div className={cardBase}>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Client ID</p>
          <p className="text-sm font-black text-gray-700">{data.idClient || 'N/A'}</p>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          <Person />
        </div>
      </div>
    </div>
  );
};

// --- Main Tab Content ---
const MainTabContent = ({ data, onAddLine }: { data: DevisResponse, onAddLine: () => void }) => {
  const QuotationLineLabels = ["Description", "Qty", "Price", "Total"];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <SummaryCards data={data} />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* General Details - Column 1 (Left) */}
        <section className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black text-primary uppercase tracking-widest">Metadata</h3>
            <div className="h-1.5 w-1.5 rounded-full bg-secondary-mid animate-pulse" />
          </div>
          
          <div className="space-y-1">
            <DetailItem label="Internal ID" value={data.idDevis} icon={TagOutlined} />
            <DetailItem label="Category" value={data.type} icon={BusinessCenterOutlined} />
            <DetailItem label="Client Name" value={data.nomClient} icon={Person} />
            <DetailItem label="Reference" value={data.referenceExterne} icon={InfoOutlined} />
            <DetailItem label="Expiry Date" value={formatDate(data.dateValidite)} icon={Event} />
          </div>
        </section>

        {/* Table Section - Column 2 (Right) */}
        <section className="xl:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/30">
            <div>
              <h3 className="text-xs font-black text-primary uppercase tracking-widest">Line Items</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Manage services and pricing</p>
            </div>
            <button 
              onClick={onAddLine} 
              className='px-6 py-2.5 bg-secondary-mid text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-secondary transition-all active:scale-95'
            >
              + Add Item
            </button>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left">
              <TableHeader columns={QuotationLineLabels} />
              <tbody className="divide-y divide-gray-50">
                {data.lignesDevis?.map((ligne, idx) => (
                  <TableRow 
                    key={idx} 
                    properties={["description", "quantite", "prixUnitaire", "montantTotal"]} 
                    dataObject={ligne} 
                  />
                ))}
              </tbody>
            </table>
            {(!data.lignesDevis || data.lignesDevis.length === 0) && (
              <div className="flex flex-col items-center justify-center p-20 opacity-40">
                <ReceiptLongOutlined sx={{ fontSize: 48 }} className="text-gray-200 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Items Found</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const QuotationDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.MAIN);
  const [mainContent, setMainContent] = useState<DevisResponse>({
    idDevis: "---",
    numeroDevis: "---",
    statut: DevisResponse.statut.BROUILLON,
    montantTotal: 0,
    lignesDevis: []
  });

  const [showPreview, setShowPreview] = useState(false);
  // ... existing states

  const executePrint = () => {
    // Re-use your print utility targeting the 'print-area' ID inside the modal
    const content = document.getElementById('print-area')?.innerHTML;
    const printWindow = window.open('', '', 'width=900,height=1100');
    if (!printWindow || !content) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML).join('');

    printWindow.document.write(`
      <html>
        <head>${styles}<style>body { background: white !important; padding: 0 !important; }</style></head>
        <body><div style="width: 100%; transform: scale(1); transform-origin: top left;">${content}</div></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    setShowPreview(false); // Close preview after printing starts
  };



  useEffect(() => {
    const saved = localStorage.getItem("quotation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMainContent(Array.isArray(parsed) ? (parsed[0] || parsed) : parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // ... inside QuotationDetails component

return (
  <div className='max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen bg-[#fafbfc]'>
    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Quotation Profile</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Enterprise Asset Management / Billing
        </p>
      </div>
      
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary-mid text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
          <ReceiptLongOutlined sx={{ fontSize: 16 }} /> Generate Invoice
         </button>
         
         {/* TRIGGER PRINT BUTTON */}
         <button 
           onClick={() => setShowPreview(true)} 
           className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:border-secondary-mid transition-all"
         >
           <Print sx={{ fontSize: 16 }}/>Print PDF 
         </button>
      </div>
    </header>

    {/* WRAPPER FOR PRINTING */}
    <div id="quotation-content">
      {/* Hidden Header for PDF branding */}
      <div className="hidden print:flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h2 className="text-2xl font-black text-primary">OFFICIAL QUOTATION</h2>
          <p className="text-xs text-gray-500 font-bold">Ref: {mainContent.numeroDevis}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-secondary-mid">Your Company Name</p>
          <p className="text-[10px] text-gray-400">Douala, Cameroun</p>
        </div>
      </div>

      <main>
        {activeTab === Tabs.MAIN ? (
          <MainTabContent data={mainContent} onAddLine={() => setShowForm(true)} />
        ) : (
          <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">
            No activity history available.
          </div>
        )}
      </main>
      
      {/* Print-only Footer */}
      <div className="hidden print:block mt-20 border-t pt-6">
        <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
          Thank you for your business. This quotation is valid for 30 days.
        </p>
      </div>
    </div>

    {showForm && (
      <Modal 
        showForm={showForm} 
        setshowForm={setShowForm} 
        mainContent={mainContent} 
        setMainContent={setMainContent} 
      />
    )}

    <PrintPreviewModal 
      isOpen={showPreview} 
      onClose={() => setShowPreview(false)} 
      data={mainContent} 
      onConfirmPrint={executePrint}
    />
  </div>
);
};

export default QuotationDetails;