"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ReceiptText, Building2, PlayCircle, Package,
  Hash, ShieldCheck, ArrowRight, Sparkles,
  FileCheck2, Layers, Zap, Settings2, Rocket,
  Check, X, Minus, Globe, CheckCircle2, Shield
} from "lucide-react";
import Reveal from "@/components/Reveal";
import AuthModal from "@/components/AuthModal";
import { getStoredSeller } from "@/src/api/session";

const COMPARISON_CATEGORIES = [
  {
    category: "POS & Sales Terminal",
    items: [
      {
        feature: "Offline-First POS Selling",
        description: "Full offline register capability with Dexie/IndexedDB local storage & automatic background synchronization when internet restores.",
        ksm: true,
        ksmNote: "Full offline-first with auto-sync",
        traditional: "Limited",
        traditionalNote: "Requires active network connection",
        manual: false,
        manualNote: "No offline capabilities",
      },
      {
        feature: "Session Lifecycle & Cash Float",
        description: "UTC-aligned session scheduling, open/close float balance validation, cash drawer tracking, and automatic timeout gates.",
        ksm: true,
        ksmNote: "UTC gates + float audit trail",
        traditional: "Basic",
        traditionalNote: "Basic daily open/close",
        manual: false,
        manualNote: "Manual paper registers",
      },
      {
        feature: "Tiered Pricing per Sale Size",
        description: "Automatic price application for Detail, Demi-Gros, Gros, and Super-Gros customer categories.",
        ksm: true,
        ksmNote: "4-tier automatic pricing",
        traditional: "Limited",
        traditionalNote: "Single fixed price list",
        manual: false,
        manualNote: "Manual calculation errors",
      },
    ],
  },
  {
    category: "Documents & Automation",
    items: [
      {
        feature: "10+ Specialized Document Types",
        description: "Quotations, Proformas, Sales Orders, Invoices, Delivery Notes, Credit Notes, Back Orders, Goods Receipts, Supplier Invoices & Purchase Orders.",
        ksm: true,
        ksmNote: "Complete 10+ document suite",
        traditional: "Basic",
        traditionalNote: "Invoices & Receipts only",
        manual: false,
        manualNote: "Word / Excel templates",
      },
      {
        feature: "1-Click Document Transformations",
        description: "Seamlessly turn Quotations ➔ Sales Orders ➔ Invoices ➔ Delivery Notes without re-typing line items.",
        ksm: true,
        ksmNote: "Automated workflow pipeline",
        traditional: false,
        traditionalNote: "Manual re-entry required",
        manual: false,
        manualNote: "Re-copying across files",
      },
      {
        feature: "Custom Composable Document Numbering",
        description: "Define custom prefix, organization code, agency code, tax flags, dates, and sequence rules per document type.",
        ksm: true,
        ksmNote: "Fully composable rules",
        traditional: "Limited",
        traditionalNote: "Rigid auto-increment IDs",
        manual: false,
        manualNote: "Manual numbers & duplicates",
      },
    ],
  },
  {
    category: "Multi-Agency & Portal",
    items: [
      {
        feature: "Multi-Agency & Sales Point Scoping",
        description: "Hierarchy management across Organizations, Agencies, and Sales Points with strict data isolation.",
        ksm: true,
        ksmNote: "Org ➔ Agency ➔ Sales Point",
        traditional: "Limited",
        traditionalNote: "Single location focus",
        manual: false,
        manualNote: "Disconnected spreadsheets",
      },
      {
        feature: "Public Customer Portal & Sharing",
        description: "Generate secure token-based public links for customer quotation approvals, proposal reviews, and invoice downloads.",
        ksm: true,
        ksmNote: "Tokenized public portal",
        traditional: false,
        traditionalNote: "Email PDF attachments only",
        manual: false,
        manualNote: "Physical paper printouts",
      },
      {
        feature: "Granular Role-Based Access (RBAC)",
        description: "Fine-grained permissions for discount caps, price overrides, quotation negotiations, and document approval workflows.",
        ksm: true,
        ksmNote: "Custom seller & manager RBAC",
        traditional: "Basic",
        traditionalNote: "Generic Admin/User roles",
        manual: false,
        manualNote: "Zero access controls",
      },
      {
        feature: "Real-Time Sync & WebSocket Alerts",
        description: "Instant updates across terminals, live notifications for session events, and full financial audit logs.",
        ksm: true,
        ksmNote: "Live WebSockets + Audit trail",
        traditional: false,
        traditionalNote: "Delayed batch updates",
        manual: false,
        manualNote: "No audit trails",
      },
    ],
  },
];

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Sales & Quotations",
    description: "Create quotations, sales orders and invoices with negotiable, tiered pricing per sale size.",
  },
  {
    icon: Building2,
    title: "Multi-Agency Organizations",
    description: "Manage agencies, sellers, customers and suppliers across your entire organization from one place.",
  },
  {
    icon: PlayCircle,
    title: "Real-Time Sessions",
    description: "Open, suspend and reconcile seller sessions per sale point with a full audit trail.",
  },
  {
    icon: Package,
    title: "Product Catalog",
    description: "Track stock, configure sale-size pricing tiers, and manage product photos in one catalog.",
  },
  {
    icon: Hash,
    title: "Custom Document Numbering",
    description: "Compose your own invoice, quotation and delivery note numbers exactly the way your business needs.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Fine-grained seller permissions for pricing, discounts and document approvals, agency by agency.",
  },
];

