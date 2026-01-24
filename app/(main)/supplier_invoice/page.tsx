'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Pencil, Trash2, MoreVertical, Printer, Truck } from "lucide-react";

// API & Models
import { FactureResponse, UpdatedSupplierFactureResponse } from '@/src/api/models/UpdatedSupplierFactureResponse'
import { MOCK_SUPPLIER_FACTURES } from '@/src/api/models/UpdatedSupplierFactureResponse'
import { clients } from '@/src/api/models/UpdatedClientResponse'

// Logic Components
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

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<FactureResponse.etat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedFacture, setClickedFacture] = useState<UpdatedSupplierFactureResponse | undefined>();
  const [factures, setFactures] = useState<UpdatedSupplierFactureResponse[]>(MOCK_SUPPLIER_FACTURES);
  const [selectedSupplier, setSelectedSupplier] = useState<any | undefined>();

  // 2. Transformation Effect (Combined & Fixed)
  useEffect(() => {
    const modalOpen = localStorage.getItem("modalOpen") ;
    
    if (modalOpen === "open") {
      // Check both potential keys for incoming transformed data
      const invoiceString = localStorage.getItem("supplier_invoice") 
      
      if (invoiceString) {
        setIsModalOpen(true);
        const invoiceData: UpdatedSupplierFactureResponse = JSON.parse(invoiceString);
        setClickedFacture(invoiceData);

        // Attempt to find and set the supplier info for the modal context
        // Matching on the supplier ID (adjust key name if your model uses supplierId or idClient)
        const supplierMatch = clients.find(c => c.idClient === invoiceData.idFournisseur);
        console.log(supplierMatch)
        setSelectedSupplier(supplierMatch);

        // Cleanup
        localStorage.setItem("modalOpen", "close");
       
        localStorage.removeItem("supplier_invoice");
        
      }
    }
  }, []);

  // 3. Filter Logic
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

  // 4. Click Outside Menu Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            onClick={() => { setClickedFacture(undefined); setSelectedSupplier(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-secondary-mid text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:shadow-lg transition-all"
          >
            <AddIcon sx={{ fontSize: 18 }} /> Create Supplier Invoice
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r pr-4">Status Filters</span>
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
              <button onClick={() => {setSelectedStatus(null); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-[10px] font-black text-gray-400 border-b hover:bg-gray-50 uppercase tracking-widest">Clear Filter</button>
              {Object.values(FactureResponse.etat).map((status) => (
                <button 
                  key={status} 
                  onClick={() => {setSelectedStatus(status); setShowStatusMenu(false)}} 
                  className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors"
                >
                  {status}
                </button>
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
                  <th key={col} className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">{col}</th>
                ))}
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFactures.map((facture) => (
                <tr key={facture.idFacture} className="group hover:bg-secondary-mid/[0.01] transition-colors">
                  {Object.values(columns).map((key, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {key === 'etat' ? (
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${
                          facture.etat === FactureResponse.etat.PAYE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          facture.etat === FactureResponse.etat.EN_RETARD ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {facture.etat}
                        </span>
                      ) : key === 'dateFacturation' || key === 'dateEcheance' ? (
                        <span className="text-xs font-bold text-gray-500">{formatDate(facture[key as keyof UpdatedSupplierFactureResponse] as string)}</span>
                      ) : (
                        (facture as any)[key] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === facture.idFacture ? null : (facture.idFacture ?? null))}
                      className="p-2 text-gray-300 hover:text-secondary-mid hover:bg-secondary-super-light rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === facture.idFacture && (
                      <div ref={menuRef} className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                        <button 
                          onClick={() => { setClickedFacture(facture); setIsModalOpen(true); setActiveMenuId(null); }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-blue-600 transition-all"
                          title="Modify"
                        ><Pencil size={14} /></button>
                        
                        <button 
                          onClick={() => { setClickedFacture(facture); setIsPrintModalOpen(true); setActiveMenuId(null); }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-purple-800 transition-all"
                          title="Print"
                        ><Printer size={14} /></button>

                        <button 
                          onClick={() => { setFactures(prev => prev.filter(f => f.idFacture !== facture.idFacture)); setActiveMenuId(null); }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 text-red-600 transition-all"
                          title="Delete"
                        ><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateSupplierInvoiceModal 
          factureData={clickedFacture} 
          supplierData={selectedSupplier}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {isPrintModalOpen && clickedFacture && (
        <SupplierInvoicePrintPreviewModal 
          data={clickedFacture} 
          isOpen={isPrintModalOpen} 
          onClose={() => setIsPrintModalOpen(false)} 
          onConfirmPrint={() => {}} 
        />
      )}
    </div>
  )
}

export default SupplierFactures;