"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Assessment as AssessmentIcon,
  RequestQuote as RequestQuoteIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  AssignmentReturn as CreditNoteIcon,
  ConfirmationNumber as VoucherIcon,
} from "@mui/icons-material";

// Mapping string names to actual components
const IconMap: Record<string, any> = {
  AssessmentIcon,
  RequestQuoteIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CreditNoteIcon,
  VoucherIcon,
};

const MENU_SECTIONS = [
  {
    id: "sales",
    label: "Sales Management",
    icon: "AssessmentIcon",
    pathPrefix: "/sales", // Used for the active indicator
    items: [
      {
        content: "Quotations",
        Icon: "RequestQuoteIcon",
        path: "/quotations",
      },
      {
        content: "Sales Orders",
        Icon: "ShoppingCartIcon",
        path: "/sales_orders",
      },
      {
        content: "Invoices",
        Icon: "ReceiptIcon",
        path: "/invoices",
      },
      {
        content: "Credit Notes",
        Icon: "CreditNoteIcon",
        path: "/credit_notes",
      },
      {
        content: "Store Credit Vouchers",
        Icon: "VoucherIcon",
        path: "/store_credit",
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  // We initialize with 'sales' open since it's the only section
  const [openSectionId, setOpenSectionId] = useState<string | null>("sales");

  const handleIconClick = (id: string) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };
page
page
page
  const currentSection = MENU_SECTIONS.find((s) => s.id === openSectionId);

  return (
    <div className="inset-y-0 left-0 z-50 flex h-screen">
      {/* STAGE 1: The Icon Wall */}
      <aside
        className="w-16 h-full flex flex-col bg-white border-r-4 shadow-xl z-20"
        style={{ borderColor: "var(--color-secondary-mid)" }}
      >
        <Link href="/Dashboard">
          <div className="flex justify-center py-6 border-b border-gray-100 cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-[var(--color-secondary-mid)] shadow-lg shadow-secondary-mid/20">
              B
            </div>
          </div>
        </Link>

        <nav className="flex-1 flex flex-col items-start py-4">
          {MENU_SECTIONS.map((section) => {
            const Icon = IconMap[section.icon];
            const isActive = pathname.startsWith(section.pathPrefix) || 
                             section.items.some(item => pathname === item.path);
            const isOpen = openSectionId === section.id;

            return (
              <button
                key={section.id}
                onClick={() => handleIconClick(section.id)}
                className={`w-full h-14 flex items-center justify-center transition-all relative
                  ${isOpen ? "bg-[var(--color-secondary-super-light)] text-[var(--color-secondary-mid)]" : "text-gray-400 hover:bg-gray-50"}`}
              >
                {/* Active Indicator Bar */}
                <div
                  className={`w-1 flex h-8 rounded-r-full absolute left-0 transition-all 
                  ${isActive ? "bg-[var(--color-secondary-mid)]" : "bg-transparent"}`}
                />

                <Icon fontSize="medium" />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* STAGE 2: The Expanding Items Panel */}
      <div
        className={`h-full bg-white shadow-2xl border-r transition-all duration-300 ease-in-out overflow-hidden no-scrollbar
          ${openSectionId ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        style={{ borderColor: "var(--color-secondary-light)" }}
      >
        {currentSection && (
          <div className="w-64 p-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                {currentSection.label}
              </h2>
              <button
                onClick={() => setOpenSectionId(null)}
                className="text-gray-300 hover:text-secondary-mid transition-colors p-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-1.5">
              {currentSection.items.map((item) => {
                const ItemIcon = IconMap[item.Icon];
                const isItemActive = pathname === item.path;

                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all group
                      ${isItemActive
                          ? "bg-[var(--color-secondary-mid)] text-white font-bold shadow-lg shadow-secondary-mid/30"
                          : "text-gray-500 hover:bg-[var(--color-secondary-super-light)] hover:text-[var(--color-secondary-mid)]"}`}
                    >
                      <ItemIcon
                        fontSize="small"
                        className={`${isItemActive ? "text-white" : "text-gray-400 group-hover:text-secondary-mid"}`}
                      />
                      <span className="text-sm tracking-tight">{item.content}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;