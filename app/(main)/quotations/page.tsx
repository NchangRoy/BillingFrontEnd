'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Pencil, Trash2, MoreVertical, Printer, ReceiptText, Clock, CheckCircle2, XCircle } from "lucide-react";

// API & Types
import { UpdatedClientResponse, clients } from '@/src/api/models/UpdatedClientResponse'
import { UpdatedDevisResponse, MOCK_QUOTATIONS } from '@/src/api/models/UpdatedDevisResponse'
import { UpdatedFactureResponse } from '@/src/api/models/UpdatedFactureResponse'
import { mapDevisToFacture } from '@/src/api/transformation/DevisTransformation'

// Components
import CreateQuotationModal from './CreateQuotationModal'
import PrintPreviewModal from './PrintPreviewModal'

const columns = {
  "Devis Number": "numeroDevis",
  "Client Name": "nomClient",
  "Email": "emailClient",
  "Creation Date": "dateCreation",
  "Status": "statut",
  "Total Amount": "montantTTC",
  "Currency": "devise"
}

const Quotation = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedQuotation, setClickedQuotation] = useState<UpdatedDevisResponse | undefined>();
  const [quotations, setQuotations] = useState<UpdatedDevisResponse[]>(MOCK_QUOTATIONS);
  const [client, setClient] = useState<UpdatedClientResponse | undefined>()

  // 2. Filter Logic
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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actionOptions = [
    { 
      label: "Modify Quotation", 
      icon: <Pencil size={14} />, 
      action: (q: UpdatedDevisResponse) => {
        const foundClient = clients.find(c => c.idClient === q.idClient) || clients[0];
        setClient(foundClient);
        setClickedQuotation(q);
        setIsModalOpen(true);
      },
      color: "text-blue-600" 
    },
    { 
      label: "Transform to Bill", 
      icon: <ReceiptText size={14} />, 
      action: (q: UpdatedDevisResponse) => {
        const invoice: UpdatedFactureResponse = mapDevisToFacture(q);
        localStorage.setItem("invoice", JSON.stringify(invoice));
        localStorage.setItem("modalOpen", "open");
        router.push("/invoices");
      },
      color: "text-emerald-600" 
    },
    { 
      label: "Print Quotation", 
      icon: <Printer size={14} />, 
      action: (q: UpdatedDevisResponse) => {
        setClickedQuotation(q);
        setIsPrintModalOpen(true);
      },
      color: "text-purple-800" 
    },
    { 
      label: "Delete Quotation", 
      icon: <Trash2 size={14} />, 
      action: (q: UpdatedDevisResponse) => {
        setQuotations(prev => prev.filter(item => item.idDevis !== q.idDevis));
      },
      color: "text-red-600" 
    },
  ];

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Quotations</h1>
          <p className='text-gray-500 mt-1 font-medium'>View and manage client estimates</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search client or quote #...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          <button 
            onClick={() => { setClient(undefined); setClickedQuotation(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-secondary-mid text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-secondary-mid/20"
          >
            <AddIcon sx={{ fontSize: 18 }} /> 
            Create Quotation
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r pr-4">Filters</span>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
              selectedStatus ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" : "border-gray-100 text-gray-500"
            }`}
          >
            {selectedStatus || "All Statuses"}
            <DropDown className={showStatusMenu ? 'rotate-180' : ''} />
          </button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 min-w-[200px] overflow-hidden">
              <button onClick={() => {setSelectedStatus(null); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-[10px] font-bold text-gray-400 border-b hover:bg-gray-50 uppercase tracking-widest">Clear Filter</button>
              {["ACCEPTE", "EN_ATTENTE", "REFUSE"].map((status) => (
                <button key={status} onClick={() => {setSelectedStatus(status); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors uppercase">{status.replace('_', ' ')}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {Object.keys(columns).map((col) => (
                  <th key={col} className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.idDevis} className="group hover:bg-secondary-mid/[0.01] transition-colors">
                  {Object.values(columns).map((value, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {value === 'statut' ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-tighter uppercase ${
                          quotation.statut === 'ACCEPTE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          quotation.statut === 'REFUSE' ? 'bg-red-50 text-red-600 border-red-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {quotation.statut === 'ACCEPTE' ? <CheckCircle2 size={12}/> : quotation.statut === 'REFUSE' ? <XCircle size={12}/> : <Clock size={12}/>}
                          {quotation.statut?.replace('_', ' ')}
                        </span>
                      ) : value === 'dateCreation' ? (
                        /* Adjusted Date Logic */
                        <span className="text-xs font-bold text-gray-500">
                          {quotation.dateCreation 
                            ? new Date(quotation.dateCreation).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                            : '—'}
                        </span>
                      ) : value === 'montantTTC' ? (
                        <span className="font-black text-gray-900">
                          {quotation.montantTTC?.toLocaleString()}
                        </span>
                      ) : value === 'devise' ? (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {quotation.devise || "XAF"}
                        </span>
                      ) : (
                        (quotation as any)[value] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                  

                    {activeMenuId === quotation.idDevis && (
                      <div 
                        ref={menuRef} 
                        className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200"
                      >
                        {actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            title={opt.label}
                            onClick={() => { opt.action(quotation); setActiveMenuId(null); }}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all active:scale-90 ${opt.color}`}
                          >
                            {opt.icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotations.length === 0 && (
          <div className='py-20 text-center flex flex-col items-center justify-center'>
            <ReceiptText className="text-gray-100 mb-4" size={64} />
            <p className='text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]'>No estimates found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateQuotationModal 
          quotationData={clickedQuotation}  
          clientData={client} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isPrintModalOpen && clickedQuotation && (
        <PrintPreviewModal 
          isOpen={isPrintModalOpen} 
          data={clickedQuotation} 
          onConfirmPrint={() => {}}  
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Quotation;