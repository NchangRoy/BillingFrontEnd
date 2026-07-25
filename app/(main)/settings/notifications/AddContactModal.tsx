"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UserPlus } from "lucide-react";
import { NotificationsService } from "@/src/src2/api";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (added: boolean) => void;
}

const AddContactModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setIsSaving(true);
    try {
      await NotificationsService.addContact({ name: name.trim(), email: email.trim() });
      toast.success(`${name.trim()} was added — a Telegram invite link has been emailed to them.`);
      onClose(true);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to add contact. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose(false)} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-secondary uppercase">Add Contact</h2>
              <p className="text-xs text-gray-400">They&apos;ll get an email with a Telegram invite link.</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary-mid/20 focus:border-secondary-mid outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <UserPlus size={16} />
            {isSaving ? "Adding…" : "ADD CONTACT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
