'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreCategory {
  label: string;
  score: number;
  max: number;
  icon: string;
}

interface KeywordItem {
  label: string;
  match: number; // 0-100
}

interface ChecklistItem {
  label: string;
  status: 'good' | 'warning' | 'error';
}

interface Suggestion {
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnalysisItem {
  label: string;
  status: 'good' | 'warning' | 'error';
  note: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const OVERALL_SCORE = 86;
const KEYWORD_MATCH = 72;

const SCORE_CATEGORIES: ScoreCategory[] = [
  { label: 'Content', score: 22, max: 25, icon: '📝' },
  { label: 'Structure', score: 21, max: 25, icon: '🏗️' },
  { label: 'Keywords', score: 18, max: 25, icon: '🔑' },
  { label: 'Formatting', score: 13, max: 25, icon: '🎨' },
  { label: 'Readability', score: 12, max: 25, icon: '📖' },
];

const TOP_KEYWORDS: KeywordItem[] = [
  { label: 'Product Design', match: 100 },
  { label: 'User Experience', match: 100 },
  { label: 'Figma', match: 90 },
  { label: 'UI/UX', match: 90 },
  { label: 'Prototyping', match: 80 },
  { label: 'Design Systems', match: 75 },
  { label: 'Wireframing', match: 65 },
];

const MISSING_KEYWORDS: string[] = [
  'Design System',
  'User Research',
  'Wireframing',
  'Interaction Design',
  'Information Architecture',
  'Usability Testing',
  'Design Thinking',
  'Stakeholder Management',
  'Accessibility',
  'A/B Testing',
];

const CHECKLIST: ChecklistItem[] = [
  { label: 'Contact Information', status: 'good' },
  { label: 'Professional Summary', status: 'good' },
  { label: 'Work Experience', status: 'good' },
  { label: 'Education', status: 'good' },
  { label: 'Skills', status: 'good' },
  { label: 'Keywords', status: 'warning' },
  { label: 'Formatting', status: 'warning' },
  { label: 'Length', status: 'good' },
];

const SUGGESTIONS: Suggestion[] = [
  {
    icon: '🔑',
    title: 'Add More Keywords',
    description: 'Include relevant keywords from the job description to improve your match rate.',
    priority: 'high',
  },
  {
    icon: '🎨',
    title: 'Improve Formatting',
    description: 'Use standard section headings and avoid tables or columns.',
    priority: 'high',
  },
  {
    icon: '📝',
    title: 'Enhance Summary',
    description: 'Add more specific details about your achievements and skills.',
    priority: 'medium',
  },
  {
    icon: '📊',
    title: 'Quantify Achievements',
    description: 'Add numbers and metrics to your bullet points for impact.',
    priority: 'medium',
  },
];

const ATS_ANALYSIS: { category: string; items: AnalysisItem[] }[] = [
  {
    category: 'File Format',
    items: [
      { label: 'File Type', status: 'good', note: 'Good. PDF file type is ATS-friendly.' },
      { label: 'Text Quality', status: 'good', note: 'Good. Text is selectable and readable.' },
      { label: 'Page Count', status: 'good', note: 'Good. 2 pages is ideal.' },
      { label: 'Font', status: 'warning', note: 'Consider using a standard font like Arial, Calibri or Times New Roman.' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { label: 'Margins', status: 'good', note: 'Good. Adequate margins detected.' },
      { label: 'Line Spacing', status: 'good', note: 'Good. Appropriate line spacing.' },
      { label: 'Section Headings', status: 'warning', note: 'Some headings could be more ATS-friendly.' },
      { label: 'Tables/Columns', status: 'error', note: 'Avoid tables and columns for better ATS compatibility.' },
    ],
  },
];

const PRO_TIPS = [
  'Use standard section headings',
  'Include relevant keywords naturally',
  'Quantify your achievements',
  'Keep formatting simple',
  'Proofread for typos and grammar',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusIcon(status: 'good' | 'warning' | 'error') {
  if (status === 'good') return '✓';
  if (status === 'warning') return '!';
  return '✕';
}
function statusColor(status: 'good' | 'warning' | 'error') {
  if (status === 'good') return 'text-[#15803D]';
  if (status === 'warning') return 'text-[#B45309]';
  return 'text-[#B91C1C]';
}
function statusBg(status: 'good' | 'warning' | 'error') {
  if (status === 'good') return 'bg-[#DCFCE7] text-[#15803D]';
  if (status === 'warning') return 'bg-[#FEF3C7] text-[#B45309]';
  return 'bg-[#FEE2E2] text-[#B91C1C]';
}
function statusLabel(status: 'good' | 'warning' | 'error') {
  if (status === 'good') return 'Good';
  if (status === 'warning') return 'Needs Work';
  return 'Critical';
}

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularGauge({
  score,
  max = 100,
  size = 140,
  stroke = 10,
  color = '#15803D',
  label,
  sublabel,
}: {
  score: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / max) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E4E7"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#18181B]">{score}</span>
        {label && <span className="text-[11px] text-[#71717A] font-medium">{label}</span>}
        {sublabel && <span className="text-[10px] text-[#71717A]">{sublabel}</span>}
      </div>
    </div>
  );
}

function DonutChart({ value, size = 110 }: { value: number; size?: number }) {
  const [animated, setAnimated] = useState(0);
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E4E4E7" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#111827"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-[#18181B]">{value}%</span>
        <span className="text-[10px] text-[#71717A]">Matched</span>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { label: 'Dashboard', icon: '⊟', href: '/' },
  { label: 'My Resumes', icon: '📄', href: '/' },
  { label: 'Templates', icon: '🎨', href: '/templates' },
];
const NAV_AI = [
  { label: 'AI Writer', icon: '✏️', href: '#' },
  { label: 'AI Summary', icon: '✨', href: '#' },
  { label: 'Cover Letter Generator', icon: '✉️', href: '#' },
  { label: 'Job Match', icon: '🎯', href: '#' },
  { label: 'ATS Checker', icon: '✓', href: '/ats-checker', active: true },
  { label: 'Interview Prep', icon: '🎤', href: '#' },
  { label: 'Job Tracker', icon: '📊', href: '#' },
];
const NAV_ACCOUNT = [
  { label: 'Settings', icon: '⚙️', href: '#' },
  { label: 'Profile', icon: '👤', href: '#' },
  { label: 'Billing', icon: '💳', href: '#' },
];

function Sidebar() {
  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-[#E4E4E7] z-20">
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[#E4E4E7] shrink-0">
        <div className="w-7 h-7 rounded-xl bg-[#111827] flex items-center justify-center">
          <span className="text-white text-xs font-black">R</span>
        </div>
        <span className="text-sm font-bold text-[#18181B]">ResumeAI</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_MAIN.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B] transition-all">
            <span className="text-sm w-4 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest px-3 mb-1">AI TOOLS</p>
          {NAV_AI.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${item.active ? 'bg-zinc-100 text-[#18181B]' : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'}`}>
              <span className="text-sm w-4 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest px-3 mb-1">ACCOUNT</p>
          {NAV_ACCOUNT.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B] transition-all">
              <span className="text-sm w-4 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-[#E4E4E7]">
        <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#111827] flex items-center justify-center">
              <span className="text-white text-[10px]">★</span>
            </div>
            <p className="text-xs font-bold text-[#18181B]">Upgrade to Pro</p>
          </div>
          <p className="text-[11px] text-[#71717A] mb-2 leading-relaxed">Unlock unlimited AI credits, advanced tools and more.</p>
          <button className="w-full py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-bold cursor-pointer transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-t border-[#E4E4E7]">
        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-[#71717A]">JD</div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#18181B] truncate">John Doe</p>
          <p className="text-[10px] text-[#71717A] truncate">john.doe@example.com</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ATSCheckerPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(true);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);

  const scoreColor = OVERALL_SCORE >= 80 ? '#15803D' : OVERALL_SCORE >= 60 ? '#B45309' : '#B91C1C';
  const scoreLabel = OVERALL_SCORE >= 80 ? 'Excellent' : OVERALL_SCORE >= 60 ? 'Good' : 'Needs Work';

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex font-sans antialiased text-[#18181B]">
      <Sidebar />

      <main className="flex-1 md:ml-56 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-14 bg-white border-b border-[#E4E4E7] flex items-center justify-between px-6 md:px-8">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search anything..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 cursor-pointer relative">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#B91C1C] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#18181B]">John Doe</p>
                <p className="text-[10px] text-[#71717A]">Premium Plan</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <Link href="/" className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B] mb-2 w-fit">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-black text-[#18181B]">ATS Checker</h1>
              <p className="text-sm text-[#71717A] mt-0.5">Analysis of your resume against ATS best practices and job description</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-zinc-50 text-xs font-bold text-[#18181B] cursor-pointer transition-all disabled:opacity-60"
              >
                {scanning ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Scan New Resume
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-bold cursor-pointer transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </button>
            </div>
          </div>

          {/* ── Main 2-column layout ── */}
          <div className="flex gap-6 items-start">
            {/* Left column */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Row 1: Overall Score + Score Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Overall ATS Score */}
                <div className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
                  <h2 className="text-sm font-bold text-[#18181B] mb-4">Overall ATS Score</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <CircularGauge score={OVERALL_SCORE} color={scoreColor} label="/100" size={130} stroke={11} />
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        {scoreLabel}
                      </div>
                      <p className="text-sm font-semibold text-[#18181B] mb-1">
                        Great job! Your resume is well-optimized for ATS systems.
                      </p>
                      <p className="text-xs text-[#71717A] leading-relaxed">
                        Your resume has a strong foundation. Address the suggested improvements to increase your chances of getting shortlisted.
                      </p>
                      <button className="mt-3 text-xs font-bold text-[#18181B] hover:text-[#71717A] underline underline-offset-2 cursor-pointer">
                        View Full Report →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
                  <h2 className="text-sm font-bold text-[#18181B] mb-4">Score Breakdown</h2>
                  <div className="space-y-3">
                    {SCORE_CATEGORIES.map((cat) => {
                      const pct = (cat.score / cat.max) * 100;
                      const barColor = pct >= 80 ? '#15803D' : pct >= 60 ? '#B45309' : '#B91C1C';
                      return (
                        <div key={cat.label}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{cat.icon}</span>
                              <span className="text-xs font-semibold text-[#18181B]">{cat.label}</span>
                            </div>
                            <span className="text-xs font-bold text-[#18181B]">
                              {cat.score}/{cat.max}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 2: Keyword Match + Top Keywords + Missing Keywords */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Keyword Match donut */}
                <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                  <h2 className="text-sm font-bold text-[#18181B] mb-4">Keyword Match</h2>
                  <div className="flex flex-col items-center gap-4">
                    <DonutChart value={KEYWORD_MATCH} size={110} />
                    <div className="w-full space-y-2">
                      {[
                        { label: 'Matched Keywords', value: 36, color: '#15803D' },
                        { label: 'Partial Matches', value: 12, color: '#B45309' },
                        { label: 'Missing Keywords', value: 18, color: '#B91C1C' },
                        { label: 'Total Keywords', value: 66, color: '#71717A' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-[11px] text-[#71717A]">{item.label}</span>
                          </div>
                          <span className="text-xs font-bold text-[#18181B]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Matched Keywords */}
                <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                  <h2 className="text-sm font-bold text-[#18181B] mb-4">Top Matched Keywords</h2>
                  <div className="space-y-2.5">
                    {(showAllKeywords ? TOP_KEYWORDS : TOP_KEYWORDS.slice(0, 5)).map((kw) => {
                      const color = kw.match >= 90 ? '#15803D' : kw.match >= 70 ? '#B45309' : '#B91C1C';
                      return (
                        <div key={kw.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-[#18181B] font-semibold">{kw.label}</span>
                            <span className="text-[11px] font-bold" style={{ color }}>{kw.match}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${kw.match}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowAllKeywords((p) => !p)}
                    className="mt-3 text-xs font-bold text-[#18181B] hover:text-[#71717A] cursor-pointer"
                  >
                    {showAllKeywords ? 'Show Less' : 'View All Keywords →'}
                  </button>
                </div>

                {/* Missing Keywords */}
                <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                  <h2 className="text-sm font-bold text-[#18181B] mb-4">Missing Keywords</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {(showAllMissing ? MISSING_KEYWORDS : MISSING_KEYWORDS.slice(0, 8)).map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold border border-[#FECACA]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAllMissing((p) => !p)}
                    className="mt-3 text-xs font-bold text-[#18181B] hover:text-[#71717A] cursor-pointer block"
                  >
                    {showAllMissing ? 'Show Less' : `View All Missing Keywords (${MISSING_KEYWORDS.length}) →`}
                  </button>
                </div>
              </div>

              {/* Row 3: ATS Analysis */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
                <h2 className="text-sm font-bold text-[#18181B] mb-5">ATS Analysis</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {ATS_ANALYSIS.flatMap((cat) =>
                    cat.items.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5 ${statusBg(item.status)}`}>
                          {statusIcon(item.status)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#18181B]">{item.label}</p>
                          <p className="text-[11px] text-[#71717A] leading-relaxed mt-0.5">{item.note}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Row 4: Job Description Paste */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#18181B]">Job Description Match</h2>
                    <p className="text-xs text-[#71717A] mt-0.5">Paste a job description to get a more precise ATS score</p>
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={!jobDesc.trim() || scanning}
                    className="px-4 py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-bold cursor-pointer disabled:opacity-40 transition-all"
                  >
                    {scanning ? 'Analyzing...' : 'Analyze →'}
                  </button>
                </div>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={4}
                  placeholder="Paste the job description here to get a tailored ATS score and keyword analysis..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Right column (sidebar) */}
            <div className="w-64 xl:w-72 shrink-0 hidden lg:flex flex-col gap-5">
              {/* Checklist */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                <h2 className="text-sm font-bold text-[#18181B] mb-3">Checklist</h2>
                <div className="space-y-2">
                  {CHECKLIST.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${statusBg(item.status)}`}>
                          {statusIcon(item.status)}
                        </div>
                        <span className="text-xs text-[#18181B]">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${statusColor(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 flex items-center gap-1 text-xs font-bold text-[#18181B] hover:text-[#71717A] cursor-pointer">
                  View Details
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                <h2 className="text-sm font-bold text-[#18181B] mb-3">Improvement Suggestions</h2>
                <div className="space-y-3">
                  {SUGGESTIONS.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] hover:border-[#111827] cursor-pointer transition-all">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        suggestion.priority === 'high' ? 'bg-[#FEF3C7]' : 'bg-[#FAFAF9] border border-[#E4E4E7]'
                      }`}>
                        {suggestion.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-[#18181B]">{suggestion.title}</p>
                        <p className="text-[10px] text-[#71717A] mt-0.5 leading-relaxed">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 flex items-center gap-1 text-xs font-bold text-[#18181B] hover:text-[#71717A] cursor-pointer">
                  View All Suggestions
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Pro Tips */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">💡</span>
                  <h2 className="text-sm font-bold text-[#18181B]">Pro Tips</h2>
                </div>
                <ul className="space-y-2">
                  {PRO_TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-[11px] text-[#71717A]">
                      <span className="text-[#15803D] font-bold mt-px shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Score History mini chart */}
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5">
                <h2 className="text-sm font-bold text-[#18181B] mb-3">Score History</h2>
                <div className="flex items-end gap-1.5 h-16">
                  {[62, 68, 71, 75, 79, 82, 86].map((val, i) => {
                    const height = (val / 100) * 64;
                    const isLast = i === 6;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md transition-all duration-500"
                          style={{
                            height: `${height}px`,
                            backgroundColor: isLast ? '#111827' : '#E4E4E7',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-[#71717A]">
                  <span>6 weeks ago</span>
                  <span className="font-bold text-[#15803D]">↑ +24 pts</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
