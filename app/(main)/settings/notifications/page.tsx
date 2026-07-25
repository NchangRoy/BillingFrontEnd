"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, MessageCircle, Mail, ChevronRight, MoreVertical,
  UserPlus, Ban, Trash2, CheckCircle2, Clock, ShieldOff,
} from "lucide-react";
import { NotificationsService, ContactResponse } from "@/src/src2/api";
import { toast } from "sonner";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import ActionButton from "@/components/ActionButton";
import AddContactModal from "./AddContactModal";

const COLUMNS = ["Contact", "Status", "Telegram", "Added", ""];

const STATUS_STYLES: Record<string, { icon: React.ElementType; className: string; label: string }> = {
  ACTIVE: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Active" },
  PENDING: { icon: Clock, className: "bg-amber-50 text-amber-600 border-amber-200", label: "Pending" },
  BLOCKED_BY_ADMIN: { icon: ShieldOff, className: "bg-red-50 text-red-500 border-red-200", label: "Blocked" },
  BLOCKED_BY_USER: { icon: ShieldOff, className: "bg-red-50 text-red-500 border-red-200", label: "Blocked by user" },
};

const NotificationContactsPage = () => {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await NotificationsService.listContacts();
      setContacts(res);
    } catch (error) {
      console.error("Error fetching notification contacts:", error);
      toast.error("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddModalClose = (added: boolean) => {
    setIsAddModalOpen(false);
    if (added) fetchContacts();
  };

  const handleBlock = async (contact: ContactResponse) => {
    if (!contact.id) return;
    setActiveMenuId(null);
    setMutatingId(contact.id);
    try {
      await NotificationsService.blockContact(contact.id);
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, status: ContactResponse.status.BLOCKED_BY_ADMIN } : c)));
      toast.success(`${contact.name} will no longer receive notifications.`);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to block contact. Please try again.");
    } finally {
      setMutatingId(null);
    }
  };

  const handleRemove = async (contact: ContactResponse) => {
    if (!contact.id) return;
    if (!window.confirm(`Remove ${contact.name} from notification contacts? This can't be undone.`)) return;
    setActiveMenuId(null);
    setMutatingId(contact.id);
    try {
      await NotificationsService.removeContact(contact.id);
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
      toast.success(`${contact.name} was removed.`);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to remove contact. Please try again.");
    } finally {
      setMutatingId(null);
    }
  };

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) => [c.name, c.email].some((v) => v?.toLowerCase().includes(term)));
  }, [contacts, search]);

  const activeCount = useMemo(() => contacts.filter((c) => c.status === ContactResponse.status.ACTIVE).length, [contacts]);
  const blockedCount = useMemo(
    () => contacts.filter((c) => c.status === ContactResponse.status.BLOCKED_BY_ADMIN || c.status === ContactResponse.status.BLOCKED_BY_USER).length,
    [contacts]
  );

  return (
    <div className="p-8 bg-secondary-background min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-secondary-gray mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
            <ChevronRight size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-mid">Notification Contacts</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Notification Contacts</h1>
          <p className="text-secondary-gray text-sm font-medium">
            People notified over Telegram whenever new invoices come in.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <MessageCircle size={16} className="text-secondary-mid" />
            <span className="text-xs font-black text-primary">{contacts.length}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Contacts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-xs font-black text-primary">{activeCount}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-light rounded-xl shadow-sm">
            <ShieldOff size={16} className="text-red-500" />
            <span className="text-xs font-black text-primary">{blockedCount}</span>
            <span className="text-[10px] font-bold text-secondary-gray uppercase tracking-widest">Blocked</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-secondary-mid text-secondary-mid px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-mid hover:text-white transition-all duration-300 shadow-sm"
          >
            <UserPlus size={16} /> Add Contact
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-light mb-6">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray group-focus-within:text-secondary-mid transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary-background border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-secondary-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-super-light/30 border-b border-secondary-light">
                {COLUMNS.map((col) => (
                  <th key={col} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-gray whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableSkeleton cols={COLUMNS.length - 1} />
              ) : filteredContacts.length === 0 ? (
                <EmptyState title="No contacts yet" message="Add a contact to start sending them Telegram notifications." />
              ) : (
                filteredContacts.map((contact) => {
                  const statusMeta = STATUS_STYLES[contact.status ?? ""] ?? STATUS_STYLES.PENDING;
                  const StatusIcon = statusMeta.icon;
                  const isBlocked = contact.status === ContactResponse.status.BLOCKED_BY_ADMIN || contact.status === ContactResponse.status.BLOCKED_BY_USER;
                  const isMutating = mutatingId === contact.id;
                  return (
                    <tr key={contact.id} className="hover:bg-secondary-super-light/40 transition-all group border-l-4 border-l-transparent hover:border-l-secondary-mid">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-primary group-hover:text-secondary-mid transition-colors">{contact.name}</span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-secondary-gray">
                            <Mail size={11} className="text-secondary-mid" /> {contact.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-1.5 px-3 py-1 w-fit border rounded-lg text-[10px] font-black uppercase tracking-widest ${statusMeta.className}`}>
                          <StatusIcon size={11} /> {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {contact.linked ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 w-fit bg-secondary-super-light text-secondary-mid rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <MessageCircle size={11} /> Linked
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-secondary-gray">Awaiting link</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-bold text-secondary-gray">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === contact.id ? null : (contact.id ?? null))}
                          disabled={isMutating}
                          className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-40"
                        >
                          {isMutating ? (
                            <span className="block h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MoreVertical size={18} />
                          )}
                        </button>

                        {activeMenuId === contact.id && (
                          <div ref={menuRef} className="absolute right-16 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                            {!isBlocked && (
                              <ActionButton
                                label="Block"
                                onClick={() => handleBlock(contact)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-amber-600"
                              >
                                <Ban size={14} />
                              </ActionButton>
                            )}
                            <ActionButton
                              label="Remove"
                              onClick={() => handleRemove(contact)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-red-600"
                            >
                              <Trash2 size={14} />
                            </ActionButton>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddContactModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </div>
  );
};

export default NotificationContactsPage;
