'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DevisResponse } from '@/src/api'
import FilterButton from '../../components/FilterButton'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import QuotationTable from './QuotationTable'

const Quotation = () => {
  const router = useRouter();

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    // Logic for loading initial data from localStorage if needed
    const savedQuotation = localStorage.getItem("quotation");
  }, []);

  // 2. Filter Logic
  const filteredQuotations = useMemo(() => {
    return MOCK_QUOTATIONS.filter((item) => {
      const matchesSearch = 
        item.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroDevis?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || item.statut === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  // 3. Navigation Handler
  const handleCreateNew = () => {
    router.push('/quotations/new');
  };

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

  {/* Header Section */}
  <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
    <div>
      <h1 className='text-secondary text-4xl font-black tracking-tight'>Quotations</h1>
      <p className='text-gray-500 mt-1 font-medium'>View and manage client estimates</p>
    </div>

    <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
      {/* Search Bar */}
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

      {/* Create Quotation Button */}
      <button 
        onClick={handleCreateNew}
        className='flex items-center justify-center gap-2 px-6 py-3 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/20 hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap'
      >
        <AddIcon fontSize="small" /> 
        Create Quotation
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
          <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-light/20 rounded-xl shadow-xl z-20 flex flex-col min-w-[220px] overflow-hidden animate-in fade-in slide-in-from-top-1">
            <button 
              onClick={() => { setSelectedStatus(null); setShowStatusMenu(false); }}
              className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 text-gray-400 border-b border-gray-50"
            >
              Clear Selection
            </button>
            {Object.values(DevisResponse.statut).map((status) => (
              <button
                key={status}
                className="px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors"
                onClick={() => {
                  setSelectedStatus(status);
                  setShowStatusMenu(false);
                }}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      <FilterButton name="Standard Only" method={() => {}} />
    </div>
  </div>

  {/* Table Section */}
  <div className='bg-white rounded-2xl shadow-sm border border-secondary-light/20 overflow-hidden'>
    <QuotationTable data={filteredQuotations}/>
    
    {filteredQuotations.length === 0 && (
      <div className='p-24 text-center bg-secondary-super-light/10'>
        <div className='mb-4 opacity-20'>
           <SearchIcon sx={{ fontSize: 64 }} className="text-secondary" />
        </div>
        <p className='text-gray-400 font-bold uppercase tracking-widest text-xs'>No matching records found</p>
      </div>
    )}
  </div>

</div>

  )
}

// --- MOCK DATA ---
const MOCK_QUOTATIONS: DevisResponse[] = [
  {
    "idDevis": "DV001",
    "numeroDevis": "2025-001",
    "dateCreation": "2025-01-10T12:30:00Z",
    "dateValidite": "2025-01-25T00:00:00Z",
    "type": "STANDARD",
    "statut": DevisResponse.statut.ACCEPTE,
    "montantTotal": 450000,
    "idClient": "CLT100",
    "nomClient": "Entreprise Alpha SARL",
    "adresseClient": "Rue 123, Douala",
    "emailClient": "contact@alpha.com",
    "telephoneClient": "+237650000001",
    "lignesDevis": [
      {
        "idLigne": "LG001",
        "quantite": 2,
        "description": "Installation caméra IP",
        "debit": 300000,
        "credit": 0,
        "isTaxLine": false,
        "idProduit": "PRD001",
        "nomProduit": "Caméra IP 4MP",
        "prixUnitaire": 150000,
        "montantTotal": 300000,
        "remisePourcentage": 0,
        "remiseMontant": 0
      },
      {
        "idLigne": "LG003",
        "quantite": 1,
        "description": "TVA 19%",
        "debit": 0,
        "credit": 66500,
        "isTaxLine": true,
        "idProduit": '1',
        "nomProduit": "TVA",
        "prixUnitaire": 66500,
        "montantTotal": 66500,
        "remisePourcentage": 0,
        "remiseMontant": 0
      }
    ],
    "montantHT": 350000,
    "montantTVA": 66500,
    "montantTTC": 416500,
    "devise": "XAF",
    "tauxChange": 1,
    "conditionsPaiement": "50% à la commande, 50% à la livraison",
    "notes": "Merci pour votre confiance.",
    "referenceExterne": "REF-2025-ALPHA",
    "pdfPath": "/devis/2025-001.pdf",
    "envoyeParEmail": true,
    "dateEnvoiEmail": "2025-01-10T12:35:00Z",
    "dateAcceptation": "2025-01-12T10:32:00Z",
    "createdAt": "2025-01-10T12:30:00Z",
    "updatedAt": "2025-01-10T12:35:00Z"
  },
  {
    "idDevis": "DV002",
    "numeroDevis": "2025-002",
    "dateCreation": "2025-02-05T10:00:00Z",
    "dateValidite": "2025-02-20T00:00:00Z",
    "type": "SERVICE",
    "statut": DevisResponse.statut.ACCEPTE,
    "montantTotal": 142800,
    "idClient": "CLT200",
    "nomClient": "Mr. Jean Dupont",
    "adresseClient": "Bastos, Yaoundé",
    "emailClient": "jean.dupont@example.com",
    "telephoneClient": "+237690123456",
    "lignesDevis": [
      {
        "idLigne": "LG010",
        "quantite": 3,
        "description": "Maintenance réseau (heure)",
        "debit": 120000,
        "credit": 0,
        "isTaxLine": false,
        "idProduit": "PRD100",
        "nomProduit": "Maintenance Réseau",
        "prixUnitaire": 40000,
        "montantTotal": 120000,
        "remisePourcentage": 0,
        "remiseMontant": 0
      }
    ],
    "montantHT": 120000,
    "montantTVA": 22800,
    "montantTTC": 142800,
    "devise": "XAF",
    "tauxChange": 1,
    "conditionsPaiement": "Paiement comptant après service",
    "notes": "",
    "referenceExterne": "EXTERNAL-REF-2025-002",
    "pdfPath": "/devis/2025-002.pdf",
    "envoyeParEmail": true,
    "dateEnvoiEmail": "2025-02-06T10:15:00Z",
    "dateAcceptation": "2025-02-06T09:00:00Z",
    "createdAt": "2025-02-05T10:00:00Z",
    "updatedAt": "2025-02-06T09:00:00Z"
  }
];

export default Quotation;