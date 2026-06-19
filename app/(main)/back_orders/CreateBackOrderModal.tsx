'use client';

import React, { useEffect, useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Save, Package } from "lucide-react";

import { UpdatedBackOrderResponse, BackOrderStatus } from "@/src/api/models/UpdatedBackOrderResponse";
import { UpdatedClientResponse } from "@/src/api/models/UpdatedClientResponse";
import SupplierHeader from "./SupplierHeader";
import BackOrderDetails from "./BackOrderDetails";
import { mapUIToBackOrderRequest } from "@/src/Mappers/BackOrderMapper";
import { BackOrderService } from "@/src/src2/api/services/BackOrderService";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (param: boolean) => void;
  supplierData?: UpdatedClientResponse;
  backOrderData?: UpdatedBackOrderResponse;
  suppliers: UpdatedClientResponse[];
}

const CreateBackOrderModal = ({ isOpen, onClose, supplierData, backOrderData, suppliers }: Props) => {
  const [selectedSupplier, setSelectedSupplier] = useState<UpdatedClientResponse | undefined>(supplierData);
  const [backOrder, setBackOrder] = useState<UpdatedBackOrderResponse | undefined>();

  // Init
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (backOrderData) {
        setBackOrder(backOrderData);
        setSelectedSupplier(supplierData);
      } else {
        setBackOrder({
          statut: BackOrderStatus.statut.EN_ATTENTE,
          lignes: [],
          remarques: "",
          createdAt: new Date().toISOString(),
        });
        setSelectedSupplier(supplierData);
      }
    } else {
      document.body.style.overflow = "unset";
      setBackOrder(undefined);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, backOrderData, supplierData]);

  // Save
  const handleSave = async () => {
    if (!backOrder) return;

    const finalPayload: UpdatedBackOrderResponse = {
      ...backOrder,
      supplierName: selectedSupplier?.raisonSociale,
      updatedAt: new Date().toISOString(),
    };

    const apiPayload = mapUIToBackOrderRequest(finalPayload);

    try {
      if (!backOrderData) {
        await BackOrderService.createBackOrder(apiPayload);
      } else if (backOrderData.id) {
        await BackOrderService.updateBackOrder(backOrderData.id, apiPayload);
      }
      toast.success(backOrderData ? "Back order updated successfully." : "Back order created successfully.");
      onClose(false);
    } catch (error) {
      console.error("Failed to save back order:", error);
      toast.error("Failed to save back order. Please try again.");
    }
  };

  const handleBackOrderChange = useCallback((param: Partial<UpdatedBackOrderResponse>) => {
    setBackOrder(prev => ({ ...(prev || {}), ...param } as UpdatedBackOrderResponse));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-5xl bg-secondary-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-5 border-b border-secondary-light flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-super-light rounded-xl text-secondary-mid">
              <Package size={26} />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                {backOrderData ? "Edit Back Order" : "New Back Order"}
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-xs text-secondary-gray font-bold">{backOrder?.id || "Draft"}</p>
                {backOrder?.idBonAchat && (
                  <span className="text-[10px] bg-secondary-super-light text-secondary-mid px-2 py-0.5 rounded border border-secondary-light font-black uppercase">
                    PO: {backOrder.idBonAchat}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <SupplierHeader
            suppliers={suppliers}
            setSelectedSupplier={setSelectedSupplier}
            selectedSupplier={selectedSupplier}
            backOrder={backOrder as any}
            setBackOrder={setBackOrder as any}
          />
          <BackOrderDetails
            backOrder={backOrder}
            setBackOrder={setBackOrder as any}
          />
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-secondary-light bg-white flex justify-between items-center gap-4 shrink-0 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-secondary-gray uppercase tracking-widest">Missing Items Value</span>
            <span className="text-3xl font-black text-primary">
              {(backOrder?.lignes || [])
                .reduce((acc, l) => acc + ((l.quantiteManquante || 0) * (l.unitPrice || 0)), 0)
                .toLocaleString()}
              <small className="text-sm text-secondary-mid font-bold ml-2">XAF</small>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onClose(false)} className="text-xs font-black text-secondary-gray hover:text-primary uppercase tracking-widest transition-colors">
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={(backOrder?.lignes?.length ?? 0) === 0}
              className="flex items-center gap-3 bg-secondary-mid hover:bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-secondary/20 transition-all active:scale-95 disabled:opacity-30"
            >
              <Save size={20} />
              SAVE BACK ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBackOrderModal;
