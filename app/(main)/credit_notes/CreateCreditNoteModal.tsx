'use client';

import React, { useEffect, useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Save, Undo2, AlertCircle, FileText, ClipboardList, ShoppingCart, ChevronRight, CheckCircle2 } from "lucide-react";

// API & Types
import { UpdatedCreditNoteResponse, CreditNoteResponse } from "@/src/api/models/UpdatedCreditNoteResponse";
import { UpdatedClientResponse } from "@/src/api/models/UpdatedClientResponse";
import { UpdatedSellerResponse } from "@/src/api/models/UpdatedSellerResponse";

// Equivalent UI Components (You'll need to adapt these or use your existing ones)
import ClientHeader from "./ClientHeader";
import CreditNoteDetails from "./CreditNoteDetails"; // Similar to InvoiceDetails but handles reasons
import { mapCreditNoteToRequest } from "@/src/Mappers/CreditNoteMapper";
import { createNoteCreditOffline, updateNoteCreditOffline } from "@/src/offline/services/noteCreditService";
import { isFullyOnline } from "@/src/offline/network/connectivity";
import { toast } from 'sonner';
import { getVisibleClients } from "@/src/api/scopedTiers";

interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  clientData?: UpdatedClientResponse;
  creditNoteData?: UpdatedCreditNoteResponse;
}

type Stage = "general" | "products";

const CreateCreditNoteModal = ({ isOpen, onClose, clientData, creditNoteData }: Props) => {
  const [selectedClient, setSelectedClient] = useState<UpdatedClientResponse | undefined>(clientData);
  const [creditNote, setCreditNote] = useState<UpdatedCreditNoteResponse | undefined>();
  const [clients, setClients] = useState<UpdatedClientResponse[]>([]);
  const [stage, setStage] = useState<Stage>("general");
  const [seller, setSeller] = useState<UpdatedSellerResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) setSeller(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    getVisibleClients()
      .then((data) => setClients(data as unknown as UpdatedClientResponse[]))
      .catch(() => toast.error("Failed to load clients."));
  }, [isOpen]);

  // 1. INITIALIZATION LOGIC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStage("general");

      if (creditNoteData) {
        // Mode: EDIT
        setCreditNote(creditNoteData);
        setSelectedClient(clientData);
      } else {
        // Mode: CREATE
        const newNote: Partial<UpdatedCreditNoteResponse> = {
         
          etat: CreditNoteResponse.etat.BROUILLON,
          reason: CreditNoteResponse.reason.RETOUR_MARCHANDISE, // Default reason
          modeReglement: CreditNoteResponse.modeReglement.CREDIT_CLIENT, // Default for credit notes
          devise: "XAF",
          applyVat: true,
          lignesCreditNote: [],
          montantHT: 0,
          montantTVA: 0,
          montantTTC: 0,
          dateEmission: new Date().toISOString().split('T')[0],
          dateSysteme: new Date().toISOString(),
        };
        setCreditNote(newNote as UpdatedCreditNoteResponse);
        setSelectedClient(clientData);
      }
    } else {
      document.body.style.overflow = "unset";
      setCreditNote(undefined);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, creditNoteData, clientData]);

  // 2. SAVE LOGIC
  const handleSave = async () => {
    if (!selectedClient || !creditNote) return;

    const finalPayload: UpdatedCreditNoteResponse = {
      ...creditNote,
      // Client Mapping
      idClient: selectedClient.idClient,
      nomClient: selectedClient.raisonSociale || selectedClient.username,
      emailClient: selectedClient.email,
      adresseClient: selectedClient.adresse,
      telephoneClient: selectedClient.telephone,
      
      // Totals
      finalAmount: creditNote.montantTTC,

      // Metadata
      organizationId: seller?.organizationId,
      agencyId: seller?.agencyId,
      createdBy: seller?.Id,
      updatedAt: new Date().toISOString()
    };


    const apiPayload=mapCreditNoteToRequest(finalPayload)

    console.log("Saving Credit Note Payload:", finalPayload);

    try {
      const online = await isFullyOnline();
      if (!creditNoteData) {
        await createNoteCreditOffline(apiPayload);
      } else if (creditNoteData.idCreditNote) {
        await updateNoteCreditOffline(creditNoteData.idCreditNote, apiPayload);
      }
      const offlineMsg = !online ? " (sauvegardé localement, synchronisation en attente)" : "";
      toast.success((creditNoteData ? "Credit note updated successfully." : "Credit note created successfully.") + offlineMsg);
      onClose(false);
    } catch (error) {
      console.error("Failed to save credit note:", error);
      toast.error("Failed to save credit note. Please try again.")
    }
  };

  // 3. CHANGE HANDLER
  const handleNoteChange = useCallback((param: Partial<UpdatedCreditNoteResponse>) => {
    setCreditNote((prev) => {
      const base = prev || creditNoteData || {};
      return {
        ...base,
        ...param
      } as UpdatedCreditNoteResponse;
    });
  }, [creditNoteData]);

  if (!isOpen) return null;

  const generalInfoDone = !!selectedClient;
  const productsDone = (creditNote?.lignesCreditNote?.length ?? 0) > 0;
  const STAGES: { key: Stage; label: string; icon: typeof ClipboardList; done: boolean }[] = [
    { key: "general", label: "General Info", icon: ClipboardList, done: generalInfoDone },
    { key: "products", label: "Products & Totals", icon: ShoppingCart, done: productsDone },
  ];

