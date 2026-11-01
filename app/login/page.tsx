'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  PersonOutline, // Changed from EmailOutlined
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LoginOutlined
} from "@mui/icons-material";
import { ApiError, AuthService } from '@/src/src2/api';
import { KernelOrganizationResponse } from '@/src/src2/api/models/KernelOrganizationResponse';
import { KernelDiscoveredContext } from '@/src/src2/api/models/KernelDiscoveredContext';
import { SellerAuthResponse } from '@/src/src2/api/models/SellerAuthResponse';
import { mapAuthToUpdatedSeller } from '@/src/Mappers/SellerAuthMapper';
import { getStoredSeller } from '@/src/api/session';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Changed from email
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the account belongs to more than one Kernel organization and
  // /api/auth/login came back asking which one to use — the frontend must
  // show a picker and resubmit the same credentials with the chosen org id.
  const [orgOptions, setOrgOptions] = useState<KernelOrganizationResponse[] | null>(null);
  // Set when the account has contexts under more than one Kernel tenant —
  // resubmit the same credentials with the chosen tenantId.
  const [tenantOptions, setTenantOptions] = useState<KernelDiscoveredContext[] | null>(null);
  // Set when Kernel replied mfaRequired=true — it already emailed a one-time
  // code tied to this mfaToken; confirm it via /api/auth/login/mfa.
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaChannel, setMfaChannel] = useState<string | undefined>(undefined);
  const [mfaCode, setMfaCode] = useState('');
  // Tracks which specific tenant/org button was clicked, purely so that
  // button can show visual feedback — the ~1-1.5s Kernel round trip behind
  // it otherwise looks identical to nothing happening, which was prompting
  // a reflexive second click.
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const router=useRouter()
  const searchParams = useSearchParams();

  useEffect(() => {
    if (getStoredSeller()?.accessToken) {
      router.replace('/dashboard');
    }
  }, [router]);

  // Landed here via the generated API client's auto-logout (request.ts,
  // catchErrorCodes) after a 401 from an expired Kernel token.
  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      toast.error('Your session has expired. Please sign in again.');
    }
    if (searchParams.get('subscribed') === '1') {
      toast.success('Your free trial is ready — sign in to get started.');
    }
  }, [searchParams]);

  const completeLogin = async (data: SellerAuthResponse) => {
    const sellerData = mapAuthToUpdatedSeller(data);

    // uiPermissions now comes straight from the login response — it's read
    // from Billing's own local store (no Kernel round-trip, no missing
    // token/org-id problem), and already carries the owner's full-access
    // override. Re-fetching via getUiPermissions here would overwrite that
    // with the admin-endpoint's un-overridden value, so don't.
    localStorage.setItem("seller", JSON.stringify(sellerData));

    // Pré-charger les données de référence pour le mode hors ligne
    import('@/src/offline/sync/referenceSync').then(({ syncReferenceData }) => {
      syncReferenceData().catch(console.error);
    });

    if (sellerData.mustChangePassword) {
      // Carried over so the forced password-change screen doesn't have to
      // ask for the email/temporary password the user just typed in here.
      sessionStorage.setItem("pendingPasswordChange", JSON.stringify({
        email: formData.username,
        currentPassword: formData.password,
      }));
      router.push("/change-password");
    } else {
      router.push("/dashboard");
    }
  };

  /**
   * Shared next-step router for every point this flow can resolve to: a
   * multi-tenant account needs a tenant picked first, then Kernel may still
   * demand an emailed OTP, then (rarer, but possible even after either of
   * those) a multi-org account needs an org picked — only once none of those
   * apply is there an actual completed session to store.
   */
  const handleAuthResult = async (data: SellerAuthResponse) => {
    if (data.requiresTenantSelection) {
      setTenantOptions(data.availableTenants ?? []);
      return;
    }
    if (data.mfaRequired) {
      setMfaToken(data.mfaToken ?? null);
      setMfaChannel(data.mfaChannel);
      return;
    }
    if (data.requiresOrganizationSelection) {
      setOrgOptions(data.availableOrganizations ?? []);
      return;
    }
    await completeLogin(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await AuthService.login1({
        username: formData.username,
        password: formData.password,
      });
      await handleAuthResult(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTenant = async (tenantId: string) => {
    setError(null);
    setIsSubmitting(true);
    setSelectingId(tenantId);
    try {
      const data = await AuthService.login1({
        username: formData.username,
        password: formData.password,
        tenantId,
      });
      await handleAuthResult(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
      setTenantOptions(null);
    } finally {
      setIsSubmitting(false);
      setSelectingId(null);
    }
  };

  const handleSelectOrganization = async (organizationId: string) => {
    setError(null);
    setIsSubmitting(true);
    setSelectingId(organizationId);
    try {
      const data = await AuthService.login1({
        username: formData.username,
        password: formData.password,
        organizationId,
      });
      await completeLogin(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
      setOrgOptions(null);
    } finally {
      setIsSubmitting(false);
      setSelectingId(null);
    }
  };

  const handleConfirmMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaToken) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await AuthService.confirmMfa({
        mfaToken,
        code: mfaCode,
        tryOut: false,
      });
      await handleAuthResult(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Invalid or expired code';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToCredentials = () => {
    setTenantOptions(null);
    setOrgOptions(null);
    setMfaToken(null);
    setMfaChannel(undefined);
    setMfaCode('');
    setSelectingId(null);
    setError(null);
  };

  const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
  const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";

  if (tenantOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Choose a workspace</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">This account belongs to more than one workspace</p>
          </div>

          <div className="p-8 pt-4 space-y-3">
            {tenantOptions.map((tenant) => (
              <button
                key={tenant.tenantId}
                type="button"
                disabled={isSubmitting}
                onClick={() => tenant.tenantId && handleSelectTenant(tenant.tenantId)}
                className="w-full flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 hover:border-secondary-mid hover:bg-white px-4 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <span className="text-sm font-bold text-gray-700">
                  {tenant.label || tenant.organizations?.[0]?.displayName || tenant.tenantId}
                </span>
                {selectingId === tenant.tenantId && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary-mid">Connecting…</span>
                )}
              </button>
            ))}

            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={resetToCredentials}
              className="w-full text-sm text-gray-400 font-medium hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mfaToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Enter verification code</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              A code was sent {mfaChannel === 'EMAIL' ? 'to your email' : 'via ' + (mfaChannel ?? 'your verification channel')}
            </p>
          </div>

          <form onSubmit={handleConfirmMfa} className="p-8 pt-4 space-y-5">
            <div className={inputWrapper}>
              <LockOutlined className="text-gray-400" fontSize="small" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="123456"
                className={`${inputStyle} tracking-[0.3em] text-center`}
                required
                autoFocus
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !mfaCode}
              className="w-full py-4 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/25 hover:bg-secondary-mid/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>

            <button
              type="button"
              onClick={resetToCredentials}
              className="w-full text-sm text-gray-400 font-medium hover:underline"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (orgOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Choose an organization</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">This account belongs to more than one organization</p>
          </div>

          <div className="p-8 pt-4 space-y-3">
            {orgOptions.map((org) => (
              <button
                key={org.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => org.id && handleSelectOrganization(org.id)}
                className="w-full flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 hover:border-secondary-mid hover:bg-white px-4 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-center gap-3">
                  {org.logoUri && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={org.logoUri} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <span className="text-sm font-bold text-gray-700">
                    {org.displayName || org.shortName || org.legalName}
                  </span>
                </div>
                {selectingId === org.id && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary-mid">Connecting…</span>
                )}
              </button>
            ))}

            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={resetToCredentials}
              className="w-full text-sm text-gray-400 font-medium hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

        {/* Branding Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-12 h-12 bg-secondary-mid rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary-mid/20">
            <LoginOutlined className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
            <div className={inputWrapper}>
              <PersonOutline className="text-gray-400" fontSize="small" />
              <input 
                type="text" 
                placeholder="johndoe123" 
                className={inputStyle}
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Password</label>
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
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-secondary-mid transition-colors"
              >
                {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 ml-1">
            <input 
              type="checkbox" 
              id="remember"
              className="w-4 h-4 rounded border-gray-300 text-secondary-mid focus:ring-secondary-mid cursor-pointer"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
            />
            <label htmlFor="remember" className="text-sm text-gray-500 font-medium cursor-pointer">Remember me</label>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/25 hover:bg-secondary-mid/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don't have an account? <a href="#" className="text-secondary-mid font-bold hover:underline">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}