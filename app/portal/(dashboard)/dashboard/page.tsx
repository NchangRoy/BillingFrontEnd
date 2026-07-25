"use client";

import React, { useEffect, useState } from "react";
import { RequestQuote, Receipt, ShoppingBag, Description } from "@mui/icons-material";
import { PortalApi } from "@/src/api/portalApi";
import { getPortalSession, getPortalRoles } from "@/src/api/portalSession";

const StatCard = ({ label, value, Icon }: { label: string; value: number; Icon: React.ElementType }) => (
  <div className="bg-white rounded-2xl border border-secondary-light shadow-sm p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-secondary-super-light flex items-center justify-center text-secondary-mid">
      <Icon fontSize="medium" />
    </div>
    <div>
      <p className="text-2xl font-black text-primary">{value}</p>
      <p className="text-xs font-bold text-secondary-gray uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

export default function PortalDashboardPage() {
  const session = getPortalSession();
  const roles = getPortalRoles(session);
  const isCustomer = roles.includes("CUSTOMER");
  const isSupplier = roles.includes("SUPPLIER");
  const [counts, setCounts] = useState({ quotations: 0, invoices: 0, purchaseOrders: 0, supplierInvoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      isCustomer ? PortalApi.getQuotations() : Promise.resolve([]),
      isCustomer ? PortalApi.getInvoices() : Promise.resolve([]),
      isSupplier ? PortalApi.getPurchaseOrders() : Promise.resolve([]),
      isSupplier ? PortalApi.getSupplierInvoices() : Promise.resolve([]),
    ])
      .then(([quotations, invoices, purchaseOrders, supplierInvoices]) =>
        setCounts({
          quotations: quotations.length,
          invoices: invoices.length,
          purchaseOrders: purchaseOrders.length,
          supplierInvoices: supplierInvoices.length,
        })
      )
      .catch((err) => console.error("Failed to load dashboard counts", err))
      .finally(() => setLoading(false));
  }, [isCustomer, isSupplier]);

  const summary = isCustomer && isSupplier
    ? "Here's a summary of your customer and supplier account."
    : isSupplier
    ? "Here's a summary of your supplier account."
    : "Here's a summary of your customer account.";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          Welcome, {session?.name || "Partner"}
        </h1>
        <p className="text-secondary-gray text-sm font-medium">{summary}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {loading ? (
          <>
            <div className="h-24 bg-white rounded-2xl border border-secondary-light animate-pulse" />
            <div className="h-24 bg-white rounded-2xl border border-secondary-light animate-pulse" />
          </>
        ) : (
          <>
            {isCustomer && <StatCard label="Quotations" value={counts.quotations} Icon={RequestQuote} />}
            {isCustomer && <StatCard label="Invoices" value={counts.invoices} Icon={Receipt} />}
            {isSupplier && <StatCard label="Purchase Orders" value={counts.purchaseOrders} Icon={ShoppingBag} />}
            {isSupplier && <StatCard label="Supplier Invoices" value={counts.supplierInvoices} Icon={Description} />}
          </>
        )}
      </div>
    </div>
  );
}
