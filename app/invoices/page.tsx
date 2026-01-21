'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FactureResponse } from '@/src/api' // Using FactureResponse now
import FilterButton from '../../components/FilterButton'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import ReceiptIcon from "@mui/icons-material/ReceiptLong" // More appropriate for invoices
import InvoiceTable from './InvoiceTable' // You'll need to create this based on QuotationTable
import CreateInvoiceModal from './CreateInvoiceModal'

const Invoices = () => {
  const router = useRouter();

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<FactureResponse.etat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 2. Filter Logic
  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((item) => {
      const matchesSearch = 
        item.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroFacture?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || item.etat === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Invoices</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage billing and track payments</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          {/* Search Bar */}
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search client or invoice #...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          <button 
            onClick={handleCreateNew}
            className='flex items-center justify-center gap-2 px-6 py-3 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/20 hover:bg-secondary hover:scale-[1.02] transition-all whitespace-nowrap'
          >
            <AddIcon fontSize="small" /> 
            New Invoice
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex flex-col md:flex-row md:items-center gap-6">
        <div className='flex items-center gap-2 border-r border-secondary-super-light pr-6'>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Filters</span>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${
                showStatusMenu || selectedStatus 
                ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" 
                : "border-secondary-super-light text-gray-500 hover:border-secondary-light bg-white"
              }`}
            >
              <span>{selectedStatus ? `Status: ${selectedStatus}` : "Select Status"}</span>
              <DropDown className={`transition-transform duration-300 ${showStatusMenu ? 'rotate-180' : ''}`} />
            </button>

            {showStatusMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-light/20 rounded-xl shadow-xl z-20 flex flex-col min-w-[220px] overflow-hidden">
                <button 
                  onClick={() => { setSelectedStatus(null); setShowStatusMenu(false); }}
                  className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 text-gray-400 border-b border-gray-50"
                >
                  All Invoices
                </button>
                {Object.values(FactureResponse.etat).map((status) => (
                  <button
                    key={status}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors"
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusMenu(false);
                    }}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
          <FilterButton name="Overdue Only" method={() => setSelectedStatus(FactureResponse.etat.EN_RETARD)} />
        </div>
      </div>

      {/* Table Section */}
      <div className='bg-white rounded-2xl shadow-sm border border-secondary-light/20 overflow-hidden'>
        <InvoiceTable data={filteredInvoices}/>
        
        {filteredInvoices.length === 0 && (
          <div className='p-24 text-center bg-secondary-super-light/10'>
            <div className='mb-4 opacity-20'>
               <ReceiptIcon sx={{ fontSize: 64 }} className="text-secondary" />
            </div>
            <p className='text-gray-400 font-bold uppercase tracking-widest text-xs'>No invoices found</p>
          </div>
        )}
      </div>

      {isModalOpen && <CreateInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}
    </div>
  )
}

// --- MOCK DATA MAPPED TO FACTURE STRUCTURE ---
const MOCK_INVOICES: FactureResponse[] = [
  {
    idFacture: "INV-001",
    numeroFacture: "FAC-2025-001",
    dateFacturation: "2025-01-15T09:00:00Z",
    dateEcheance: "2025-02-15T00:00:00Z",
    etat: FactureResponse.etat.PAYE,
    montantTotal: 416500,
    montantRestant: 0,
    nomClient: "Entreprise Alpha SARL",
    montantTTC: 416500,
    devise: "XAF",
    referenceCommande: "REF-2025-ALPHA",
    lignesFacture: [
      {
        idLigne: "L-001",
        description: "Installation caméra IP",
        quantite: 2,
        prixUnitaire: 150000,
        montantTotal: 300000
      }
    ]
  },
  {
    idFacture: "INV-002",
    numeroFacture: "FAC-2025-002",
    dateFacturation: "2025-02-10T14:30:00Z",
    dateEcheance: "2025-02-20T00:00:00Z",
    etat: FactureResponse.etat.EN_RETARD,
    montantTotal: 142800,
    montantRestant: 142800,
    nomClient: "Mr. Jean Dupont",
    montantTTC: 142800,
    devise: "XAF"
  }
];

export default Invoices;