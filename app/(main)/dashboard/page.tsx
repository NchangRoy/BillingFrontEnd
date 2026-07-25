'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  BarChart, Bar, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Camera } from 'lucide-react'
import { getVisibleFactures, getVisibleFacturesFournisseur, getVisiblePaiements } from '@/src/api/scopedDocs'
import { FactureResponse, FactureFournisseurResponse, PaiementResponse } from '@/src/src2/api'
import { getStoredSeller, updateStoredSellerProfileImage } from '@/src/api/session'
import { SellerRole } from '@/src/api/models/UpdatedSellerResponse'
import { toast } from 'sonner'
import SellerAvatar from '@/components/SellerAvatar'
import UploadSellerAvatarModal from '@/components/UploadSellerAvatarModal'

const formatMoney = (amount?: number) => `${Math.round(amount ?? 0).toLocaleString()} XAF`

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
};

// --- Metric Card ---
type Trend = { pct: number; positiveIsGood: boolean } | null;

const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend?: Trend }) => {
  const trendUp = trend != null && trend.pct >= 0;
  const trendGood = trend != null && (trendUp === trend.positiveIsGood);
  return (
    <div className="bg-white p-5 rounded-2xl border border-[var(--color-secondary-light)] shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-[var(--color-secondary-super-light)]">
          <Icon size={16} className="text-[var(--color-secondary-mid)]" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-[10px] font-black ${trendGood ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendUp ? '+' : ''}{trend.pct.toFixed(0)}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-[var(--color-secondary-gray)] uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-black text-[var(--color-primary)] mt-0.5 tracking-tight">{value}</h3>
      {trend && <p className="text-[10px] text-[var(--color-secondary-gray)] font-medium mt-1">vs last month</p>}
    </div>
  );
};

interface CashSummary {
  count: number;
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
}

const summarize = (
  entries: { montantTTC?: number; montantRestant?: number; cancelled: boolean }[]
): CashSummary => {
  const active = entries.filter((e) => !e.cancelled);
  return active.reduce(
    (acc, e) => {
      const total = e.montantTTC ?? 0;
      const pending = Math.min(e.montantRestant ?? 0, total);
      const paid = total - pending;
      return {
        count: acc.count + 1,
        totalInvoiced: acc.totalInvoiced + total,
        totalPaid: acc.totalPaid + paid,
        totalPending: acc.totalPending + pending,
      };
    },
    { count: 0, totalInvoiced: 0, totalPaid: 0, totalPending: 0 }
  );
};

type Transaction = {
  id: string;
  flow: 'IN' | 'OUT';
  reference?: string;
  counterparty?: string;
  date?: string;
  totalTTC?: number;
  restant?: number;
};

const isSameMonth = (dateString: string | undefined, ref: Date) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

const trendPct = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PAYMENT_MODE_LABELS: Record<string, string> = {
  ESPECES: 'Cash',
  CHEQUE: 'Cheque',
  VIREMENT: 'Transfer',
  CARTE_BANCAIRE: 'Card',
  AUTRE: 'Other',
};

