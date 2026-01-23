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
  CardMembership as StoreCreditIcon, // New icon for Store Credit
} from "@mui/icons-material";

// Mapping string names to components to keep the data structure clean
const iconMap: Record<string, React.ElementType> = {
  AssessmentIcon,
  RequestQuoteIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CreditNoteIcon,
  StoreCreditIcon
};

const MENU_SECTIONS = [
  {
    id: "sales",
    label: "Sales Management",
    icon: "AssessmentIcon",
    items: [
      { 
        content: "Quotations", 
        Icon: "RequestQuoteIcon", 
        path: "/quotations" 
      },
      { 
        content: "Sales Orders", 
        Icon: "ShoppingCartIcon", 
        path: "/sales_orders" 
      },
      { 
        content: "Invoices", 
        Icon: "ReceiptIcon", 
        path: "/invoices" 
      },
      { 
        content: "Credit Notes", 
        Icon: "CreditNoteIcon", 
        path: "/credit_notes" 
      },
      { 
        content: "Store Credit Vouchers", 
        Icon: "StoreCreditIcon", 
        path: "/store_credit" 
      },
      
       { 
        content: "Purchase Order", 
        Icon: "StoreCreditIcon", 
        path: "/purchase_orders" 
      },{ 
        content: "Delivery Note", 
        Icon: "StoreCreditIcon", 
        path: "/delivery_notes" 
      },
      { 
        content: "Goods Receipt Note", 
        Icon: "StoreCreditIcon", 
        path: "/goods_rns" 
      },
       { 
        content: "Supplier Invoice", 
        Icon: "StoreCreditIcon", 
        path: "/supplier_invoice" 
      },

    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  
  // Since we only have one section, we can default it to open or keep it togglable
  const [openSectionId, setOpenSectionId] = useState<string | null>("sales");

  const handleIconClick = (id: string) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  const currentSection = MENU_SECTIONS.find(s => s.id === openSectionId);

  return (
    <div className="inset-y-0 left-0 z-50 flex">
      {/* STAGE 1: The Primary Icon Rail */}
      <aside
        className="w-16 h-screen flex flex-col bg-white border-r-4 shadow-xl z-20"
        style={{ borderColor: "var(--color-secondary-mid)" }}
      >
        <Link href="/dashboard">
          <div className="flex justify-center py-6 border-b border-gray-100 cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white bg-[var(--color-secondary-mid)] shadow-lg shadow-secondary-mid/20">
              B
            </div>
          </div>
        </Link>

        <nav className="flex-1 flex flex-col items-start py-4">
          {MENU_SECTIONS.map((section) => {
            const Icon = iconMap[section.icon];
            const isOpen = openSectionId === section.id;
            // Check if any sub-item is active
            const isAnyItemActive = section.items.some(item => pathname === item.path);
            
            return (
              <button
                key={section.id}
                onClick={() => handleIconClick(section.id)}
                className={`w-full h-14 flex items-center justify-center transition-all relative
                  ${isOpen ? 'bg-[var(--color-secondary-super-light)] text-[var(--color-secondary-mid)]' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {/* Active Indicator Bar */}
                <div className={`w-1 flex h-8 rounded-r-full absolute left-0 transition-all 
                  ${isAnyItemActive ? 'bg-[var(--color-secondary-mid)]' : 'bg-transparent'}`} 
                />
                
                {Icon && <Icon fontSize="medium" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* STAGE 2: The Secondary Sub-Menu Panel */}
      <div
        className={`h-screen bg-white shadow-2xl border-r transition-all duration-300 ease-in-out overflow-hidden no-scrollbar
          ${openSectionId ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        style={{ borderColor: "var(--color-secondary-light)" }}
      >
        {currentSection && (
          <div className="w-64 p-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                  {currentSection.label}
                </h2>
                <div className="h-1 w-6 bg-secondary-mid mt-1 rounded-full" />
              </div>
              <button 
                onClick={() => setOpenSectionId(null)}
                className="text-gray-300 hover:text-secondary-mid transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-1.5">
              {currentSection.items.map((item) => {
                const ItemIcon = iconMap[item.Icon];
                const isItemActive = pathname === item.path;

                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                      ${isItemActive 
                        ? 'bg-[var(--color-secondary-mid)] text-white font-bold shadow-lg shadow-secondary-mid/30 translate-x-1' 
                        : 'text-gray-500 hover:bg-[var(--color-secondary-super-light)] hover:text-[var(--color-secondary-mid)] hover:translate-x-1'}`}>
                      {ItemIcon && (
                        <ItemIcon 
                          fontSize="small" 
                          className={isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-secondary-mid'} 
                        />
                      )}
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Sidebar;