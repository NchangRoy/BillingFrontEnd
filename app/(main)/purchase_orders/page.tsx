'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Pencil, Trash2, MoreVertical, Printer, Package, Clock, CheckCircle2, XCircle } from "lucide-react";

// Updated Imports for Purchase Orders
import { UpdatedClientResponse, clients } from '@/src/api/models/UpdatedClientResponse'
import { PurcaseOrderResponse, PurchaseOrderResponse } from '@/src/api/models/PurchaseOrderLine'
import { MOCK_PURCHASE_ORDERS } from '@/src/api/models/PurchaseOrderLine'

// Components
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal'
import PurchaseOrderPrintPreviewModal from './PurchaseOrderPrintPreviewModal'

const columns = {
  "PO #": "poNumber",
  "Producer/Supplier": "supplierName",
  "PO Date": "poDate",
  "Expected Delivery": "expectedDeliveryDate",
  "Method": "transportMethod",
  "Status": "status",
  "Total Amount": "grandTotal"
}

const PurchaseOrders = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [clickedOrder, setClickedOrder] = useState<PurchaseOrderResponse | undefined>();
  
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>(MOCK_PURCHASE_ORDERS); 
  const [producer, setProducer] = useState<UpdatedClientResponse | undefined>()

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const matchesSearch = 
        item.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.poNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, orders]);

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
      label: "Edit PO", 
      icon: <Pencil size={14} />, 
      action: (o: PurchaseOrderResponse) => {
        const foundProducer = clients.find(c => c.idClient === o.supplierId);
        setProducer(foundProducer);
        setClickedOrder(o);
        setIsModalOpen(true);
      },
      color: "text-blue-600" 
    },
    { 
      label: "Print PO", 
      icon: <Printer size={14} />, 
      action: (o: PurchaseOrderResponse) => {
        setClickedOrder(o);
        setIsPrintModalOpen(true);
      },
      color: "text-purple-800" 
    },
    { 
      label: "Delete", 
      icon: <Trash2 size={14} />, 
      action: (o: PurchaseOrderResponse) => {
        setOrders(prev => prev.filter(item => item.idPO !== o.idPO));
      },
      color: "text-red-600" 
    },
  ];

  // Dynamic status options from your Enum
  const statusOptions = Object.values(PurcaseOrderResponse.statut);

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Purchase Orders</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage stock procurement and producers</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search PO #, producer name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

         <button 
            onClick={() => {  setProducer(undefined); setClickedOrder(undefined); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-secondary-mid text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-secondary-mid/20"
          >
            <AddIcon sx={{ fontSize: 18 }} /> Create Purchase Order
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r pr-4">PO Status</span>
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
              {statusOptions.map((status) => (
                <button key={status} onClick={() => {setSelectedStatus(status); setShowStatusMenu(false)}} className="w-full text-left px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors uppercase">{status}</button>
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
              {filteredOrders.map((order) => (
                <tr key={order.idPO} className="group hover:bg-secondary-mid/[0.01] transition-colors">
                  {Object.values(columns).map((key, index) => (
                    <td key={index} className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {key === 'status' ? (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${
                          order.status === PurcaseOrderResponse.statut.VALIDE || order.status === PurcaseOrderResponse.statut.LIVRE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          order.status === PurcaseOrderResponse.statut.ANNULE ? 'bg-red-50 text-red-600 border-red-100' : 
                          order.status === PurcaseOrderResponse.statut.EXPEDIE ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      ) : key === 'poDate' || key === 'expectedDeliveryDate' ? (
                        <span className="text-xs font-bold text-gray-500">
                          {order[key as keyof PurchaseOrderResponse] 
                            ? new Date(order[key as keyof PurchaseOrderResponse] as string).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "—"}
                        </span>
                      ) : key === 'transportMethod' ? (
                        <span className="text-[10px] font-bold text-secondary-mid bg-secondary-super-light px-2 py-1 rounded border border-secondary-mid/10 uppercase">
                          {order.transportMethod?.replace(/_/g, ' ')}
                        </span>
                      ) : key === 'grandTotal' ? (
                        <span className="font-black text-gray-900">
                          {order.grandTotal?.toLocaleString()} <span className="text-[10px] text-gray-400">XAF</span>
                        </span>
                      ) : (
                        (order as any)[key] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === order.idPO ? null : (order.idPO ?? null))}
                      className="p-2 text-gray-300 hover:text-secondary-mid hover:bg-secondary-super-light rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === order.idPO && (
                      <div ref={menuRef} className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                        {actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            title={opt.label}
                            onClick={() => { opt.action(order); setActiveMenuId(null); }}
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
      </div>

      {isModalOpen && <CreatePurchaseOrderModal orderData={clickedOrder} producerData={producer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>} 
      {isPrintModalOpen && clickedOrder && <PurchaseOrderPrintPreviewModal isOpen={isPrintModalOpen} data={clickedOrder} onClose={() => setIsPrintModalOpen(false) } onConfirmPrint={()=>{}}/>}
    </div>
  )
}

export default PurchaseOrders;