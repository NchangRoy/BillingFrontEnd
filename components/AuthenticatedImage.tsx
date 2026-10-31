"use client";

import React, { useEffect, useState } from "react";
import { getStoredSeller } from "@/src/api/session";

interface Props {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

/**
 * /api/media/files/{fileId} requires a real bearer token — Kernel 403s anonymous
 * reads — but a plain <img src> can never attach one (and putting the token in
 * the URL as a query param leaks it via browser history/server logs). Fetches
 * the bytes with proper headers instead and renders the result as a blob URL.
 * Only kicks in for Billing's own media-proxy URLs; anything else (a raw Kernel
 * imageUri, a data: URL, a locally-created object URL) is rendered as-is.
 */
const AuthenticatedImage = ({ src, alt, className, style, fallback }: Props) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const isProtectedMediaUrl = !!src && src.includes("/api/media/files/");

  useEffect(() => {
    if (!isProtectedMediaUrl) {
      setBlobUrl(null);
      return;
    }
    setFailed(false);
    setBlobUrl(null);
    const seller = getStoredSeller();
    let objectUrl: string | null = null;
    let cancelled = false;

    fetch(src as string, {
      headers: {
        Authorization: `Bearer ${seller?.accessToken ?? ""}`,
        "X-Organization-ID": seller?.organizationId ?? "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, isProtectedMediaUrl]);

  if (!src || failed) return <>{fallback ?? null}</>;

  const resolvedSrc = isProtectedMediaUrl ? blobUrl : src;
  if (!resolvedSrc) return <>{fallback ?? null}</>;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolvedSrc} alt={alt} className={className} style={style} />;
};

export default AuthenticatedImage;
