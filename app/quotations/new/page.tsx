'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { DevisCreateRequest } from '@/src/api';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  mainContent: DevisCreateRequest;
  setMainContent: (content: DevisCreateRequest) => void;
}

// Compact & Refined styling to match your new system
const inputStyles = "w-full border border-gray-200 rounded-lg outline-none py-2 px-3 focus:ring-2 focus:ring-secondary-mid/10 focus:border-secondary-mid transition-all text-sm text-gray-700 bg-white shadow-sm placeholder:text-gray-300";
const labelStyles = "text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block ml-0.5";

const CreateQuotationPage = ({ mainContent, setMainContent }: Props) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const updatedContent: DevisCreateRequest = {
      ...mainContent,
      idClient: raw.idClient as string,
      dateCreation: raw.dateCreation as string,
      dateValidite: raw.dateValidite as string,
      conditionsPaiement: raw.conditionsPaiement as string,
      referenceExterne: raw.referenceExterne as string,
      devise: raw.devise as string,
      notes: raw.notes as string,
      validiteOffreJours: raw.validiteOffreJours ? Number(raw.validiteOffreJours) : undefined,
      tauxChange: raw.tauxChange ? Number(raw.tauxChange) : 1,
    };

    setMainContent(updatedContent);
    console.log("Main Quotation Data Updated:", updatedContent);
  };

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-300'>
      {/* Navigation Header */}
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
            Quotation Information
          </h1>
          <p className='text-xs text-gray-400 mt-1 font-medium'>
            Primary details for the new estimate
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4'>
          
          {/* SECTION: CLIENT & REFERENCE */}
          <div className='md:col-span-2 border-b border-gray-50 pb-1 mb-1'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>1. Client & Reference</h3>
          </div>

          <div className='md:col-span-1'>
            <label className={labelStyles}>Client ID / Reference *</label>
            <input 
              required
              type="text" 
              name='idClient' 
              defaultValue={mainContent?.idClient}
              className={inputStyles} 
              placeholder="e.g. CLT-001" 
            />
          </div>

          <div className='md:col-span-1'>
            <label className={labelStyles}>External Reference</label>
            <input 
              type="text" 
              name='referenceExterne' 
              defaultValue={mainContent?.referenceExterne}
              className={inputStyles} 
              placeholder="PO Number, External ID"
            />
          </div>

          {/* SECTION: DATES */}
          <div className='md:col-span-2 border-b border-gray-50 pb-1 mb-1 mt-2'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>2. Schedule & Validity</h3>
          </div>

          <div>
            <label className={labelStyles}>Creation Date *</label>
            <input 
              required
              type="date" 
              name='dateCreation' 
              defaultValue={mainContent?.dateCreation}
              className={inputStyles} 
            />
          </div>

          <div>
            <label className={labelStyles}>Validity Date *</label>
            <input 
              required
              type="date" 
              name='dateValidite' 
              defaultValue={mainContent?.dateValidite}
              className={inputStyles} 
            />
          </div>

          {/* SECTION: CURRENCY */}
          <div className='md:col-span-2 border-b border-gray-50 pb-1 mb-1 mt-2'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>3. Currency & Rates</h3>
          </div>

          <div>
            <label className={labelStyles}>Currency (Devise)</label>
            <select name="devise" defaultValue={mainContent?.devise || "XAF"} className={inputStyles}>
              <option value="XAF">XAF - CFA Franc</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>Exchange Rate</label>
            <input 
              type="number" 
              step="0.01" 
              name='tauxChange' 
              defaultValue={mainContent?.tauxChange || 1}
              className={inputStyles} 
            />
          </div>

          {/* SECTION: TERMS & NOTES */}
          <div className='md:col-span-2 border-b border-gray-50 pb-1 mb-1 mt-2'>
            <h3 className='text-secondary-mid text-[10px] font-black uppercase tracking-widest'>4. Terms & Notes</h3>
          </div>

          <div className='md:col-span-2'>
            <label className={labelStyles}>Payment Conditions</label>
            <textarea 
              name='conditionsPaiement' 
              defaultValue={mainContent?.conditionsPaiement}
              rows={2}
              className={`${inputStyles} resize-none`} 
              placeholder="e.g. 50% upfront, net 30..."
            />
          </div>

          <div className='md:col-span-2'>
            <label className={labelStyles}>Additional Notes</label>
            <textarea 
              name='notes' 
              defaultValue={mainContent?.notes}
              rows={3}
              className={`${inputStyles} resize-none`} 
              placeholder="Internal notes or terms for the client..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-8 flex gap-3 justify-end border-t border-gray-50 pt-6'>
          <button 
            type='button' 
            onClick={() => router.push("/quotations")}
            className='px-6 py-2 rounded-lg text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all'
          >
            Discard
          </button>
          <button 
            type='submit'
            //for now 
            //will have to add post request and then route directly to quotation page 
            onClick={()=>{
              router.push("/quotations/DV001")
            }}
            className='px-8 py-2 bg-secondary-mid hover:bg-secondary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md shadow-secondary-mid/10 hover:scale-[1.02] active:scale-[0.98]'
          >
             Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotationPage;