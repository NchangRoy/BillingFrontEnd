'use client'
import {  UpdatedSellerResponse } from '@/src/api/models/UpdatedSellerResponse';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  PersonOutline, // Changed from EmailOutlined
  LockOutlined, 
  VisibilityOutlined, 
  VisibilityOffOutlined,
  LoginOutlined
} from "@mui/icons-material";
import { SellerAuthResponse } from '@/src/src2/api/services/ExternalServices.ts/SellerAuthResponse';
import { mapAuthToUpdatedSeller } from '@/src/Mappers/SellerAuthMapper';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Changed from email
    password: '',
    rememberMe: false
  });
  const router=useRouter()



const loginSellerFetch = async (username: string, password: string): Promise<SellerAuthResponse> => {
  const response = await fetch('http://192.168.50.1:8081/sellers/login', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Authentication failed');
  }

  return response.json();
};

  


  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", formData);

      //send request to authenticate user

     const data=await loginSellerFetch(formData.username,formData.password)
     

     const sellerdate=mapAuthToUpdatedSeller(data)
     localStorage.setItem("seller",JSON.stringify(sellerdate))
console.log(sellerdate)
router.push("/dashboard")

   /*
    if(formData.username=="alice_smith"){
      localStorage.setItem("seller",JSON.stringify(seller1))
      router.push("/dashboard")
    }
    else if(formData.username=="bob_johnson"){
      localStorage.setItem("seller",JSON.stringify(seller2))
      
    }
   */
   
    // Add your authentication logic here
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/25 hover:bg-secondary-mid/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In to Dashboard
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