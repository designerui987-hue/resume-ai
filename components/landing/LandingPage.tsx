'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MinimalLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'editor' | 'preview'>('editor');

  const faqs = [
    {
      question: 'Is ResumeAI free to use?',
      answer: 'Yes! You can start with our Free plan which includes 2 resumes and 2 PDF exports. No credit card required.',
    },
    {
      question: 'How does the AI Resume Builder work?',
      answer: 'Our AI utilizes Google’s Gemini Flash model to analyze your target job title, automatically crafting executive summaries and metrics-backed bullet points.',
    },
    {
      question: 'Will my resume pass ATS checks?',
      answer: 'Absolutely. All layouts use standardized section markers, single-column bounding hierarchies, and clean typography guaranteed to pass automated screening software.',
    },
    {
      question: 'Can I download my resume as a PDF?',
      answer: 'Yes! High-resolution pixel-perfect A4 PDFs are generated directly in your browser with zero formatting loss.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time with a single click in your settings.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Your personal data is encrypted and strictly isolated using Supabase Row-Level Security (RLS). We never sell your personal information.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 antialiased">
      {/* 1. Header Navigation */}
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#71717A]">
            <a href="#features" className="hover:text-[#18181B] transition-colors">Features</a>
            <a href="#preview" className="hover:text-[#18181B] transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-[#18181B] transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-[#18181B] transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-[#18181B] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#71717A] hover:text-[#18181B] px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="btn-micro bg-[#111827] hover:bg-[#27272A] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* 2. Hero Section */}
        <section className="pt-20 pb-16 text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-xs font-medium text-[#71717A] mb-8 shadow-2xs">
            <span className="text-amber-500">✨</span>
            <span>AI-Powered Resume Builder</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#18181B] tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Build a Job-Winning <br /> Resume in Minutes
          </h1>

          <p className="text-base sm:text-lg text-[#71717A] max-w-2xl mx-auto leading-relaxed mb-10">
            Create ATS-friendly resumes, generate cover letters, and get hired faster with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/login"
              className="btn-micro w-full sm:w-auto bg-[#111827] hover:bg-[#27272A] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs text-center"
            >
              Create My Resume
            </Link>
            <a
              href="#preview"
              className="btn-micro w-full sm:w-auto bg-white hover:bg-zinc-50 text-[#18181B] text-sm font-semibold px-6 py-3.5 rounded-xl border border-[#E4E4E7] shadow-2xs text-center"
            >
              See Templates
            </a>
          </div>

          {/* Interactive UI Mockup Card matching reference image exactly */}
          <div id="preview" className="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-6 shadow-xs hover-lift transition-all">
            <div className="border border-[#E4E4E7] rounded-xl bg-[#FAFAF9] overflow-hidden text-left">
              {/* App Bar */}
              <div className="bg-white border-b border-[#E4E4E7] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#18181B] flex items-center gap-1.5">
                    📄 ResumeAI
                  </span>
                  <span className="text-[#E4E4E7]">|</span>
                  <span className="font-medium text-[#71717A]">Senior Product Designer</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">Saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white border border-[#E4E4E7] rounded-lg text-[#71717A]">Template ▾</span>
                  <span className="px-3 py-1 bg-[#111827] text-white rounded-lg font-medium">Download ↓</span>
                </div>
              </div>

              {/* Split Editor Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 border-r border-[#E4E4E7] bg-white p-4 space-y-1 text-xs">
                  <div className="px-3 py-2 rounded-lg font-semibold bg-zinc-100 text-[#18181B]">Personal Info</div>
                  <div className="px-3 py-2 rounded-lg text-[#71717A] hover:bg-zinc-50">Summary</div>
                  <div className="px-3 py-2 rounded-lg text-[#71717A] hover:bg-zinc-50">Experience</div>
                  <div className="px-3 py-2 rounded-lg text-[#71717A] hover:bg-zinc-50">Education</div>
                  <div className="px-3 py-2 rounded-lg text-[#71717A] hover:bg-zinc-50">Skills</div>
                  <div className="px-3 py-2 rounded-lg text-[#71717A] hover:bg-zinc-50">Projects</div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-4 border-r border-[#E4E4E7] bg-white p-6 space-y-4 text-xs">
                  <h4 className="font-bold text-sm text-[#18181B]">Personal Information</h4>
                  <div>
                    <label className="block text-[#71717A] mb-1 font-medium">Full Name</label>
                    <input type="text" readOnly value="Alex Morgan" className="w-full px-3 py-2 bg-[#FAFAF9] border border-[#E4E4E7] rounded-lg text-[#18181B]" />
                  </div>
                  <div>
                    <label className="block text-[#71717A] mb-1 font-medium">Email</label>
                    <input type="text" readOnly value="alex.morgan@gmail.com" className="w-full px-3 py-2 bg-[#FAFAF9] border border-[#E4E4E7] rounded-lg text-[#18181B]" />
                  </div>
                  <div>
                    <label className="block text-[#71717A] mb-1 font-medium">Phone</label>
                    <input type="text" readOnly value="+1 (555) 123-4567" className="w-full px-3 py-2 bg-[#FAFAF9] border border-[#E4E4E7] rounded-lg text-[#18181B]" />
                  </div>
                  <div>
                    <label className="block text-[#71717A] mb-1 font-medium">Location</label>
                    <input type="text" readOnly value="San Francisco, CA" className="w-full px-3 py-2 bg-[#FAFAF9] border border-[#E4E4E7] rounded-lg text-[#18181B]" />
                  </div>
                </div>

                {/* Document Live Preview */}
                <div className="lg:col-span-5 bg-[#FAFAF9] p-6 text-xs font-sans">
                  <div className="bg-white p-6 rounded-lg border border-[#E4E4E7] space-y-4 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-base text-[#18181B]">Alex Morgan</h3>
                      <p className="text-[#71717A] text-xs">Senior Product Designer</p>
                      <p className="text-[11px] text-[#71717A] mt-1">alex.morgan@gmail.com • +1 (555) 123-4567 • San Francisco, CA</p>
                    </div>
                    <div className="border-t border-[#E4E4E7] pt-2">
                      <h5 className="font-bold text-xs text-[#18181B] mb-1">SUMMARY</h5>
                      <p className="text-[#71717A] leading-relaxed text-[11px]">Product designer with 6+ years of experience designing intuitive digital products for enterprise platforms. Specialized in data-driven user research and system design.</p>
                    </div>
                    <div className="border-t border-[#E4E4E7] pt-2">
                      <h5 className="font-bold text-xs text-[#18181B] mb-1">EXPERIENCE</h5>
                      <div className="flex justify-between font-semibold text-[#18181B]">
                        <span>Senior Product Designer</span>
                        <span className="text-[#71717A]">2021 – Present</span>
                      </div>
                      <p className="text-[#71717A] text-[11px] mt-1">• Led core design system used by 50+ internal developers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud Section */}
        <section className="py-12 border-b border-[#E4E4E7]">
          <p className="text-center text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-8">
            Trusted by job seekers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70 font-semibold text-lg text-[#18181B]">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>Meta</span>
            <span>Adobe</span>
            <span>Notion</span>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-24 border-b border-[#E4E4E7]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#71717A] uppercase tracking-widest block mb-2">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl sm:text-[40px] font-bold text-[#18181B] tracking-tight">
              Everything you need to land your dream job
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                📝
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">AI Resume Builder</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Create ATS-friendly resumes with AI-powered suggestions and content optimization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                📊
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">ATS Score Checker</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Analyze your resume and get a detailed score with actionable improvement tips.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                ✉️
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">Cover Letter Generator</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Generate personalized cover letters tailored to any job description in seconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                🎯
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">Job Match</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Match your resume with job descriptions and boost your chances of getting hired.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                💬
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">Interview Prep</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Practice with AI-generated interview questions and sample answers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-white border border-[#E4E4E7] hover-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-base mb-6">
                📌
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">Job Tracker</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Track your applications, follow-ups, and interview progress in one place.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Pricing Section */}
        <section id="pricing" className="py-24 border-b border-[#E4E4E7]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#71717A] uppercase tracking-widest block mb-2">
              SIMPLE PRICING
            </span>
            <h2 className="text-3xl sm:text-[40px] font-bold text-[#18181B] tracking-tight">
              Choose the plan that works for you
            </h2>
          </div>

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
                  <span className="text-4xl font-bold text-[#18181B]">$9</span>
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
        </section>

        {/* 5. Testimonials Section */}
        <section id="testimonials" className="py-24 border-b border-[#E4E4E7]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#71717A] uppercase tracking-widest block mb-2">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-[40px] font-bold text-[#18181B] tracking-tight">
              Loved by professionals worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7]">
              <p className="text-xs text-[#71717A] leading-relaxed mb-4">
                &quot;ResumeAI helped me rewrite my bullet points in minutes. I landed 3 interviews within a week of updating my resume.&quot;
              </p>
              <div className="font-bold text-xs text-[#18181B]">Sarah Jenkins</div>
              <div className="text-[11px] text-[#71717A]">Software Engineer @ TechCorp</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7]">
              <p className="text-xs text-[#71717A] leading-relaxed mb-4">
                &quot;The ATS checker is a game-changer. It highlighted formatting issues I had no idea were blocking my applications.&quot;
              </p>
              <div className="font-bold text-xs text-[#18181B]">David Chen</div>
              <div className="text-[11px] text-[#71717A]">Product Manager</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7]">
              <p className="text-xs text-[#71717A] leading-relaxed mb-4">
                &quot;Simple, clean design. No clutter or unnecessary fluff. Exporting A4 PDFs worked flawlessly.&quot;
              </p>
              <div className="font-bold text-xs text-[#18181B]">Elena Rostova</div>
              <div className="text-[11px] text-[#71717A]">UX Designer</div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section id="faq" className="py-24 border-b border-[#E4E4E7]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#71717A] uppercase tracking-widest block mb-2">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-[40px] font-bold text-[#18181B] tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-white border border-[#E4E4E7] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#18181B] hover:bg-zinc-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="text-[#71717A]">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#71717A] leading-relaxed border-t border-[#E4E4E7] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="py-16 text-xs text-[#71717A]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#18181B]">
                📄 ResumeAI
              </div>
              <p className="max-w-xs leading-relaxed">
                AI-powered resume builder helping you get hired faster.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-[#18181B] mb-3">Product</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-[#18181B]">Features</a></li>
                <li><a href="#preview" className="hover:text-[#18181B]">Templates</a></li>
                <li><a href="#pricing" className="hover:text-[#18181B]">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#18181B] mb-3">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#faq" className="hover:text-[#18181B]">FAQ</a></li>
                <li><a href="#testimonials" className="hover:text-[#18181B]">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#18181B] mb-3">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#18181B]">About Us</a></li>
                <li><a href="#" className="hover:text-[#18181B]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#18181B]">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E4E4E7] pt-8 text-center">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
