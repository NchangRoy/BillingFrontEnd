'use client'

import { DevisResponse, LigneDevisResponse, ProduitResponse } from '@/src/api';
import React, { useState, useEffect, useMemo } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

interface ModalProps {
  showForm: boolean;
  setshowForm: (show: boolean) => void;
  mainContent: DevisResponse;
  setMainContent: (mainContent: DevisResponse) => void;
}

const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const Modal = ({ showForm, setshowForm, mainContent, setMainContent }: ModalProps) => {
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [form, setForm] = useState({
    idProduit: "",
    nomProduit: "",
    description: "",
    quantite: 1,
    prixUnitaire: 0,
    remisePourcentage: 0,
    remiseMontant: 0,
  });

  useEffect(() => {
    if (showForm) {
      // Data setup - Replace with your actual API fetch if needed
      const PRODUITS: ProduitResponse[] = [
        { idProduit: "PRD-001", nomProduit: "Caméra IP 4MP", reference: "CAM-IP-4MP", prixVente: 150000 },
        { idProduit: "PRD-002", nomProduit: "Caméra IP 8MP", reference: "CAM-IP-8MP", prixVente: 220000 },
        { idProduit: "PRD-003", nomProduit: "Installation Caméra", reference: "SERV-INSTALL", prixVente: 50000 },
      ];
      setProducts(PRODUITS);
    }
  }, [showForm]);

  // Calculations
  const brutTotal = form.quantite * form.prixUnitaire;
  const montantTotal = brutTotal - form.remiseMontant;

  // Linked Discount Handlers
  const handleDiscountPercentChange = (percent: number) => {
    const amount = (percent / 100) * brutTotal;
    setForm(prev => ({ ...prev, remisePourcentage: percent, remiseMontant: amount }));
  };

  const handleDiscountAmountChange = (amount: number) => {
    const percent = brutTotal > 0 ? (amount / brutTotal) * 100 : 0;
    setForm(prev => ({ ...prev, remiseMontant: amount, remisePourcentage: percent }));
  };

  const handleSelectProduct = (product: ProduitResponse) => {
    setForm(prev => ({
      ...prev,
      idProduit: product.idProduit || "",
      nomProduit: product.nomProduit || "",
      prixUnitaire: product.prixVente || 0,
      description: product.nomProduit || "", 
      // Directly set the product name here
      remiseMontant: 0,
      remisePourcentage: 0
    }));
    setSearchTerm(product.nomProduit || "");
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const quotationLine: LigneDevisResponse = {
      quantite: form.quantite,
      description: form.description,
      isTaxLine: (e.currentTarget.elements.namedItem('isTaxLine') as HTMLInputElement).checked,
      idProduit: form.idProduit,
      nomProduit: form.nomProduit,
      prixUnitaire: form.prixUnitaire,
      montantTotal: montantTotal,
      remisePourcentage: form.remisePourcentage,
      remiseMontant: form.remiseMontant,
    };

    console.log(quotationLine)
    setMainContent({
      ...mainContent,
      lignesDevis: [...(mainContent.lignesDevis || []), quotationLine]
    });
    setshowForm(false);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => p.nomProduit?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, products]);

  if (!showForm) return null;

  return (
    <div className='fixed bottom-10 right-10 z-50  p-4'>
      <div className='bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden'>
        
        
        <div className='px-8 py-5 border-b flex justify-between items-center'>
          <h2 className='text-secondary text-xl font-black tracking-tight'>Quotation Line</h2>
          <button onClick={() => setshowForm(false)} className='text-gray-400 hover:text-secondary'><CloseIcon /></button>
        </div>

        <form onSubmit={handleSubmit} className='p-8 overflow-y-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4'>
            
            
            <div className='md:col-span-2 relative'>
              <label className={labelStyles}>Quick Search Product</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 text-gray-300" sx={{ fontSize: 18 }} />
                <input 
                  type="text" 
                  className={`${inputStyles} pl-10`} 
                  placeholder="Type product name..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                />
              </div>
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-2xl max-h-40 overflow-auto">
                  {filteredProducts.map(p => (
                    <div key={p.idProduit} onClick={() => handleSelectProduct(p)} className="p-3 hover:bg-secondary-mid/5 cursor-pointer border-b last:border-none flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">{p.nomProduit}</span>
                      <span className="text-[10px] font-black text-secondary-mid">{p.prixVente?.toLocaleString()} XAF</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='md:col-span-2'>
              <label className={labelStyles}>Description</label>
              <input 
                required 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className={inputStyles} 
              />
            </div>

            <div>
              
              <label className={labelStyles}>Unit Price</label>
             
              <input 
                required 
                type="number" 
                value={form.prixUnitaire} 
                onChange={e => setForm({...form, prixUnitaire: Number(e.target.value)})} 
                className={inputStyles} />

            </div>

            <div>
              <label className={labelStyles}>Quantity</label>

              <input 
                required 
                type="number" 
                value={form.quantite} 
                onChange={e => setForm({...form, quantite: Number(e.target.value)})} 
                className={inputStyles} 
              />

            </div>

           
            <div className="md:col-span-2 grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>

                <label className={labelStyles}>Discount (%)</label>

                <input 
                    type="number" 
                    value={form.remisePourcentage} 
                    onChange={e => handleDiscountPercentChange(Number(e.target.value))} 
                    className={inputStyles} 
                />

              </div>
              <div>

                <label className={labelStyles}>Discount Amount (XAF)</label>

                <input 
                    type="number" 
                    value={form.remiseMontant} 
                    onChange={e => handleDiscountAmountChange(Number(e.target.value))} 
                    className={inputStyles} 
                />

              </div>
            </div>

            <div className='md:col-span-2'>

              <label className="flex items-center gap-2 cursor-pointer group">

                <input type="checkbox" name='isTaxLine' className="w-4 h-4 accent-secondary-mid" />

                <span className="text-xs font-bold text-gray-500 uppercase group-hover:text-secondary-mid transition-colors">Apply Tax</span>

              </label>
              
            </div>

           
            <div className='md:col-span-2 bg-gray-900 text-white p-6 rounded-2xl flex justify-between items-end'>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Final Line Total</p>
                <p className="text-3xl font-black">{montantTotal.toLocaleString()} <span className="text-sm font-normal text-gray-400">XAF</span></p>
              </div>
              {form.remiseMontant > 0 && (
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    Save {form.remiseMontant.toLocaleString()} XAF
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='mt-8 flex gap-3 justify-end'>
            <button type='button' onClick={() => setshowForm(false)} className='px-6 py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest'>Cancel</button>
            <button type='submit' className='px-10 py-3 bg-secondary-mid hover:bg-secondary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-secondary-mid/20'>Save to Quote</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;