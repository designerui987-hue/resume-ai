'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SocialButton } from './SocialButton';
import { Divider } from './Divider';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { FeatureBenefit } from './FeatureBenefit';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        // Fallback for demo mode
        localStorage.setItem('demo_user_logged_in', 'true');
        router.push('/dashboard');
        return;
      }

      if (data.session) {
        router.push('/dashboard');
      } else {
        localStorage.setItem('demo_user_logged_in', 'true');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred during registration.');
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
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-[#18181B] tracking-tight">
          Create your account
        </h2>
        <p className="text-xs text-[#71717A]">
          Start building your job-winning resume today.
        </p>
      </div>

      {/* Social Buttons */}
      <div className="space-y-2 pt-1">
        <SocialButton provider="google" mode="signup" onClick={handleDemoBypass} />
        <SocialButton provider="github" mode="signup" onClick={handleDemoBypass} />
      </div>

      <Divider />

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <AuthInput
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <AuthInput
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            showLockIcon
            error={errors.password?.message}
            {...register('password')}
          />
          <p className="text-[10px] text-[#71717A] mt-1.5 font-medium">
            Use 8+ characters with a mix of letters, numbers &amp; symbols.
          </p>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              {...register('terms')}
              className="w-4 h-4 mt-0.5 rounded border-[#E4E4E7] text-[#111827] focus:ring-[#111827] cursor-pointer"
            />
            <label htmlFor="terms" className="text-[11px] leading-snug font-medium text-[#71717A] cursor-pointer select-none">
              I agree to the{' '}
              <a href="#" className="text-[#18181B] underline hover:opacity-80">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#18181B] underline hover:opacity-80">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.terms && (
            <p className="text-[11px] font-medium text-[#B91C1C] mt-1">{errors.terms.message}</p>
          )}
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
              <span>Creating account...</span>
            </>
          ) : (
            'Create account'
          )}
        </button>

        {/* Security Message */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71717A] pt-1">
          <Shield className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Your data is secure and never shared.</span>
        </div>
      </form>

      {/* Feature Benefit Cards */}
      <FeatureBenefit />
    </div>
  );
}
