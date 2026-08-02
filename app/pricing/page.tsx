'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <span className="font-bold text-base tracking-tight text-[#18181B]">
              ResumeAI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-[#71717A] hover:text-[#18181B] px-3 py-1.5 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="btn-micro bg-[#111827] hover:bg-[#27272A] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#71717A] uppercase tracking-widest block mb-2">
            SIMPLE PRICING
          </span>
          <h1 className="text-4xl sm:text-[40px] font-bold text-[#18181B] tracking-tight mb-4">
            Choose the plan that works for you
          </h1>
          <p className="text-sm text-[#71717A]">
            Simple, transparent pricing. Build ATS-ready resumes with AI and get hired faster.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#E4E4E7] mt-8 shadow-2xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Yearly Billing
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Free */}
          <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] flex flex-col justify-between hover-lift transition-all">
            <div>
              <h3 className="text-lg font-bold text-[#18181B]">Free</h3>
              <div className="my-4">
                <span className="text-4xl font-bold text-[#18181B]">$0</span>
                <span className="text-xs text-[#71717A] ml-1">/ forever</span>
              </div>
              <p className="text-xs text-[#71717A] mb-6">Perfect for getting started</p>
              <ul className="space-y-3 text-xs text-[#18181B] mb-8">
                <li className="flex items-center gap-2">✓ 2 Resumes</li>
                <li className="flex items-center gap-2">✓ 2 PDF Downloads</li>
                <li className="flex items-center gap-2">✓ Basic Templates</li>
                <li className="flex items-center gap-2">✓ AI Summary Generator</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="btn-micro w-full py-3 rounded-xl bg-white hover:bg-zinc-50 text-[#18181B] font-semibold text-xs text-center border border-[#E4E4E7] shadow-2xs"
            >
              Get Started
            </Link>
          </div>

          {/* Pro (Highlighted) */}
          <div className="p-8 rounded-2xl bg-white border-2 border-[#111827] flex flex-col justify-between relative shadow-sm hover-lift transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-[#111827] text-white uppercase">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#18181B]">Pro</h3>
              <div className="my-4">
                <span className="text-4xl font-bold text-[#18181B]">
                  {billingCycle === 'monthly' ? '$9' : '$7.20'}
                </span>
                <span className="text-xs text-[#71717A] ml-1">/ month</span>
              </div>
              <p className="text-xs text-[#71717A] mb-6">Everything you need to stand out</p>
              <ul className="space-y-3 text-xs text-[#18181B] mb-8">
                <li className="flex items-center gap-2">✓ Unlimited Resumes</li>
                <li className="flex items-center gap-2">✓ Unlimited PDF Downloads</li>
                <li className="flex items-center gap-2">✓ All Premium Templates</li>
                <li className="flex items-center gap-2">✓ AI Resume Optimization</li>
                <li className="flex items-center gap-2">✓ Cover Letter Generator</li>
                <li className="flex items-center gap-2">✓ ATS Score Checker</li>
                <li className="flex items-center gap-2">✓ Interview Prep</li>
                <li className="flex items-center gap-2">✓ Job Tracker</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="btn-micro w-full py-3 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs text-center shadow-xs"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Lifetime */}
          <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] flex flex-col justify-between hover-lift transition-all">
            <div>
              <h3 className="text-lg font-bold text-[#18181B]">Lifetime</h3>
              <div className="my-4">
                <span className="text-4xl font-bold text-[#18181B]">$69</span>
                <span className="text-xs text-[#71717A] ml-1">/ one-time</span>
              </div>
              <p className="text-xs text-[#71717A] mb-6">One payment, lifetime access</p>
              <ul className="space-y-3 text-xs text-[#18181B] mb-8">
                <li className="flex items-center gap-2">✓ Everything in Pro</li>
                <li className="flex items-center gap-2">✓ Lifetime Updates</li>
                <li className="flex items-center gap-2">✓ Priority Support</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="btn-micro w-full py-3 rounded-xl bg-white hover:bg-zinc-50 text-[#18181B] font-semibold text-xs text-center border border-[#E4E4E7] shadow-2xs"
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
