'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import LandingPage from '@/components/landing/LandingPage';

type ResumeRow = Database['public']['Tables']['resumes']['Row'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [fetchingResumes, setFetchingResumes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<ResumeRow | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeRole, setResumeRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'resumes' | 'cover-letters' | 'job-tracker'>('dashboard');

  // Fetch resumes for the authenticated user from Supabase
  const fetchUserResumes = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
      // Mock initial demo data if empty
      setResumes((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                id: 'demo-1',
                user_id: 'demo-user-id',
                title: 'Senior Frontend Developer',
                target_role: 'Senior React / Next.js Engineer',
                summary: 'Experienced developer building high performance web apps.',
                contact_email: 'john.doe@example.com',
                contact_phone: '+1 (555) 019-2834',
                location: 'San Francisco, CA',
                website_url: 'https://johndoe.dev',
                linkedin_url: 'https://linkedin.com/in/johndoe',
                github_url: 'https://github.com/johndoe',
                status: 'Published',
                completion_score: 88,
                created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
                updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
              },
              {
                id: 'demo-2',
                user_id: 'demo-user-id',
                title: 'Product Designer Resume',
                target_role: 'Staff Product Designer',
                summary: 'User-centric product designer specializing in complex SaaS systems.',
                contact_email: 'john.doe@example.com',
                contact_phone: '+1 (555) 019-2834',
                location: 'San Francisco, CA',
                website_url: null,
                linkedin_url: null,
                github_url: null,
                status: 'Draft',
                completion_score: 76,
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date(Date.now() - 86400000).toISOString(),
              },
              {
                id: 'demo-3',
                user_id: 'demo-user-id',
                title: 'Backend Developer',
                target_role: 'Lead Backend Engineer',
                summary: 'Distributed systems software architect.',
                contact_email: 'john.doe@example.com',
                contact_phone: null,
                location: 'Remote',
                website_url: null,
                linkedin_url: null,
                github_url: null,
                status: 'Draft',
                completion_score: 82,
                created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
                updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
              },
            ]
      );
      return;
    }
    setFetchingResumes(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err: any) {
      console.error('Error fetching resumes:', err);
      setErrorMsg('Failed to load resumes. Please try refreshing.');
    } finally {
      setFetchingResumes(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true';
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        fetchUserResumes(session.user.id);
      } else if (isDemo) {
        setUser({ id: 'demo-user-id', email: 'john.doe@example.com' } as User);
        setLoading(false);
        fetchUserResumes('demo-user-id');
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true';
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        fetchUserResumes(session.user.id);
      } else if (!isDemo) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, fetchUserResumes]);

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user_logged_in');
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleOpenCreateModal = () => {
    setEditingResume(null);
    setResumeTitle('');
    setResumeRole('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resume: ResumeRow) => {
    setEditingResume(resume);
    setResumeTitle(resume.title);
    setResumeRole(resume.target_role || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeTitle.trim() || !user) return;

    setSubmitting(true);
    setErrorMsg(null);

    // If using Demo Mode without actual Supabase Auth session
    if (user.id === 'demo-user-id') {
      const now = new Date().toISOString();
      if (editingResume) {
        setResumes((prev) =>
          prev.map((r) =>
            r.id === editingResume.id
              ? { ...r, title: resumeTitle.trim(), target_role: resumeRole.trim() || null, updated_at: now }
              : r
          )
        );
      } else {
        const newResume: ResumeRow = {
          id: 'demo-' + Date.now(),
          user_id: user.id,
          title: resumeTitle.trim(),
          target_role: resumeRole.trim() || null,
          summary: null,
          contact_email: null,
          contact_phone: null,
          location: null,
          website_url: null,
          linkedin_url: null,
          github_url: null,
          status: 'Draft',
          completion_score: 80,
          created_at: now,
          updated_at: now,
        };
        setResumes((prev) => [newResume, ...prev]);
      }

      setIsModalOpen(false);
      setSubmitting(false);
      return;
    }

    try {
      if (editingResume) {
        // Update resume title & target_role in Supabase
        const { error } = await supabase
          .from('resumes')
          .update({
            title: resumeTitle.trim(),
            target_role: resumeRole.trim() || null,
          })
          .eq('id', editingResume.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new resume in Supabase
        const { error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: resumeTitle.trim(),
            target_role: resumeRole.trim() || null,
            status: 'Draft',
            completion_score: 80,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchUserResumes(user.id);
    } catch (err: any) {
      console.error('Error saving resume:', err);
      setErrorMsg(err?.message || 'Failed to save resume to Supabase. Make sure user session is active.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      try {
        if (user.id !== 'demo-user-id') {
          const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;
        }
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        console.error('Error deleting resume:', err);
        alert('Failed to delete resume: ' + err.message);
      }
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-7 w-7 text-[#111827]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-[#71717A] font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 flex antialiased">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 border-r border-[#E4E4E7] bg-white flex flex-col justify-between shrink-0 hidden md:flex min-h-screen">
        <div className="p-6 space-y-6">
          {/* App Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <span className="font-bold text-base tracking-tight text-[#18181B]">
              ResumeAI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-zinc-100 text-[#18181B] font-bold'
                  : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
              }`}
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('resumes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'resumes'
                  ? 'bg-zinc-100 text-[#18181B] font-bold'
                  : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
              }`}
            >
              <span>📄</span>
              <span>My Resumes</span>
            </button>
            <button
              onClick={() => setActiveNav('cover-letters')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'cover-letters'
                  ? 'bg-zinc-100 text-[#18181B] font-bold'
                  : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
              }`}
            >
              <span>✉️</span>
              <span>Cover Letters</span>
            </button>
            <button
              onClick={() => setActiveNav('job-tracker')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'job-tracker'
                  ? 'bg-zinc-100 text-[#18181B] font-bold'
                  : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
              }`}
            >
              <span>📌</span>
              <span>Job Tracker</span>
            </button>
            <Link
              href="/pricing"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B] transition-all"
            >
              <span>💎</span>
              <span>Pricing & Plans</span>
            </Link>
          </nav>

          {/* Upgrade to Pro Card */}
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
              <span>👑 Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Unlock AI rewrites, cover letter generator & unlimited ATS downloads.
            </p>
            <Link
              href="/pricing"
              className="btn-micro block w-full py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold text-center rounded-xl shadow-xs"
            >
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#E4E4E7] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-zinc-200 text-[#18181B] flex items-center justify-center font-bold text-xs shrink-0">
              JD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#18181B] truncate">John Doe</p>
              <p className="text-[11px] text-[#71717A] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors"
            title="Sign Out"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Search */}
        <header className="h-16 border-b border-[#E4E4E7] bg-white px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#71717A]">🔍</span>
              <input
                type="text"
                placeholder="Search anything... (⌘K)"
                className="w-full pl-8 pr-4 py-1.5 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="btn-micro inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>+ Create Resume</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                Welcome back, John! 👋
              </h1>
              <p className="text-xs text-[#71717A] mt-0.5">
                Here&apos;s an overview of your resume journey and job search progress.
              </p>
            </div>
          </div>

          {/* 3. Statistics Cards (4 Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Resume Score</span>
                <span>📈</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#18181B]">88</span>
                <span className="text-xs text-[#71717A]">/100</span>
              </div>
              <p className="text-[11px] text-[#15803D] font-semibold">Great! Keep improving</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Resumes</span>
                <span>📄</span>
              </div>
              <div className="text-3xl font-bold text-[#18181B]">{resumes.length || 6}</div>
              <p className="text-[11px] text-[#71717A]">Total Resumes Created</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Cover Letters</span>
                <span>✉️</span>
              </div>
              <div className="text-3xl font-bold text-[#18181B]">4</div>
              <p className="text-[11px] text-[#71717A]">Total Cover Letters</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Applications</span>
                <span>📌</span>
              </div>
              <div className="text-3xl font-bold text-[#18181B]">24</div>
              <p className="text-[11px] text-[#71717A]">Track Applications</p>
            </div>
          </div>

          {/* 4. Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (8 cols): Recent Resumes & Activity */}
            <div className="lg:col-span-8 space-y-8">
              {/* Resume List */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#18181B]">Recent Resumes</h3>
                  <button onClick={handleOpenCreateModal} className="text-xs text-[#71717A] hover:text-[#18181B] font-semibold">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-[#E4E4E7]">
                  {resumes.map((r) => (
                    <div key={r.id} className="py-3.5 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-sm shrink-0">
                          📄
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#18181B] truncate">{r.title}</h4>
                          <p className="text-[11px] text-[#71717A] truncate">
                            Updated {formatDate(r.updated_at)} {r.target_role ? `• ${r.target_role}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full border border-emerald-600/30 bg-emerald-50 text-emerald-700 font-bold text-[11px] flex items-center justify-center">
                          {r.completion_score || 88}
                        </span>

                        <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/editor/${r.id}`}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#18181B] text-xs font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            className="p-1 rounded-lg text-[#71717A] hover:text-[#18181B]"
                            title="Rename"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteResume(r.id)}
                            className="p-1 rounded-lg text-[#71717A] hover:text-rose-600"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOpenCreateModal}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[#E4E4E7] hover:border-[#111827] text-xs font-semibold text-[#71717A] hover:text-[#18181B] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>+ Create New Resume</span>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#18181B]">Recent Activity</h3>
                  <span className="text-xs text-[#71717A] font-semibold">View all</span>
                </div>

                <div className="space-y-3.5 text-xs text-[#71717A]">
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-emerald-50 text-emerald-700 text-xs">✅</span>
                    <div className="flex-1 flex justify-between">
                      <span className="text-[#18181B] font-medium">Your resume &quot;Senior Frontend Developer&quot; score improved to 88</span>
                      <span className="text-[11px] text-[#71717A]">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-zinc-100 text-[#18181B] text-xs">✉️</span>
                    <div className="flex-1 flex justify-between">
                      <span className="text-[#18181B] font-medium">You created a new cover letter for &quot;Product Designer&quot;</span>
                      <span className="text-[11px] text-[#71717A]">1 day ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-zinc-100 text-[#18181B] text-xs">📌</span>
                    <div className="flex-1 flex justify-between">
                      <span className="text-[#18181B] font-medium">You applied for &quot;UI/UX Designer&quot; at Acme Inc.</span>
                      <span className="text-[11px] text-[#71717A]">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): AI Assistant & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Assistant Sidebar Panel */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                    <span>✨ AI Assistant</span>
                  </h3>
                  <span className="text-xs text-[#71717A]">▲</span>
                </div>
                <p className="text-xs text-[#71717A]">How can I help you today?</p>

                <div className="space-y-2">
                  <Link href="/editor/demo-1" className="block p-3 rounded-xl border border-[#E4E4E7] hover:border-[#111827] bg-[#FAFAF9] transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#18181B]">Improve Resume</span>
                      <span className="text-xs text-[#71717A]">→</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Get AI suggestions to improve your score</p>
                  </Link>

                  <Link href="/editor/demo-1" className="block p-3 rounded-xl border border-[#E4E4E7] hover:border-[#111827] bg-[#FAFAF9] transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#18181B]">Generate Cover Letter</span>
                      <span className="text-xs text-[#71717A]">→</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Create a personalized cover letter</p>
                  </Link>

                  <Link href="/editor/demo-1" className="block p-3 rounded-xl border border-[#E4E4E7] hover:border-[#111827] bg-[#FAFAF9] transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#18181B]">Resume Review</span>
                      <span className="text-xs text-[#71717A]">→</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Get detailed feedback on formatting</p>
                  </Link>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#18181B]">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenCreateModal}
                    className="p-3 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#18181B] block">+ Create</span>
                    <span className="text-[10px] text-[#71717A]">New Resume</span>
                  </button>
                  <Link
                    href="/editor/demo-1"
                    className="p-3 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-[#18181B] block">✨ Review</span>
                    <span className="text-[10px] text-[#71717A]">AI Score</span>
                  </Link>
                </div>
              </div>

              {/* Pro Tip Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
                  <span>💡 Pro Tip</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Add more quantifiable achievements in your experience section to boost your ATS resume score by 15%.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Creating / Renaming Resumes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#18181B]">
              {editingResume ? 'Rename Resume' : 'Create New Resume'}
            </h3>
            <form onSubmit={handleSaveResume} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Resume Title *</label>
                <input
                  type="text"
                  required
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Target Role / Industry</label>
                <input
                  type="text"
                  value={resumeRole}
                  onChange={(e) => setResumeRole(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#71717A] hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-[#27272A] text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingResume ? 'Save Changes' : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
