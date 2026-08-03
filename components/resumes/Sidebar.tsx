import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  FileText,
  FileCode,
  Palette,
  CheckSquare,
  Target,
  Mail,
  Mic,
  BarChart3,
  User,
  CreditCard,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const [resumeCount, setResumeCount] = useState<number | null>(null);
  const [coverLetterCount, setCoverLetterCount] = useState<number | null>(null);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    const fetchCountsAndPlan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        if (typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true') {
          setResumeCount(3);
          setCoverLetterCount(2);
          setJobCount(5);
          setIsPro(localStorage.getItem('user_plan') === 'pro');
        }
        return;
      }

      try {
        const [resumesRes, coverRes, jobsRes, profileRes] = await Promise.all([
          supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('cover_letters').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('job_tracker').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        ]);

        if (resumesRes.count !== null) setResumeCount(resumesRes.count);
        if (coverRes.count !== null) setCoverLetterCount(coverRes.count);
        if (jobsRes.count !== null) setJobCount(jobsRes.count);

        if (profileRes.data?.is_pro || profileRes.data?.plan === 'pro' || user.user_metadata?.is_pro || localStorage.getItem('user_plan') === 'pro') {
          setIsPro(true);
        }
      } catch (e) {
        // ignore fallback
      }
    };

    fetchCountsAndPlan();
  }, []);

  const mainNav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'My Resumes', icon: FileText, href: '/resumes', badge: resumeCount },
    { label: 'Resume Builder', icon: FileCode, href: '/editor/demo-1' },
    { label: 'Templates', icon: Palette, href: '/templates' },
  ];

  const aiToolsNav = [
    { label: 'ATS Checker', icon: CheckSquare, href: '/ats-checker' },
    { label: 'Job Match', icon: Target, href: '/job-match' },
    { label: 'Cover Letters', icon: Mail, href: '/cover-letters', badge: coverLetterCount },
    { label: 'Interview Prep', icon: Mic, href: '/job-match' },
    { label: 'Job Tracker', icon: BarChart3, href: '/dashboard', badge: jobCount },
  ];

  const accountNav = [
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Billing', icon: CreditCard, href: '/pricing' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Help & Support', icon: HelpCircle, href: '/pricing' },
  ];

  return (
    <aside className="w-[220px] shrink-0 hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-[#E4E4E7] z-30 select-none">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-[#E4E4E7] shrink-0">
        <div className="w-7 h-7 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          R
        </div>
        <span className="font-bold text-base tracking-tight text-[#18181B]">
          ResumeAI
        </span>
      </Link>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs font-medium text-[#71717A]">
        {/* Main */}
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href === '/editor/demo-1' && pathname.startsWith('/editor'));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  active
                    ? 'bg-zinc-100 text-[#18181B] font-bold shadow-2xs'
                    : 'hover:bg-zinc-50 hover:text-[#18181B]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-100 border border-[#E4E4E7] text-[#18181B]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* AI Tools */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest px-3 mb-1">
            AI TOOLS
          </p>
          {aiToolsNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  active
                    ? 'bg-zinc-100 text-[#18181B] font-bold shadow-2xs'
                    : 'hover:bg-zinc-50 hover:text-[#18181B]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-100 border border-[#E4E4E7] text-[#18181B]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Account */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest px-3 mb-1">
            ACCOUNT
          </p>
          {accountNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  active
                    ? 'bg-zinc-100 text-[#18181B] font-bold shadow-2xs'
                    : 'hover:bg-zinc-50 hover:text-[#18181B]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade to Pro Card */}
      <div className="p-3 border-t border-[#E4E4E7]">
        <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] space-y-2">
          {isPro ? (
            <>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>You&apos;re a Pro Member</span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-relaxed">
                Enjoy unlimited resumes, AI generation, and ATS analysis.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B]">
                <Sparkles className="w-3.5 h-3.5 text-[#18181B]" />
                <span>Upgrade to Pro</span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-relaxed">
                Unlock unlimited resumes, AI tools, and advanced features.
              </p>
              <Link
                href="/pricing"
                className="block w-full py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-[11px] font-semibold text-center transition-colors shadow-2xs"
              >
                Upgrade Now
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
