"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ShieldCheck, Save } from "lucide-react";
import { ApiError, SellerAdminService, SellerListItemResponse } from "@/src/src2/api";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (updated: boolean) => void;
  seller: SellerListItemResponse | null;
}

const UI_PERMISSION_FIELDS: { key: keyof UiPermissionsState; label: string; group: string }[] = [
  { key: "salesQuotations", label: "Quotations", group: "Sales Management" },
  { key: "salesProformaInvoices", label: "Proforma Invoices", group: "Sales Management" },
  { key: "salesSalesOrders", label: "Sales Orders", group: "Sales Management" },
  { key: "salesInvoices", label: "Invoices", group: "Sales Management" },
  { key: "salesDeliveryNotes", label: "Delivery Notes", group: "Sales Management" },
  { key: "salesCreditNotes", label: "Credit Notes", group: "Sales Management" },
  { key: "salesStoreCredit", label: "Store Credit", group: "Sales Management" },
  { key: "salesBackOrders", label: "Back Orders", group: "Sales Management" },
  { key: "purchasingPurchaseOrders", label: "Purchase Orders", group: "Purchasing & Logistics" },
  { key: "purchasingGoodsRns", label: "Goods Receipt Notes", group: "Purchasing & Logistics" },
  { key: "purchasingSupplierInvoice", label: "Supplier Invoice", group: "Purchasing & Logistics" },
  { key: "journalsQuotations", label: "Quotation Journal", group: "Journals" },
];

type UiPermissionsState = {
  salesQuotations: boolean;
  salesProformaInvoices: boolean;
  salesSalesOrders: boolean;
  salesInvoices: boolean;
  salesDeliveryNotes: boolean;
  salesCreditNotes: boolean;
  salesStoreCredit: boolean;
  salesBackOrders: boolean;
  purchasingPurchaseOrders: boolean;
  purchasingGoodsRns: boolean;
  purchasingSupplierInvoice: boolean;
  journalsQuotations: boolean;
};

const emptyUiPermissions: UiPermissionsState = {
  salesQuotations: false,
  salesProformaInvoices: false,
  salesSalesOrders: false,
  salesInvoices: false,
  salesDeliveryNotes: false,
  salesCreditNotes: false,
  salesStoreCredit: false,
  salesBackOrders: false,
  purchasingPurchaseOrders: false,
  purchasingGoodsRns: false,
  purchasingSupplierInvoice: false,
  journalsQuotations: false,
};

const SALE_SIZES = ["DETAIL", "DEMIS_GROS", "GROS", "SUPER_GROS"] as const;
const SALE_PERMISSIONS = ["NEGOTIATE_PRICE", "APPLY_DISCOUNT", "OVERRIDE_PRICE", "APPROVE_DOCUMENT"] as const;

const PermissionsModal = ({ isOpen, onClose, seller }: Props) => {
  const [uiPermissions, setUiPermissions] = useState<UiPermissionsState>(emptyUiPermissions);
  const [saleSizes, setSaleSizes] = useState<Set<string>>(new Set());
  const [salePermissions, setSalePermissions] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !seller) return;
    document.body.style.overflow = "hidden";

    setSaleSizes(new Set(seller.permittedSaleSizes ?? []));
    setSalePermissions(new Set(seller.permissions ?? []));

    setIsLoading(true);
    SellerAdminService.getUiPermissions(seller.id!)
      .then((res) => setUiPermissions({ ...emptyUiPermissions, ...res }))
      .catch(() => setUiPermissions(emptyUiPermissions))
      .finally(() => setIsLoading(false));

    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, seller]);

  const toggleSetValue = (set: Set<string>, setter: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const handleSave = async () => {
    if (!seller?.id) return;
    setIsSaving(true);
    try {
      await Promise.all([
        SellerAdminService.setUiPermissions(seller.id, uiPermissions),
        SellerAdminService.updatePermissions(seller.id, {
          permissions: Array.from(salePermissions) as Array<'NEGOTIATE_PRICE' | 'APPLY_DISCOUNT' | 'OVERRIDE_PRICE' | 'APPROVE_DOCUMENT'>,
          permittedSaleSizes: Array.from(saleSizes) as Array<'DETAIL' | 'DEMIS_GROS' | 'GROS' | 'SUPER_GROS'>,
        }),
      ]);
      toast.success("Permissions updated successfully.");
      onClose(true);
    } catch (error) {
      const message = error instanceof ApiError ? (error.body?.message ?? error.message) : "Failed to update permissions. Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !seller) return null;

  const groups = Array.from(new Set(UI_PERMISSION_FIELDS.map((f) => f.group)));
  const checkboxRow = "flex items-center gap-2.5 py-1.5";
  const checkboxStyle = "w-4 h-4 rounded border-gray-300 text-secondary-mid focus:ring-secondary-mid cursor-pointer";
  const sectionTitle = "text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Permissions</h2>
              <p className="text-xs text-gray-400 font-bold">{seller.username}</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {isLoading ? (
            <p className="text-sm text-gray-400 font-medium">Loading current permissions…</p>
          ) : (
            <>
              {/* Sale Permissions */}
              <div>
                <p className={sectionTitle}>Sale Permissions</p>
                <div className="grid grid-cols-2 gap-x-4 bg-white p-4 rounded-xl border border-gray-100">
                  {SALE_PERMISSIONS.map((perm) => (
                    <label key={perm} className={`${checkboxRow} cursor-pointer`}>
                      <input
                        type="checkbox"
                        className={checkboxStyle}
                        checked={salePermissions.has(perm)}
                        onChange={() => toggleSetValue(salePermissions, setSalePermissions, perm)}
                      />
                      <span className="text-sm text-gray-600 font-medium">{perm.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sale Sizes */}
              <div>
                <p className={sectionTitle}>Permitted Sale Sizes</p>
                <div className="grid grid-cols-2 gap-x-4 bg-white p-4 rounded-xl border border-gray-100">
                  {SALE_SIZES.map((size) => (
                    <label key={size} className={`${checkboxRow} cursor-pointer`}>
                      <input
                        type="checkbox"
                        className={checkboxStyle}
                        checked={saleSizes.has(size)}
                        onChange={() => toggleSetValue(saleSizes, setSaleSizes, size)}
                      />
                      <span className="text-sm text-gray-600 font-medium">{size.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* UI Permissions */}
              <div>
                <p className={sectionTitle}>UI Permissions</p>
                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
                  {groups.map((group) => (
                    <div key={group}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{group}</p>
                      <div className="grid grid-cols-2 gap-x-4">
                        {UI_PERMISSION_FIELDS.filter((f) => f.group === group).map((field) => (
                          <label key={field.key} className={`${checkboxRow} cursor-pointer`}>
                            <input
                              type="checkbox"
                              className={checkboxStyle}
                              checked={uiPermissions[field.key]}
                              onChange={() => setUiPermissions((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                            />
                            <span className="text-sm text-gray-600 font-medium">{field.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
          >
            <Save size={18} />
            {isSaving ? "SAVING…" : "SAVE PERMISSIONS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
