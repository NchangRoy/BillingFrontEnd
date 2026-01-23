'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Pencil, Trash2, MoreVertical, Printer, ClipboardCheck, Clock, XCircle, CheckCircle2, PackageSearch } from "lucide-react";

// API & Models
import { GoodReceiptResponse,GoodsReceiptNoteResponse } from '@/src/api/models/GoodsReceiptNote'
import { MOCK_GOODS_RN } from '@/src/api/models/GoodsReceiptNote'
import { UpdatedClientResponse, clients } from '@/src/api/models/UpdatedClientResponse'

// Logic Components
import CreateGRNModal from './CreateGRNModal'
import GRNPrintPreviewModal from './GRNPrintPreviewModal'

// Mapping Table Columns for GRN
const columns = {
  "GRN #": "grnNumber",
  "Supplier": "supplierName",
  "PO Reference": "purchaseOrderNumber",
  "Receipt Date": "receiptDate",
  "Status": "status",
  "Inspector": "inspectedBy",
  "Vehicle": "vehicleNumber"
}

const GoodsReceiptNotes = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. State Management
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedGRN, setClickedGRN] = useState<GoodsReceiptNoteResponse | undefined>();
  const [grnList, setGrnList] = useState<GoodsReceiptNoteResponse[]>(MOCK_GOODS_RN);
  const [client, setClient] = useState<UpdatedClientResponse | undefined>()

  // 2. Filter Logic (Structural match to your DN search)
  const filteredGRNs = useMemo(() => {
    return grnList.filter((item) => {
      const matchesSearch = 
        item.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.grnNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.purchaseOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, grnList]);

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
      label: "Modify GRN", 
      icon: <Pencil size={14} />, 
      action: (g: GoodsReceiptNoteResponse) => {
        // Finding the supplier/client exactly like in your DN logic
        const foundClient = clients.find(c => c.idClient === g.supplierId);
        setClient(foundClient);
        setClickedGRN(g);
        setIsModalOpen(true);
      },
      color: "text-blue-600" 
    },
    { 
      label: "Quality Check", 
      icon: <ClipboardCheck size={14} />, 
      action: (g: GoodsReceiptNoteResponse) => console.log('Inspecting:', g.grnNumber),
      color: "text-emerald-600" 
    },
    { 
      label: "Print GRN", 
      icon: <Printer size={14} />, 
      action: (g: GoodsReceiptNoteResponse) => {
        setClickedGRN(g);
        setIsPrintModalOpen(true);
      },
      color: "text-purple-800" 
    },
    { 
      label: "Delete GRN", 
      icon: <Trash2 size={14} />, 
      action: (g: GoodsReceiptNoteResponse) => {
        setGrnList(prev => prev.filter(item => item.idGRN !== g.idGRN));
      },
      color: "text-red-600" 
    },
  ];

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Goods Receipt Notes</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage incoming inventory and supplier intake</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search Supplier, GRN # or PO Ref...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          <button 
            onClick={() => { setClient(undefined); setClickedGRN(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-secondary-mid text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:shadow-lg transition-all"
          >
            <AddIcon sx={{ fontSize: 18 }} /> 
            Create Goods Receipt
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r pr-4">Receipt Status</span>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
              selectedStatus ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" : "border-gray-100 text-gray-500"
            }`}
          >
            {selectedStatus || "Filter by Status"}
            <DropDown className={showStatusMenu ? 'rotate-180' : ''} />
          </button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 min-w-[200px] overflow-hidden">
              <button onClick={() => {setSelectedStatus(null); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-[10px] font-black text-gray-400 border-b hover:bg-gray-50 tracking-widest uppercase">Show All</button>
              {Object.values(GoodReceiptResponse.statut).map((status) => (
                <button 
                  key={status} 
                  onClick={() => {setSelectedStatus(status); setShowStatusMenu(false)}} 
                  className="w-full text-left px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors uppercase"
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
                  <th key={col} className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGRNs.map((grn) => (
                <tr key={grn.idGRN} className="group hover:bg-secondary-mid/[0.01] transition-colors">
                  {Object.values(columns).map((value, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {value === 'status' ? (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-tighter uppercase ${
                          grn.status === GoodReceiptResponse.statut.VALIDE || grn.status === GoodReceiptResponse.statut.LIVRE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          grn.status === GoodReceiptResponse.statut.ANNULE ? 'bg-red-50 text-red-600 border-red-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {(grn.status === GoodReceiptResponse.statut.VALIDE || grn.status === GoodReceiptResponse.statut.LIVRE) ? <CheckCircle2 size={12}/> : grn.status === GoodReceiptResponse.statut.ANNULE ? <XCircle size={12}/> : <Clock size={12}/>}
                          {grn.status}
                        </div>
                      ) : value === 'receiptDate' ? (
                        <span className="text-xs font-bold text-gray-500">
                           {grn.receiptDate ? new Date(grn.receiptDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                        </span>
                      ) : value === 'purchaseOrderNumber' ? (
                        <span className="text-[10px] font-bold bg-secondary-super-light text-secondary-mid px-2 py-1 rounded-lg">
                          {grn.purchaseOrderNumber || "No PO Ref"}
                        </span>
                      ) : (
                        (grn as any)[value] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === grn.idGRN ? null : (grn.idGRN ?? null))}
                      className="p-2 text-gray-300 hover:text-secondary-mid hover:bg-secondary-super-light rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === grn.idGRN && (
                      <div 
                        ref={menuRef} 
                        className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200"
                      >
                        {actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            title={opt.label}
                            onClick={() => { opt.action(grn); setActiveMenuId(null); }}
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

        {filteredGRNs.length === 0 && (
          <div className='py-24 text-center flex flex-col items-center justify-center'>
            <PackageSearch className="text-gray-100 mb-4" size={64} />
            <p className='text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]'>No receipt records found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateGRNModal 
          grnData={clickedGRN}  
          clientData={client} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isPrintModalOpen && clickedGRN && (
        <GRNPrintPreviewModal 
          isOpen={isPrintModalOpen} 
          data={clickedGRN} 
          onClose={() => setIsPrintModalOpen(false)}
          onConfirmPrint={()=>{}}
        />
      )}
    </div>
  )
}

export default GoodsReceiptNotes;