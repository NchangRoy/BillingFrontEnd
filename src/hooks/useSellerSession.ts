'use client';

import { useEffect, useRef, useState } from 'react';
import { SessionsService, SessionResponse } from '@/src/src2/api';
import { getStoredSeller } from '@/src/api/session';
import { SellerRole } from '@/src/api/models/UpdatedSellerResponse';

const POLL_INTERVAL_MS = 20_000;

// Kernel's session startTime/endTime are naive (no offset) strings that are
// actually UTC wall-clock values — see CreateSessionModal's
// toServerUtcNaive for the write-side half of this. Parsed as-is, JS would
// read them as local time instead and every comparison here would be off by
// the browser's UTC offset.
const parseServerUtcNaive = (value: string): number =>
  new Date(value.endsWith('Z') ? value : `${value}Z`).getTime();

export type SellerSessionState = {
  canEdit: boolean;
  isChecking: boolean;
  // The seller's current SALES session (PENDING or OPEN), if any. Null for
  // owners/agency managers (they don't need one) or if the seller has none.
  session: SessionResponse | null;
  secondsToStart: number | null;
  secondsToEnd: number | null;
};

const IDLE_STATE: SellerSessionState = {
  canEdit: true,
  isChecking: false,
  session: null,
  secondsToStart: null,
  secondsToEnd: null,
};

/**
 * Owners and agency managers always have full document access. A seller or
 * POS seller only gets it while they have an active (OPEN) SALES session that
 * hasn't reached its scheduled end time — otherwise they're restricted to
 * viewing whatever documents they already have permission on.
 *
 * Kernel's own session model has no background job that flips a scheduled
 * (PENDING) session to OPEN once its start time arrives — that transition
 * only happens via an explicit POST .../start call (see
 * SessionService.start in billing-sales-core). So this polls periodically
 * and fires that call itself the moment the scheduled time is reached,
 * giving the "it should automatically start" behavior without needing a
 * server-side scheduler.
 */
export function useSellerSession(): SellerSessionState {
  const [state, setState] = useState<SellerSessionState>({ ...IDLE_STATE, isChecking: true });
  const startingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller) {
      setState({ ...IDLE_STATE, canEdit: false, isChecking: false });
      return;
    }
    if (seller.role === SellerRole.OWNER || seller.role === SellerRole.AGENCY_MANAGER) {
      setState({ ...IDLE_STATE, isChecking: false });
      return;
    }
    if (!seller.Id) {
      setState({ ...IDLE_STATE, canEdit: false, isChecking: false });
      return;
    }

    let cancelled = false;

    const tick = async () => {
      try {
        const sessions = await SessionsService.getAll(undefined, seller.Id);
        if (cancelled) return;

        const rank = (s: SessionResponse) => (s.status === SessionResponse.status.OPEN ? 0 : 1);
        const relevant = sessions
          .filter((s) => s.type === SessionResponse.type.SALES
            && (s.status === SessionResponse.status.OPEN || s.status === SessionResponse.status.PENDING))
          .sort((a, b) => rank(a) - rank(b))[0] ?? null;

        if (!relevant) {
          setState({ ...IDLE_STATE, canEdit: false, isChecking: false });
          return;
        }

        const now = Date.now();

        // Scheduled time has arrived but Kernel hasn't been told to actually
        // start it yet — do that now, once per session id, then let the next
        // poll pick up the resulting OPEN status.
        if (relevant.status === SessionResponse.status.PENDING
            && relevant.startTime
            && parseServerUtcNaive(relevant.startTime) <= now
            && relevant.id
            && !startingRef.current.has(relevant.id)) {
          startingRef.current.add(relevant.id);
          try {
            await SessionsService.start(relevant.id);
          } catch {
            // Someone else may have started it already, or it's not actually
            // eligible yet (clock skew) — next poll will reconcile either way.
          }
          if (!cancelled) await tick();
          return;
        }

        const isOpen = relevant.status === SessionResponse.status.OPEN;
        const pastEnd = !!relevant.endTime && parseServerUtcNaive(relevant.endTime) <= now;

        setState({
          canEdit: isOpen && !pastEnd,
          isChecking: false,
          session: relevant,
          secondsToStart: relevant.startTime
            ? Math.max(0, Math.round((parseServerUtcNaive(relevant.startTime) - now) / 1000))
            : null,
          secondsToEnd: relevant.endTime
            ? Math.max(0, Math.round((parseServerUtcNaive(relevant.endTime) - now) / 1000))
            : null,
        });
      } catch {
        if (!cancelled) setState({ ...IDLE_STATE, canEdit: false, isChecking: false });
      }
    };

    tick();
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return state;
}
