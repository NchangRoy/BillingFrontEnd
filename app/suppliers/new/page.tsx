'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { FournisseurCreateRequest } from '@/src/api';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  initialData?: Partial<FournisseurCreateRequest>;
  onSubmit: (content: FournisseurCreateRequest) => void;
}

// Compact, subtle styling constants
const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const SupplierFormPage = ({ initialData, onSubmit }: Props) => {
  const router = useRouter();
  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const payload: FournisseurCreateRequest = {
      username: raw.username as string,
      categorie: raw.categorie as string,
      siteWeb: raw.siteWeb as string || undefined,
      adresse: raw.adresse as string,
      telephone: raw.telephone as string || undefined,
      email: raw.email as string || undefined,
      typeFournisseur: raw.typeFournisseur as FournisseurCreateRequest.typeFournisseur,
      raisonSociale: raw.raisonSociale as string || undefined,
      numeroTva: raw.numeroTva as string || undefined,
      codeFournisseur: raw.codeFournisseur as string || undefined,
      limiteCredit: raw.limiteCredit ? Number(raw.limiteCredit) : undefined,
      actif: raw.actif === 'on',
      ntva: raw.ntva === 'on',
    };

    onSubmit(payload);
  };

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-300'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-6'>
        <button 
          type="button"
          onClick={() => router.back()}
          className='p-2 bg-white border border-gray-200 hover:border-secondary-mid/50 rounded-lg transition-all shadow-sm'
        >
          <ArrowBackIcon className='text-gray-500' fontSize="small" />
        </button>
        <div>
          <h1 className='text-secondary text-2xl font-black tracking-tight leading-none'>
            {isEditing ? 'Edit Supplier' : 'New Supplier'}
          </h1>
          <p className='text-xs text-gray-400 mt-1 font-medium'>
            {isEditing ? `Modifying vendor: ${initialData.username}` : 'Register a new vendor or service provider'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4'>
          
          {/* SECTION: IDENTITY */}
          <div className='md:col-span-2 lg:col-span-3 border-b border-gray-50 pb-1 mb-1'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>1. Supplier Identity</h3>
          </div>

          <div>
            <label className={labelStyles}>Username *</label>
            <input required type="text" name='username' defaultValue={initialData?.username} className={inputStyles} placeholder="vendor_name" />
          </div>

          <div>
            <label className={labelStyles}>Category *</label>
            <select required name="categorie" defaultValue={initialData?.categorie || ""} className={inputStyles}>
              <option value="" disabled>Select Category</option>
              <option value="Grossiste">Grossiste</option>
              <option value="Détaillant">Détaillant</option>
              <option value="Service">Service</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>Type *</label>
            <select required name="typeFournisseur" defaultValue={initialData?.typeFournisseur || ""} className={inputStyles}>
              <option value="" disabled>Select Type</option>
              {Object.values(FournisseurCreateRequest.typeFournisseur).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* SECTION: BUSINESS DETAILS */}
          <div className='md:col-span-2 lg:col-span-3 border-b border-gray-50 pb-1 mb-1 mt-2'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>2. Business Info</h3>
          </div>

          <div className='lg:col-span-2'>
            <label className={labelStyles}>Raison Sociale</label>
            <input type="text" name='raisonSociale' defaultValue={initialData?.raisonSociale} className={inputStyles} placeholder="Legal Entity Name" />
          </div>

          <div>
            <label className={labelStyles}>Supplier Code</label>
            <input type="text" name='codeFournisseur' defaultValue={initialData?.codeFournisseur} className={inputStyles} placeholder="VND-001" />
          </div>

          <div>
            <label className={labelStyles}>VAT Number</label>
            <input type="text" name='numeroTva' defaultValue={initialData?.numeroTva} className={inputStyles} placeholder="Tax identifier" />
          </div>

          <div>
            <label className={labelStyles}>Credit Limit</label>
            <input type="number" name='limiteCredit' defaultValue={initialData?.limiteCredit} className={inputStyles} placeholder="0.00" />
          </div>

          <div>
            <label className={labelStyles}>Website</label>
            <input type="url" name='siteWeb' defaultValue={initialData?.siteWeb} className={inputStyles} placeholder="https://..." />
          </div>

          {/* SECTION: CONTACT */}
          <div className='md:col-span-2 lg:col-span-3 border-b border-gray-50 pb-1 mb-1 mt-2'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>3. Contact & Address</h3>
          </div>

          <div>
            <label className={labelStyles}>Email Address</label>
            <input type="email" name='email' defaultValue={initialData?.email} className={inputStyles} placeholder="contact@vendor.com" />
          </div>

          <div>
            <label className={labelStyles}>Phone Number</label>
            <input type="tel" name='telephone' defaultValue={initialData?.telephone} className={inputStyles} />
          </div>

          <div className='md:col-span-2 lg:col-span-3'>
            <label className={labelStyles}>Full Address *</label>
            <input required name='adresse' defaultValue={initialData?.adresse} className={inputStyles} placeholder="Warehouse or Office address" />
          </div>

          {/* SECTION: STATUS */}
          <div className='flex gap-6 mt-2 md:col-span-3'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input type="checkbox" name="actif" defaultChecked={initialData?.actif ?? true} className="w-4 h-4 accent-secondary-mid" />
              <span className="text-xs font-bold text-gray-500 group-hover:text-secondary-mid transition-colors">Active Supplier</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input type="checkbox" name="ntva" defaultChecked={initialData?.ntva} className="w-4 h-4 accent-secondary-mid" />
              <span className="text-xs font-bold text-gray-500 group-hover:text-secondary-mid transition-colors">VAT Exempt</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-8 flex gap-3 justify-end border-t border-gray-50 pt-6'>
          <button 
            type='button' 
            onClick={() => router.back()}
            className='px-6 py-2 rounded-lg text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all'
          >
            Cancel
          </button>
          <button 
            type='submit' 
            className='px-8 py-2 bg-secondary-mid hover:bg-secondary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md shadow-secondary-mid/10'
          >
            {isEditing ? 'Update Supplier' : 'Save Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierFormPage;