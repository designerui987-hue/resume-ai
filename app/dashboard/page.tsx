'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import AIAssistantDrawer from '@/components/ai/AIAssistantDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  TrendingUp,
  FileText,
  Mail,
  Briefcase,
  FileEdit,
  Sparkles,
  CheckSquare,
  Target,
  PenLine,
  LayoutTemplate,
  Key,
  Eye,
  ArrowRight,
  Plus,
  Bell,
  Lightbulb,
  AlertTriangle,
  MoreHorizontal,
  Zap,
  Search,
} from 'lucide-react';

type ResumeRow = Database['public']['Tables']['resumes']['Row'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [fetchingResumes, setFetchingResumes] = useState(false);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  const [fetchingCLs, setFetchingCLs] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [fetchingApps, setFetchingApps] = useState(false);
  const [atsScan, setAtsScan] = useState<any>(null);
  const [atsScansList, setAtsScansList] = useState<any[]>([]);
  const [fetchingAts, setFetchingAts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<ResumeRow | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeRole, setResumeRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'professional' | 'minimal'>('modern');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'resumes' | 'cover-letters' | 'job-tracker'>('dashboard');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // Import states
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStep, setImportStep] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Per-widget error states
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [clError, setCLError] = useState<string | null>(null);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [atsError, setAtsError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserResumes = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
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
    setResumeError(null);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err: any) {
      console.error('[Dashboard] Error fetching resumes:', err?.message ?? err);
      setResumeError('Failed to load resumes.');
    } finally {
      setFetchingResumes(false);
    }
  }, []);

  const fetchCoverLetters = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
      setCoverLetters([]);
      return;
    }
    setFetchingCLs(true);
    setCLError(null);
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('created_at, id, job_title')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (err: any) {
      console.error('[Dashboard] Error fetching cover letters:', err?.message ?? err);
      setCoverLetters([]);
      setCLError('Failed to load cover letters.');
    } finally {
      setFetchingCLs(false);
    }
  }, []);

  const fetchApplications = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
      setApplications([]);
      return;
    }
    setFetchingApps(true);
    setAppsError(null);
    try {
      const { data, error } = await supabase
        .from('job_tracker')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error('[Dashboard] Error fetching applications:', err?.message ?? err);
      setApplications([]);
      setAppsError('Failed to load applications.');
    } finally {
      setFetchingApps(false);
    }
  }, []);

  const fetchAtsScan = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
      setAtsScan(null);
      setAtsScansList([]);
      return;
    }
    setFetchingAts(true);
    setAtsError(null);
    try {
      const { data, error } = await supabase
        .from('ats_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setAtsScan(data[0]);
        setAtsScansList(data);
      } else {
        setAtsScan(null);
        setAtsScansList([]);
      }
    } catch (err: any) {
      console.error('[Dashboard] Error fetching ATS scans:', err?.message ?? err);
      setAtsScan(null);
      setAtsScansList([]);
      setAtsError('Failed to load ATS score.');
    } finally {
      setFetchingAts(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true';
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);

          // Attempt to fetch profile record if table exists
          try {
            const { data: profData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profData) {
              setProfile(profData);
            }
          } catch (pErr) {
            console.log('Profiles table fetch skipped:', pErr);
          }

          await fetchUserResumes(session.user.id);
          await fetchCoverLetters(session.user.id);
          await fetchApplications(session.user.id);
          await fetchAtsScan(session.user.id);
          setLoading(false);
        } else if (isDemo) {
          setUser({
            id: 'demo-user-id',
            email: 'john.doe@example.com',
            user_metadata: { full_name: 'John Doe' },
          } as unknown as User);
          await fetchUserResumes('demo-user-id');
          await fetchCoverLetters('demo-user-id');
          await fetchApplications('demo-user-id');
          await fetchAtsScan('demo-user-id');
          setLoading(false);
        } else {
          // If not logged in, redirect to login
          router.push('/login');
        }
      } catch (err: any) {
        console.error('Auth verification error:', err);
        setErrorMsg(err?.message || 'Authentication error. Please try logging in again.');
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, fetchUserResumes]);

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user_logged_in');
    }
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const handleOpenCreateModal = () => {
    setEditingResume(null);
    setResumeTitle('');
    setResumeRole('');
    setSelectedTemplate('modern');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMsg('Only PDF and DOCX files are supported.');
      return;
    }

    setIsImporting(true);
    setImportProgress(10);
    setImportStep('Reading file...');
    setErrorMsg(null);

    try {
      // Simulate progress steps
      await new Promise(r => setTimeout(r, 400));
      setImportProgress(30);
      setImportStep('Extracting text content...');

      // Read file text (basic extraction)
      let extractedText = '';
      if (ext === 'pdf') {
        // For PDF we store the raw file and note extraction
        extractedText = `Imported from: ${file.name}`;
      } else {
        // For DOCX we read as text best-effort
        try {
          extractedText = await file.text();
        } catch {
          extractedText = `Imported from: ${file.name}`;
        }
      }

      setImportProgress(60);
      setImportStep('Creating draft resume...');
      await new Promise(r => setTimeout(r, 300));

      const resumeName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      let newId = 'import-' + Date.now();

      if (user.id !== 'demo-user-id') {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: resumeName,
            target_role: null,
            summary: extractedText.substring(0, 500) || null,
            status: 'Draft',
            completion_score: 50,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data?.id) newId = data.id;
      } else {
        const now = new Date().toISOString();
        const mockResume: ResumeRow = {
          id: newId,
          user_id: user.id,
          title: resumeName,
          target_role: null,
          summary: extractedText.substring(0, 500) || null,
          contact_email: null, contact_phone: null, location: null,
          website_url: null, linkedin_url: null, github_url: null,
          status: 'Draft', completion_score: 50,
          created_at: now, updated_at: now,
        };
        setResumes(prev => [mockResume, ...prev]);
      }

      setImportProgress(90);
      setImportStep('Finalising...');
      await new Promise(r => setTimeout(r, 300));
      setImportProgress(100);

      setSuccessMsg(`"${resumeName}" imported successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);

      await fetchUserResumes(user.id);
      router.push(`/editor/${newId}`);
    } catch (err: any) {
      console.error('[Import] Error:', err?.message ?? err);
      setErrorMsg('Failed to import resume. Please try again.');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      setImportStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        const { error } = await supabase
          .from('resumes')
          .update({
            title: resumeTitle.trim(),
            target_role: resumeRole.trim() || null,
          })
          .eq('id', editingResume.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsModalOpen(false);
        await fetchUserResumes(user.id);
      } else {
        const { data: newData, error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: resumeTitle.trim(),
            target_role: resumeRole.trim() || null,
            status: 'Draft',
            completion_score: 80,
          })
          .select('id')
          .single();

        if (error) throw error;
        setIsModalOpen(false);
        await fetchUserResumes(user.id);
        if (newData?.id) router.push(`/editor/${newData.id}`);
      }
    } catch (err: any) {
      console.error('Error saving resume:', err);
      setErrorMsg(err?.message || 'Failed to save resume to Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this resume?')) {
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

  // Dynamic User Profile Calculations
  const rawName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : 'User');

  const formattedFullName = rawName
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const firstName = formattedFullName.split(' ')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  const initials =
    formattedFullName
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  // Dynamic Greeting based on time of day
  const hour = new Date().getHours();
  const greetingTime =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Dynamic Motivational Subtitle based on resume progress
  const avgScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((acc, r) => acc + (r.completion_score || 0), 0) / resumes.length
        )
      : 0;

  let motivationalMessage =
    'Your resume is looking great. Keep improving to increase your ATS score.';

  if (resumes.length === 0) {
    motivationalMessage = 'Create your first resume to start unlocking job interviews.';
  } else if (avgScore >= 85) {
    motivationalMessage = 'Your resume is looking great. Keep improving to increase your ATS score.';
  } else if (avgScore >= 70) {
    motivationalMessage = 'Good progress on your resume. Optimize a few more sections to reach top ATS score.';
  } else {
    motivationalMessage = 'Your resume is off to a good start. Add more details to boost your score.';
  }

  const highestScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.completion_score || 0)) : 0;
  const lastScanDate = resumes.length > 0 ? new Date(Math.max(...resumes.map((r) => new Date(r.updated_at).getTime()))) : null;

  const clCount = coverLetters.length;
  const lastCLDate = clCount > 0 ? new Date(coverLetters[0].created_at) : null;

  const totalApps = applications.length;
  const appStats = {
    Applied: applications.filter(a => a.status?.toLowerCase() === 'applied').length,
    Interview: applications.filter(a => a.status?.toLowerCase() === 'interview').length,
    Offer: applications.filter(a => a.status?.toLowerCase() === 'offer').length,
    Rejected: applications.filter(a => a.status?.toLowerCase() === 'rejected').length,
  };

  const activities = useMemo(() => {
    const feed: any[] = [];

    // 1. Resumes created and updated
    resumes.forEach((r) => {
      feed.push({
        id: `res-c-${r.id}`,
        type: 'resume_created',
        title: `You created a new resume "${r.title || 'Untitled Resume'}"`,
        timestamp: r.created_at,
        icon: '📄',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        textColor: 'text-blue-700'
      });
      if (r.updated_at && r.updated_at !== r.created_at) {
        feed.push({
          id: `res-u-${r.id}`,
          type: 'resume_updated',
          title: `You updated your resume "${r.title || 'Untitled Resume'}"`,
          timestamp: r.updated_at,
          icon: '✏️',
          bgColor: 'bg-zinc-50',
          borderColor: 'border-[#E4E4E7]',
          textColor: 'text-[#18181B]'
        });
      }
    });

    // 2. Cover letters generated
    coverLetters.forEach((cl) => {
      feed.push({
        id: `cl-${cl.id}`,
        type: 'cover_letter',
        title: `You created a new cover letter for "${cl.job_title || 'a job'}"`,
        timestamp: cl.created_at,
        icon: '✉️',
        bgColor: 'bg-zinc-50',
        borderColor: 'border-[#E4E4E7]',
        textColor: 'text-[#18181B]'
      });
    });

    // 3. Applications
    applications.forEach((app) => {
      feed.push({
        id: `app-${app.id}`,
        type: 'job_application',
        title: `You applied for "${app.job_title || 'a role'}" at ${app.company || app.company_name || 'a company'}`,
        timestamp: app.created_at,
        icon: '📌',
        bgColor: 'bg-zinc-50',
        borderColor: 'border-[#E4E4E7]',
        textColor: 'text-[#18181B]'
      });
    });

    // 4. ATS Scans
    atsScansList.forEach((scan) => {
      feed.push({
        id: `ats-${scan.id}`,
        type: 'ats_check',
        title: `Your resume score improved to ${scan.overall_score || 0}`,
        timestamp: scan.created_at,
        icon: '✅',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        textColor: 'text-emerald-700'
      });
    });

    // Sort descending by date and take top 10
    feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return feed.slice(0, 10);
  }, [resumes, coverLetters, applications, atsScansList]);

  const proTip = useMemo(() => {
    if (!atsScan) {
      return "Run an ATS scan on your resume to get personalized AI recommendations for improvement.";
    }
    
    const scores = {
      keywords: atsScan.keywords_score || 0,
      formatting: atsScan.formatting_score || 0,
      readability: atsScan.readability_score || 0,
      content: atsScan.content_score || 0
    };
    
    let lowestCategory = 'content';
    let lowestScore = scores.content;
    
    for (const [category, score] of Object.entries(scores)) {
      if (score < lowestScore) {
        lowestScore = score;
        lowestCategory = category;
      }
    }
    
    if (lowestCategory === 'keywords') {
      return "Your keyword match is a bit low. Try tailoring your resume skills to match specific phrases in the job description.";
    } else if (lowestCategory === 'formatting') {
      return "Ensure your layout uses standard fonts and clear headings so ATS systems can parse it easily.";
    } else if (lowestCategory === 'readability') {
      return "Use clear bullet points and action verbs to make your experience section highly readable for recruiters.";
    } else {
      return "Add measurable achievements (like percentages or metrics) to your experience section to improve your ATS score.";
    }
  }, [atsScan]);

  const reminders = useMemo(() => {
    const list: any[] = [];
    const now = new Date();

    // 1. Upcoming interviews & deadlines
    applications.forEach(app => {
      if (app.status?.toLowerCase() === 'interview') {
        // Fallback to 7 days from creation if no explicit date
        const date = app.interview_date ? new Date(app.interview_date) : new Date(new Date(app.created_at).getTime() + 7 * 24 * 60 * 60 * 1000);
        if (date > now) {
          list.push({
            id: `int-${app.id}`,
            icon: '⏱️',
            title: `Interview with ${app.company || app.company_name || 'Company'}`,
            subtitle: app.job_title || 'Role',
            date: date
          });
        }
      }
      if (app.status?.toLowerCase() === 'applied' || app.status?.toLowerCase() === 'saved') {
        // Fallback to 14 days
        const date = app.deadline_date ? new Date(app.deadline_date) : new Date(new Date(app.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
        if (date > now) {
           list.push({
             id: `dead-${app.id}`,
             icon: '📅',
             title: `Deadline: ${app.company || app.company_name || 'Company'}`,
             subtitle: app.job_title || 'Role',
             date: date
           });
        }
      }
    });

    // 2. Resume review reminders
    resumes.forEach(r => {
      const updatedAt = new Date(r.updated_at);
      const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24);
      if (daysSinceUpdate > 30) {
        list.push({
          id: `rev-${r.id}`,
          icon: '✨',
          title: `Review Resume: ${r.title || 'Untitled'}`,
          subtitle: 'Not updated in 30+ days',
          date: new Date(now.getTime() + 24 * 60 * 60 * 1000) // Tomorrow
        });
      }
    });

    // Sort by nearest date
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    return list.slice(0, 3);
  }, [applications, resumes]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 flex antialiased">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-w-0">
        <TopHeader />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Error toast */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0" /><span>{errorMsg}</span></div>
              <button onClick={() => setErrorMsg(null)} className="text-rose-900 font-bold hover:underline ml-3">Dismiss</button>
            </div>
          )}
          {/* Success toast */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2"><CheckSquare className="w-3.5 h-3.5 shrink-0" /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-900 font-bold hover:underline ml-3">Dismiss</button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                {greetingTime}, {firstName} 👋
              </h1>
              <p className="text-xs text-[#71717A] mt-0.5">
                {motivationalMessage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Resume Score</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              {loading ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : resumeError ? (
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-rose-600 font-medium">{resumeError}</p>
                  <button onClick={() => user && fetchUserResumes(user.id)} className="text-[11px] font-semibold text-[#18181B] underline cursor-pointer">Retry</button>
                </div>
              ) : resumes.length === 0 ? (
                <div className="pt-2">
                  <p className="text-sm font-semibold text-[#18181B]">No resume score available.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#18181B]">{highestScore}</span>
                    <span className="text-xs text-[#71717A]">/100</span>
                  </div>
                  <p className="text-[11px] text-[#71717A] font-medium">Avg: {avgScore} • Last scan: {lastScanDate ? formatDate(lastScanDate.toISOString()) : 'N/A'}</p>
                </>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Resumes</span>
                <FileText className="w-4 h-4" />
              </div>
              {loading ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : resumeError ? (
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-rose-600 font-medium">{resumeError}</p>
                  <button onClick={() => user && fetchUserResumes(user.id)} className="text-[11px] font-semibold text-[#18181B] underline cursor-pointer">Retry</button>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-[#18181B]">{resumes.length}</div>
                  <p className="text-[11px] text-[#71717A]">Total Resumes</p>
                </>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Cover Letters</span>
                <Mail className="w-4 h-4" />
              </div>
              {loading || fetchingCLs ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : clError ? (
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-rose-600 font-medium">{clError}</p>
                  <button onClick={() => user && fetchCoverLetters(user.id)} className="text-[11px] font-semibold text-[#18181B] underline cursor-pointer">Retry</button>
                </div>
              ) : clCount === 0 ? (
                <div className="pt-1">
                  <p className="text-xs font-semibold text-[#18181B]">No cover letters created.</p>
                  <Link href="/cover-letters" className="inline-block mt-1.5 text-[11px] font-semibold text-blue-600 hover:underline">
                    + Create Cover Letter
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-[#18181B]">{clCount}</div>
                  <p className="text-[11px] text-[#71717A]">Last: {lastCLDate ? formatDate(lastCLDate.toISOString()) : 'N/A'}</p>
                </>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-2 hover-lift transition-all">
              <div className="flex justify-between items-center text-xs text-[#71717A]">
                <span className="font-semibold">Applications</span>
                <Briefcase className="w-4 h-4" />
              </div>
              {loading || fetchingApps ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : appsError ? (
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-rose-600 font-medium">{appsError}</p>
                  <button onClick={() => user && fetchApplications(user.id)} className="text-[11px] font-semibold text-[#18181B] underline cursor-pointer">Retry</button>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-[#18181B]">{totalApps}</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#71717A] mt-1">
                    <div>Applied: <span className="font-semibold text-[#18181B]">{appStats.Applied}</span></div>
                    <div>Interview: <span className="font-semibold text-[#18181B]">{appStats.Interview}</span></div>
                    <div>Offer: <span className="font-semibold text-[#18181B]">{appStats.Offer}</span></div>
                    <div>Rejected: <span className="font-semibold text-[#18181B]">{appStats.Rejected}</span></div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#18181B]">Recent Resumes</h3>
                  <button onClick={handleOpenCreateModal} className="text-[11px] px-3 py-1 rounded-full border border-[#E4E4E7] text-[#18181B] font-semibold hover:bg-zinc-50">
                    View all
                  </button>
                </div>

                <div className="divide-y divide-[#E4E4E7]">
                  {loading ? (
                    <div className="space-y-3 py-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-1">
                          <Skeleton className="w-10 h-10 rounded-xl" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-3.5 w-3/4" />
                            <Skeleton className="h-2.5 w-1/2" />
                          </div>
                          <Skeleton className="w-8 h-8 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : resumeError ? (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-[12px] text-rose-600 font-medium flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {resumeError}
                      </p>
                      <button onClick={() => user && fetchUserResumes(user.id)} className="text-[11px] font-semibold text-[#18181B] border border-[#E4E4E7] px-3 py-1 rounded-lg hover:bg-zinc-50 cursor-pointer">Retry</button>
                    </div>
                  ) : resumes.length === 0 ? (
                    <EmptyState
                      compact
                      icon="📄"
                      title="No resumes found"
                      description="Create your first resume to see it here."
                      actionLabel="Create Resume"
                      onAction={handleOpenCreateModal}
                    />
                  ) : resumes.slice(0, 5).map((r) => (
                    <div key={r.id} className="py-4 flex items-center justify-between gap-4 group">
                      <Link href={`/editor/${r.id}`} className="flex items-center gap-4 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-[#E4E4E7] flex items-center justify-center shrink-0 shadow-xs">
                          <FileText className="w-4 h-4 text-[#71717A]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-bold text-[#18181B] truncate">{r.title}</h4>
                          <p className="text-[11px] text-[#71717A] truncate mt-0.5">
                            Updated {formatDate(r.updated_at)}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/editor/${r.id}`}
                          className="w-8 h-8 rounded-full border border-emerald-600/30 bg-white text-[#18181B] font-bold text-[13px] flex items-center justify-center shadow-xs hover:border-emerald-600 transition-colors"
                        >
                          {r.completion_score || 88}
                        </Link>
                        <div className="relative menu-container">
                          <button 
                            onClick={(e) => { e.preventDefault(); setOpenMenuId(openMenuId === r.id ? null : r.id); }}
                            className="text-[#71717A] hover:text-[#18181B] p-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenuId === r.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E4E4E7] shadow-lg rounded-xl py-1 z-50 overflow-hidden">
                              <Link href={`/editor/${r.id}`} className="block w-full text-left px-4 py-2 text-[11px] text-[#18181B] hover:bg-zinc-50 font-medium">Edit</Link>
                              <button className="block w-full text-left px-4 py-2 text-[11px] text-[#18181B] hover:bg-zinc-50 font-medium cursor-pointer">Duplicate</button>
                              <button className="block w-full text-left px-4 py-2 text-[11px] text-[#18181B] hover:bg-zinc-50 font-medium cursor-pointer">Download PDF</button>
                              <button className="block w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-red-50 font-medium cursor-pointer">Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {resumes.length > 0 && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="w-full py-3.5 rounded-xl border border-dashed border-[#E4E4E7] text-[13px] font-semibold text-[#18181B] hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Resume</span>
                  </button>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#18181B]">Recent Activity</h3>
                </div>

                <div className="space-y-4 text-[13px] text-[#71717A] pt-2">
                  {loading || fetchingCLs || fetchingApps || fetchingAts ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Skeleton className="w-6 h-6 rounded" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-2.5 w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length === 0 ? (
                    <EmptyState
                      compact
                      icon="⚡"
                      title="No recent activity"
                      description="Actions you take will appear here automatically."
                      actionLabel="Create Resume"
                      onAction={handleOpenCreateModal}
                    />
                  ) : (
                    activities.map((act) => {
                      const now = new Date();
                      const actDate = new Date(act.timestamp);
                      const diffMs = now.getTime() - actDate.getTime();
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffDays = Math.floor(diffHrs / 24);
                      
                      let timeString = '';
                      if (diffHrs < 1) timeString = 'Just now';
                      else if (diffHrs < 24) timeString = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
                      else timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

                      const actIconMap: Record<string, React.ReactNode> = {
                        resume_created: <FileText className="w-3.5 h-3.5" />,
                        resume_updated: <FileEdit className="w-3.5 h-3.5" />,
                        cover_letter: <Mail className="w-3.5 h-3.5" />,
                        job_application: <Briefcase className="w-3.5 h-3.5" />,
                        ats_check: <CheckSquare className="w-3.5 h-3.5" />,
                      };

                      return (
                        <div key={act.id} className="flex items-start gap-3">
                          <span className={`p-1.5 rounded-lg ${act.bgColor} border ${act.borderColor} ${act.textColor} flex items-center justify-center shrink-0`}>
                            {actIconMap[act.type] ?? <Zap className="w-3.5 h-3.5" />}
                          </span>
                          <div className="flex-1 flex justify-between gap-4">
                            <span className="text-[#18181B] leading-tight">{act.title}</span>
                            <span className="text-[11px] text-[#71717A] whitespace-nowrap">{timeString}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-6">
                <h3 className="text-[15px] font-bold text-[#18181B]">Resume Score</h3>
                
                {loading || fetchingAts ? (
                  <div className="flex flex-col items-center py-4 space-y-4">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <div className="w-full space-y-3 pt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : atsError ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-[12px] text-rose-600 font-medium flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {atsError}
                    </p>
                    <button onClick={() => user && fetchAtsScan(user.id)} className="text-[11px] font-semibold text-[#18181B] border border-[#E4E4E7] px-3 py-1.5 rounded-lg hover:bg-zinc-50 cursor-pointer">Retry</button>
                  </div>
                ) : !atsScan ? (
                  <EmptyState
                    compact
                    icon="🔍"
                    title="No ATS check run"
                    description="Run an ATS scan to see your score analysis."
                    actionLabel="Run ATS Check"
                    actionHref="/ats-checker"
                  />
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#E4E4E7" strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#15803D" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * (atsScan.overall_score || 0)) / 100} className="transition-all duration-1000" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-[#18181B]">{atsScan.overall_score || 0}</span>
                          <span className="text-[11px] text-[#71717A]">/100</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#71717A] text-center mt-4">
                        {atsScan.overall_score >= 80 ? 'Great job! Your resume is strong.' : 'Keep improving to boost your score.'}
                      </p>
                      <button className="w-full mt-4 py-2 rounded-xl border border-[#E4E4E7] text-[13px] font-semibold text-[#18181B] hover:bg-zinc-50 transition-colors cursor-pointer">
                        Improve Score
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-bold text-[#18181B] mb-3">Score Breakdown</h4>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-[13px]">
                          <div className="flex items-center gap-2 text-[#71717A]"><PenLine className="w-3.5 h-3.5" /> Content</div>
                          <span className="font-semibold text-[#15803D]">{atsScan.content_score || 0}/100</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <div className="flex items-center gap-2 text-[#71717A]"><LayoutTemplate className="w-3.5 h-3.5" /> Formatting</div>
                          <span className="font-semibold text-[#15803D]">{atsScan.formatting_score || 0}/100</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <div className="flex items-center gap-2 text-[#71717A]"><Key className="w-3.5 h-3.5" /> Keywords</div>
                          <span className="font-semibold text-[#15803D]">{atsScan.keywords_score || 0}/100</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <div className="flex items-center gap-2 text-[#71717A]"><Eye className="w-3.5 h-3.5" /> Readability</div>
                          <span className="font-semibold text-[#15803D]">{atsScan.readability_score || 0}/100</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <h3 className="text-[15px] font-bold text-[#18181B]">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleOpenCreateModal} className="p-3.5 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors flex items-center gap-2 cursor-pointer">
                    <Plus className="w-4 h-4 text-[#71717A]" />
                    <span className="text-[12px] font-medium text-[#71717A]">Create Resume</span>
                  </button>
                  <button onClick={() => setIsAIDrawerOpen(true)} className="p-3.5 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-[#71717A]" />
                    <span className="text-[12px] font-medium text-[#71717A]">AI Resume Review</span>
                  </button>
                  <Link href="/ats-checker" className="p-3.5 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors flex items-center gap-2 cursor-pointer">
                    <CheckSquare className="w-4 h-4 text-[#71717A]" />
                    <span className="text-[12px] font-medium text-[#71717A]">Check ATS Score</span>
                  </Link>
                  <Link href="/job-match" className="p-3.5 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-left transition-colors flex items-center gap-2 cursor-pointer">
                    <Target className="w-4 h-4 text-[#71717A]" />
                    <span className="text-[12px] font-medium text-[#71717A]">Job Match</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#18181B] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#18181B]" /> AI Assistant
                  </h3>
                  <span className="text-[#71717A] cursor-pointer">︿</span>
                </div>
                <p className="text-[13px] text-[#71717A]">How can I help you today?</p>

                <div className="space-y-3">
                  <button onClick={() => setIsAIDrawerOpen(true)} className="block w-full text-left pb-3 border-b border-[#E4E4E7] hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-[#18181B]">Improve Resume</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#71717A] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1">Get AI suggestions to improve your resume</p>
                  </button>

                  <button onClick={() => setIsAIDrawerOpen(true)} className="block w-full text-left pb-3 border-b border-[#E4E4E7] hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-[#18181B]">Generate Cover Letter</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#71717A] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1">Create a personalized cover letter</p>
                  </button>

                  <button onClick={() => setIsAIDrawerOpen(true)} className="block w-full text-left pb-3 border-[#E4E4E7] hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-[#18181B]">Optimize for Job</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#71717A] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1">Tailor your resume for a specific job</p>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-[15px] font-bold text-[#18181B]">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </div>
                {loading || fetchingAts ? (
                  <div className="space-y-2 pt-1">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                    <Skeleton className="h-8 w-28 rounded-xl mt-2" />
                  </div>
                ) : (
                  <>
                    <p className="text-[13px] text-[#71717A] leading-relaxed">
                      {proTip}
                    </p>
                    <button className="text-[13px] font-semibold text-[#18181B] border border-[#E4E4E7] px-4 py-2 rounded-xl mt-2 hover:bg-zinc-50 cursor-pointer">
                      Learn More
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[15px] font-bold text-[#18181B]">
                  <Bell className="w-4 h-4" /> Upcoming Reminders
                </div>
                
                {loading || fetchingApps ? (
                  <div className="space-y-3 pt-1">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-3.5 w-3/4" />
                          <Skeleton className="h-2.5 w-1/2" />
                        </div>
                        <Skeleton className="w-12 h-6" />
                      </div>
                    ))}
                  </div>
                ) : reminders.length === 0 ? (
                  <EmptyState
                    compact
                    icon="🔔"
                    title="No upcoming reminders"
                    description="Track job deadlines and interviews easily."
                    actionLabel="Job Match"
                    actionHref="/job-match"
                  />
                ) : (
                  <div className="space-y-4">
                    {reminders.map((reminder) => {
                      const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' });
                      const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
                      
                      return (
                        <div key={reminder.id} className="flex gap-3">
                          <div className="text-xl">{reminder.icon}</div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#18181B] truncate">{reminder.title}</p>
                            <p className="text-[11px] text-[#71717A] truncate">{reminder.subtitle}</p>
                          </div>
                          <div className="ml-auto text-right shrink-0">
                            <p className="text-[11px] text-[#71717A]">{formatter.format(reminder.date)}</p>
                            <p className="text-[11px] text-[#71717A]">{timeFormatter.format(reminder.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {reminders.length > 0 && (
                  <button className="w-full py-2.5 rounded-xl border border-[#E4E4E7] text-[13px] font-semibold text-[#18181B] hover:bg-zinc-50 mt-2 cursor-pointer transition-colors">
                    View Calendar
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Import progress overlay */}
      {isImporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl border border-[#E4E4E7] space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-[#E4E4E7] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5 text-[#18181B] animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#18181B] mb-1">Importing Resume</p>
              <p className="text-xs text-[#71717A]">{importStep}</p>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#111827] h-2 rounded-full transition-all duration-500"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#71717A]">{importProgress}%</p>
          </div>
        </div>
      )}

      {/* Create / Edit Resume Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-[#E4E4E7]">
              <h3 className="text-base font-bold text-[#18181B]">
                {editingResume ? 'Rename Resume' : 'Create New Resume'}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                {editingResume ? 'Update the title of this resume.' : 'Name your resume and choose a starting template.'}
              </p>
            </div>

            <form onSubmit={handleSaveResume} className="p-6 space-y-4">
              {/* Resume Name */}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Resume Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827] transition-colors"
                />
              </div>

              {/* Template Selection — only shown on create */}
              {!editingResume && (
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] mb-2">Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'modern', label: 'Modern', icon: '🎨', desc: 'Clean & bold' },
                      { id: 'professional', label: 'Professional', icon: '💼', desc: 'Structured' },
                      { id: 'minimal', label: 'Minimal', icon: '✦', desc: 'Simple & clean' },
                    ] as const).map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedTemplate === tpl.id
                            ? 'border-[#111827] bg-zinc-50 shadow-2xs'
                            : 'border-[#E4E4E7] hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="text-base block mb-1">{tpl.icon}</span>
                        <p className="text-[11px] font-bold text-[#18181B]">{tpl.label}</p>
                        <p className="text-[10px] text-[#71717A]">{tpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Import option */}
              {!editingResume && (
                <div className="border-t border-[#E4E4E7] pt-3">
                  <p className="text-[11px] text-[#71717A] mb-2">Or import an existing file:</p>
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); handleTriggerImport(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#E4E4E7] text-[12px] font-semibold text-[#71717A] hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Import PDF or DOCX
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#71717A] hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-[#27272A] text-white shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : editingResume ? 'Save Changes' : 'Create Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAIDrawerOpen} onClose={() => setIsAIDrawerOpen(false)} />
    </div>
  );
}
