"use client";

import React, { useEffect, useState ,useCallback} from "react";
import { DevisCreateRequest } from "@/src/api";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import ClientHeader from "./ClientHeader";
import QuotationDetails from "./QuotationDetails";
import { CheckCircle2, Save } from "lucide-react";
import { DevisResponse } from "@/src/api";
import { clients, UpdatedClientResponse } from "@/src/api/models/UpdatedClientResponse";
import { UpdatedDevisResponse } from "@/src/api/models/UpdatedDevisResponse";
import { MOCK_QUOTATIONS } from "@/src/api/models/UpdatedDevisResponse";
interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  clientData?:UpdatedClientResponse|undefined,
  quotationData?:UpdatedDevisResponse
  
  
}

interface headerData {
  clientId: string,
  creationDate: Date,
  validityDate: Date,
  applyVat?: boolean,
  paymentMethod?: string;             
  remiseGlobalePourcentage?: number;  
  isReferal?:boolean,
  nosRef?:string,
}

const QuotationFormModal = ({ isOpen, onClose,clientData,quotationData}: Props) => {
  const [selectedClient, setSelectedClient] = useState<UpdatedClientResponse|undefined>(clientData);
  
  const [headerData, setHeaderData] = useState<headerData>();

  const [quotation, setQuotation] = useState<UpdatedDevisResponse | undefined>();
  



  // 1. INITIALIZATION LOGIC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      if (quotationData) {
        // Mode: EDIT
        setQuotation(quotationData);
        setSelectedClient(clientData);
      


      } else {
        // Mode: CREATE (Initialize with defaults)
        const newQuo: Partial<UpdatedDevisResponse> = {
          numeroDevis: `QUO-${new Date().getTime()}`, // Temporary ID or call gen function
          
          statut: DevisResponse.statut.BROUILLON,
          devise: "XAF",
          lignesDevis: [], // Start with empty lines
          montantHT: 0,
          montantTTC: 0,
          montantTVA: 0,
         
        };
        setQuotation(newQuo as UpdatedDevisResponse);
        setSelectedClient(clientData);
      }
    } else {
      document.body.style.overflow = "unset";
      // Clear state on close to avoid stale data when re-opening
      setQuotation(undefined);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, quotationData, clientData]);


  
  useEffect(() => {
    
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
 const handleSave = () => {


  if(quotationData==undefined){}
    // Combine everything for the API request
    const finalPayload: UpdatedDevisResponse = {
    ...quotation, // Existing lines, totals, and ID if editing
    
    // Header Data Overrides
    idClient: selectedClient?.idClient,
    nomClient: selectedClient?.raisonSociale,
    emailClient: selectedClient?.email,
    
    // Convert Dates to ISO Strings for the API
    dateCreation: headerData?.creationDate.toISOString(),
    dateValidite: headerData?.validityDate.toISOString(),
    
    // VAT Toggle Logic
    applyVat: headerData?.applyVat ?? false,
    
    // Default metadata if new
    statut: quotation?.statut || DevisResponse.statut.BROUILLON,
    devise: quotation?.devise || "XAF",
    
    // Ensure totals are synced with the applyVat logic
    // If applyVat is false, TTC should equal HT
    montantTTC: headerData?.applyVat 
      ? quotation?.montantTTC 
      : quotation?.montantHT,
    montantTVA: headerData?.applyVat 
      ? quotation?.montantTVA 
      : 0,
  };

    console.log("Saving Quotation Payload:", finalPayload);
    // Add your API call here (e.g., mutate(finalPayload))

    if(quotationData==undefined){
      //call method to create new quotataion
      console.log("creating")
    }else{
      //call method to update new quotation
      console.log("updating")
    }

    onClose(false)
  };

 const handleQuotationDataChange = useCallback((param: Partial<UpdatedDevisResponse>) => {
    setQuotation((prev) => {
      // Merge previous state with new parameters
      const base = prev || quotationData || {};
      return {
        ...base,
        ...param
      } as UpdatedDevisResponse;

    })
    
    
    
  }, [quotationData]);

 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch ">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-4xl bg-secondary-background rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
          <ClientHeader 
            clients={clients} 
             
            setMainSelectedClient={setSelectedClient}
            selectClient={selectedClient}
            quotation={quotation}
            setQuotation={setQuotation}
          />
          <QuotationDetails quotation={quotation} setQuotation={setQuotation} client={selectedClient}  />
        </div>

        {/* FIXED FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4 shrink-0">
           <button 
             onClick={() => onClose(false)}
             className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
           >
             Cancel
           </button>
           <button 
           onClick={()=>{handleSave()}}
             disabled={!selectedClient}
             className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 transition-all"
           >
             <Save size={18} />
             SAVE QUOTATION
           </button>
        </div>

      </div>
    </div>
  );
};

export default QuotationFormModal;