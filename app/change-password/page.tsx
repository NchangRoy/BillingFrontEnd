'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  MailOutline,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LoginOutlined
} from "@mui/icons-material";
import { ApiError, AuthService } from '@/src/src2/api';
import { mapAuthToUpdatedSeller } from '@/src/Mappers/SellerAuthMapper';
import { getStoredSeller } from '@/src/api/session';

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller?.accessToken) {
      router.replace('/login');
      return;
    }
    if (!seller.mustChangePassword) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await AuthService.changePassword({
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      const sellerData = mapAuthToUpdatedSeller(data);
      localStorage.setItem("seller", JSON.stringify(sellerData));
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? err.message) : 'Password change failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapper = "flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus-within:border-secondary-mid focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary-mid/5 transition-all duration-200";
  const inputStyle = "bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

        {/* Branding Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-12 h-12 bg-secondary-mid rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary-mid/20">
            <LoginOutlined className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Set a New Password</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Your account uses a temporary password. Set a permanent one to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
            <div className={inputWrapper}>
              <MailOutline className="text-gray-400" fontSize="small" />
              <input
                type="email"
                placeholder="you@example.com"
                className={inputStyle}
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Current (temporary) Password Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Temporary Password</label>
            <div className={inputWrapper}>
              <LockOutlined className="text-gray-400" fontSize="small" />
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-gray-400 hover:text-secondary-mid transition-colors"
              >
                {showCurrent ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
            <div className={inputWrapper}>
              <LockOutlined className="text-gray-400" fontSize="small" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                required
                minLength={8}
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-gray-400 hover:text-secondary-mid transition-colors"
              >
                {showNew ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
            <div className={inputWrapper}>
              <LockOutlined className="text-gray-400" fontSize="small" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
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
            {isSubmitting ? 'Updating…' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
