"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell,
} from "recharts";
import { FileText, Receipt, ShoppingBag, FileStack, Building2, Wallet } from "lucide-react";
import { PortalApi } from "@/src/api/portalApi";
import { getPortalSession, getPortalRoles, getOrganizationName } from "@/src/api/portalSession";

const formatMoney = (amount?: number) => `${Math.round(amount ?? 0).toLocaleString()} XAF`;

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateString));
};

const StatCard = ({ label, value, icon: Icon, money }: { label: string; value: number; icon: React.ElementType; money?: boolean }) => (
  <div className="bg-white p-5 rounded-2xl border border-secondary-light shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
    <div className="p-2.5 rounded-xl bg-secondary-super-light w-fit mb-3">
      <Icon size={18} className="text-secondary-mid" />
    </div>
    <p className={`font-black text-primary tracking-tight ${money ? "text-lg" : "text-2xl"}`}>
      {money ? formatMoney(value) : value}
    </p>
    <p className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest mt-0.5">{label}</p>
  </div>
);

const STATUS_PILL: Record<string, string> = {
  ACCEPTE: "bg-emerald-50 text-emerald-600",
  ACCEPTED: "bg-emerald-50 text-emerald-600",
  PAYEE: "bg-emerald-50 text-emerald-600",
  PAID: "bg-emerald-50 text-emerald-600",
  REFUSE: "bg-red-50 text-red-600",
  REJECTED: "bg-red-50 text-red-600",
  REJETE: "bg-red-50 text-red-600",
  EN_RETARD: "bg-red-50 text-red-600",
  OVERDUE: "bg-red-50 text-red-600",
};
const defaultPill = "bg-amber-50 text-amber-600";

type DocRow = { id: string; type: string; ref: string; org?: string; date?: string; amount?: number; status?: string };

export default function PortalDashboardPage() {
  const session = getPortalSession();
  const roles = getPortalRoles(session);
  const isCustomer = roles.includes("CUSTOMER");
  const isSupplier = roles.includes("SUPPLIER");

  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      isCustomer ? PortalApi.getQuotations() : Promise.resolve([]),
      isCustomer ? PortalApi.getInvoices() : Promise.resolve([]),
      isSupplier ? PortalApi.getPurchaseOrders() : Promise.resolve([]),
      isSupplier ? PortalApi.getSupplierInvoices() : Promise.resolve([]),
    ])
      .then(([q, i, po, si]) => {
        setQuotations(q);
        setInvoices(i);
        setPurchaseOrders(po);
        setSupplierInvoices(si);
      })
      .catch((err) => console.error("Failed to load dashboard data", err))
      .finally(() => setLoading(false));
  }, [isCustomer, isSupplier]);

  const organizations = session?.organizations ?? [];

  // Outstanding balance (montantRestant) summed per org, across whichever
  // document types this account actually has — a client sees what they owe,
  // a supplier sees what's owed to them.
  const balanceByOrg = useMemo(() => {
    const totals = new Map<string, number>();
    [...invoices, ...supplierInvoices].forEach((doc) => {
      const orgId = doc.organizationId;
      if (!orgId) return;
      totals.set(orgId, (totals.get(orgId) ?? 0) + (doc.montantRestant ?? 0));
    });
    return organizations
      .filter((o) => totals.has(o.organizationId))
      .map((o) => ({ name: o.organizationName, value: totals.get(o.organizationId) ?? 0 }));
  }, [invoices, supplierInvoices, organizations]);

  // Status breakdown across quotations + purchase orders (the two document
  // types a client/supplier actually approves or rejects).
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Pending: 0, Accepted: 0, Rejected: 0 };
    [...quotations, ...purchaseOrders].forEach((doc) => {
      const status = doc.statut || doc.status;
      if (status === "ACCEPTE" || status === "ACCEPTED") counts.Accepted++;
      else if (status === "REFUSE" || status === "REJECTED" || status === "REJETE") counts.Rejected++;
      else if (status === "ENVOYE" || status === "SENT") counts.Pending++;
    });
    return [
      { name: "Pending", value: counts.Pending, fill: "#f59e0b" },
      { name: "Accepted", value: counts.Accepted, fill: "#10b981" },
      { name: "Rejected", value: counts.Rejected, fill: "#ef4444" },
    ];
  }, [quotations, purchaseOrders]);

  const recentDocs: DocRow[] = useMemo(() => {
    const rows: DocRow[] = [
      ...quotations.map((q) => ({ id: q.idDevis, type: "Quotation", ref: q.numeroDevis, org: q.organizationId, date: q.dateCreation, amount: q.montantTTC, status: q.statut })),
      ...invoices.map((i) => ({ id: i.idFacture, type: "Invoice", ref: i.numeroFacture, org: i.organizationId, date: i.dateFacturation, amount: i.montantTTC, status: i.etat })),
      ...purchaseOrders.map((po) => ({ id: po.idBonAchat, type: "Purchase Order", ref: po.numeroBonAchat, org: po.organizationId, date: po.dateBonAchat, amount: po.grandTotal, status: po.status })),
      ...supplierInvoices.map((si) => ({ id: si.idFactureFournisseur, type: "Supplier Invoice", ref: si.numeroFacture, org: si.organizationId, date: si.dateFacture, amount: si.montantTTC, status: si.statut })),
    ];
    return rows
      .filter((r) => r.date)
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
      .slice(0, 8);
  }, [quotations, invoices, purchaseOrders, supplierInvoices]);

  const totalOutstanding = balanceByOrg.reduce((sum, o) => sum + o.value, 0);

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight uppercase">Partner Dashboard</h1>
          <p className="text-secondary-gray text-sm font-medium mt-1">
            Overview across quotations, invoices and {isSupplier ? "purchase orders" : "orders"}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-secondary-light shadow-sm p-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-super-light flex items-center justify-center text-secondary-mid shrink-0">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-lg font-black text-primary leading-none">{organizations.length}</p>
            <p className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest mt-1">
              Organization{organizations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-secondary-light animate-pulse" />
          ))
        ) : (
          <>
            <StatCard label="Outstanding" value={totalOutstanding} icon={Wallet} money />
            {isCustomer && <StatCard label="Quotations" value={quotations.length} icon={FileText} />}
            {isCustomer && <StatCard label="Invoices" value={invoices.length} icon={Receipt} />}
            {isSupplier && <StatCard label="Purchase Orders" value={purchaseOrders.length} icon={ShoppingBag} />}
            {isSupplier && <StatCard label="Supplier Invoices" value={supplierInvoices.length} icon={FileStack} />}
          </>
        )}
      </div>

      {/* CHARTS */}
      {!loading && (balanceByOrg.length > 0 || statusCounts.some((s) => s.value > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {balanceByOrg.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-secondary-light shadow-sm">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Outstanding Balance by Organization</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={balanceByOrg}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip formatter={(v) => formatMoney(Number(v))} />
                  <Bar dataKey="value" fill="var(--color-secondary-mid)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-secondary-light shadow-sm">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Documents by Status</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RECENT DOCUMENTS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest">Recent Documents</h3>
        </div>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {["Reference", "Type", "Organization", "Date", "Amount", "Status"].map((col) => (
                <th key={col} className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : recentDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400 font-medium">
                  No documents yet.
                </td>
              </tr>
            ) : (
              recentDocs.map((doc) => (
                <tr key={`${doc.type}-${doc.id}`} className="hover:bg-secondary-mid/[0.02] transition-colors">
                  <td className="px-6 py-4 font-black text-gray-900 whitespace-nowrap">{doc.ref || "—"}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{doc.type}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{getOrganizationName(session, doc.org)}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{formatDate(doc.date)}</td>
                  <td className="px-6 py-4 font-black text-gray-900 whitespace-nowrap">{formatMoney(doc.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${STATUS_PILL[doc.status || ""] || defaultPill}`}>
                      {(doc.status || "—").replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
