'use client';

import React, { useEffect, useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Save, Truck, Package, AlertCircle, FileText } from "lucide-react";

// API & Types
import { DeliveryNoteResponse } from "@/src/api/models/DeliveryNoteResponse";
import { UpdatedClientResponse, clients } from "@/src/api/models/UpdatedClientResponse";

// Equivalent UI Components
// Note: You would adapt these to handle Delivery Note specific fields like Agency/Warehouse
import ClientHeader from "./ClientHeader";
import DeliveryNoteDetails from "./DeliveryNoteDetails"; 
import DeliveryNoteLogistics from "./DeliveryNoteLogistics";
import { mapSalesOrderToBonCommandeRequest } from "@/src/Mappers/BonCommandeMapper";
import { BonDeLivraisonService } from "@/src/src2/api";
import { mapDeliveryNoteToRequest } from "@/src/Mappers/DeliveryNoteMapper";

interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  clientData?: UpdatedClientResponse;
  deliveryNoteData?: DeliveryNoteResponse;
}

const CreateDeliveryNoteModal = ({ isOpen, onClose, clientData, deliveryNoteData }: Props) => {
  const [selectedClient, setSelectedClient] = useState<UpdatedClientResponse | undefined>(clientData);
  const [deliveryNote, setDeliveryNote] = useState<DeliveryNoteResponse | undefined>();

  // 1. INITIALIZATION LOGIC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      if (deliveryNoteData) {
        // Mode: EDIT
        setDeliveryNote(deliveryNoteData);
        setSelectedClient(clientData);
      } else {
        // Mode: CREATE
        const newNote: Partial<DeliveryNoteResponse> = {
         
          etat: DeliveryNoteResponse.etat.BROUILLON,
          deliveryDate: new Date().toISOString().split('T')[0],
          lines: [],
          totalAmount: 0,
          termsAndConditions: "Goods must be checked upon arrival.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDeliveryNote(newNote as DeliveryNoteResponse);
        setSelectedClient(clientData);
      }
    } else {
      document.body.style.overflow = "unset";
      setDeliveryNote(undefined);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, deliveryNoteData, clientData]);

  // 2. SAVE LOGIC
  const handleSave = async () => {
    // Basic Validation: Ensure we have a client and at least one item
    if (!selectedClient || !deliveryNote || (deliveryNote.lines?.length ?? 0) === 0) {
      console.error("Missing required data: Client or Items");
      return;
    }

    // Calculate total amount based on lines
    const calculatedTotal = deliveryNote.lines?.reduce((sum, line) => {
      return sum + (line.quantity || 0) * (line.unitPrice || 0);
    }, 0) || 0;

    const finalPayload: DeliveryNoteResponse = {
      ...deliveryNote,
      // 1. Client Info (The billing entity)
      idClient: selectedClient.idClient,
      nomClient: selectedClient.raisonSociale || selectedClient.username,
      adresseClient: selectedClient.adresse,
      emailClient: selectedClient.email,
      telephoneClient: selectedClient.telephone,

      // 2. Recipient Info (Fallback to client if recipient fields are empty)
      recipientName: deliveryNote.recipientName || selectedClient.raisonSociale || selectedClient.username,
      recipientPhone: deliveryNote.recipientPhone || selectedClient.telephone,
      recipientAddress: deliveryNote.recipientAddress || selectedClient.adresse,
      recipientCity: deliveryNote.recipientCity 

      // 3. Financials
      

      // 4. Metadata
      
      // Ensure it's no longer a draft if your business logic requires it upon certain actions
      // etat: DeliveryNoteResponse.etat.ENVOYE 
    };

    console.log("Final Delivery Note Payload for API:", finalPayload);
    const apiPayload=mapDeliveryNoteToRequest(finalPayload)
    console.log(apiPayload)
    // Simulation of API Call
    try {
      if (!deliveryNoteData?.idDN) {
        // CALL POST /delivery-notes
        console.log("Creating new entry in Database...");
        await BonDeLivraisonService.createBonLivraison(apiPayload)
      } else {
        // CALL PUT /delivery-notes/${deliveryNoteData.idDN}
        console.log("Updating existing entry...");
        if(deliveryNoteData.idDN){
          await BonDeLivraisonService.updateLivraison(deliveryNoteData.idDN,apiPayload)
        }

      }
      
      // Close modal on success
      onClose(true); 
    } catch (error) {
      console.error("Failed to save delivery note:", error);
    }
  };
  // 3. CHANGE HANDLER
  const handleNoteChange = useCallback((param: Partial<DeliveryNoteResponse>) => {
    setDeliveryNote((prev) => {
      const base = prev || deliveryNoteData || {};
      return {
        ...base,
        ...param
      } as DeliveryNoteResponse;
    });
  }, [deliveryNoteData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0 " onClick={() => onClose(false)} />

      <div className="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-secondary-light flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Truck size={26} />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                {deliveryNoteData ? "Edit Delivery Note" : "New Delivery Note"}
              </h2>
              <div className="flex items-center gap-3">
                 <p className="text-xs text-secondary-gray font-bold">{deliveryNote?.deliveryNoteNumber}</p>
                 {deliveryNote?.SaleOrderNumber && (
                    <span className="text-[10px] bg-secondary-super-light text-secondary-mid px-2 py-0.5 rounded border border-secondary-light font-black uppercase">
                      PO: {deliveryNote.SaleOrderNumber}
                    </span>
                 )}
              </div>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-secondary-super-light rounded-full text-secondary-gray transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-secondary-super-light/10">
          <ClientHeader 
            clients={clients} 
            setMainSelectedClient={setSelectedClient}
            selectClient={selectedClient}
            deliveryNote={deliveryNote} 
            setDeliveryNote={setDeliveryNote}
          />
          <DeliveryNoteLogistics
           deliveryNote={deliveryNote} 
            setDeliveryNote={setDeliveryNote} 
            client={selectedClient} 
          />

          <DeliveryNoteDetails 
            deliveryNote={deliveryNote} 
            setDeliveryNote={setDeliveryNote} 
            
          />
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-secondary-light bg-white flex justify-between items-center gap-4 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-secondary-gray uppercase tracking-widest">Estimated Value</span>
              <span className="text-3xl font-black text-primary">
                {deliveryNote?.totalAmount?.toLocaleString()} <small className="text-sm text-secondary-mid font-bold">XAF</small>
              </span>
           </div>

           <div className="flex items-center gap-6">
              <button onClick={() => onClose(false)} className="text-xs font-black text-secondary-gray hover:text-primary uppercase tracking-widest transition-colors">
                Discard
              </button>
              <button 
                onClick={handleSave}
                disabled={!selectedClient || (deliveryNote?.lines?.length ?? 0) === 0}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                <Save size={20} />
                SAVE DELIVERY NOTE
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeliveryNoteModal;