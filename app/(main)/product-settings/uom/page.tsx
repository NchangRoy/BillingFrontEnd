"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Ruler, ChevronRight, Plus } from "lucide-react";
import { listUoms, UomResponse } from "@/src/api/productCatalog";
import { toast } from "sonner";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import AddUomModal from "./AddUomModal";

const COLUMNS = ["Code", "Name", "Symbol", "Dimension", "Base Factor"];

const UomSettingsPage = () => {
  const [uoms, setUoms] = useState<UomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUoms = useCallback(async () => {
    setLoading(true);
    try {
      setUoms(await listUoms());
    } catch (error) {
      console.error("Error fetching units of measure:", error);
      toast.error("Failed to load units of measure. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUoms(); }, [fetchUoms]);

  const handleAddModalClose = (added: boolean) => {
    setIsAddModalOpen(false);
    if (added) fetchUoms();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return uoms;
    return uoms.filter((u) => [u.code, u.name, u.symbol].some((v) => v?.toLowerCase().includes(term)));
  }, [uoms, search]);

  return (
    <div className="p-8 bg-secondary-background min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-secondary-gray mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Product Settings</span>
            <ChevronRight size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-mid">Units of Measure</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Units of Measure</h1>
          <p className="text-secondary-gray text-sm font-medium">Shared across the whole platform catalog — not specific to your organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <Ruler size={16} className="text-secondary-mid" />
            <span className="text-xs font-black text-primary">{uoms.length}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Units</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <Plus size={16} /> Add Unit
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
                <EmptyState title="No units found" message="Add a unit of measure to use it when defining products." />
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary-super-light/40 transition-all group border-l-4 border-l-transparent hover:border-l-secondary-mid">
                    <td className="px-8 py-5 font-black text-primary">{u.code}</td>
                    <td className="px-8 py-5 text-sm font-bold text-secondary-gray">{u.name}</td>
                    <td className="px-8 py-5 text-sm font-mono text-secondary-gray">{u.symbol || "-"}</td>
                    <td className="px-8 py-5">
                      <span className="px-2.5 py-1 bg-secondary-super-light text-secondary-mid rounded-lg text-[10px] font-black uppercase">{u.dimension}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-secondary-gray">{u.baseFactor}{u.base ? " (base)" : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUomModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </div>
  );
};

export default UomSettingsPage;
