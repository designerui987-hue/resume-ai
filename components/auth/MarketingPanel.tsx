import React from 'react';
import { Sparkles, FileText, Target } from 'lucide-react';
import { FeatureRow } from '../marketing/FeatureRow';
import { ResumeCard } from '../marketing/ResumeCard';
import { ATSCard } from '../marketing/ATSCard';
import { KeywordCard } from '../marketing/KeywordCard';

interface MarketingPanelProps {
  mode: 'login' | 'signup';
}

export function MarketingPanel({ mode }: MarketingPanelProps) {
  const isLogin = mode === 'login';

  return (
    <div className="h-full bg-[#FAFAF9] flex flex-col justify-between p-8 xl:p-12 border-r border-[#E4E4E7] overflow-y-auto select-none">
      {/* Top Header & Content */}
      <div className="space-y-12 max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            R
          </div>
          <span className="font-bold text-lg tracking-tight text-[#18181B]">
            ResumeAI
          </span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E4E4E7]/60 border border-[#E4E4E7] text-[10px] font-bold tracking-widest text-[#71717A] uppercase">
            AI POWERED. CAREER FOCUSED.
          </div>

          {/* Heading */}
          <h1 className="text-3xl xl:text-4xl font-extrabold text-[#18181B] tracking-tight leading-[1.15] max-w-[420px]">
            {isLogin ? 'Build a resume that gets you hired.' : 'Create a resume that opens doors.'}
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[#71717A] leading-relaxed max-w-[420px]">
            {isLogin
              ? 'Create ATS-friendly resumes, optimize with AI, and land more interviews.'
              : 'Join thousands of job seekers using AI to build ATS-friendly resumes and land more interviews.'}
          </p>
        </div>

        {/* Feature Rows */}
        <div className="space-y-6 pt-2">
          <FeatureRow
            icon={Sparkles}
            title={isLogin ? 'AI Resume Optimization' : 'AI Resume Builder'}
            description={
              isLogin
                ? 'Get AI suggestions to improve your content, structure, and impact.'
                : 'Create and optimize resumes with AI that gets you noticed.'
            }
          />

          <FeatureRow
            icon={FileText}
            title="ATS Score Checker"
            description={
              isLogin
                ? "Analyze your resume and fix what's holding you back."
                : 'Analyze your resume and improve your chances.'
            }
          />

          <FeatureRow
            icon={Target}
            title="Job Match"
            description={
              isLogin
                ? 'Match your resume with job descriptions and increase your chances.'
                : 'Match your resume with job descriptions and find the right opportunities.'
            }
          />
        </div>
      </div>

      {/* Bottom Floating Cards Visual Showcase */}
      <div className="relative mt-8 pt-8 pb-4 flex justify-center items-end min-h-[220px]">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E4E4E7_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-70 rounded-2xl pointer-events-none" />

        {/* Overlapping Cards Container */}
        <div className="relative flex items-end justify-center z-10 scale-90 sm:scale-100 origin-bottom">
          {/* Left: ATS Score Card */}
          <div className="absolute -left-12 bottom-6 z-20 shadow-lg transition-transform hover:-translate-y-1">
            <ATSCard />
          </div>

          {/* Center: Resume Card */}
          <div className="z-10 shadow-xl">
            <ResumeCard />
          </div>

          {/* Right: Keyword Card */}
          <div className="absolute -right-12 bottom-8 z-20 shadow-lg transition-transform hover:-translate-y-1">
            <KeywordCard />
          </div>
        </div>
      </div>
    </div>
  );
}
