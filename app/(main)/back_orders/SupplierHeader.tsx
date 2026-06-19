'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UpdatedClientResponse } from '@/src/api/models/UpdatedClientResponse';
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import { Hash, Calendar, Package, FileSearch } from 'lucide-react';

import { UpdatedBackOrderResponse, BackOrderStatus } from '@/src/api/models/UpdatedBackOrderResponse';
import { UpdatedSellerResponse } from '@/src/api/models/UpdatedSellerResponse';
import { PurchaseOrderResponse, MOCK_PURCHASE_ORDERS } from '@/src/api/models/PurchaseOrderLine';
import { BonDAchatService } from '@/src/src2/api/services/BonDAchatService';
import { mapBackendBAArrayToUIArray } from '@/src/Mappers/BonAchatMapper';
import { toast } from 'sonner';

interface Props {
  suppliers: UpdatedClientResponse[];
  setSelectedSupplier: (data: UpdatedClientResponse) => void;
  selectedSupplier?: UpdatedClientResponse;
  backOrder?: UpdatedBackOrderResponse;
  setBackOrder: (data: UpdatedBackOrderResponse | ((prev: any) => any)) => void;
}

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const readOnlyStyles = "w-full border border-gray-100 bg-gray-50 rounded-lg py-2 px-3 text-sm text-gray-600 cursor-not-allowed font-medium";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const SupplierHeader = ({ suppliers, setSelectedSupplier, selectedSupplier, backOrder, setBackOrder }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<UpdatedClientResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [generatedId, setGeneratedId] = useState<string>("");
  const [systemDate, setSystemDate] = useState<string>("");
  const [seller, setSeller] = useState<UpdatedSellerResponse | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResponse[]>(MOCK_PURCHASE_ORDERS);
  const [poSearch, setPoSearch] = useState("");
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrderResponse[]>([]);
  const [showPODropdown, setShowPODropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    createdAt: new Date().toISOString().split('T')[0],
    statut: BackOrderStatus.statut.EN_ATTENTE,
    remarques: "",
    purchaseOrderNumber: "",
  });

  // Initial load
  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) setSeller(JSON.parse(stored));
    setSystemDate(new Date().toISOString().split('T')[0]);

    const fetchPOs = async () => {
      try {
        const data = await BonDAchatService.getAllBonsAchat();
        const transformed = mapBackendBAArrayToUIArray(data);
        setPurchaseOrders(transformed);
      } catch {
        toast.error("Failed to load purchase orders.");
      }
    };
    fetchPOs();
  }, []);

  // ID generation
  useEffect(() => {
    const agency = seller?.agency || "HQ";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `${agency}-BO-${dateStr}-${suffix}`;
    if (!generatedId) setGeneratedId(newId);
  }, [seller]);

  // Supplier search
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term || (selectedSupplier && term === selectedSupplier.raisonSociale?.toLowerCase())) {
      setFilteredResults([]);
      return;
    }
    const matches = suppliers.filter(s =>
      s.idClient?.toLowerCase().includes(term) ||
      s.raisonSociale?.toLowerCase().includes(term)
    );
    setFilteredResults(matches);
  }, [searchTerm, suppliers, selectedSupplier]);

  // PO search filter
  useEffect(() => {
    if (!poSearch.trim()) {
      setFilteredPOs([]);
      return;
    }
    setFilteredPOs(purchaseOrders.filter(p =>
      p.poNumber?.toLowerCase().includes(poSearch.toLowerCase())
    ));
  }, [poSearch, purchaseOrders]);

  // Sync with parent
  useEffect(() => {
    if (selectedSupplier && backOrder) {
      setBackOrder((prev: any) => ({
        ...prev,
        supplierName: selectedSupplier.raisonSociale,
        statut: formData.statut,
        remarques: formData.remarques,
        numeroBonAchat: formData.purchaseOrderNumber,
      }));
    }
  }, [selectedSupplier, formData]);

  const handleSelectSupplier = (s: UpdatedClientResponse) => {
    setSelectedSupplier(s);
    setSearchTerm(s.raisonSociale || "");
    setShowResults(false);
  };

  const handleSelectPO = (po: PurchaseOrderResponse) => {
    setPoSearch(po.poNumber || "");
    setFormData(prev => ({ ...prev, purchaseOrderNumber: po.poNumber || "" }));
    setShowPODropdown(false);
    const supplierMatch = suppliers.find(s => s.idClient === po.supplierId || s.raisonSociale === po.supplierName);
    if (supplierMatch) handleSelectSupplier(supplierMatch);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100" ref={containerRef}>
      {/* TOP ROW */}
      <div className="p-6 border-b border-gray-50 bg-gray-50/10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-5">
            <label className={labelStyles}>Supplier Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input
                type="text"
                className={`${inputStyles} pl-10`}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                placeholder="Search Supplier..."
              />
              {showResults && filteredResults.length > 0 && (
                <div className="absolute z-[110] w-full mt-2 bg-white border rounded-xl shadow-xl max-h-48 overflow-auto">
                  {filteredResults.map(s => (
                    <div key={s.idClient} onClick={() => handleSelectSupplier(s)} className="px-4 py-2 hover:bg-secondary-super-light cursor-pointer border-b last:border-0">
                      <p className="text-sm font-bold">{s.raisonSociale}</p>
                      <p className="text-[10px] text-gray-400">{s.idClient}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Link Purchase Order</label>
            <div className="relative">
              <FileSearch className="absolute left-3 top-2.5 text-gray-300" size={16} />
              <input
                className={`${inputStyles} pl-9`}
                placeholder="Search PO #..."
                value={poSearch}
                onChange={(e) => { setPoSearch(e.target.value); setShowPODropdown(true); }}
                onFocus={() => setShowPODropdown(true)}
              />
              {showPODropdown && filteredPOs.length > 0 && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl max-h-40 overflow-auto p-1">
                  {filteredPOs.map(p => (
                    <div key={p.idPO} onClick={() => handleSelectPO(p)} className="px-3 py-2 hover:bg-secondary-super-light cursor-pointer rounded-lg flex justify-between items-center group">
                      <span className="text-xs font-black text-gray-700">{p.poNumber}</span>
                      <span className="text-[9px] bg-secondary-light text-secondary-mid px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3">
            <label className={labelStyles}>Back Order ID</label>
            <input readOnly value={backOrder?.id || generatedId} className={`${readOnlyStyles} font-mono text-secondary-mid`} />
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="p-6 grid grid-cols-12 gap-x-5 gap-y-6">
        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Supplier Name</label>
          <div className="relative">
            <HomeIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 16 }} />
            <input readOnly value={selectedSupplier?.raisonSociale || ""} className={`${readOnlyStyles} pl-9`} placeholder="---" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Supplier Address</label>
          <div className="relative">
            <HomeIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 16 }} />
            <input readOnly value={selectedSupplier?.adresse || ""} className={`${readOnlyStyles} pl-9`} placeholder="---" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Status</label>
          <div className="relative">
            <Package className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <select name="statut" value={formData.statut} onChange={handleInputChange} className={`${inputStyles} pl-9 appearance-none`}>
              {Object.values(BackOrderStatus.statut).map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>Creation Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input type="date" name="createdAt" value={formData.createdAt} onChange={handleInputChange} className={`${inputStyles} pl-9`} />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>System Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input readOnly value={systemDate} className={`${readOnlyStyles} pl-9`} />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className={labelStyles}>PO Reference</label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input readOnly value={formData.purchaseOrderNumber || backOrder?.idBonAchat || ""} className={`${readOnlyStyles} pl-9 text-secondary-mid font-bold`} placeholder="---" />
          </div>
        </div>

        <div className="col-span-12">
          <label className={labelStyles}>Remarks</label>
          <textarea
            name="remarques"
            value={formData.remarques}
            onChange={handleInputChange}
            rows={2}
            className={`${inputStyles} resize-none`}
            placeholder="Additional notes about this back order..."
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierHeader;
