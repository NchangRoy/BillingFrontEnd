"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Mail, MessageCircle, BellRing } from "lucide-react";
import { LiveNotificationsService, ContactResponse, LiveNotificationResponse } from "@/src/src2/api";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  channel: LiveNotificationResponse.channel;
  existingRule: LiveNotificationResponse | null;
  contacts: ContactResponse[];
  onClose: (saved: boolean) => void;
}

const CHANNEL_META: Record<LiveNotificationResponse.channel, { label: string; icon: React.ElementType; description: string }> = {
  [LiveNotificationResponse.channel.EMAIL]: {
    label: "Email",
    icon: Mail,
    description: "Batches new invoices into a single email every few minutes.",
  },
  [LiveNotificationResponse.channel.TELEGRAM]: {
    label: "Telegram",
    icon: MessageCircle,
    description: "Batches new invoices into a single Telegram message every few minutes.",
  },
};

const LiveNotificationRuleModal = ({ isOpen, channel, existingRule, contacts, onClose }: Props) => {
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  const isEditing = !!existingRule;

  useEffect(() => {
    if (isOpen) {
      setDelayMinutes(existingRule?.delayMinutes ?? 15);
      setSelectedContactIds(new Set(existingRule?.contactIds ?? []));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, existingRule]);

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContactIds.size === 0) {
      toast.error("Select at least one contact to notify.");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && existingRule?.id) {
        // Only the flush delay can be changed on an existing rule — contacts
        // are fixed at creation time (no backend route to edit them yet).
        await LiveNotificationsService.updateDelay(existingRule.id, { delayMinutes });
      } else {
        await LiveNotificationsService.create3({
          channel,
          delayMinutes,
          contactIds: Array.from(selectedContactIds),
          active: true,
        });
      }
      toast.success(`${meta.label} notifications ${isEditing ? "updated" : "turned on"}.`);
      onClose(true);
    } catch (error: any) {
      toast.error(error?.body?.message || "Failed to save notification rule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end items-stretch">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-super-light rounded-lg text-secondary-mid">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight">
                {isEditing ? `Edit ${meta.label} Notifications` : `Turn On ${meta.label} Notifications`}
              </h2>
              <p className="text-xs text-gray-400 font-bold">{meta.description}</p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Batch every (minutes)
            </label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200">
              <BellRing size={16} className="text-gray-400" />
              <input
                type="number"
                min={1}
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Math.max(1, Number(e.target.value)))}
                className="bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Notify
            </label>
            {isEditing && (
              <p className="text-[11px] text-gray-400 font-medium ml-1">
                Contacts are fixed when a rule is created — turn this off and back on to change them.
              </p>
            )}
            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 font-medium text-center">
                  No contacts yet — add one from the Contacts page first.
                </p>
              ) : (
                contacts.map((contact) => (
                  <label
                    key={contact.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isEditing ? "opacity-60 cursor-not-allowed" : "hover:bg-secondary-super-light/40"}`}
                  >
                    <input
                      type="checkbox"
                      disabled={isEditing}
                      checked={!!contact.id && selectedContactIds.has(contact.id)}
                      onChange={() => contact.id && toggleContact(contact.id)}
                      className="w-4 h-4 rounded border-gray-300 text-secondary-mid focus:ring-secondary-mid cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">{contact.name}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{contact.email}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-secondary-mid hover:bg-secondary text-white py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
          >
            <Icon size={16} />
            {isSaving ? "Saving…" : isEditing ? "SAVE CHANGES" : `TURN ON ${meta.label.toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveNotificationRuleModal;
