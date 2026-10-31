'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PersonOutline,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  RocketLaunchOutlined,
  ArrowBackOutlined,
  ApartmentOutlined,
  CardGiftcardOutlined,
  CheckCircle
} from "@mui/icons-material";
import { ApiError, AuthService, KernelOrganizationResponse, SellerAuthResponse } from '@/src/src2/api';
import { getStoredSeller } from '@/src/api/session';

type Step = 'credentials' | 'plan' | 'org';

// Only FREE_TRIAL is wired up end-to-end right now — the other three are
// placeholders (per product direction) until real payment collection exists.
const PLANS: {
  id: string;
  eyebrow: string;
  title: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  functional: boolean;
  features: string[];
}[] = [
  {
    id: 'FREE_TRIAL',
    eyebrow: 'Get Started',
    title: 'Free Trial',
    price: '0 XAF',
    period: '/ 30 days',
    description: 'Full access, no payment required. The best way to try everything out.',
    cta: 'Try for Free',
    functional: true,
    features: [
      'Full platform access',
      '1 organization',
      'Up to 2 users',
      'No credit card required',
    ],
  },
  {
    id: 'STARTER',
    eyebrow: 'For Small Teams',
    title: 'Starter',
    price: '—',
    period: '',
    description: 'Coming soon.',
    cta: 'Coming Soon',
    functional: false,
    features: [
      'Everything in Free Trial',
      'Unlimited users',
      'Priority support',
    ],
  },
  {
    id: 'BUSINESS',
    eyebrow: 'For Growing Businesses',
    title: 'Business',
    price: '—',
    period: '',
    description: 'Coming soon.',
    cta: 'Coming Soon',
    functional: false,
    features: [
      'Everything in Starter',
      'OCR & auto-accounting',
      'Granular roles & permissions',
    ],
  },
  {
    id: 'ENTERPRISE',
    eyebrow: 'For Organizations',
    title: 'Enterprise',
    price: '—',
    period: '',
    description: 'Coming soon.',
    cta: 'Coming Soon',
    functional: false,
    features: [
      'Everything in Business',
      'Dedicated deployment',
      '24/7 SLA support',
    ],
  },
];

const TryOutForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('credentials');
  // Raw response from the first tryOut() call — carries either the resolved
  // single org (organizationId/organizationName) or, for an account on more
  // than one org, requiresOrganizationSelection + availableOrganizations.
  // Org selection (step 2) always shows next regardless of which case this
  // is — a single resolved org is still presented as a one-item list to
  // confirm, not auto-skipped.
  const [pendingAuth, setPendingAuth] = useState<SellerAuthResponse | null>(null);
  const [selectingOrgId, setSelectingOrgId] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    if (getStoredSeller()?.accessToken) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // This single call already runs Kernel's discover-contexts internally
      // (via authServicePort.tryOut) — its result just isn't acted on until
      // after the plan step, regardless of whether it resolved one org or
      // came back asking which of several to use.
      const data = await AuthService.tryOut({
        username: formData.username,
        password: formData.password,
      });
      if (data.mfaRequired) {
        setError('This account requires MFA, which Try Out doesn\'t support yet — sign in instead.');
        return;
      }
      setPendingAuth(data);
      setStep('plan');
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChoosePlan = (planId: string) => {
    if (planId !== 'FREE_TRIAL') return;
    setError(null);
    setStep('org');
  };

  const handleConfirmOrganization = async (organizationId?: string) => {
    if (!organizationId) return;
    setError(null);
    setSelectingOrgId(organizationId);
    try {
      const data = await AuthService.tryOut({
        username: formData.username,
        password: formData.password,
        organizationId,
        planType: 'FREE_TRIAL',
      });

      if (data.requiresOrganizationSelection) {
        // Shouldn't happen now that an explicit organizationId was sent, but
        // stay on this step with the refreshed list rather than crash.
        setPendingAuth(data);
        return;
      }

      // The subscription now exists for this org, and Kernel/Billing already
      // issued a session as a side effect of provisioning the owner seller —
      // but Try Out is meant to end at the sign-in page, not silently log the
      // user in. Don't persist that session; send them to Sign In instead.
      router.push("/login?subscribed=1");
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Authentication failed';
      setError(message);
    } finally {
      setSelectingOrgId(null);
    }
  };

  const organizationChoices: { id?: string; displayName?: string; shortName?: string; legalName?: string }[] =
    pendingAuth?.requiresOrganizationSelection
      ? (pendingAuth.availableOrganizations as KernelOrganizationResponse[] | undefined) ?? []
      : pendingAuth
        ? [{ id: pendingAuth.organizationId, displayName: pendingAuth.organizationName }]
        : [];

  const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
  const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";

  const cardWidth = step === 'plan' ? "max-w-5xl" : "max-w-md";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className={`w-full ${cardWidth} bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-300`}>

        {/* Branding Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-12 h-12 bg-secondary-mid rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary-mid/20">
            {step === 'org' ? <ApartmentOutlined className="text-white" /> : step === 'plan' ? <CardGiftcardOutlined className="text-white" /> : <RocketLaunchOutlined className="text-white" />}
          </div>
          {step === 'org' ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Choose an Organization</h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">Pick the organization to start your free trial on.</p>
            </>
          ) : step === 'plan' ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Choose a Plan</h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">Start with a free trial — upgrade anytime later.</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Try Out KSM Billing</h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">Sign in with your existing KSM account to jump straight in</p>
            </>
          )}
        </div>

        {step === 'plan' ? (
          <div className="p-8 pt-4 space-y-6">
            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between ${plan.functional ? "border-secondary-mid bg-secondary-super-light/30" : "border-gray-100 bg-gray-50/60 opacity-70"}`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary-mid">{plan.eyebrow}</span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">{plan.title}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-xs text-gray-400 font-medium">{plan.period}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-3 leading-relaxed">{plan.description}</p>

                    <button
                      type="button"
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={!plan.functional}
                      className={`mt-5 w-full py-3 rounded-full font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                        plan.functional
                          ? "bg-secondary-mid text-white hover:bg-secondary-mid/90 active:scale-[0.98] shadow-lg shadow-secondary-mid/25"
                          : "bg-gray-900/80 text-white cursor-not-allowed"
                      }`}
                    >
                      {plan.cta}
                    </button>

                    <hr className="border-gray-100 mt-5 mb-3" />

                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plan includes:</p>
                    <ul className="mt-2 space-y-1.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-1.5 text-xs text-gray-500 font-medium leading-snug">
                          <CheckCircle sx={{ fontSize: 13 }} className={`mt-0.5 shrink-0 ${plan.functional ? "text-secondary-mid" : "text-gray-300"}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setPendingAuth(null); setError(null); }}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-secondary-mid transition-colors"
            >
              <ArrowBackOutlined style={{ fontSize: 14 }} /> Back
            </button>
          </div>
        ) : step === 'org' ? (
          <div className="p-8 pt-4 space-y-5">
            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {organizationChoices.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium text-center py-6">No organizations found for this account.</p>
              ) : (
                organizationChoices.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleConfirmOrganization(org.id)}
                    disabled={selectingOrgId !== null}
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-secondary-mid/5 border border-gray-100 hover:border-secondary-mid rounded-xl transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary-mid/10 text-secondary-mid flex items-center justify-center shrink-0">
                      <ApartmentOutlined fontSize="small" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 flex-1">
                      {org.displayName || org.shortName || org.legalName}
                    </span>
                    {selectingOrgId === org.id && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary-mid">Connecting…</span>
                    )}
                  </button>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => { setStep('plan'); setError(null); }}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-secondary-mid transition-colors"
            >
              <ArrowBackOutlined style={{ fontSize: 14 }} /> Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitCredentials} className="p-8 pt-4 space-y-5">

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
              <div className={inputWrapper}>
                <PersonOutline className="text-gray-400" fontSize="small" />
                <input
                  type="text"
                  placeholder="you@company.com"
                  className={inputStyle}
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-secondary-mid transition-colors"
                >
                  {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                </button>
              </div>
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
              {isSubmitting ? 'Connecting…' : 'Try It Out'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have a Billing seller account? <Link href="/login" className="text-secondary-mid font-bold hover:underline">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TryOutForm;
