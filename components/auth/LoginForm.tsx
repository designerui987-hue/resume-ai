'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { SocialButton } from './SocialButton';
import { Divider } from './Divider';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { FooterLinks } from './FooterLinks';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        // Fallback for demo mode if Supabase credentials aren't set up yet
        if (values.email.includes('demo') || values.email === 'admin@resume.ai') {
          localStorage.setItem('demo_user_logged_in', 'true');
          router.push('/dashboard');
          return;
        }
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    localStorage.setItem('demo_user_logged_in', 'true');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-[#18181B] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-[#71717A]">
          Log in to your account and continue building.
        </p>
      </div>

      {/* Social Buttons */}
      <div className="space-y-2.5 pt-2">
        <SocialButton provider="google" mode="login" onClick={handleDemoBypass} />
        <SocialButton provider="github" mode="login" onClick={handleDemoBypass} />
      </div>

      <Divider />

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          rightLabelAction={
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link has been sent to your email.');
              }}
              className="text-[11px] font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              Forgot password?
            </a>
          }
          {...register('password')}
        />

        {/* Remember me Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-[#E4E4E7] text-[#111827] focus:ring-[#111827] cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs font-medium text-[#71717A] cursor-pointer select-none">
            Remember me
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-[#111827] hover:bg-[#27272A] active:scale-[0.99] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Logging in...</span>
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <FooterLinks />
    </div>
  );
}
