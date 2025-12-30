'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { FactureResponse } from '@/src/api'
import FilterButton from '../../components/FilterButton'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import InvoiceTable from './InvoiceTable'

const Invoices = () => {
  // 1. State Management
  const [invoices, setInvoices] = useState<FactureResponse[]>([]);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // 2. Fetch from LocalStorage on Mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoice");
    if (savedInvoices) {
      try {

        const parsed = JSON.parse(savedInvoices);
        // Normalize to array
        setInvoices(Array.isArray(parsed) ? parsed : [parsed]);

        setInvoices(MOCK_INVOICES);
      } catch (error) {
        console.error("Failed to parse invoices", error);
        setInvoices(MOCK_INVOICES);
      }
    } else {
      setInvoices(MOCK_INVOICES);
    }
  }, []);

  // 3. Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      const matchesSearch = 
        item.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || item.etat === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, invoices]);

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-gray-50 min-h-screen'>
      
      {/* Header & Search */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary-mid text-4xl font-bold tracking-tight'>Invoices</h1>
          <p className='text-gray-500 mt-1'>Track payments and billing status</p>
        </div>

        <div className='flex items-center bg-white border-2 border-secondary-light/30 px-4 py-2 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all'>
          <input 
            type="text" 
            className='border-none outline-none text-gray-700 w-full md:w-72 bg-transparent' 
            placeholder='Search client or invoice #...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className='text-secondary-mid' />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
        <div className='flex items-center gap-2 border-r border-gray-100 pr-6'>
           <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Filters</span>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-medium text-sm ${
                showStatusMenu || selectedStatus 
                ? "border-secondary-mid bg-secondary-mid/5 text-secondary-mid" 
                : "border-gray-100 text-gray-600 hover:border-secondary-light"
              }`}
            >
              <span>{selectedStatus ? `Status: ${selectedStatus}` : "Invoice Status"}</span>
              <DropDown className={`transition-transform duration-300 ${showStatusMenu ? 'rotate-180' : ''}`} />
            </button>

            {showStatusMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 flex flex-col min-w-[200px] overflow-hidden animate-in fade-in slide-in-from-top-1">
                <button 
                  onClick={() => { setSelectedStatus(null); setShowStatusMenu(false); }}
                  className="px-4 py-2 text-left text-xs hover:bg-gray-50 text-gray-400 border-b border-gray-50"
                >
                  Clear Selection
                </button>
                {Object.values(FactureResponse.etat).map((status) => (
                  <button
                    key={status}
                    className="px-4 py-3 text-left text-sm font-medium hover:bg-secondary-mid/10 hover:text-secondary-mid transition-colors"
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

          <FilterButton name="Overdue Only" method={() => setSelectedStatus(FactureResponse.etat.EN_RETARD)} />
        </div>
      </div>

      {/* Table Section */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <InvoiceTable data={filteredInvoices}/>
        
        {filteredInvoices.length === 0 && (
          <div className='p-20 text-center'>
            <p className='text-gray-400 font-medium'>No invoices found matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  )
}

// --- MOCK DATA ---
const MOCK_INVOICES: FactureResponse[] = [
  {
    idFacture: "FAC-2025-001",
    numeroFacture: "INV/2025/001",
    dateFacturation: "2025-12-01T10:00:00Z",
    dateEcheance: "2025-12-31T10:00:00Z",
    type: "VENTE",
    etat: FactureResponse.etat.PARTIELLEMENT_PAYE,
    montantTotal: 595000,
    montantRestant: 200000,
    idClient: "CLT-001",
    nomClient: "Global Tech SARL",
    adresseClient: "Avenue Kennedy, Yaoundé",
    emailClient: "billing@globaltech.cm",
    telephoneClient: "+237 677 000 000",
    lignesFacture: [
      {
        idLigne: "L-001",
        quantite: 2,
        description: "Installation Serveur Proliant",
        debit: 500000,
        credit: 0,
        isTaxLine: false,
        idProduit: "PRD-99",
        nomProduit: "Installation Physique",
        prixUnitaire: 250000,
        montantTotal: 500000
      },
      {
        idLigne: "L-TAX",
        quantite: 1,
        description: "TVA (19%)",
        debit: 95000,
        credit: 0,
        isTaxLine: true,
        idProduit: "TAX-19",
        nomProduit: "TVA",
        prixUnitaire: 95000,
        montantTotal: 95000
      }
    ],
    montantHT: 500000,
    montantTVA: 95000,
    montantTTC: 595000,
    devise: "XAF",
    tauxChange: 1,
    conditionsPaiement: "Net 30 jours",
    notes: "Merci de mentionner la référence sur votre virement.",
    referenceCommande: "CMD-2025-882",
    pdfPath: "/storage/invoices/inv-001.pdf",
    envoyeParEmail: true,
    dateEnvoiEmail: "2025-12-01T11:00:00Z",
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-05T14:20:00Z"
  },
  {
    idFacture: "FAC-2025-002",
    numeroFacture: "INV/2025/002",
    dateFacturation: "2025-12-15T09:30:00Z",
    dateEcheance: "2026-01-15T09:30:00Z",
    type: "MAINTENANCE",
    etat: FactureResponse.etat.PAYE,
    montantTotal: 119000,
    montantRestant: 0,
    idClient: "CLT-042",
    nomClient: "Mme. Alice Ngassa",
    adresseClient: "Bonapriso, Douala",
    emailClient: "alice.n@gmail.com",
    telephoneClient: "+237 699 111 222",
    lignesFacture: [
      {
        idLigne: "L-002",
        quantite: 1,
        description: "Maintenance Réseau Mensuelle",
        debit: 100000,
        credit: 0,
        isTaxLine: false,
        idProduit: "SRV-MNT",
        nomProduit: "Pack Maintenance",
        prixUnitaire: 100000,
        montantTotal: 100000
      }
    ],
    montantHT: 100000,
    montantTVA: 19000,
    montantTTC: 119000,
    devise: "XAF",
    tauxChange: 1,
    conditionsPaiement: "Paiement à la réception",
    notes: "Service effectué avec succès.",
    referenceCommande: "CMD-2025-901",
    envoyeParEmail: false,
    createdAt: "2025-12-15T09:30:00Z",
    updatedAt: "2025-12-15T09:30:00Z"
  },
  {
    idFacture: "FAC-2025-003",
    numeroFacture: "INV/2025/003",
    dateFacturation: "2025-11-20T08:00:00Z",
    dateEcheance: "2025-12-20T08:00:00Z",
    type: "VENTE",
    etat: FactureResponse.etat.EN_RETARD,
    montantTotal: 238000,
    montantRestant: 238000,
    idClient: "CLT-088",
    nomClient: "Hôtel la Falaise",
    adresseClient: "Centre Ville, Yaoundé",
    emailClient: "finance@lafalaise.com",
    telephoneClient: "+237 222 333 444",
    lignesFacture: [
      {
        idLigne: "L-003",
        quantite: 4,
        description: "Remplacement Routeurs WiFi",
        debit: 200000,
        credit: 0,
        isTaxLine: false,
        idProduit: "HW-WIFI",
        nomProduit: "TP-Link AX6000",
        prixUnitaire: 50000,
        montantTotal: 200000
      }
    ],
    montantHT: 200000,
    montantTVA: 38000,
    montantTTC: 238000,
    devise: "XAF",
    tauxChange: 1,
    conditionsPaiement: "Net 30",
    notes: "Relance effectuée le 18/12.",
    createdAt: "2025-11-20T08:00:00Z",
    updatedAt: "2025-12-18T10:00:00Z"
  }
];

export default Invoices;