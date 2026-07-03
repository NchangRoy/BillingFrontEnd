"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSeller } from "@/src/api/session";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller?.accessToken) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-secondary-background">
        <div className="w-8 h-8 border-4 border-secondary-light border-t-secondary-mid rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
