"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import {
  MailOutline,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  ApartmentOutlined,
} from "@mui/icons-material";
import { ApiError, AuthService } from "@/src/src2/api";
import { KernelOrganizationResponse } from "@/src/src2/api/models/KernelOrganizationResponse";
import { SellerAuthResponse } from "@/src/src2/api/models/SellerAuthResponse";
import { mapAuthToUpdatedSeller } from "@/src/Mappers/SellerAuthMapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Logo = () => (
  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white bg-gradient-to-br from-secondary-mid to-primary shadow-lg shadow-secondary-mid/25 mx-auto">
    KSM
  </div>
);

const AuthModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", rememberMe: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgOptions, setOrgOptions] = useState<KernelOrganizationResponse[] | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setTab("login");
    setFormData({ username: "", password: "", rememberMe: false });
    setError(null);
    setOrgOptions(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const completeLogin = (data: SellerAuthResponse) => {
    const sellerData = mapAuthToUpdatedSeller(data);
    localStorage.setItem("seller", JSON.stringify(sellerData));

    import("@/src/offline/sync/referenceSync").then(({ syncReferenceData }) => {
      syncReferenceData().catch(console.error);
    });

    if (sellerData.mustChangePassword) {
      sessionStorage.setItem(
        "pendingPasswordChange",
        JSON.stringify({ email: formData.username, currentPassword: formData.password })
      );
      router.push("/change-password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await AuthService.login({
        username: formData.username,
        password: formData.password,
      });

      if (data.requiresOrganizationSelection) {
        setOrgOptions(data.availableOrganizations ?? []);
        return;
      }

      completeLogin(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : "Authentication failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOrganization = async (organizationId: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await AuthService.login({
        username: formData.username,
        password: formData.password,
        organizationId,
      });
      completeLogin(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : "Authentication failed";
      setError(message);
      setOrgOptions(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapper =
    "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
  const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";
  const label = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 pb-4 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </button>
          <Logo />
          <p className="text-gray-500 text-sm mt-4 font-medium">Access your billing workspace</p>
        </div>

        {orgOptions ? (
          <div className="px-8 pb-8 space-y-3">
            <p className="text-sm font-bold text-gray-700 text-center mb-2">Choose an organization</p>
            {orgOptions.map((org) => (
              <button
                key={org.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => org.id && handleSelectOrganization(org.id)}
                className="w-full flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-secondary-mid hover:bg-white px-4 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                {org.logoUri && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.logoUri} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                )}
                <span className="text-sm font-bold text-gray-700">
                  {org.displayName || org.shortName || org.legalName}
                </span>
              </button>
            ))}
            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => { setOrgOptions(null); setError(null); }}
              className="w-full text-sm text-gray-400 font-medium hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="px-8">
              <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => { setTab("login"); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    tab === "login" ? "bg-white shadow-sm text-primary" : "text-gray-400"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab("signup"); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    tab === "signup" ? "bg-white shadow-sm text-primary" : "text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {tab === "login" ? (
              <form onSubmit={handleSubmit} className="p-8 pt-5 space-y-5">
                <div className="space-y-2">
                  <label className={label}>Username</label>
                  <div className={inputWrapper}>
                    <MailOutline className="text-gray-400" fontSize="small" />
                    <input
                      type="text"
                      placeholder="johndoe123"
                      className={inputStyle}
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className={label}>Password</label>
                    <a href="#" className="text-[10px] font-bold text-secondary-mid hover:underline">Forgot?</a>
                  </div>
                  <div className={inputWrapper}>
                    <LockOutlined className="text-gray-400" fontSize="small" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={inputStyle}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-secondary-mid transition-colors">
                      {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="checkbox"
                    id="remember-modal"
                    className="w-4 h-4 rounded border-gray-300 text-secondary-mid focus:ring-secondary-mid cursor-pointer"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  />
                  <label htmlFor="remember-modal" className="text-sm text-gray-500 font-medium cursor-pointer">Remember me</label>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/25 hover:bg-secondary-mid/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing in…" : "Sign In"}
                </button>
              </form>
            ) : (
              <div className="p-8 pt-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={label}>First name</label>
                    <div className={inputWrapper}>
                      <input className={inputStyle} placeholder="John" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={label}>Last name</label>
                    <div className={inputWrapper}>
                      <input className={inputStyle} placeholder="Doe" disabled />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={label}>Email</label>
                  <div className={inputWrapper}>
                    <MailOutline className="text-gray-400" fontSize="small" />
                    <input className={inputStyle} placeholder="you@example.com" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={label}>Organization code</label>
                  <div className={inputWrapper}>
                    <ApartmentOutlined className="text-gray-400" fontSize="small" />
                    <input className={inputStyle} placeholder="e.g. KSM-BILL-01" disabled />
                  </div>
                  <p className="text-xs text-gray-400 ml-1">
                    Given to you by your organization&apos;s admin — self-service sign-up isn&apos;t available yet.
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold text-sm cursor-not-allowed"
                >
                  Coming soon
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
