'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Pencil, Trash2, MoreVertical, Printer, Truck, Receipt } from "lucide-react";

import { FactureResponse, UpdatedSupplierFactureResponse } from '@/src/api/models/UpdatedSupplierFactureResponse'
import { MOCK_SUPPLIER_FACTURES } from '@/src/api/models/UpdatedSupplierFactureResponse'
import CreateSupplierInvoiceModal from './CreateSupplierInvoiceModal'
import SupplierInvoicePrintPreviewModal from './SupplierInvoicePrintPreviewModal'

// Helper for date formatting
const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
};

const columns = {
  "Invoice #": "numeroFacture",
  "Supplier": "nomFournisseru",
  "GRN #": "numeroGRN",
  "Date": "dateFacturation",
  "Due Date": "dateEcheance",
  "Status": "etat",
  "Total (TTC)": "montantTTC",
  "Resting": "montantRestant"
}

const SupplierFactures = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<FactureResponse.etat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedFacture, setClickedFacture] = useState<UpdatedSupplierFactureResponse | undefined>();
  const [factures, setFactures] = useState<UpdatedSupplierFactureResponse[]>(MOCK_SUPPLIER_FACTURES);

  useEffect(() => {
    const modalOpen = localStorage.getItem("supplierModalOpen")
    if (modalOpen === "open") {
      setIsModalOpen(true)
      localStorage.setItem("supplierModalOpen", "close")
      const invoiceString = localStorage.getItem("supplierInvoice")
      if (invoiceString) {
        const invoice: UpdatedSupplierFactureResponse = JSON.parse(invoiceString)
        setClickedFacture(invoice)
      }
    }
  }, [])

  const filteredFactures = useMemo(() => {
    return factures.filter((item) => {
      const matchesSearch = 
        item.nomFournisseru?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroFacture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.numeroGRN?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.etat === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, factures]);

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
      label: "Modify", 
      icon: <Pencil size={14} />, 
      action: (f: UpdatedSupplierFactureResponse) => { setClickedFacture(f); setIsModalOpen(true); },
      color: "text-blue-600" 
    },
    { 
        label: "View GRN", 
        icon: <Truck size={14} />, 
        action: (f: UpdatedSupplierFactureResponse) => console.log('Viewing GRN:', f.numeroGRN),
        color: "text-emerald-600" 
    },
    { 
      label: "Print PDF", 
      icon: <Printer size={14} />, 
      action: (f: UpdatedSupplierFactureResponse) => { setClickedFacture(f); setIsPrintModalOpen(true); },
      color: "text-purple-800" 
    },
    { 
      label: "Delete", 
      icon: <Trash2 size={14} />, 
      action: (f: UpdatedSupplierFactureResponse) => { setFactures(prev => prev.filter(item => item.idFacture !== f.idFacture)); },
      color: "text-red-600" 
    },
  ];

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Supplier Invoices</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage incoming bills and supplier payments</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search supplier, invoice or GRN...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          <button 
            onClick={() => { setClickedFacture(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <AddIcon sx={{ fontSize: 18 }} /> Create  Supplier Invoice
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
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 min-w-[200px] overflow-hidden">
              <button onClick={() => {setSelectedStatus(null); setShowStatusMenu(false)}} className="w-full text-left px-4 py-2 text-[10px] font-bold text-gray-400 border-b hover:bg-gray-50">CLEAR FILTER</button>
              {Object.values(FactureResponse.etat).map((status) => (
                <button key={status} onClick={() => {setSelectedStatus(status); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors">{status}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
              {filteredFactures.map((facture) => (
                <tr key={facture.idFacture} className="group hover:bg-secondary-mid/[0.02] transition-colors">
                  {Object.values(columns).map((key, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {key === 'etat' ? (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter uppercase ${
                          facture.etat === FactureResponse.etat.PAYE ? 'bg-emerald-50 text-emerald-600' : 
                          facture.etat === FactureResponse.etat.EN_RETARD ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {facture.etat}
                        </span>
                      ) : key === 'dateFacturation' || key === 'dateEcheance' ? (
                        formatDate(facture[key as keyof UpdatedSupplierFactureResponse] as string)
                      ) : key === 'montantTTC' || key === 'montantRestant' ? (
                        <span className="font-bold">
                             {facture[key as keyof UpdatedSupplierFactureResponse]?.toLocaleString()}
                        </span>
                      ) : (
                        (facture as any)[key] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === facture.idFacture ? null : (facture.idFacture ?? null))}
                      className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === facture.idFacture && (
                      <div ref={menuRef} className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1">
                        {actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            title={opt.label}
                            onClick={() => { opt.action(facture); setActiveMenuId(null); }}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all ${opt.color}`}
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
      </div>

      {isModalOpen && <CreateSupplierInvoiceModal factureData={clickedFacture} isOpen={isModalOpen} onClose={setIsModalOpen} />}
      {isPrintModalOpen && clickedFacture && <SupplierInvoicePrintPreviewModal data={clickedFacture} isOpen={isPrintModalOpen} onClose={()=>setIsPrintModalOpen(false)} onConfirmPrint={()=>{}} />}
    </div>
  )
}

export default SupplierFactures;