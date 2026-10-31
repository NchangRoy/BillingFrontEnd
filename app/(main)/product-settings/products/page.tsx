"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Package, ChevronRight, Plus } from "lucide-react";
import { getProductDefinitions, ProductDefinitionResponse } from "@/src/api/productDefinitions";
import { listCategories, categorizeProduct, CategoryResponse } from "@/src/api/productCatalog";
import { toast } from "sonner";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import AddProductDefinitionModal from "./AddProductDefinitionModal";

const COLUMNS = ["Name", "Global Code", "Article Kind", "Category", "Description"];

const ProductDefinitionsSettingsPage = () => {
  const [definitions, setDefinitions] = useState<ProductDefinitionResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savingCategoryFor, setSavingCategoryFor] = useState<string | null>(null);

  const fetchDefinitions = useCallback(async () => {
    setLoading(true);
    try {
      setDefinitions(await getProductDefinitions());
    } catch (error) {
      console.error("Error fetching product definitions:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDefinitions();
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, [fetchDefinitions]);

  const handleCategoryChange = async (productId: string, categoryId: string) => {
    if (!categoryId) return;
    setSavingCategoryFor(productId);
    try {
      await categorizeProduct(productId, categoryId);
      setDefinitions((prev) => prev.map((d) => (d.id === productId ? { ...d, categoryId } : d)));
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to set category. Please try again.");
    } finally {
      setSavingCategoryFor(null);
    }
  };

  const handleAddModalClose = (added: boolean) => {
    setIsAddModalOpen(false);
    if (added) fetchDefinitions();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return definitions;
    return definitions.filter((d) => [d.name, d.globalCode].some((v) => v?.toLowerCase().includes(term)));
  }, [definitions, search]);

  return (
    <div className="p-8 bg-secondary-background min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-secondary-gray mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Product Settings</span>
            <ChevronRight size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-mid">Products</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Catalog Products</h1>
          <p className="text-secondary-gray text-sm font-medium">
            Base product definitions — no price/stock yet. Provision one as sellable from the Products page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <Package size={16} className="text-secondary-mid" />
            <span className="text-xs font-black text-primary">{definitions.length}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Products</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-light mb-6">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray group-focus-within:text-secondary-mid transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or global code..."
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
                <EmptyState title="No products defined yet" message="Add a product to start building your catalog." />
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-secondary-super-light/40 transition-all group border-l-4 border-l-transparent hover:border-l-secondary-mid">
                    <td className="px-8 py-5 font-black text-primary">{d.name}</td>
                    <td className="px-8 py-5 text-sm font-mono text-secondary-gray">{d.globalCode}</td>
                    <td className="px-8 py-5">
                      <span className="px-2.5 py-1 bg-secondary-super-light text-secondary-mid rounded-lg text-[10px] font-black uppercase">{d.articleKind || "-"}</span>
                    </td>
                    <td className="px-8 py-5">
                      <select
                        value={d.categoryId || ""}
                        disabled={savingCategoryFor === d.id}
                        onChange={(e) => d.id && handleCategoryChange(d.id, e.target.value)}
                        className="bg-secondary-super-light/60 border border-secondary-light rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-secondary-mid outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">Uncategorized</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-secondary-gray">{d.shortDescription || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductDefinitionModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </div>
  );
};

export default ProductDefinitionsSettingsPage;
