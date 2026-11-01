'use client';

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Save, Truck, ClipboardList, ShoppingCart, ChevronRight, CheckCircle2 } from "lucide-react";

// API & Types
import { FactureResponse, UpdatedSupplierFactureResponse } from "@/src/api/models/UpdatedSupplierFactureResponse";
import { UpdatedClientResponse } from "@/src/api/models/UpdatedClientResponse";

// Sub-components
import SupplierHeader from "./SupplierHeader";
import SupplierInvoiceDetails from "./SupplierInvoiceDetails";
import { mapInternalToFactureFournisseurCreateRequest } from "@/src/Mappers/SupplierFactureMapper";
import { createFactureFournisseurOffline, updateFactureFournisseurOffline } from "@/src/offline/services/factureFournisseurService";
import { isFullyOnline } from "@/src/offline/network/connectivity";
import { UpdatedSellerResponse } from "@/src/api/models/UpdatedSellerResponse";
import { toast } from 'sonner';
import { getVisibleFournisseurs } from "@/src/api/scopedTiers";

interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  supplierData?: UpdatedClientResponse; 
  factureData?: UpdatedSupplierFactureResponse;
}

type Stage = "general" | "products";

const CreateSupplierInvoiceModal = ({ isOpen, onClose, supplierData, factureData }: Props) => {
  const [selectedSupplier, setSelectedSupplier] = useState<UpdatedClientResponse | undefined>(supplierData);
  const [facture, setFacture] = useState<UpdatedSupplierFactureResponse | undefined>();
  const [seller, setSeller] = useState<UpdatedSellerResponse | null>(null);
  const [suppliers, setSuppliers] = useState<UpdatedClientResponse[]>([]);
  const [stage, setStage] = useState<Stage>("general");
    useEffect(() => {
        const stored = localStorage.getItem("seller");
        if (stored) setSeller(JSON.parse(stored));

      }, []);

  useEffect(() => {
    if (!isOpen) return;
    getVisibleFournisseurs()
      .then((data) => setSuppliers(data.map((f) => ({
        ...f,
        idClient: f.idFournisseur,
        typeClient: f.typeFournisseur as unknown as UpdatedClientResponse["typeClient"],
        codeClient: f.codeFournisseur,
      })) as unknown as UpdatedClientResponse[]))
      .catch(() => toast.error("Failed to load suppliers."));
  }, [isOpen]);
  // Helper for consistent date strings
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getDueDateStr = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStage("general");

      if (factureData) {
        setFacture(factureData);
        setSelectedSupplier(supplierData);
      } else {
        const newFacture: Partial<UpdatedSupplierFactureResponse> = {
          idFacture: `fact-${new Date().getTime()}`,
          numeroFacture: `SUP-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          etat: FactureResponse.etat.BROUILLON,
          type: "FOURNISSEUR",
          devise: "XAF",
          tauxChange: 1,
          lignesFacture: [],
          montantHT: 0,
          montantTVA: 0,
          montantTTC: 0,
          montantRestant: 0,
          applyVat: true,
          dateFacturation: getTodayStr(),
          dateEcheance: getDueDateStr(30),
          createdAt: new Date().toISOString(),
        };
        setFacture(newFacture as UpdatedSupplierFactureResponse);
        setSelectedSupplier(supplierData);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, factureData, supplierData]);


   

  const handleSave = async () => {
    if (!selectedSupplier || !facture) return;

    const finalPayload: UpdatedSupplierFactureResponse = {
      ...facture,
      
      idFournisseur: selectedSupplier.idClient,
      nomFournisseru: selectedSupplier.raisonSociale || selectedSupplier.username,
      emailFournisseur: selectedSupplier.email,
      adresseFournisseur: selectedSupplier.adresse,
      telephoneFournisseur: selectedSupplier.telephone,
      montantTotal: facture.montantTTC,
      montantRestant: facture.etat === FactureResponse.etat.PAYE ? 0 : facture.montantTTC,
      finalAmount: facture.montantTTC,
      organizationId: seller?.organizationId,
      agencyId: seller?.agencyId,
      createdBy: seller?.Id,
      updatedAt: new Date().toISOString(),

    };

    console.log("Saving Payload:", finalPayload);

    const apiPayload=mapInternalToFactureFournisseurCreateRequest(finalPayload)
    try {
      const online = await isFullyOnline();
      if (!factureData?.idFacture) {
        await createFactureFournisseurOffline(apiPayload)
      } else {
        await updateFactureFournisseurOffline(factureData.idFacture, apiPayload)
      }
      const offlineMsg = !online ? " (sauvegardé localement, synchronisation en attente)" : "";
      toast.success((factureData?.idFacture ? "Supplier invoice updated successfully." : "Supplier invoice created successfully.") + offlineMsg)
      onClose(false);
    } catch (error) {
      console.error("Failed to save supplier invoice:", error);
      toast.error("Failed to save supplier invoice. Please try again.")
    }
  };

  if (!isOpen) return null;

  const generalInfoDone = !!selectedSupplier;
  const productsDone = (facture?.lignesFacture?.length ?? 0) > 0;
  const STAGES: { key: Stage; label: string; icon: typeof ClipboardList; done: boolean }[] = [
    { key: "general", label: "General Info", icon: ClipboardList, done: generalInfoDone },
    { key: "products", label: "Products & Totals", icon: ShoppingCart, done: productsDone },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Background Overlay - Using primary with low opacity for blur */}
      <div 
        className="absolute inset-0 bg-primary/20 backdrop-blur-md" 
        onClick={() => onClose(false)} 
      />

      <div className="relative w-full max-w-5xl bg-secondary-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* HEADER - Using primary/secondary theme */}
        <div className="px-8 py-5 border-b border-secondary-light flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-super-light rounded-2xl text-secondary shadow-sm">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                {factureData ? "Modify Supplier Bill" : "Record Supplier Bill"}
              </h2>
              <p className="text-[10px] text-secondary-gray font-black uppercase tracking-widest flex items-center gap-2">
                <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                    {facture?.numeroFacture}
                </span>
                <span className="w-1 h-1 rounded-full bg-secondary-gray" />
                {facture?.type}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onClose(false)} 
            className="p-2 hover:bg-secondary-super-light rounded-xl transition-all text-secondary-gray hover:text-primary"
          >
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
            <SupplierHeader
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
              invoice={facture}
              setInvoice={setFacture}
            />
          ) : (
            <SupplierInvoiceDetails
              invoice={facture}
              setInvoice={setFacture}
              supplier={selectedSupplier}
            />
          )}
        </div>

        {/* FOOTER - Using your secondary-mid for the amount */}
        <div className="p-6 border-t border-secondary-light bg-white flex justify-between items-center gap-4 shrink-0 shadow-[0_-10px_40px_rgba(3,4,94,0.05)]">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-secondary-gray uppercase tracking-widest">Total Payable Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">
                    {facture?.montantTTC?.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-secondary">
                    {facture?.devise || 'XAF'}
                </span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => onClose(false)}
                className="px-6 py-2 text-xs font-black text-secondary-gray hover:text-primary uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              {stage === "general" ? (
                <button
                  onClick={() => setStage("products")}
                  className="flex items-center gap-3 bg-secondary hover:bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-secondary/20 transition-all active:scale-95 uppercase tracking-wider"
                >
                  Continue to Products <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!selectedSupplier || (facture?.lignesFacture?.length ?? 0) === 0}
                  className="flex items-center gap-3 bg-secondary hover:bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-secondary/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 uppercase tracking-wider"
                >
                  <Save size={18} />
                  Confirm & Record Bill
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplierInvoiceModal;