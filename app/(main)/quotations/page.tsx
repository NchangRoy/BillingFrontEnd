'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UpdatedDevisResponse } from '@/src/api'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import CreateQuotationModal from './CreateQuotationModal'
import { Pencil, Trash2, MoreVertical,Printer, FileText, Calendar, DollarSign, ReceiptText } from "lucide-react";
import { UpdatedClientResponse } from '@/src/api/models/UpdatedClientResponse'
import { Print } from '@mui/icons-material'
import { clients } from '@/src/api/models/UpdatedClientResponse'
import { MOCK_QUOTATIONS } from '@/src/api/models/UpdatedDevisResponse'
import PrintPreviewModal from './PrintPreviewModal'
import { UpdatedDevisResponse } from '@/src/api/models/UpdatedDevisResponse'
const columns = {
  "Devis Number": "numeroDevis",
  "Client Name": "nomClient",
  "Email": "emailClient",
  "Creation Date": "dateCreation",
  "Status": "statut",
  "Total Amount": "montantTTC",
  "Currency": "devise"
}
import { UpdatedDevisResponse } from '@/src/api/models/UpdatedDevisResponse';

 
const Quotation = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  // State for the Action Popup
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedQuotation, setClickedQuotation] = useState<UpdatedDevisResponse | undefined>();
  const [quotations, setQuotations] = useState<UpdatedDevisResponse[]>(MOCK_QUOTATIONS);
  const [client,setClient]=useState<UpdatedClientResponse>()

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesSearch = 
        item.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.numeroDevis?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.statut === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus,quotations]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);  // Close menus when clicking outside

  }, []);

  const actionOptions = [
    { 
    label: "Modify Quotation", 
    icon: <Pencil size={14} />, 
    action: (q: UpdatedDevisResponse) => {
      console.log('Modifying Devis:', q.idDevis);

      // Find the specific client from your clients list based on the ID in the quotation
     
      
      if (clients[0]) {
        setClient(clients[0]);
      } else {
        // Fallback: If client not found in list, create a partial object from quotation data
        setClient({
          id: q.idClient,
          nom: q.nomClient,
          email: q.emailClient,
          // add other fields as necessary for your UpdatedClientResponse type
        } as UpdatedClientResponse);
      }

      
      setClickedQuotation(q)
      setIsModalOpen(true);
    },
    color: "text-blue-600" 
  },
    { 
      label: "Transform to Bill", 
      icon: <ReceiptText size={14} />, 
      action: (q: UpdatedDevisResponse) => console.log('Bill', q.idDevis),
      color: "text-emerald-600" 

      //


    },
    { 
      label: "Delete Quotation", 
      icon: <Trash2 size={14} />, 
      action: (q: UpdatedDevisResponse) => {
        
        console.log('Delete', q.idDevis)
        setQuotations(prev =>
        prev.filter(item => item.idDevis !== q.idDevis)
      );


      //add api stuff here 
      },
      color: "text-red-600" 
    },
    { 
      label: "Print Quotation", 
      icon: <Printer size={14} />, 
      action: (q: UpdatedDevisResponse) => {

      
         setClickedQuotation(q)
      setIsPrintModalOpen(!isPrintModalOpen)
      console.log(isPrintModalOpen)


      //add api stuff here 
      },
      color: "text-purple-800" 
    },
  ];

  // 2. Filter Logic
  
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
  onClick={() => {
    setClient(undefined);
    setClickedQuotation(undefined)
    setIsModalOpen(true);
  }}
  className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
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
              {["ACCEPTE", "EN_ATTENTE", "REFUSE"].map((status) => (
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
              {filteredQuotations.map((quotation: any) => (
                <tr key={quotation.idDevis} className="group hover:bg-secondary-mid/[0.02] transition-colors">
                  {Object.values(columns).map((value: any, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {value === 'statut' ? (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter uppercase ${
                          quotation[value] === 'ACCEPTE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {quotation[value]}
                        </span>
                      ) : (
                        quotation[value] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === quotation.idDevis ? null : quotation.idDevis)}
                      className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* ACTION POPUP */}
                   {activeMenuId === quotation.idDevis && (
                <div 
                  ref={menuRef} 
                  className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-right-2 duration-200"
                >
                  <div className="flex items-center gap-1">
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
                </div>
              )}
                                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotations.length === 0 && (
          <div className='py-20 text-center'>
            <SearchIcon sx={{ fontSize: 48 }} className="text-gray-200 mb-2" />
            <p className='text-gray-400 font-bold uppercase tracking-widest text-[10px]'>No records found</p>
          </div>
        )}
      </div>

      {isModalOpen && <CreateQuotationModal quotationData={clickedQuotation}  clientData={client} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}

        {isPrintModalOpen && clickedQuotation && <PrintPreviewModal isOpen={isPrintModalOpen} data={clickedQuotation} onConfirmPrint={()=>{

        }}  onClose={() => setIsPrintModalOpen(false)}/>}
    </div>
  )
}



export default Quotation;