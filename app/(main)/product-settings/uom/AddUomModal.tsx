"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Ruler, Save } from "lucide-react";
import { createUom } from "@/src/api/productCatalog";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (added: boolean) => void;
}

const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

const AddUomModal = ({ isOpen, onClose }: Props) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [dimension, setDimension] = useState("");
  const [baseFactor, setBaseFactor] = useState("1");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(""); setName(""); setSymbol(""); setDimension(""); setBaseFactor("1");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !dimension.trim()) {
      toast.error("Code, name, and dimension are required.");
      return;
    }
    setIsSaving(true);
    try {
      await createUom({ code: code.trim(), name: name.trim(), symbol: symbol || undefined, dimension: dimension.trim(), baseFactor: Number(baseFactor) || 1 });
      toast.success(`${name.trim()} was added.`);
      onClose(true);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to create unit. Please try again.");
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
              <Ruler size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">New Unit of Measure</h2>
              <p className="text-xs text-gray-400 font-bold">Shared across the whole platform catalog</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Code</label>
              <div className={inputWrapper}>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. BOX" className={inputStyle} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Symbol</label>
              <div className={inputWrapper}>
                <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. bx" className={inputStyle} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Name</label>
            <div className={inputWrapper}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Box" className={inputStyle} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={label}>Dimension</label>
              <div className={inputWrapper}>
                <input type="text" value={dimension} onChange={(e) => setDimension(e.target.value.toUpperCase())} placeholder="e.g. COUNT, MASS" className={inputStyle} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className={label}>Base Factor</label>
              <div className={inputWrapper}>
                <input type="number" min={0} step="any" value={baseFactor} onChange={(e) => setBaseFactor(e.target.value)} className={inputStyle} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {isSaving ? "Creating…" : "CREATE UNIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUomModal;
