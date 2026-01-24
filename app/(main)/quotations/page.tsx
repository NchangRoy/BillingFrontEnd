'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Printer, 
  ReceiptText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ChevronRight 
} from "lucide-react";

// API & Types
import { UpdatedClientResponse, clients } from '@/src/api/models/UpdatedClientResponse'
import { UpdatedDevisResponse, MOCK_QUOTATIONS } from '@/src/api/models/UpdatedDevisResponse'
import { UpdatedFactureResponse } from '@/src/api/models/UpdatedFactureResponse'
import { mapDevisToFacture, mapDevisToSalesOrder } from '@/src/api/transformation/DevisTransformation'

// Components
import CreateQuotationModal from './CreateQuotationModal'
import PrintPreviewModal from './PrintPreviewModal'
import { UpdatedSalesOrderResponse } from '@/src/api/models/UpdatedSalesOrder'

const columns = {
  "Devis Number": "numeroDevis",
  "Client Name": "nomClient",
  "Creation Date": "dateCreation",
  "Status": "statut",
  "Total Amount": "montantTTC",
}

const Quotation = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showTransformSub, setShowTransformSub] = useState<boolean>(false);
  const [clickedQuotation, setClickedQuotation] = useState<UpdatedDevisResponse | undefined>();
  const [quotations, setQuotations] = useState<UpdatedDevisResponse[]>(MOCK_QUOTATIONS);
  const [client, setClient] = useState<UpdatedClientResponse | undefined>()
  
  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesSearch = 
        item.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroDevis?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.statut === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, quotations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
        setShowTransformSub(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTransform = (q: UpdatedDevisResponse) => {
    const invoice: UpdatedFactureResponse = mapDevisToFacture(q);
    localStorage.setItem("invoice", JSON.stringify(invoice));
    localStorage.setItem("modalOpen", "open");
    router.push("/invoices");
  };

  const statusOptions = Array.from(new Set(MOCK_QUOTATIONS.map(q => q.statut)));

  function handleTransformToProforma(quotation: UpdatedDevisResponse): void {
    const invoice: UpdatedFactureResponse = mapDevisToFacture(quotation);
    localStorage.setItem("proforma_invoice", JSON.stringify(invoice));
    localStorage.setItem("modalOpen", "open");
    router.push("/proforma_invoices");
  }

  function handleTransformToQuotation(quotation: UpdatedDevisResponse): void {
    const invoice: UpdatedFactureResponse = mapDevisToFacture(quotation);
    localStorage.setItem("invoice", JSON.stringify(invoice));
    localStorage.setItem("modalOpen", "open");
    router.push("/invoices");
  }


  function handleTransformToSalesOrder(quotation: UpdatedDevisResponse): void {
    const invoice: UpdatedSalesOrderResponse = mapDevisToSalesOrder(quotation);
    localStorage.setItem("salesOrder", JSON.stringify(invoice));
    localStorage.setItem("modalOpen", "open");
    router.push("/sales_orders");
  }

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Quotations</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage and transform estimates for clients</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search Devis #, client name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          <button 
            onClick={() => { setClient(undefined); setClickedQuotation(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <AddIcon sx={{ fontSize: 18 }} /> Create Quotation
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r pr-4">Status Filters</span>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
              selectedStatus ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" : "border-gray-100 text-gray-500"
            }`}
          >
            {selectedStatus || "All Statuses"}
            <DropDown className={showStatusMenu ? 'rotate-180' : ''} />
          </button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 min-w-[200px] ">
              <button onClick={() => {setSelectedStatus(null); setShowStatusMenu(false)}} className="w-full text-left px-4 py-2 text-[10px] font-bold text-gray-400 border-b hover:bg-gray-50 uppercase tracking-widest">Clear Filter</button>
              {statusOptions.map((status) => (
                <button key={status} onClick={() => {setSelectedStatus(status??""); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors uppercase">{status}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div >
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {Object.keys(columns).map((col) => (
                  <th key={col} className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.idDevis} className="group hover:bg-secondary-mid/[0.02] transition-colors">
                  {Object.values(columns).map((key, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {key === 'statut' ? (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter uppercase inline-flex items-center gap-1 ${
                          quotation.statut === 'ACCEPTE' ? 'bg-emerald-50 text-emerald-600' : 
                          quotation.statut === 'REFUSE' ? 'bg-red-50 text-red-600' : 
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {quotation.statut === 'ACCEPTE' ? <CheckCircle2 size={10}/> : quotation.statut === 'REFUSE' ? <XCircle size={10}/> : <Clock size={10}/>}
                          {quotation.statut?.replace('_', ' ')}
                        </span>
                      ) : key === 'montantTTC' ? (
                        <span className="font-black text-gray-900">
                          {quotation.montantTTC?.toLocaleString()} <span className='text-[10px] text-gray-400 uppercase'>{quotation.devise || 'XAF'}</span>
                        </span>
                      ) : key === 'dateCreation' ? (
                        <span className="text-xs font-bold text-gray-500">
                           {quotation.dateCreation ? new Date(quotation.dateCreation).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      ) : (
                        (quotation as any)[key] || "—"
                      )}
                    </td>
                  ))}
                  
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === quotation.idDevis ? null : (quotation.idDevis ?? null))}
                      className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === quotation.idDevis && (
                      <div ref={menuRef} className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                        
                        {/* Edit */}
                        <button 
                           onClick={() => {
                             const foundClient = clients.find(c => c.idClient === quotation.idClient);
                             setClient(foundClient);
                             setClickedQuotation(quotation);
                             setIsModalOpen(true);
                             setActiveMenuId(null);
                           }}
                           className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-blue-600"
                           title="Edit"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Transform */}
                        <div 
                          className="relative"
                          onClick={() => setShowTransformSub(!showTransformSub)}
                        >
                          <button 
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${showTransformSub ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-50 text-emerald-600'}`}
                          >
                            <ReceiptText size={14} />
                          </button>

                          {showTransformSub && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-secondary-light rounded-2xl shadow-2xl p-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
                               <p className="text-[9px] font-black text-gray-400 uppercase px-3 py-2 border-b border-gray-50 mb-1 tracking-widest">Transform To:</p>
                               
                               <button 
                                 onClick={() => handleTransformToQuotation(quotation)}
                                 className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors group"
                               >
                                  <div className="flex items-center gap-2">
                                    <ReceiptText size={14} />
                                    <span className="text-[11px] font-bold">Client Invoice</span>
                                  </div>
                                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                               </button>

                               <button 
                                 onClick={() => handleTransformToProforma(quotation)}
                                 className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors group"
                               >
                                  <div className="flex items-center gap-2">
                                    <FileText size={14} />
                                    <span className="text-[11px] font-bold">Proforma Invoice</span>
                                  </div>
                                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                               </button>
                                <button 
                                 onClick={() => handleTransformToSalesOrder(quotation)}
                                 className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors group"
                               >
                                  <div className="flex items-center gap-2">
                                    <FileText size={14} />
                                    <span className="text-[11px] font-bold">Sales Order</span>
                                  </div>
                                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                               </button>
                            </div>
                          )}
                        </div>

                        {/* Print */}
                        <button 
                          onClick={() => { setClickedQuotation(quotation); setIsPrintModalOpen(true); setActiveMenuId(null); }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-purple-800 transition-all"
                          title="Print"
                        >
                          <Printer size={14} />
                        </button>

                        {/* Delete */}
                        <button 
                          onClick={() => {
                            setQuotations(prev => prev.filter(q => q.idDevis !== quotation.idDevis));
                            setActiveMenuId(null);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-red-600 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <CreateQuotationModal quotationData={clickedQuotation} clientData={client} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>} 
      {isPrintModalOpen && clickedQuotation && <PrintPreviewModal onConfirmPrint={()=>{}} isOpen={isPrintModalOpen} data={clickedQuotation} onClose={() => setIsPrintModalOpen(false)} />}
    </div>
  )
}

export default Quotation;