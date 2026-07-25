"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, PlayCircle, TimerOff } from "lucide-react";
import { useSellerSession } from "@/src/hooks/useSellerSession";
import { SessionResponse } from "@/src/src2/api";

const formatCountdown = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

/** Ticks a seconds value down once per second between the hook's ~20s polls, so the countdown reads as live rather than jumping in 20s steps. */
function useLiveCountdown(seconds: number | null): number | null {
  const [display, setDisplay] = useState(seconds);
  const ref = useRef(seconds);

  useEffect(() => {
    ref.current = seconds;
    setDisplay(seconds);
  }, [seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current == null || ref.current <= 0) return;
      ref.current -= 1;
      setDisplay(ref.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return display;
}

/**
 * Shows a seller (non-owner/agency-manager) their sales session state at a
 * glance: counting down to a scheduled start, counting down to the end of an
 * active session, or that access is currently blocked (no session / it's
 * over). Owners and agency managers never have a session to show, so this
 * renders nothing for them.
 */
const SessionStatusBadge = () => {
  const { session, secondsToStart, secondsToEnd, canEdit, isChecking } = useSellerSession();
  const liveSecondsToStart = useLiveCountdown(secondsToStart);
  const liveSecondsToEnd = useLiveCountdown(secondsToEnd);

  if (isChecking || !session) return null;

  if (session.status === SessionResponse.status.PENDING && liveSecondsToStart != null) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 rounded-full">
        <Clock size={13} />
        <span>Session starts in {formatCountdown(liveSecondsToStart)}</span>
      </div>
    );
  }

  if (canEdit && liveSecondsToEnd != null) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 rounded-full">
        <PlayCircle size={13} />
        <span>Session ends in {formatCountdown(liveSecondsToEnd)}</span>
      </div>
    );
  }

  if (canEdit) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 rounded-full">
        <PlayCircle size={13} />
        <span>Session active</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-200/60 rounded-full">
      <TimerOff size={13} />
      <span>Session ended</span>
    </div>
  );
};

export default SessionStatusBadge;
