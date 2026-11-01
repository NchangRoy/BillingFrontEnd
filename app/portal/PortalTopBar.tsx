"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, Building2 } from "lucide-react";
import { getPortalSession, clearPortalSession, PortalSession } from "@/src/api/portalSession";

const PortalTopBar = () => {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setSession(getPortalSession());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearPortalSession();
    router.replace("/portal/login");
  };

  const orgs = session?.organizations || [];
  const primaryOrgName = orgs[0]?.organizationName;
  const initials = (session?.name || session?.email || "?").slice(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      {/* Left: Org context */}
      <div className="flex items-center gap-2">
        <Building2 size={14} className="text-secondary-mid" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {primaryOrgName || "Partner Portal"}
        </span>
        {orgs.length > 1 && (
          <span className="px-2 py-0.5 text-[9px] font-black text-secondary-mid bg-secondary-mid/10 rounded-full">
            +{orgs.length - 1} more
          </span>
        )}
      </div>

      {/* Right: Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center gap-2.5 p-1 rounded-full transition-all border ${
            isProfileOpen
              ? "bg-white border-secondary-mid shadow-lg ring-4 ring-secondary-mid/5"
              : "bg-transparent border-transparent hover:bg-gray-100"
          }`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-tr from-primary to-secondary-mid shadow-sm">
            {initials}
          </div>
          <div className="hidden pr-2 text-left sm:block">
            <p className="text-xs font-black tracking-tight text-gray-700">{session?.name || "—"}</p>
            <p className="text-[9px] font-bold text-gray-400 truncate max-w-[10rem]">{session?.email}</p>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200">
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
              <p className="text-sm font-black text-gray-800 line-clamp-1">{session?.name}</p>
              <p className="text-[10px] font-medium text-gray-400 truncate mt-1">{session?.email}</p>
            </div>
            <div className="p-2">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-black text-red-500 transition-all rounded-xl hover:bg-red-50 active:scale-[0.98]">
                <div className="p-1.5 bg-red-100 rounded-lg"><LogOut size={16} /></div>
                Logout Session
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PortalTopBar;
