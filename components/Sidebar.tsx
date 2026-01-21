"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Group as GroupIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  ShoppingBag as ShoppingBagIcon,
  AccountBalanceWallet as TreasuryIcon,
  PeopleAlt as PeopleAltIcon,
  Factory as FactoryIcon,
  Inventory2 as Inventory2Icon,
  Warehouse as WarehouseIcon,
  SwapVert as SwapVertIcon,
  RequestQuote as RequestQuoteIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Receipt as ReceiptIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  BarChart as BarChartIcon,
  Restore as RestoreIcon,
  AttachMoney as AttachMoneyIcon,
  Percent as PercentIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

const MENU_SECTIONS = [
  {
    "id": "customers",
    "label": "Customers & Suppliers",
    "icon": "GroupIcon",
    "items": [
      {
        "content": "Customers",
        "Icon": "PeopleAltIcon",
        "path": "/customers"
      },
      {
        "content": "Suppliers",
        "Icon": "FactoryIcon",
        "path": "/suppliers"
      }
    ]
  },
  {
    "id": "products",
    "label": "Products & Inventory",
    "icon": "StoreIcon",
    "items": [
      {
        "content": "Products",
        "Icon": "Inventory2Icon",
        "path": "/products"
      },
      {
        "content": "Stock",
        "Icon": "WarehouseIcon",
        "path": "/stock"
      },
      {
        "content": "Inventory Movements",
        "Icon": "SwapVertIcon",
        "path": "/inventory-movement"
      }
    ]
  },
  {
    "id": "sales",
    "label": "Sales",
    "icon": "AssessmentIcon",
    "items": [
      {
        "content": "Quotations",
        "Icon": "RequestQuoteIcon",
        "path": "/quotations"
      },
      {
        "content": "Sales Orders",
        "Icon": "ShoppingCartIcon",
        "path": "/sales-orders"
      },
      {
        "content": "Invoices",
        "Icon": "ReceiptIcon",
        "path": "/invoices"
      }
    ]
  },
  {
    "id": "finance",
    "label": "Finance",
    "icon": "TreasuryIcon",
    "items": [
      {
        "content": "Banks",
        "Icon": "AccountBalanceIcon",
        "path": "/banks"
      },
      {
        "content": "Currency",
        "Icon": "AttachMoneyIcon",
        "path": "/currency"
      },
      {
        "content": "Ledger",
        "Icon": "MenuBookIcon",
        "path": "/ledger"
      }
    ]
  }
]

const Sidebar = () => {
  const pathname = usePathname();
  // State to track which section is currently "pinned" open
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const handleIconClick = (id: string) => {
    // If clicking the same icon, close it. Otherwise, open the new one.
    setOpenSectionId(openSectionId === id ? null : id);
  };

  const currentSection = MENU_SECTIONS.find(s => s.id === openSectionId);

  return (
    <div className="inset-y-0 left-0 z-50 flex">
      {/* STAGE 1: The Icon Wall */}
      <aside
        className="w-16 h-screen flex flex-col bg-white border-r-4 shadow-xl z-20"
        style={{ borderColor: "var(--color-secondary-mid)" }}
      >
        <Link href="/Dashboard">
          <div className="flex justify-center py-6 border-b border-gray-100 cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-[var(--color-secondary-mid)]">
              B
            </div>
          </div>
        </Link>

        <nav className="flex-1 flex flex-col items-start py-4">
          {MENU_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = pathname.startsWith(section.path);
            const isOpen = openSectionId === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => handleIconClick(section.id)}
                className={`w-full h-14 flex items-center justify-center transition-all relative
                  ${isOpen ? 'bg-[var(--color-secondary-super-light)] text-[var(--color-secondary-mid)]' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {/* Active Indicator Bar */}
                <div className={`w-1 flex h-8 rounded-r-full absolute left-0 transition-all 
                  ${isActive ? 'bg-[var(--color-secondary-mid)]' : 'bg-transparent'}`} 
                />
                
                <Icon fontSize="medium" />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* STAGE 2: The Expanding Items Panel */}
      <div
        className={`h-screen bg-white shadow-2xl border-r transition-all duration-300 ease-in-out overflow-hidden no-scrollbar
          ${openSectionId ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        style={{ borderColor: "var(--color-secondary-light)" }}
      >
        {currentSection && (
          <div className="w-64 p-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                {currentSection.label}
              </h2>
              {/* Optional: X button to close */}
              <button 
                onClick={() => setOpenSectionId(null)}
                className="text-gray-300 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {currentSection.items.map((item) => {
                const ItemIcon = item.Icon;
                const isItemActive = pathname === item.path;

                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                      ${isItemActive 
                        ? 'bg-[var(--color-secondary-mid)] text-white font-semibold shadow-md' 
                        : 'text-gray-600 hover:bg-[var(--color-secondary-super-light)] hover:text-[var(--color-secondary-mid)]'}`}>
                      <ItemIcon fontSize="small" className={isItemActive ? 'text-white' : 'opacity-70'} />
                      <span className="text-sm">{item.content}</span>
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