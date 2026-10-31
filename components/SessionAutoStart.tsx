"use client";

import { useSellerSession } from "@/src/hooks/useSellerSession";

/**
 * Mounted once in the main layout so the pending-session auto-start poll (see
 * useSellerSession) runs everywhere a seller is logged in — not just on the
 * handful of document pages that happened to call useCanEditDocuments.
 * Without this, a session scheduled to start stayed PENDING until the seller
 * navigated to one of those pages.
 */
export default function SessionAutoStart() {
  useSellerSession();
  return null;
}