return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0 " onClick={() => onClose(false)} />

      <div className="relative w-full max-w-5xl bg-secondary-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-5 border-b border-secondary-light flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-super-light rounded-xl text-secondary-mid">
              <Undo2 size={26} />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                {creditNoteData ? "Edit Credit Note" : "New Credit Note"}
              </h2>
              <div className="flex items-center gap-3">
                 <p className="text-xs text-secondary-gray font-bold">{creditNote?.numeroCreditNote}</p>
                 {creditNote?.numeroFactureOrigine && (
                    <span className="text-[10px] bg-secondary-super-light text-secondary-mid px-2 py-0.5 rounded border border-secondary-light font-black uppercase">
                      Ref: {creditNote.numeroFactureOrigine}
                    </span>
                 )}
              </div>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-secondary-super-light rounded-full text-secondary-gray transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* STAGE INDICATOR */}
        <div className="px-8 py-4 border-b border-secondary-light bg-white shrink-0 flex items-center gap-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = stage === s.key;
            return (
              <React.Fragment key={s.key}>
                {i > 0 && <ChevronRight size={16} className="text-gray-200 shrink-0" />}
                <button
                  type="button"
                  onClick={() => setStage(s.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    isActive ? "border-secondary-mid bg-secondary-super-light/50" : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black shrink-0 ${
                      s.done ? "bg-emerald-500 text-white" : isActive ? "bg-secondary-mid text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {s.done ? <CheckCircle2 size={12} /> : i + 1}
                  </span>
                  <Icon size={15} className={isActive ? "text-secondary-mid" : "text-gray-400"} />
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-secondary-mid" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {stage === "general" ? (
            <ClientHeader
              clients={clients}
              setMainSelectedClient={setSelectedClient}
              selectClient={selectedClient}
              credit_note={creditNote as any}
              setCreditNote={setCreditNote as any}
            />
          ) : (
            <CreditNoteDetails
              creditNote={creditNote}
              setCreditNote={setCreditNote}
              client={selectedClient}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-secondary-light bg-white flex justify-between items-center gap-4 shrink-0 shadow-lg">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-secondary-gray uppercase tracking-widest">Total Refund</span>
              <span className="text-3xl font-black text-primary">
                {creditNote?.montantTTC?.toLocaleString()} <small className="text-sm text-secondary-mid font-bold">{creditNote?.devise}</small>
              </span>
           </div>

           <div className="flex items-center gap-6">
              <button onClick={() => onClose(false)} className="text-xs font-black text-secondary-gray hover:text-primary uppercase tracking-widest transition-colors">
                Discard
              </button>
              {stage === "general" ? (
                <button
                  onClick={() => setStage("products")}
                  className="flex items-center gap-3 bg-secondary-mid hover:bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-secondary/20 transition-all active:scale-95"
                >
                  Continue to Products <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!selectedClient || (creditNote?.lignesCreditNote?.length ?? 0) === 0}
                  className="flex items-center gap-3 bg-secondary-mid hover:bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-secondary/20 transition-all active:scale-95 disabled:opacity-30"
                >
                  <Save size={20} />
                  SAVE CREDIT NOTE
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCreditNoteModal;