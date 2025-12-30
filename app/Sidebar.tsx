"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Factory as FactoryIcon,
  ArrowDropDown as ArrowDown,
  PeopleAlt as PeopleAltIcon,
  Inventory2 as Inventory2Icon,
  Warehouse as WarehouseIcon,
  SwapVert as SwapVertIcon,
  RequestQuote as RequestQuoteIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Receipt as ReceiptIcon,
  AssignmentReturn as AssignmentReturnIcon,
  ShoppingBag as ShoppingBagIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  BarChart as BarChartIcon,
  Restore as RestoreIcon,
  AttachMoney as AttachMoneyIcon,
  Percent as PercentIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  AccountBalanceWallet as TreasuryIcon
} from "@mui/icons-material";

import SideBarComponent from "./SideBarComponent";

// 1. Data Configuration for easy maintenance
const MENU_SECTIONS = [
  {
    id: "customers",
    label: "Customers & Suppliers",
    icon: GroupIcon,
    items: [
      { content: "Customers", Icon: PeopleAltIcon, path: "/customers" },
      { content: "Suppliers", Icon: FactoryIcon, path: "/suppliers" },
    ],
  },
  {
    id: "products",
    label: "Products & Inventory",
    icon: StoreIcon,
    items: [
      { content: "Products", Icon: Inventory2Icon, path: "/products" },
      { content: "Stock", Icon: WarehouseIcon, path: "/stock" },
      { content: "Inventory Movements", Icon: SwapVertIcon, path: "/inventory-movement" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: AssessmentIcon,
    items: [
      { content: "Quotations", Icon: RequestQuoteIcon, path: "/quotations" },
      { content: "Sales Orders", Icon: ShoppingCartIcon, path: "/sales-orders" },
      { content: "Delivery Notes", Icon: LocalShippingIcon, path: "/delivery-notes" },
      { content: "Invoices", Icon: ReceiptIcon, path: "/invoices" },
      { content: "Credit Notes", Icon: AssignmentReturnIcon, path: "/credit-notes" },
    ],
  },
  {
    id: "purchasing",
    label: "Purchasing",
    icon: ShoppingBagIcon,
    items: [
      { content: "Purchase Orders", Icon: ShoppingBagIcon, path: "/purchase-orders" },
      { content: "Payments", Icon: PaymentIcon, path: "/payments" },
    ],
  },
  {
    id: "finance",
    label: "Treasury & Finance",
    icon: TreasuryIcon,
    items: [
      { content: "Banks", Icon: AccountBalanceIcon, path: "/banks" },
      { content: "Treasury Plan", Icon: BarChartIcon, path: "/treasury-plan" },
      { content: "Reimbursements", Icon: RestoreIcon, path: "/reimbursements" },
      { content: "Currency", Icon: AttachMoneyIcon, path: "/currency" },
      { content: "Taxes", Icon: PercentIcon, path: "/taxes" },
      { content: "Ledger", Icon: MenuBookIcon, path: "/ledger" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  // Store the currently open section ID (null if all closed)
  const [activeSection, setActiveSection] = useState<string | null>("sales");

  const toggle = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <aside
      className="w-64 h-screen flex flex-col shadow-2xl z-50 transition-colors"
      style={{ backgroundColor: "var(--color-secondary-super-light)", color: "var(--color-secondary)" }}
    >
      {/* Header / Logo Section */}  
      <Link href="/Dashboard">
      <div
        className="flex gap-3 p-6 justify-start items-center border-b"
        style={{ borderColor: "var(--color-secondary-light)" }}
      >
     
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm"
          style={{ backgroundColor: "var(--color-secondary-mid)", color: "white" }}
        >
          B
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none">Billing</span>
          <span className="text-[10px] uppercase tracking-widest opacity-60">Enterprise ERP</span>
        </div>
      </div>
    </Link>
      {/* Navigation Body */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {MENU_SECTIONS.map((section) => {
          const isOpen = activeSection === section.id;
          const ParentIcon = section.icon;

          return (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isOpen ? 'bg-white shadow-sm font-bold' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-3">
                  <ParentIcon 
                    fontSize="small" 
                    className={`${isOpen ? 'text-[var(--color-secondary-mid)]' : 'opacity-50 group-hover:opacity-100'}`} 
                  />
                  <span className="text-sm tracking-tight">{section.label}</span>
                </div>
                <ArrowDown
                  fontSize="small"
                  className={`transition-transform duration-300 opacity-40 ${isOpen ? "rotate-180 opacity-100" : ""}`}
                />
              </button>

              {/* Submenu with Animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out px-2
                  ${isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
              >
                <div className="border-l-2 ml-4 pl-2 space-y-1 border-[var(--color-secondary-light)]">
                  {section.items.map((item) => (
                    <SideBarComponent
                      key={item.path}
                      content={item.content}
                      Icon={item.Icon}
                      path={item.path}
                      isActive={pathname === item.path}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile Placeholder */}
      <div className="p-4 border-t border-[var(--color-secondary-light)] bg-white/30 text-xs text-center opacity-50">
        v2.4.0-release
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: var(--color-secondary-light); 
          border-radius: 10px; 
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;