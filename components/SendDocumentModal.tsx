"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Send, Mail, CheckCircle2, UserPlus, Star } from "lucide-react";
import { ThirdPartyContactsService } from "@/src/src2/api";
import type { ThirdPartyContactResponse } from "@/src/src2/api/models/ThirdPartyContactResponse";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  thirdPartyId: string | undefined;
  docLabel: string | undefined;
  onClose: (sent: boolean) => void;
  onSend: (contactEmail: string, contactName: string) => Promise<void>;
}

const displayName = (c: ThirdPartyContactResponse) =>
  [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || "Unnamed contact";

const SendDocumentModal = ({ isOpen, thirdPartyId, docLabel, onClose, onSend }: Props) => {
  const [contacts, setContacts] = useState<ThirdPartyContactResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const loadContacts = () => {
    if (!thirdPartyId) return;
    setIsLoading(true);
    ThirdPartyContactsService.getThirdPartyContacts(thirdPartyId)
      .then((res) => {
        setContacts(res);
        const favorite = res.find((c) => c.favorite);
        setSelectedContactId((favorite ?? res[0])?.id);
      })
      .catch(() => toast.error("Failed to load contacts."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    setSelectedContactId(undefined);
    setShowAddForm(false);
    setNewFirstName("");
    setNewLastName("");
    setNewEmail("");
    loadContacts();
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, thirdPartyId]);

  const handleAddContact = async () => {
    if (!thirdPartyId || !newEmail.trim()) return;
    setIsAdding(true);
    try {
      const created = await ThirdPartyContactsService.addThirdPartyContact(thirdPartyId, {
        firstName: newFirstName.trim() || undefined,
        lastName: newLastName.trim() || undefined,
        email: newEmail.trim(),
        favorite: contacts.length === 0,
      });
      toast.success("Contact added.");
      setContacts((prev) => [...prev, created]);
      setSelectedContactId(created.id);
      setShowAddForm(false);
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
    } catch {
      toast.error("Failed to add contact. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSend = async () => {
    const contact = contacts.find((c) => c.id === selectedContactId);
    if (!contact?.email) return;
    setIsSending(true);
    try {
      await onSend(contact.email, displayName(contact));
      toast.success(`${docLabel || "Document"} shared with ${displayName(contact)}.`);
      onClose(true);
    } catch (err) {
      console.error("Failed to send document:", err);
      toast.error("Failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-stretch">
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Send Document</h2>
              <p className="text-xs text-gray-400 font-bold">{docLabel}</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Choose A Contact
              </label>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-secondary-mid hover:text-secondary transition-colors"
              >
                <UserPlus size={13} /> {showAddForm ? "Cancel" : "Add New"}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
                    placeholder="First name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
                    placeholder="Last name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                  />
                </div>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid transition-all outline-none"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  onClick={handleAddContact}
                  disabled={isAdding || !newEmail.trim()}
                  className="w-full bg-secondary-mid hover:bg-secondary text-white py-2 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50 transition-all"
                >
                  {isAdding ? "Adding…" : "Save Contact"}
                </button>
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {isLoading ? (
                <p className="text-sm text-gray-400 font-medium p-6 text-center">Loading contacts…</p>
              ) : contacts.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium p-6 text-center">
                  No contacts on file yet — add one above.
                </p>
              ) : (
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {contacts.map((contact) => {
                    const isSelected = selectedContactId === contact.id;
                    return (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContactId(contact.id)}
                        className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                          isSelected ? "bg-secondary-super-light" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          {contact.favorite && <Star size={13} className="text-amber-400 fill-amber-400 shrink-0" />}
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-gray-700 truncate block">{displayName(contact)}</span>
                            <span className="text-[11px] text-gray-400 font-medium truncate block">{contact.email}</span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={18} className="text-secondary-mid shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end items-center gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !selectedContactId}
            className="flex items-center gap-2 bg-secondary-mid hover:bg-secondary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
          >
            <Send size={18} />
            {isSending ? "SENDING…" : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendDocumentModal;
