"use client";

import React, { useState, useRef, useEffect } from "react";
import ProfileIcon from "@mui/icons-material/Person";
import NotificationHeaderIcon from "./NotificationHeaderIcon";
import Link from "next/link";
import { SearchIcon, MenuIcon, SettingsIcon, LogOut, User, ShieldCheck, MapPin, Store } from "lucide-react";
import { UpdatedSellerResponse } from "@/src/api/models/UpdatedSellerResponse";

interface Props {
  name: string;
  signedIn: boolean;
}

const Navbar = ({ name, signedIn }: Props) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [seller, setSeller] = useState<UpdatedSellerResponse | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load seller data safely on mount
    const stored = localStorage.getItem("seller");
    if (stored) {
      try {
        setSeller(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse seller data", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-secondary-gray flex justify-between items-center py-3 px-6 bg-secondary-background relative border-b border-gray-100">
      {/* Left: Logo & Menu */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <MenuIcon className="text-gray-400 cursor-pointer hover:text-[var(--color-secondary)] transition-colors" />
          <div className="text-2xl font-bold font-serif text-[var(--color-primary)]">{name}</div>
        </div>

        {/* Agency & Sale Point Display */}
        {signedIn && seller && (
          <div className="hidden md:flex items-center gap-3 px-4 py-1 bg-gray-50 rounded-full border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <MapPin size={14} className="text-[var(--color-secondary)]" />
              <span className="uppercase tracking-wider">{seller.agency}</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Store size={14} className="text-[var(--color-primary)]" />
              <span>{seller.salePoint}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      {!signedIn ? (
        <div className="flex gap-3 items-center">
          <div className="cursor-pointer hover:text-[var(--color-secondary)] text-sm">Sign In</div>
          <div className="py-2 px-4 rounded-lg text-sm font-semibold bg-[var(--color-secondary)] text-white">
            Try it free
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2 items-center bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl focus-within:border-[var(--color-secondary-mid)] transition-all mr-2">
            <SearchIcon size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent outline-none text-xs w-40" 
            />
          </div>

          <NotificationHeaderIcon Icon={SettingsIcon} path="/settings" />
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all ${
                isProfileOpen ? "bg-gray-100 ring-1 ring-gray-200" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                {seller?.username?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[10px] leading-none text-gray-400 font-bold uppercase tracking-tighter">Seller</p>
                <p className="text-xs font-bold text-gray-700">{seller?.username || "Account"}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-800">{seller?.username}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">{seller?.agency} • {seller?.salePoint}</p>
                </div>
                
                <div className="p-1">
                  <Link href="profile" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <User size={16} /> My Profile
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <ShieldCheck size={16} /> Permissions ({seller?.Permissions.length})
                  </div>
                </div>

                <div className="p-1 border-t border-gray-50 mt-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;