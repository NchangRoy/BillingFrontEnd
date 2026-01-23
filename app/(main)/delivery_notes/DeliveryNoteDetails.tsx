'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UpdatedProductResponse, produits } from '@/src/api/models/UpdatedProductResponse';
import SearchIcon from "@mui/icons-material/Search";
import { Trash2, Plus, Box, Package, ClipboardCheck, Truck, AlertCircle, Pencil } from "lucide-react";
import { DeliveryNoteResponse, DeliveryNoteLineResponse } from '@/src/api/models/DeliveryNoteResponse';
import SummaryCard from '@/components/SummaryCard';

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

interface Props {
  deliveryNote: DeliveryNoteResponse | undefined;
  setDeliveryNote: (data: DeliveryNoteResponse) => void;
}

const DeliveryNoteDetails = ({ deliveryNote, setDeliveryNote }: Props) => {
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<UpdatedProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<UpdatedProductResponse | null>(null);
  const [showProductResults, setShowProductResults] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Filter Products
  useEffect(() => {
    const term = productSearch.toLowerCase().trim();
    if (!term || (selectedProduct && term === selectedProduct.nomProduit?.toLowerCase())) {
      setFilteredProducts([]);
      return;
    }
    const filtered = produits.filter(p =>
      p.idProduit?.toLowerCase().includes(term) ||
      p.nomProduit?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  }, [productSearch, selectedProduct]);

  // 2. Add Line Logic
  const addLine = () => {
    if (!selectedProduct || !deliveryNote) return;

    const newLine: DeliveryNoteLineResponse = {
      productId: selectedProduct.idProduit,
      idProduit: selectedProduct.idProduit,
      description: selectedProduct.nomProduit,
      quantity: quantity,
      unitPrice: 0, 
      amount: 0
    };

    setDeliveryNote({
      ...deliveryNote,
      lines: [...(deliveryNote.lines || []), newLine]
    });

    // Reset Form
    setSelectedProduct(null);
    setProductSearch("");
    setQuantity(1);
  };

  const removeLine = (index: number) => {
    if (!deliveryNote) return;
    const newLines = [...(deliveryNote.lines || [])];
    newLines.splice(index, 1);
    setDeliveryNote({ ...deliveryNote, lines: newLines });
  };

  // 3. Totals Calculation for Summary
  const totalQuantity = deliveryNote?.lines?.reduce((acc, line) => acc + (line.quantity || 0), 0) || 0;
  const totalItems = deliveryNote?.lines?.length || 0;

  const handleEdit = (line: DeliveryNoteLineResponse, index: number) => {
    // 1. Find the product in the local inventory to restore selection
    const productToEdit = produits.find(p => p.idProduit === line.productId || p.idProduit === line.idProduit);
    
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setProductSearch(productToEdit.nomProduit || "");
    } else {
      // Fallback if product isn't in current list
      setProductSearch(line.description || "");
    }

    // 2. Set the quantity from the line
    setQuantity(line.quantity || 1);

    // 3. Remove the line from the current list
    removeLine(index);

    // 4. Scroll to form for better UX
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 font-sans pb-10" ref={containerRef}>
      
      {/* FORM UI */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-6 border-b border-blue-50 pb-4">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={18} />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Shipment Item Entry</h3>
          </div>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Logistics Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 md:col-span-6 relative">
            <label className={labelStyles}>Product to Ship</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
              <input
                type="text" className={`${inputStyles} pl-10 border-blue-50 focus:border-blue-500`}
                value={productSearch}
                onChange={(e) => { setProductSearch(e.target.value); setShowProductResults(true); }}
                onFocus={() => setShowProductResults(true)} 
                placeholder="Search Inventory..."
              />
            </div>
            {showProductResults && filteredProducts.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-auto">
                {filteredProducts.map(p => (
                  <div key={p.idProduit} onClick={() => {
                    setSelectedProduct(p);
                    setProductSearch(p.nomProduit || "");
                    setShowProductResults(false);
                  }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-none flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">{p.nomProduit}</span>
                    <span className="text-[10px] font-mono text-gray-400">Stock: {p.stockQuantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Quantity to Deliver</label>
            <input 
              type="number" 
              className={`${inputStyles} border-blue-50`} 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))} 
              min="1" 
            />
          </div>

          <div className="col-span-12 md:col-span-2 pt-[21px]">
            <button
              type="button" onClick={addLine} disabled={!selectedProduct}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-[38px] shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE - Product and Quantity Only */}
       <div className="bg-white rounded-2xl shadow-sm border border-secondary-light overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary-background border-b border-secondary-light">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-secondary-gray">Product</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-secondary-gray text-center">Qty</th>
             
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-super-light">
            {deliveryNote?.lines?.map((line, idx) => (
              <tr key={idx} className="group hover:bg-secondary-background/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-primary">{line.description}</p>
                 
                </td>
                <td className="px-6 py-4 text-center font-bold text-primary">{line.quantity}</td>
               
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleEdit(line, idx)} className="p-2 text-secondary-mid hover:bg-secondary-super-light rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => removeLine(idx)} className="p-2 text-red-400 hover:text-red-500 hover:bg-secondary-super-light rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOGISTICS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <SummaryCard 
          title="Total Unique Items" 
          value={totalItems} 
          icon={<Box />} 
          variant="default" 
        />
        <SummaryCard 
          title="Total Qty Units" 
          value={totalQuantity} 
          icon={<ClipboardCheck />} 
          variant="emerald" 
        />
        
      </div>
    </div>
  );
}

export default DeliveryNoteDetails;