const ProfessionalDashboard = () => {
  const [invoices, setInvoices] = useState<FactureResponse[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<FactureFournisseurResponse[]>([]);
  const [paiements, setPaiements] = useState<PaiementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const seller = getStoredSeller();
  const [profileImageUrl, setProfileImageUrl] = useState(seller?.profileImageUrl);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [factures, facturesFournisseur, paymentsList] = await Promise.all([
          getVisibleFactures(),
          getVisibleFacturesFournisseur(),
          getVisiblePaiements(),
        ]);
        setInvoices(factures);
        setSupplierInvoices(facturesFournisseur);
        setPaiements(paymentsList);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        toast.error("Failed to load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const scopeLabel = useMemo(() => {
    if (seller?.role === SellerRole.OWNER) return "Organization";
    if (seller?.role === SellerRole.AGENCY_MANAGER) return "Agency";
    return "Your";
  }, [seller?.role]);

  const cashIn = useMemo(
    () =>
      summarize(
        invoices.map((f) => ({
          montantTTC: f.montantTTC,
          montantRestant: f.montantRestant,
          cancelled: f.etat === FactureResponse.etat.ANNULE,
        }))
      ),
    [invoices]
  );

  const cashOut = useMemo(
    () =>
      summarize(
        supplierInvoices.map((f) => ({
          montantTTC: f.montantTTC,
          montantRestant: f.montantRestant,
          cancelled: f.statut === FactureFournisseurResponse.statut.ANNULE,
        }))
      ),
    [supplierInvoices]
  );

  const now = useMemo(() => new Date(), []);
  const lastMonthRef = useMemo(() => new Date(now.getFullYear(), now.getMonth() - 1, 1), [now]);

  // Real month-over-month comparisons — no fabricated numbers. Revenue and
  // collected both have a well-defined "this month vs last month" reading;
  // pending/open counts are snapshots with no natural period to compare
  // against, so those cards render without a trend badge instead of a fake one.
  const revenueThisMonth = useMemo(
    () => invoices.filter((f) => f.etat !== FactureResponse.etat.ANNULE && isSameMonth(f.dateFacturation, now))
      .reduce((sum, f) => sum + (f.montantTTC ?? 0), 0),
    [invoices, now]
  );
  const revenueLastMonth = useMemo(
    () => invoices.filter((f) => f.etat !== FactureResponse.etat.ANNULE && isSameMonth(f.dateFacturation, lastMonthRef))
      .reduce((sum, f) => sum + (f.montantTTC ?? 0), 0),
    [invoices, lastMonthRef]
  );

  const collectedThisMonth = useMemo(
    () => paiements.filter((p) => isSameMonth(p.date, now)).reduce((sum, p) => sum + (p.montant ?? 0), 0),
    [paiements, now]
  );
  const collectedLastMonth = useMemo(
    () => paiements.filter((p) => isSameMonth(p.date, lastMonthRef)).reduce((sum, p) => sum + (p.montant ?? 0), 0),
    [paiements, lastMonthRef]
  );

  const openInvoicesCount = useMemo(
    () => invoices.filter((f) => f.etat !== FactureResponse.etat.ANNULE && (f.montantRestant ?? 0) > 0).length,
    [invoices]
  );

  // Last 6 months of revenue (client invoices) vs expenses (supplier invoices).
  const monthlySeries = useMemo(() => {
    const months: { key: string; label: string; year: number; month: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
    }
    return months.map(({ label, year, month }) => {
      const revenue = invoices
        .filter((f) => f.etat !== FactureResponse.etat.ANNULE && f.dateFacturation
          && new Date(f.dateFacturation).getFullYear() === year && new Date(f.dateFacturation).getMonth() === month)
        .reduce((sum, f) => sum + (f.montantTTC ?? 0), 0);
      const expenses = supplierInvoices
        .filter((f) => f.statut !== FactureFournisseurResponse.statut.ANNULE && f.dateFacture
          && new Date(f.dateFacture).getFullYear() === year && new Date(f.dateFacture).getMonth() === month)
        .reduce((sum, f) => sum + (f.montantTTC ?? 0), 0);
      return { month: label, Revenue: Math.round(revenue), Expenses: Math.round(expenses) };
    });
  }, [invoices, supplierInvoices, now]);

  // Real breakdown of actual recorded payments by mode — not fabricated categories.
  const paymentMethodSeries = useMemo(() => {
    const totals = new Map<string, number>();
    for (const p of paiements) {
      const mode = p.modePaiement ?? 'AUTRE';
      totals.set(mode, (totals.get(mode) ?? 0) + (p.montant ?? 0));
    }
    return Object.keys(PAYMENT_MODE_LABELS).map((mode) => ({
      name: PAYMENT_MODE_LABELS[mode],
      Amount: Math.round(totals.get(mode) ?? 0),
    }));
  }, [paiements]);

  const recentTransactions: Transaction[] = useMemo(() => {
    const inTx: Transaction[] = invoices
      .filter((f) => f.etat !== FactureResponse.etat.ANNULE)
      .map((f) => ({
        id: `in-${f.idFacture}`,
        flow: 'IN',
        reference: f.numeroFacture,
        counterparty: f.nomClient,
        date: f.dateFacturation,
        totalTTC: f.montantTTC,
        restant: f.montantRestant,
      }));
    const outTx: Transaction[] = supplierInvoices
      .filter((f) => f.statut !== FactureFournisseurResponse.statut.ANNULE)
      .map((f) => ({
        id: `out-${f.idFactureFournisseur}`,
        flow: 'OUT',
        reference: f.numeroFacture,
        counterparty: f.nomFournisseur,
        date: f.dateFacture,
        totalTTC: f.montantTTC,
        restant: f.montantRestant,
      }));
    return [...inTx, ...outTx]
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
      .slice(0, 8);
  }, [invoices, supplierInvoices]);

  return (
    <div className="w-full p-8 min-h-screen bg-[var(--color-secondary-background)] text-[var(--color-primary)] font-sans overflow-y-auto">

      {/* Header: title left, profile top-right */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">{scopeLabel} Dashboard</h1>
          <p className="text-[var(--color-secondary-gray)] text-sm mt-0.5 font-medium">Billing overview across invoices, expenses and payments</p>
        </div>

        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="group/avatar flex items-center gap-3 bg-white border border-[var(--color-secondary-light)] rounded-2xl pl-4 pr-2 py-2 shadow-sm hover:shadow-md transition-all self-start md:self-auto"
          title="Change profile photo"
        >
          <div className="text-right">
            <p className="text-xs font-black text-[var(--color-primary)] leading-tight">{seller?.username}</p>
            <p className="text-[10px] text-[var(--color-secondary-gray)] font-medium leading-tight">{seller?.email || seller?.organizationEmail}</p>
          </div>
          <div className="relative shrink-0">
            <SellerAvatar name={seller?.username} imageUrl={profileImageUrl} size={40} />
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={14} className="text-white" />
            </span>
          </div>
        </button>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue This Month"
          value={isLoading ? "…" : formatMoney(revenueThisMonth)}
          icon={TrendingUp}
          trend={isLoading ? undefined : { pct: trendPct(revenueThisMonth, revenueLastMonth), positiveIsGood: true }}
        />
        <StatCard
          title="Pending Payments"
          value={isLoading ? "…" : formatMoney(cashIn.totalPending)}
          icon={TrendingDown}
        />
        <StatCard
          title="Total Collected This Month"
          value={isLoading ? "…" : formatMoney(collectedThisMonth)}
          icon={TrendingUp}
          trend={isLoading ? undefined : { pct: trendPct(collectedThisMonth, collectedLastMonth), positiveIsGood: true }}
        />
        <StatCard
          title="Open Invoices"
          value={isLoading ? "…" : `${openInvoicesCount}`}
          icon={TrendingDown}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[var(--color-secondary-light)] shadow-sm">
          <h3 className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary-light)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-secondary-gray)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-secondary-gray)' }} axisLine={false} tickLine={false} width={40}
                tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`} />
              <RechartsTooltip formatter={(v: any) => formatMoney(Number(v) || 0)} contentStyle={{ borderRadius: 12, border: '1px solid var(--color-secondary-light)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[var(--color-secondary-light)] shadow-sm">
          <h3 className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={paymentMethodSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-secondary-gray)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-secondary-gray)' }} axisLine={false} tickLine={false} width={40}
                tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`} />
              <RechartsTooltip formatter={(v: any) => formatMoney(Number(v) || 0)} contentStyle={{ borderRadius: 12, border: '1px solid var(--color-secondary-light)', fontSize: 12 }} />
              <Bar dataKey="Amount" fill="var(--color-secondary-mid)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bills */}
      <section className="border border-[var(--color-secondary-light)] bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-secondary-super-light)]">
          <h3 className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest">Recent Bills</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-secondary-background)]">
              <tr className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary-gray)] border-b border-[var(--color-secondary-light)]">
                <th className="px-6 py-4">Bill No</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-secondary-super-light)] text-sm font-medium">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400 font-medium">Loading…</td></tr>
              ) : recentTransactions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400 font-medium">No bills yet.</td></tr>
              ) : recentTransactions.map((tx) => {
                const restant = tx.restant ?? 0;
                const total = tx.totalTTC ?? 0;
                const status = restant <= 0 ? 'Paid' : restant < total ? 'Partial' : 'Pending';
                const statusColor =
                  status === 'Paid' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                  status === 'Partial' ? 'text-amber-700 bg-amber-50 border-amber-100' :
                  'text-rose-700 bg-rose-50 border-rose-100';
                return (
                  <tr key={tx.id} className="hover:bg-[var(--color-secondary-super-light)]/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[var(--color-secondary-gray)]">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${tx.flow === 'IN' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {tx.reference || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--color-primary)]">{tx.counterparty || '—'}</td>
                    <td className="px-6 py-4 text-[var(--color-secondary-gray)]">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 text-right font-black text-[var(--color-primary)]">{formatMoney(tx.totalTTC)}</td>
                    <td className="px-6 py-4 text-right text-[var(--color-secondary-gray)]">{formatMoney(tx.restant)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${statusColor}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <UploadSellerAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        sellerId={seller?.Id}
        username={seller?.username}
        profileImageUrl={profileImageUrl}
        onUploaded={(photoUrl) => {
          setProfileImageUrl(photoUrl);
          updateStoredSellerProfileImage(photoUrl);
        }}
      />
    </div>
  )
}

export default ProfessionalDashboard;
