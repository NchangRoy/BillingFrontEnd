"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Tag, ChevronRight, Plus, CheckCircle2 } from "lucide-react";
import { listCategories, CategoryResponse } from "@/src/api/productCatalog";
import { toast } from "sonner";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import AddCategoryModal from "./AddCategoryModal";

const COLUMNS = ["Code", "Name", "Path", "Status"];

const CategorySettingsPage = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await listCategories());
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAddModalClose = (added: boolean) => {
    setIsAddModalOpen(false);
    if (added) fetchCategories();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => [c.code, c.name].some((v) => v?.toLowerCase().includes(term)));
  }, [categories, search]);

  return (
    <div className="p-8 bg-secondary-background min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-secondary-gray mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Product Settings</span>
            <ChevronRight size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-mid">Categories</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Categories</h1>
          <p className="text-secondary-gray text-sm font-medium">Your organization's own product category tree.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <Tag size={16} className="text-secondary-mid" />
            <span className="text-xs font-black text-primary">{categories.length}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Categories</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-light mb-6">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray group-focus-within:text-secondary-mid transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by code or name..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary-background border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-secondary-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-super-light/30 border-b border-secondary-light">
                {COLUMNS.map((col) => (
                  <th key={col} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-gray whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableSkeleton cols={COLUMNS.length} />
              ) : filtered.length === 0 ? (
                <EmptyState title="No categories yet" message="Add a category to use it when organizing products." />
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary-super-light/40 transition-all group border-l-4 border-l-transparent hover:border-l-secondary-mid">
                    <td className="px-8 py-5 font-black text-primary">{c.code}</td>
                    <td className="px-8 py-5 text-sm font-bold text-secondary-gray">{c.name}</td>
                    <td className="px-8 py-5 text-sm font-mono text-secondary-gray">{c.path}</td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-1.5 px-3 py-1 w-fit bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={11} /> {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal isOpen={isAddModalOpen} categories={categories} onClose={handleAddModalClose} />
    </div>
  );
};

export default CategorySettingsPage;
