'use client';

import { useSellerSession } from '@/src/hooks/useSellerSession';

/**
 * Thin wrapper kept for the existing call sites (every document list page) —
 * see useSellerSession for the actual session polling/auto-start/countdown
 * logic this now delegates to.
 */
export function useCanEditDocuments(): { canEdit: boolean; isChecking: boolean } {
  const { canEdit, isChecking } = useSellerSession();
  return { canEdit, isChecking };
}
