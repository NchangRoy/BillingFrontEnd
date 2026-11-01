'use client';

import React, { useEffect, useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Save, FileText, ShoppingCart, ClipboardList, MapPinned, ChevronRight, CheckCircle2 } from "lucide-react";

// API & Types
import { PurcaseOrderResponse, PurchaseOrderResponse } from "@/src/api/models/PurchaseOrderLine";
import { UpdatedClientResponse } from "@/src/api/models/UpdatedClientResponse";

// Procurement Sub-components (Assuming these follow the same pattern as your Invoice versions)
import ProducerHeader from "./ClientHeader";
import PurchaseOrderDetails from "./PurchaseOrderDetails";       // Handles Line Items and Totals
import POPaintPreviewModal from "./PurchaseOrderPrintPreviewModal";
import PurchaseOrderLogistics from "./PurchaseOrderLogistics";
import { mapPurchaseOrderToBonAchatRequest } from "@/src/Mappers/BonAchatMapper";
import { createBonAchatOffline, updateBonAchatOffline } from "@/src/offline/services/bonAchatService";
import { isFullyOnline } from "@/src/offline/network/connectivity";
import { toast } from 'sonner';
import { UpdatedSellerResponse } from "@/src/api/models/UpdatedSellerResponse";
import { getVisibleFournisseurs } from "@/src/api/scopedTiers";
interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  producerData?: UpdatedClientResponse; // Source producer (from your clients list)
  orderData?: PurchaseOrderResponse;    // Existing PO if in edit mode
}

type Stage = "general" | "logistics" | "products";

const CreatePurchaseOrderModal = ({ isOpen, onClose, producerData, orderData }: Props) => {
  const [selectedProducer, setSelectedProducer] = useState<UpdatedClientResponse | undefined>(producerData);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderResponse | undefined>();
  const [seller, setSeller] = useState<UpdatedSellerResponse>();
  const [producers, setProducers] = useState<UpdatedClientResponse[]>([]);
  const [stage, setStage] = useState<Stage>("general");

  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) {
      setSeller(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    getVisibleFournisseurs()
      .then((data) => setProducers(data.map((f) => ({
        ...f,
        idClient: f.idFournisseur,
        typeClient: f.typeFournisseur as unknown as UpdatedClientResponse["typeClient"],
        codeClient: f.codeFournisseur,
      })) as unknown as UpdatedClientResponse[]))
      .catch(() => toast.error("Failed to load suppliers."));
  }, [isOpen]);

  // 1. INITIALIZATION LOGIC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStage("general");

      if (orderData) {
        // Mode: EDIT
        setPurchaseOrder(orderData);
        setSelectedProducer(producerData);
      } else {
        // Mode: CREATE
        const newPO: Partial<PurchaseOrderResponse> = {
      
          status: PurcaseOrderResponse.statut.BROUILLON,
          poDate: new Date().toISOString(),
          expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default +7 days
          transportMethod: PurcaseOrderResponse.transportMethod.LIVRAISON_PROPRE,
          lines: [],
          subtotalAmount: 0,
          taxAmount: 0,
          grandTotal: 0,
          remarks: ""
        };
        setPurchaseOrder(newPO as PurchaseOrderResponse);
        setSelectedProducer(producerData);
      }
    } else {
      document.body.style.overflow = "unset";
      setPurchaseOrder(undefined);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, orderData, producerData]);

  // 2. SAVE LOGIC
  const handleSave = async () => {
    if (!selectedProducer || !purchaseOrder) return;

    const finalPayload: PurchaseOrderResponse = {
      ...purchaseOrder,
      // Producer Mapping
      supplierId: selectedProducer.idClient,
      supplierName: selectedProducer.raisonSociale || selectedProducer.username,
      supplierEmail: selectedProducer.email,
      supplierAddress: selectedProducer.adresse,
      supplierContact: selectedProducer.telephone,
      supplierCode: selectedProducer.codeClient,
      
      // Audit
      updatedAt: new Date().toISOString(),
      createdAt: purchaseOrder.createdAt || new Date().toISOString()
    };

    console.log("Saving PO Payload:", finalPayload);

    const apiPayload = mapPurchaseOrderToBonAchatRequest(finalPayload);
    apiPayload.createdBy = seller?.Id;
    apiPayload.organizationId = seller?.organizationId;
    apiPayload.agencyId = seller?.agencyId;


    try {
      const online = await isFullyOnline();
      if (!orderData) {
        await createBonAchatOffline(apiPayload);
      } else if (orderData.idPO) {
        await updateBonAchatOffline(orderData.idPO, apiPayload);
      }
      const offlineMsg = !online ? " (sauvegardé localement, synchronisation en attente)" : "";
      toast.success((orderData ? "Purchase order updated successfully." : "Purchase order created successfully.") + offlineMsg);
      onClose(false);
    } catch (error) {
      console.error("Failed to save purchase order:", error);
      toast.error("Failed to save purchase order. Please try again.")
    }
  };

  // 3. CHANGE HANDLER
  const handlePOChange = useCallback((param: Partial<PurchaseOrderResponse>) => {
    setPurchaseOrder((prev) => {
      const base = prev || orderData || {};
      return {
        ...base,
        ...param
      } as PurchaseOrderResponse;
    });
  }, [orderData]);

  if (!isOpen) return null;

  const generalInfoDone = !!selectedProducer;
  const logisticsDone = !!purchaseOrder?.transportMethod;
  const productsDone = (purchaseOrder?.lines?.length ?? 0) > 0;
  const STAGES: { key: Stage; label: string; icon: typeof ClipboardList; done: boolean }[] = [
    { key: "general", label: "General Info", icon: ClipboardList, done: generalInfoDone },
    { key: "logistics", label: "Logistics", icon: MapPinned, done: logisticsDone },
    { key: "products", label: "Items & Totals", icon: ShoppingCart, done: productsDone },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-secondary/10 backdrop-blur-sm"
        onClick={() => onClose(false)}
      />

      <div className="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">
                {orderData ? "Edit Purchase Order" : "New Purchase Order"}
              </h2>
              <p className="text-xs text-gray-400 font-bold">{purchaseOrder?.poNumber}</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* STAGE INDICATOR */}
        <div className="px-8 py-4 border-b border-gray-100 bg-white shrink-0 flex items-center gap-3">
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
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {stage === "general" && (
            <ProducerHeader
              producers={producers}
              setMainSelectedProducer={setSelectedProducer}
              selectedProducer={selectedProducer}
              purchaseOrder={purchaseOrder}
              setPurchaseOrder={setPurchaseOrder}
            />
          )}
          {stage === "logistics" && (
            <PurchaseOrderLogistics
              purchaseOrder={purchaseOrder}
              setPurchaseOrder={setPurchaseOrder}
              producer={selectedProducer}
            />
          )}
          {stage === "products" && (
            <PurchaseOrderDetails
              purchaseOrder={purchaseOrder}
              setPurchaseOrder={setPurchaseOrder}
              producer={selectedProducer}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total PO Value</span>
              <span className="text-2xl font-black text-secondary-mid">
                {purchaseOrder?.grandTotal?.toLocaleString()} <small className="text-xs">XAF</small>
              </span>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => onClose(false)}
                className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
              >
                Cancel
              </button>
              {stage !== "products" ? (
                <button
                  onClick={() => setStage(stage === "general" ? "logistics" : "products")}
                  className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95"
                >
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!selectedProducer || (purchaseOrder?.lines?.length ?? 0) === 0}
                  className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                >
                  <Save size={18} />
                  SAVE & SUBMIT ORDER
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;