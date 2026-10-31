"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { PackagePlus, Save } from "lucide-react";
import { ProductResponse } from "@/src/src2/api";
import { getProductDefinitions, createProduct, ProductDefinitionResponse, ProductResponseWithNumber } from "@/src/api/productDefinitions";
import { getProductNumberingSettings, composeProductNumber, ProductNumberingSettings } from "@/src/api/productNumbering";
import { listUoms, listCategories, UomResponse, CategoryResponse } from "@/src/api/productCatalog";
import { getStoredSeller } from "@/src/api/session";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (created: boolean, product?: ProductResponseWithNumber) => void;
}

const emptyForm = {
  reference: "",
  nomProduit: "",
  typeProduit: "",
  categorie: "",
  codeBarre: "",
  uom: "",
  prixVente: "",
  cout: "",
  quantity: "",
  minStockLevel: "",
  maxStockLevel: "",
};

const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

const CreateProductModal = ({ isOpen, onClose }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [definitions, setDefinitions] = useState<ProductDefinitionResponse[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ProductDefinitionResponse | null>(null);
  const [vatApplicable, setVatApplicable] = useState(true);
  const [numberingSettings, setNumberingSettings] = useState<ProductNumberingSettings | null>(null);
  const [uoms, setUoms] = useState<UomResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm);
    setProductSearch("");
    setSelectedDefinition(null);
    setVatApplicable(true);
    document.body.style.overflow = "hidden";
    getProductDefinitions().then(setDefinitions).catch(() => setDefinitions([]));
    listUoms().then(setUoms).catch(() => setUoms([]));
    listCategories().then(setCategories).catch(() => setCategories([]));
    const organizationId = getStoredSeller()?.organizationId;
    if (organizationId) {
      getProductNumberingSettings(organizationId).then(setNumberingSettings).catch(() => setNumberingSettings(null));
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Same convention as the other documents: the frontend computes the real
  // generated code, the backend just stores whatever's sent.
  const productNumber = numberingSettings
    ? composeProductNumber(numberingSettings, form.categorie, form.typeProduit, form.uom, vatApplicable)
    : "";

  const filteredDefinitions = (() => {
    const term = productSearch.trim().toLowerCase();
    if (!term || (selectedDefinition && term === selectedDefinition.name?.toLowerCase())) return [];
    return definitions.filter((d) => d.name?.toLowerCase().includes(term) || d.globalCode?.toLowerCase().includes(term));
  })();

  const handleSelectDefinition = (d: ProductDefinitionResponse) => {
    setSelectedDefinition(d);
    setProductSearch(d.name || "");
    setShowResults(false);
    const uom = uoms.find((u) => u.id === d.defaultUomId);
    const category = categories.find((c) => c.id === d.categoryId);
    setForm((prev) => ({
      ...prev,
      nomProduit: d.name || prev.nomProduit,
      reference: d.globalCode || prev.reference,
      uom: uom?.code || prev.uom,
      categorie: category?.code || prev.categorie,
      typeProduit: d.articleKind || prev.typeProduit,
    }));
  };

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reference.trim() || !form.nomProduit.trim()) {
      toast.error("Reference and product name are required.");
      return;
    }

    setIsSaving(true);
    try {
      const created = await createProduct({
        reference: form.reference.trim(),
        nomProduit: form.nomProduit.trim(),
        typeProduit: form.typeProduit || undefined,
        categorie: form.categorie || undefined,
        codeBarre: form.codeBarre || undefined,
        uom: form.uom || undefined,
        prixVente: form.prixVente ? Number(form.prixVente) : undefined,
        cout: form.cout ? Number(form.cout) : undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        minStockLevel: form.minStockLevel ? Number(form.minStockLevel) : undefined,
        maxStockLevel: form.maxStockLevel ? Number(form.maxStockLevel) : undefined,
        vatApplicable,
        productNumber: productNumber || undefined,
      });
      toast.success(`${form.nomProduit} was added to the catalog.`);
      onClose(true, created);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to create product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <PackagePlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">New Sellable Product</h2>
              <p className="text-xs text-gray-400 font-bold">Search an existing product, or define a new one</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
          <div className="space-y-2 relative">
            <label className={label}>Product Name</label>
            <div className={inputWrapper}>
              <SearchIcon className="text-gray-400" fontSize="small" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  update({ nomProduit: e.target.value });
                  setSelectedDefinition(null);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search catalog or type a new name…"
                className={inputStyle}
                required
              />
            </div>
            {showResults && filteredDefinitions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-auto">
                {filteredDefinitions.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDefinition(d)}
                    className="px-4 py-3 hover:bg-secondary-super-light/40 cursor-pointer border-b border-gray-50 last:border-none flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-gray-700">{d.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">{d.globalCode}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedDefinition && (
              <p className="text-[11px] text-secondary-mid font-bold ml-1">
                Using existing catalog entry — reference auto-filled below.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Reference / Code</label>
              <div className={inputWrapper}>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => update({ reference: e.target.value })}
                  placeholder="SKU-001"
                  className={inputStyle}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Barcode</label>
              <div className={inputWrapper}>
                <input
                  type="text"
                  value={form.codeBarre}
                  onChange={(e) => update({ codeBarre: e.target.value })}
                  placeholder="Optional"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Category</label>
              <div className={inputWrapper}>
                <select value={form.categorie} onChange={(e) => update({ categorie: e.target.value })} className={`${inputStyle} appearance-none cursor-pointer`}>
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Family / Type</label>
              <div className={inputWrapper}>
                <input type="text" value={form.typeProduit} onChange={(e) => update({ typeProduit: e.target.value })} placeholder="Optional" className={inputStyle} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Unit Price</label>
              <div className={inputWrapper}>
                <input type="number" min={0} value={form.prixVente} onChange={(e) => update({ prixVente: e.target.value })} placeholder="0" className={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Cost</label>
              <div className={inputWrapper}>
                <input type="number" min={0} value={form.cout} onChange={(e) => update({ cout: e.target.value })} placeholder="0" className={inputStyle} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={label}>Stock Qty</label>
              <div className={inputWrapper}>
                <input type="number" min={0} value={form.quantity} onChange={(e) => update({ quantity: e.target.value })} placeholder="0" className={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Unit of Measure</label>
              <div className={inputWrapper}>
                <select value={form.uom} onChange={(e) => update({ uom: e.target.value })} className={`${inputStyle} appearance-none cursor-pointer`}>
                  <option value="">Select…</option>
                  {uoms.map((u) => (
                    <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Min Stock</label>
              <div className={inputWrapper}>
                <input type="number" min={0} value={form.minStockLevel} onChange={(e) => update({ minStockLevel: e.target.value })} placeholder="0" className={inputStyle} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div>
              <p className={label}>VAT Applicable</p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">Also feeds the "T"/"NT" numbering segment below.</p>
            </div>
            <button type="button" onClick={() => setVatApplicable((v) => !v)} className="relative inline-flex items-center">
              <input type="checkbox" className="sr-only peer" checked={vatApplicable} readOnly />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-mid" />
            </button>
          </div>

          <div className="space-y-2">
            <label className={label}>Product Number</label>
            <div className={inputWrapper}>
              <input
                type="text"
                value={productNumber}
                readOnly
                placeholder="Set up numbering in Product Settings to auto-generate this"
                className={`${inputStyle} font-mono font-black text-secondary-mid`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {isSaving ? "Creating…" : "CREATE PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
