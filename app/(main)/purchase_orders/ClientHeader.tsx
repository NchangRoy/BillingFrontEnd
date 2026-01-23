'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clients, UpdatedClientResponse } from '@/src/api/models/UpdatedClientResponse';
import SearchIcon from "@mui/icons-material/Search";
import FactoryIcon from "@mui/icons-material/Factory"; 
import HomeIcon from "@mui/icons-material/Home"; 
import ReceiptIcon from "@mui/icons-material/Receipt"; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { UpdatedSellerResponse } from '@/src/api/models/UpdatedSellerResponse';
import { PurchaseOrderResponse, MOCK_PURCHASE_ORDERS } from '@/src/api/models/PurchaseOrderLine';
import { GoodsReceiptNoteResponse,GoodReceiptResponse } from '@/src/api/models/GoodsReceiptNote';

interface Props {
  setMainSelectedProducer: (data: UpdatedClientResponse) => void;
  selectedProducer?: UpdatedClientResponse;
  grn?: GoodsReceiptNoteResponse;
  setGrn: (data: GoodsReceiptNoteResponse) => void;
}

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const readOnlyStyles = "w-full border border-gray-100 bg-gray-50 rounded-lg py-2 px-3 text-sm text-gray-600 cursor-not-allowed font-medium";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const GRNHeader = ({  setMainSelectedProducer, selectedProducer, grn, setGrn }: Props) => {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<UpdatedClientResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [generatedId, setGeneratedId] = useState<string>("");
  
  const [systemDate, setSystemDate] = useState<string | null>(null);
  const [user, setUser] = useState<UpdatedSellerResponse | null>(null);
  
  const [internalRefFilter, setInternalRefFilter] = useState<string>("");
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrderResponse[]>([]);
  const [showRefDropdown, setShowRefDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);


  const [producers,setProducers]=useState<UpdatedClientResponse[]>(clients)
  const [formData, setFormData] = useState({
    receiptDate: new Date().toISOString().split('T')[0],
    documentDate: new Date().toISOString().split('T')[0],
    transporterCompanyName: "",
    vehicleNumber: "",
    preparedBy: "",
    remarks: "",
  });

  // --- Initial Setup ---
  useEffect(() => {
    const stored = localStorage.getItem("seller"); 
    if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setFormData(prev => ({ ...prev, preparedBy: parsedUser.nom || "" }));
    }
    setSystemDate(new Date().toISOString().split('T')[0]);
  }, []);

  // --- Producer (Supplier) Search Logic ---
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term || (selectedProducer && term === selectedProducer.raisonSociale?.toLowerCase())) {
      setFilteredResults([]);
      return;
    }
    const matches = producers.filter(p =>
      p.idClient?.toLowerCase().includes(term) ||
      p.raisonSociale?.toLowerCase().includes(term) ||
      p.codeClient?.toLowerCase().includes(term)
    );
    setFilteredResults(matches);
  }, [searchTerm, producers, selectedProducer]);

  // --- Linked PO Reference Search ---
  useEffect(() => {
    if (internalRefFilter.trim() === "") {
      setFilteredPOs([]);
      return;
    }
    const filtered = MOCK_PURCHASE_ORDERS.filter((po) =>
      po.poNumber?.toLowerCase().includes(internalRefFilter.toLowerCase())
    );
    setFilteredPOs(filtered);
  }, [internalRefFilter]);

  const handleSelectReference = (refPO: PurchaseOrderResponse) => {
    setInternalRefFilter(refPO.poNumber || "");
    setShowRefDropdown(false);
    
    // Update GRN with PO reference
    if (grn) {
        setGrn({
          ...grn,
          purchaseOrderId: refPO.idPO,
          purchaseOrderNumber: refPO.poNumber,
        });
    }

    const producer = producers.find(p => p.idClient === refPO.supplierId);
    if (producer) {
      setMainSelectedProducer(producer);
      setSearchTerm(producer.raisonSociale || "");
    }
  };

  // --- ID Generation (GRN Format) ---
  useEffect(() => {
    if (!grn?.idGRN) {
      const agency = user?.agency || "WH";
      const type = "GRN"; 
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      setGeneratedId(`${agency}-${type}-${date}-${suffix}`);
    } 
  }, [user, selectedProducer]);

  // --- Final Sync to Parent ---
  useEffect(() => {
    if (setGrn && grn) {
      setGrn({
        ...grn,
        grnNumber: grn.grnNumber || generatedId,
        supplierId: selectedProducer?.idClient,
        supplierName: selectedProducer?.raisonSociale,
        receiptDate: formData.receiptDate,
        documentDate: formData.documentDate,
        transporterCompanyName: formData.transporterCompanyName,
        vehicleNumber: formData.vehicleNumber,
        preparedBy: formData.preparedBy,
        remarks: formData.remarks,
        systemDate: systemDate || undefined
      });
    }
  }, [selectedProducer, formData, generatedId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (producer: UpdatedClientResponse) => {
    setMainSelectedProducer(producer);
    setSearchTerm(producer.raisonSociale || "");
    setShowResults(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 " ref={containerRef}>
      {/* SECTION 1: SUPPLIER SEARCH & GRN ID */}
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
                    <div key={p.idClient} onClick={() => handleSelect(p)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b last:border-0">
                      <div><p className="text-sm font-bold">{p.raisonSociale}</p><p className="text-[10px] text-gray-400">{p.codeClient}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Supplier Name</label>
            <div className="relative">
              <FactoryIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input readOnly value={selectedProducer?.raisonSociale|| ""} className={`${readOnlyStyles} pl-10`} placeholder="N/A" />
            </div>
          </div>

          <div className="col-span-12 md:col-span-3">
            <label className={labelStyles}>GRN Number</label>
            <div className="relative">
              <ReceiptIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input readOnly value={grn?.grnNumber || generatedId} className={`${readOnlyStyles} pl-10 font-mono text-secondary-mid`} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LOGISTICS & DOCUMENTATION */}
      <div className="p-6 grid grid-cols-12 gap-x-5 gap-y-6">
        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Link Purchase Order (Ref)</label>
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg">
              <AssignmentIcon className="ml-3 text-gray-300" sx={{ fontSize: 18 }} />
              <input type="text" className="w-full bg-transparent outline-none py-2 px-2 text-sm text-gray-700 font-mono" placeholder="PO-2026-..." value={internalRefFilter} onChange={(e) => { setInternalRefFilter(e.target.value); setShowRefDropdown(true); }} />
            </div>
            {showRefDropdown && filteredPOs.length > 0 && (
              <div className="absolute z-[110] w-full mt-2 bg-white border shadow-2xl rounded-xl max-h-48 overflow-auto p-1">
                {filteredPOs.map((po) => (
                  <div key={po.idPO} onClick={() => handleSelectReference(po)} className="px-4 py-3 hover:bg-secondary-super-light cursor-pointer flex flex-col rounded-lg">
                    <span className="text-[11px] font-black font-mono uppercase">{po.poNumber}</span>
                    <span className="text-[10px] text-gray-400">{po.supplierName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Transporter Name</label>
          <div className="relative">
            <LocalShippingIcon className="absolute left-3 top-2.5 text-gray-300 z-10" sx={{ fontSize: 16 }} />
            <input type="text" name="transporterCompanyName" value={formData.transporterCompanyName} onChange={handleInputChange} className={`${inputStyles} pl-9`} placeholder="Logistics Co." />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Vehicle Number</label>
          <div className="relative">
            <LocalShippingIcon className="absolute left-3 top-2.5 text-gray-300 z-10" sx={{ fontSize: 16 }} />
            <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className={`${inputStyles} pl-9`} placeholder="Plate Number" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className={labelStyles}>Actual Receipt Date</label>
          <input type="date" name="receiptDate" className={inputStyles} value={formData.receiptDate} onChange={handleInputChange} />
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className={labelStyles}>Document Date</label>
          <input type="date" name="documentDate" className={inputStyles} value={formData.documentDate} onChange={handleInputChange} />
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className={labelStyles}>System Date</label>
          <input type="date" readOnly className={readOnlyStyles} value={systemDate || ""} />
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className={labelStyles}>Prepared By</label>
          <div className="relative">
            <PersonIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
            <input type="text" name="preparedBy" className={`${inputStyles} pl-10`} value={formData.preparedBy} onChange={handleInputChange} />
          </div>
        </div>

        <div className="col-span-12">
          <label className={labelStyles}>Reception Remarks</label>
          <textarea 
            name="remarks" 
            className={`${inputStyles} h-20 resize-none`} 
            value={formData.remarks} 
            onChange={(e) => setFormData(prev => ({...prev, remarks: e.target.value}))}
            placeholder="Condition of goods, temperature, seal checks..."
          />
        </div>
      </div>
    </div>
  );
};

export default GRNHeader;