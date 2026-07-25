'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  PersonOutline, // Changed from EmailOutlined
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LoginOutlined
} from "@mui/icons-material";
import { ApiError, AuthService } from '@/src/src2/api';
import { KernelOrganizationResponse } from '@/src/src2/api/models/KernelOrganizationResponse';
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
  const router=useRouter()

  useEffect(() => {
    if (getStoredSeller()?.accessToken) {
      router.replace('/dashboard');
    }
  }, [router]);

  const completeLogin = (data: SellerAuthResponse) => {
    const sellerData = mapAuthToUpdatedSeller(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await AuthService.login({
        username: formData.username,
        password: formData.password,
      });

      // The account belongs to more than one Kernel organization — Billing
      // can't guess which one, so show a picker instead of storing a mostly-
      // empty session.
      if (data.requiresOrganizationSelection) {
        setOrgOptions(data.availableOrganizations ?? []);
        return;
      }

      completeLogin(data);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
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
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
      setOrgOptions(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
  const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";

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

export default LoginForm;