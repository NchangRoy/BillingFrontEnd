"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { PackagePlus, Save } from "lucide-react";
import { defineProduct, categorizeProduct, listUoms, listCategories, UomResponse, CategoryResponse } from "@/src/api/productCatalog";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (added: boolean) => void;
}

const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

const AddProductDefinitionModal = ({ isOpen, onClose }: Props) => {
  const [globalCode, setGlobalCode] = useState("");
  const [name, setName] = useState("");
  const [nature, setNature] = useState<"TANGIBLE" | "INTANGIBLE">("TANGIBLE");
  const [articleKind, setArticleKind] = useState<"RAW_MATERIAL" | "SEMI_FINISHED" | "FINISHED">("FINISHED");
  const [defaultUomId, setDefaultUomId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [uoms, setUoms] = useState<UomResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    setGlobalCode(""); setName(""); setNature("TANGIBLE"); setArticleKind("FINISHED");
    setDefaultUomId(""); setCategoryId(""); setShortDescription("");
    document.body.style.overflow = "hidden";
    listUoms().then(setUoms).catch(() => setUoms([]));
    listCategories().then(setCategories).catch(() => setCategories([]));
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalCode.trim() || !name.trim() || !defaultUomId) {
      toast.error("Global code, name, and unit of measure are required.");
      return;
    }
    setIsSaving(true);
    try {
      const created = await defineProduct({
        globalCode: globalCode.trim(),
        name: name.trim(),
        nature,
        articleKind,
        defaultUomId,
        shortDescription: shortDescription || undefined,
      });
      if (categoryId && created.id) {
        // Kernel has no "categoryId" field on the define request itself —
        // category is assigned via a separate call once the product exists.
        await categorizeProduct(created.id, categoryId).catch(() =>
          toast.error("Product created, but setting its category failed. You can retry from the catalog list.")
        );
      }
      toast.success(`${name.trim()} was added to the catalog.`);
      onClose(true);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to define product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0" onClick={() => onClose(false)} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <PackagePlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">New Catalog Product</h2>
              <p className="text-xs text-gray-400 font-bold">Defines the item — no price/stock yet, that's set when it's provisioned as sellable.</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Global Code</label>
              <div className={inputWrapper}>
                <input type="text" value={globalCode} onChange={(e) => setGlobalCode(e.target.value.toUpperCase())} placeholder="e.g. TECH-MONITOR-01" className={inputStyle} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Unit of Measure</label>
              <div className={inputWrapper}>
                <select value={defaultUomId} onChange={(e) => setDefaultUomId(e.target.value)} className={`${inputStyle} appearance-none cursor-pointer`} required>
                  <option value="">Select…</option>
                  {uoms.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Name</label>
            <div className={inputWrapper}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monitor 24 inch" className={inputStyle} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Nature</label>
              <div className={inputWrapper}>
                <select value={nature} onChange={(e) => setNature(e.target.value as typeof nature)} className={`${inputStyle} appearance-none cursor-pointer`}>
                  <option value="TANGIBLE">Tangible</option>
                  <option value="INTANGIBLE">Intangible</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Article Kind</label>
              <div className={inputWrapper}>
                <select value={articleKind} onChange={(e) => setArticleKind(e.target.value as typeof articleKind)} className={`${inputStyle} appearance-none cursor-pointer`}>
                  <option value="FINISHED">Finished</option>
                  <option value="SEMI_FINISHED">Semi-finished</option>
                  <option value="RAW_MATERIAL">Raw material</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Category</label>
            <div className={inputWrapper}>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${inputStyle} appearance-none cursor-pointer`}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Short Description</label>
            <div className={inputWrapper}>
              <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Optional" className={inputStyle} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {isSaving ? "Creating…" : "DEFINE PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductDefinitionModal;