const STEPS = [
  {
    icon: Building2,
    step: "01",
    title: "Set up your organization",
    description: "Add agencies, sale points and invite sellers with the exact permissions they need.",
  },
  {
    icon: Settings2,
    step: "02",
    title: "Compose your numbering",
    description: "Choose your org code, branch code, tax status and sequence — for every document type.",
  },
  {
    icon: PlayCircle,
    step: "03",
    title: "Open a session",
    description: "Sellers open a session on their sale point and start negotiating, discounting and selling.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Issue & track documents",
    description: "Quotations become orders, orders become invoices — every document numbered your way.",
  },
];

const Logo = ({ variant = "dark" }: { variant?: "dark" | "light" }) => (
  <div className="flex items-center gap-2.5">
    <img
      src="/logo.png"
      alt="KSM Logo"
      className="w-9 h-9 object-contain"
    />
    <div className="flex items-baseline gap-1.5">
      <span className={`text-lg font-black tracking-tight ${variant === "dark" ? "text-primary" : "text-white"}`}>Billing</span>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${variant === "dark" ? "text-secondary-gray" : "text-white/50"}`}>by KSM</span>
    </div>
  </div>
);

const LandingPage = () => {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  useEffect(() => {
    if (getStoredSeller()?.accessToken) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* TOP ACCENT */}
      <div className="h-1 bg-gradient-to-r from-secondary-mid via-primary to-secondary-mid" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-secondary-light/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo />

          <div className="hidden md:flex items-center gap-6">
            <a href="#workflow" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">How it works</a>
            <a href="#comparison" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Compare</a>
            <Link href="/features" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Pricing</Link>
            <Link href="/developers" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Developers</Link>
            <Link href="/docs" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Docs</Link>
            <Link href="/about" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-bold text-secondary-gray hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-sm font-bold text-primary hover:text-secondary-mid transition-colors px-2"
            >
              Sign In
            </button>
            <Link
              href="/try-out"
              className="flex items-center gap-1.5 bg-primary hover:bg-secondary-mid text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Try Out <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(80% 60% at 90% -10%, var(--color-secondary-super-light) 0%, transparent 55%), radial-gradient(60% 50% at 0% 100%, var(--color-secondary-super-light) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(var(--color-secondary-light) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(60% 50% at 75% 20%, black 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-28 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          {/* Left: copy */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-secondary-light shadow-sm text-secondary-mid rounded-full text-[11px] font-black uppercase tracking-widest mb-7">
              <Sparkles size={13} /> The Billing module, by KSM
            </div>
            <h1 className="text-5xl md:text-[3.75rem] font-black text-primary tracking-tight leading-[1.05] mb-6">
              Run your entire<br />
              <span className="bg-gradient-to-r from-secondary-mid to-primary bg-clip-text text-transparent">sales operation</span><br />
              from one place.
            </h1>
            <p className="text-lg text-secondary-gray font-medium max-w-xl mb-10 leading-relaxed">
              Quotations, invoices, agencies, sessions and inventory — KSM Billing brings your whole
              organization&apos;s sales workflow together, with numbering and pricing rules
              built exactly for how your business works.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/try-out"
                className="flex items-center gap-2 bg-primary hover:bg-secondary-mid text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 hover:shadow-2xl hover:shadow-primary/30"
              >
                Try It Out <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-white border-2 border-secondary-light hover:border-secondary-mid text-primary px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
              >
                Sign In
              </button>
            </div>
            <div className="flex items-center gap-6 text-secondary-gray">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Layers size={15} className="text-secondary-mid" /> 10+ document types
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Zap size={15} className="text-secondary-mid" /> Real-time sessions
              </div>
            </div>
          </Reveal>

          {/* Right: product mockup */}
          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-secondary-super-light rounded-full blur-3xl -z-10" />
              <div className="rounded-[2rem] bg-white border border-secondary-light shadow-2xl shadow-primary/10 overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500 flex">
                {/* fake icon rail */}
                <div className="w-12 bg-secondary-background border-r border-secondary-light py-4 flex flex-col items-center gap-3 shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-secondary-mid shadow-sm" />
                  <div className="w-6 h-6 rounded-md bg-secondary-light/70" />
                  <div className="w-6 h-6 rounded-md bg-secondary-light/70" />
                  <div className="w-6 h-6 rounded-md bg-secondary-light/70" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* fake window chrome */}
                  <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-secondary-light bg-secondary-background">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    <div className="ml-3 h-2 w-36 rounded-full bg-secondary-light/70" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-28 rounded-full bg-primary/10" />
                      <div className="h-7 w-24 rounded-lg bg-secondary-mid/90" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl bg-secondary-super-light p-3 space-y-2">
                          <div className="h-2 w-10 rounded-full bg-secondary-mid/30" />
                          <div className="h-4 w-14 rounded-full bg-primary/20" />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-secondary-light overflow-hidden">
                      {[1, 2, 3, 4].map((row) => (
                        <div key={row} className="flex items-center gap-3 px-4 py-3 border-b border-secondary-light last:border-b-0">
                          <div className="w-7 h-7 rounded-lg bg-secondary-super-light shrink-0" />
                          <div className="h-2.5 flex-1 rounded-full bg-secondary-light" />
                          <div className="h-2.5 w-14 rounded-full bg-emerald-100" />
                          <div className="h-5 w-5 rounded bg-secondary-super-light" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl border border-secondary-light px-5 py-4 flex items-center gap-3 -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary-gray uppercase tracking-widest">Quotation issued</p>
                  <p className="text-sm font-black text-primary">QUO-20260703-0080</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="workflow" className="bg-secondary-background border-y border-secondary-light">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-3">From setup to sale, in four steps</h2>
              <p className="text-secondary-gray font-medium">Everything is configured once, then it just runs.</p>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-secondary-light" />
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.step} delay={i * 100}>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border-2 border-secondary-mid text-secondary-mid flex items-center justify-center mb-5 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-black text-secondary-mid/50 tracking-widest mb-2">STEP {step.step}</span>
                    <h3 className="text-base font-black text-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-secondary-gray font-medium leading-relaxed">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKFLOW / SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-[2rem] bg-white border border-secondary-light p-10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-super-light text-secondary-mid flex items-center justify-center mb-6">
                  <ReceiptText size={22} />
                </div>
                <h3 className="text-xl font-black text-primary mb-3">Quote to cash, fully composed by you</h3>
                <p className="text-sm text-secondary-gray font-medium leading-relaxed max-w-md">
                  Configure exactly how each document number is built — org code, branch code,
                  tax status, date, sequence — per document type. What goes out the door looks like your business, not a template.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs font-bold text-secondary-mid bg-secondary-super-light rounded-xl px-4 py-3 w-fit">
                KSM-QUO-NT-20260703-0080
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full rounded-[2rem] bg-primary p-10 flex flex-col justify-between text-white relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(60% 60% at 90% 10%, var(--color-secondary-mid) 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6">
                  <Building2 size={22} />
                </div>
                <h3 className="text-xl font-black mb-3">Built for multi-agency teams</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Agencies, sellers, sale points and sessions, all scoped correctly — every seller sees only what their agency needs.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-3">Everything your team needs</h2>
            <p className="text-secondary-gray font-medium">A single system for sales, inventory and organization management.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={(i % 3) * 100}>
                <div className="h-full p-8 rounded-[2rem] border border-secondary-light bg-white hover:shadow-xl hover:shadow-primary/5 hover:border-secondary-mid/20 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-super-light text-secondary-mid flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-black text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-secondary-gray font-medium leading-relaxed">{feature.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURE COMPARISON MATRIX */}
      <section id="comparison" className="bg-secondary-background border-y border-secondary-light py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-secondary-light shadow-sm text-secondary-mid rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={13} /> Feature Comparison Matrix
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-3">
                Why modern multi-agency teams choose KSM Billing
              </h2>
              <p className="text-secondary-gray font-medium max-w-2xl mx-auto">
                Compare KSM Billing against traditional POS/ERP software and fragmented manual spreadsheets.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-white rounded-[2.5rem] border border-secondary-light shadow-xl shadow-primary/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-secondary-light bg-secondary-background/60 text-xs font-black uppercase tracking-wider text-secondary-gray">
                      <th className="py-6 px-8 w-2/5">Function / Capability</th>
                      <th className="py-6 px-6 w-1/5 bg-primary/5 text-primary border-x border-primary/10 relative">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-black text-sm text-primary">KSM Billing</span>
                          <span className="ml-auto text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Full Suite</span>
                        </div>
                      </th>
                      <th className="py-6 px-6 w-1/5 text-secondary-gray">Traditional POS / ERP</th>
                      <th className="py-6 px-6 w-1/5 text-secondary-gray">Manual &amp; Spreadsheets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-light text-sm">
                    {COMPARISON_CATEGORIES.map((cat) => (
                      <React.Fragment key={cat.category}>
                        <tr className="bg-secondary-super-light/50">
                          <td colSpan={4} className="py-3 px-8 text-xs font-black text-secondary-mid uppercase tracking-widest">
                            {cat.category}
                          </td>
                        </tr>
                        {cat.items.map((item) => (
                          <tr key={item.feature} className="hover:bg-secondary-super-light/30 transition-colors">
                            <td className="py-5 px-8">
                              <p className="font-black text-primary text-sm mb-1">{item.feature}</p>
                              <p className="text-xs text-secondary-gray font-medium leading-relaxed max-w-md">{item.description}</p>
                            </td>
                            {/* KSM BILLING */}
                            <td className="py-5 px-6 bg-primary/[0.02] border-x border-primary/10">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0 mt-0.5">
                                  <Check size={14} className="stroke-[3]" />
                                </div>
                                <div>
                                  <span className="font-black text-xs text-emerald-700 uppercase tracking-wide block">Included</span>
                                  <span className="text-[11px] text-secondary-gray font-medium">{item.ksmNote}</span>
                                </div>
                              </div>
                            </td>
                            {/* TRADITIONAL POS */}
                            <td className="py-5 px-6">
                              {item.traditional === true ? (
                                <div className="flex items-start gap-2.5">
                                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                                    <Check size={14} />
                                  </div>
                                  <span className="text-xs font-bold text-primary">{item.traditionalNote}</span>
                                </div>
                              ) : item.traditional === "Limited" || item.traditional === "Basic" ? (
                                <div className="flex items-start gap-2.5">
                                  <div className="p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                                    <Minus size={14} className="stroke-[3]" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-xs text-amber-700 uppercase tracking-wide block">{item.traditional}</span>
                                    <span className="text-[11px] text-secondary-gray font-medium">{item.traditionalNote}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2.5">
                                  <div className="p-1 rounded-md bg-rose-50 text-rose-500 shrink-0 mt-0.5">
                                    <X size={14} className="stroke-[3]" />
                                  </div>
                                  <span className="text-xs font-medium text-secondary-gray">{item.traditionalNote}</span>
                                </div>
                              )}
                            </td>
                            {/* MANUAL / SPREADSHEETS */}
                            <td className="py-5 px-6">
                              {item.manual === true ? (
                                <div className="flex items-start gap-2.5">
                                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                                    <Check size={14} />
                                  </div>
                                  <span className="text-xs font-bold text-primary">{item.manualNote}</span>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2.5">
                                  <div className="p-1 rounded-md bg-rose-50 text-rose-500 shrink-0 mt-0.5">
                                    <X size={14} className="stroke-[3]" />
                                  </div>
                                  <span className="text-xs font-medium text-secondary-gray">{item.manualNote}</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary-mid px-10 py-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(50% 80% at 20% 20%, white 0%, transparent 60%)" }}
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Ready to get started?</h2>
              <p className="text-white/70 font-medium mb-8 max-w-xl mx-auto">
                Try KSM Billing out, or sign in with your organization credentials to access your dashboard.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/try-out"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-95 hover:bg-secondary-super-light"
                >
                  Try It Out <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1.1fr] gap-10">
          <div>
            <Logo variant="light" />
            <p className="text-sm text-white/50 font-medium mt-4 max-w-xs leading-relaxed">
              KSM Billing is the sales &amp; billing module of the KSM business suite.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Product</p>
            <div className="flex flex-col gap-2.5">
              <a href="#workflow" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">How it works</a>
              <Link href="/features" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Features</Link>
              <Link href="/pricing" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Pricing</Link>
              <Link href="/docs" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Documentation</Link>
              <Link href="/help" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Help &amp; FAQ</Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit text-left"
              >
                Sign In
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Company</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">About</Link>
              <Link href="/careers" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Careers</Link>
              <Link href="/press" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Press</Link>
              <Link href="/contact" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Legal</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/legal" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Mentions légales</Link>
              <Link href="/privacy" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Confidentialité</Link>
              <Link href="/terms" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Conditions d&apos;utilisation</Link>
              <Link href="/cookies" className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit">Cookies</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <p className="text-xs text-white/40 font-medium">© {new Date().getFullYear()} KSM. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
