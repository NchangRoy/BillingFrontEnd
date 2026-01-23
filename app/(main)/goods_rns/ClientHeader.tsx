'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UpdatedClientResponse } from '@/src/api/models/UpdatedClientResponse';
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home"; 
import ReceiptIcon from "@mui/icons-material/Receipt"; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { GoodsReceiptNoteResponse,GoodReceiptResponse } from '@/src/api/models/GoodsReceiptNote';
import { PurchaseOrderResponse, MOCK_PURCHASE_ORDERS } from '@/src/api/models/PurchaseOrderLine';
import { UpdatedSellerResponse } from '@/src/api/models/UpdatedSellerResponse';
import { convertPurchaseOrderToGRN } from '@/src/api/transformation/purchaseOrderTranformation';

interface Props {
  producers: UpdatedClientResponse[]; // Suppliers/Producers
  setMainSelectedProducer: (data: UpdatedClientResponse) => void;
  selectedProducer?: UpdatedClientResponse;
  grn?: GoodsReceiptNoteResponse;
  setGrn: (data: GoodsReceiptNoteResponse) => void;
}

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const readOnlyStyles = "w-full border border-gray-100 bg-gray-50 rounded-lg py-2 px-3 text-sm text-gray-600 cursor-not-allowed font-medium";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const ClientHeader = ({ producers, setMainSelectedProducer, selectedProducer, grn, setGrn }: Props) => {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<UpdatedClientResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const [systemDate, setSystemDate] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UpdatedSellerResponse | null>(null);
  
  const [poRefFilter, setPoRefFilter] = useState<string>("");
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrderResponse[]>([]);
  const [showPoDropdown, setShowPoDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    receiptDate: new Date().toISOString().split('T')[0],
    vehicleNumber: "",
    transporterCompanyName: "",
    preparedBy: "",
    remarks: "",
  });

  // --- Initial Setup ---
  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        setFormData(prev => ({ ...prev, preparedBy: user.nom || "" }));
    }
    setSystemDate(new Date().toISOString().split('T')[0]);
  }, []);

  // --- Supplier Search Logic ---
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term || (selectedProducer && term === selectedProducer.raisonSociale?.toLowerCase())) {
      setFilteredResults([]);
      return;
    }
    const matches = producers.filter(p =>
      p.idClient?.toLowerCase().includes(term) ||
      p.raisonSociale?.toLowerCase().includes(term)
    );
    setFilteredResults(matches);
  }, [searchTerm, producers, selectedProducer]);

  // --- PO Reference Search (To link GRN to a PO) ---
  useEffect(() => {
    if (poRefFilter.trim() === "") {
      setFilteredPOs([]);
      return;
    }
    const filtered = MOCK_PURCHASE_ORDERS.filter((po) =>
      po.poNumber?.toLowerCase().includes(poRefFilter.toLowerCase())
    );
    setFilteredPOs(filtered);
  }, [poRefFilter]);

  const handleSelectPO = (po: PurchaseOrderResponse) => {
    setPoRefFilter(po.poNumber || "");
    setShowPoDropdown(false);
    
    // Update GRN with PO details

    //convert PO to GRN
    const convertedgrn:GoodsReceiptNoteResponse =convertPurchaseOrderToGRN(po)

    if (grn) {
      setGrn({
        ...convertedgrn
      });
    }

    const supplier = producers.find(p => p.idClient === po.supplierId);
    if (supplier) {
      setMainSelectedProducer(supplier);
      setSearchTerm(supplier.raisonSociale || "");
    }
  };

  // --- Sync to Parent ---
  useEffect(() => {
    if (setGrn && grn) {
      setGrn({
        ...grn,
        supplierId: selectedProducer?.idClient,
        supplierName: selectedProducer?.raisonSociale,
        receiptDate: formData.receiptDate,
        vehicleNumber: formData.vehicleNumber,
        transporterCompanyName: formData.transporterCompanyName,
        preparedBy: formData.preparedBy,
        remarks: formData.remarks,
        systemDate: systemDate || undefined
      });
    }
  }, [selectedProducer, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100" ref={containerRef}>
      {/* SECTION 1: SUPPLIER & GRN IDENTITY */}
      <div className="p-6 border-b border-gray-50 bg-gray-50/10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-5">
            <label className={labelStyles}>Supplier Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input type="text" className={`${inputStyles} pl-10 font-bold`} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }} placeholder="Search Supplier..." />
              {showResults && filteredResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-48 overflow-auto">
                  {filteredResults.map(p => (
                    <div key={p.idClient} onClick={() => { setMainSelectedProducer(p); setSearchTerm(p.raisonSociale || ""); setShowResults(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b last:border-0">
                      <div><p className="text-sm font-bold">{p.raisonSociale}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Current GRN #</label>
            <div className="relative">
              <ReceiptIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input readOnly value={grn?.grnNumber || ""} className={`${readOnlyStyles} pl-10 font-mono text-blue-600`} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-3">
            <label className={labelStyles}>System Date</label>
            <input type="date" readOnly className={readOnlyStyles} value={systemDate || ""} />
          </div>
        </div>
      </div>

      {/* SECTION 2: LOGISTICS & REFERENCE */}
      <div className="p-6 grid grid-cols-12 gap-x-5 gap-y-6">
        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Link Purchase Order (PO)</label>
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg">
              <AssignmentIcon className="ml-3 text-gray-300" sx={{ fontSize: 18 }} />
              <input type="text" className="w-full bg-transparent outline-none py-2 px-2 text-sm text-gray-700 font-mono" placeholder="Search PO Number..." value={poRefFilter} onChange={(e) => { setPoRefFilter(e.target.value); setShowPoDropdown(true); }} />
            </div>
            {showPoDropdown && filteredPOs.length > 0 && (
              <div className="absolute z-[110] w-full mt-2 bg-white border shadow-2xl rounded-xl max-h-48 overflow-auto p-1">
                {filteredPOs.map((po) => (
                  <div key={po.idPO} onClick={() => handleSelectPO(po)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex flex-col rounded-lg">
                    <span className="text-[11px] font-black font-mono uppercase">{po.poNumber}</span>
                    <span className="text-[10px] text-gray-400">{po.supplierName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Transporter Company</label>
          <div className="relative">
            <LocalShippingIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
            <input type="text" name="transporterCompanyName" value={formData.transporterCompanyName} onChange={handleInputChange} className={`${inputStyles} pl-10`} placeholder="e.g. DHL, Internal Fleet" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Vehicle / Truck Number</label>
          <div className="relative">
            <LocalShippingIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
            <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className={`${inputStyles} pl-10`} placeholder="Plate Number" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Actual Receipt Date</label>
          <input type="date" name="receiptDate" className={inputStyles} value={formData.receiptDate} onChange={handleInputChange} />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Receiver (Prepared By)</label>
          <div className="relative">
            <PersonIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
            <input type="text" name="preparedBy" className={`${inputStyles} pl-10`} value={formData.preparedBy} onChange={handleInputChange} />
          </div>
        </div>

        <div className="col-span-12">
          <label className={labelStyles}>Reception Remarks</label>
          <textarea 
            name="remarks" 
            rows={2} 
            className={inputStyles} 
            value={formData.remarks} 
            onChange={(e) => setFormData(prev => ({...prev, remarks: e.target.value}))}
            placeholder="Condition of goods, temperature, seal status..."
          />
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;