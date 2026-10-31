"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Tag, Save } from "lucide-react";
import { createCategory, CategoryResponse } from "@/src/api/productCatalog";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  categories: CategoryResponse[];
  onClose: (added: boolean) => void;
}

const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

const AddCategoryModal = ({ isOpen, categories, onClose }: Props) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(""); setName(""); setParentId("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      toast.error("Code and name are required.");
      return;
    }
    setIsSaving(true);
    try {
      await createCategory({ code: code.trim(), name: name.trim(), parentId: parentId || undefined });
      toast.success(`${name.trim()} was added.`);
      onClose(true);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to create category. Please try again.");
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
              <Tag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">New Category</h2>
              <p className="text-xs text-gray-400 font-bold">Specific to your organization's catalog</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/50">
          <div className="space-y-2">
            <label className={label}>Code</label>
            <div className={inputWrapper}>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. PERIPH" className={inputStyle} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Name</label>
            <div className={inputWrapper}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Peripherals" className={inputStyle} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className={label}>Parent Category</label>
            <div className={inputWrapper}>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={`${inputStyle} appearance-none cursor-pointer`}>
                <option value="">None (top-level)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {isSaving ? "Creating…" : "CREATE CATEGORY"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
