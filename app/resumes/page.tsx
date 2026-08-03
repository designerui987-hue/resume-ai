'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/resumes/Sidebar';
import { Header } from '@/components/resumes/Header';
import { StatsCard } from '@/components/resumes/StatsCard';
import { Filters } from '@/components/resumes/Filters';
import { ResumeCard, ResumeItem } from '@/components/resumes/ResumeCard';
import { ResumeInsights } from '@/components/resumes/ResumeInsights';
import { RecentActivity } from '@/components/resumes/RecentActivity';
import { TipsCard } from '@/components/resumes/TipsCard';
import { Pagination } from '@/components/resumes/Pagination';
import { MobileNav } from '@/components/ui/MobileNav';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { logActivity } from '@/lib/activityLogger';

const ITEMS_PER_PAGE = 8;

// Helper: derive ResumeItem display fields from a raw Supabase row
function toResumeItem(row: any): ResumeItem {
  const updated = row.updated_at ? new Date(row.updated_at) : new Date(row.created_at);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffHrs / 24);

  let updatedAgo = 'Just now';
  if (diffHrs >= 1 && diffHrs < 24) updatedAgo = `${diffHrs}h ago`;
  else if (diffDays === 1) updatedAgo = 'Yesterday';
  else if (diffDays > 1) updatedAgo = `${diffDays} days ago`;

  const modifiedDate = updated.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    id: row.id,
    title: row.title || 'Untitled Resume',
    isDefault: row.is_default ?? false,
    updatedAgo,
    pages: 1,
    modifiedDate,
    atsScore: row.completion_score ?? 0,
    status: row.status ?? 'Draft',
    targetRole: row.target_role ?? '',
    skills: [],
    companies: [],
    createdAt: row.created_at || row.updated_at || new Date().toISOString(),
    lastOpenedAt: row.last_opened_at || row.updated_at || row.created_at || new Date().toISOString(),
  };
}

export default function ResumesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data state
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStep, setImportStep] = useState('');

  // Notification state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ───────── Auth + data fetch ───────── */
  const fetchResumes = useCallback(async (uid: string) => {
    if (uid === 'demo-user-id') {
      // Use static demo cards with roles, skills, and companies for rich search and filtering
      setResumes([
        {
          id: 'demo-1',
          title: 'Senior Frontend Developer',
          targetRole: 'Senior React / Next.js Engineer',
          skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'GraphQL'],
          companies: ['Acme Inc', 'Vercel', 'Meta'],
          isDefault: true,
          updatedAgo: '2 hours ago',
          pages: 2,
          modifiedDate: '08 May 2025',
          atsScore: 92,
          status: 'Completed',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          lastOpenedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        {
          id: 'demo-2',
          title: 'Product Manager',
          targetRole: 'Staff Product Manager',
          skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Jira', 'User Research', 'SQL'],
          companies: ['Stripe', 'Google', 'Linear'],
          isDefault: false,
          updatedAgo: '2 days ago',
          pages: 1,
          modifiedDate: '06 May 2025',
          atsScore: 88,
          status: 'Draft',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          lastOpenedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'demo-3',
          title: 'Full Stack Developer',
          targetRole: 'Lead Full Stack Engineer',
          skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS', 'Python'],
          companies: ['Amazon', 'Uber', 'GitHub'],
          isDefault: false,
          updatedAgo: '5 days ago',
          pages: 2,
          modifiedDate: '03 May 2025',
          atsScore: 74,
          status: 'Draft',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          lastOpenedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: 'demo-4',
          title: 'UI/UX Designer',
          targetRole: 'Senior Product Designer',
          skills: ['Figma', 'User Testing', 'Design Systems', 'Wireframing', 'Prototyping'],
          companies: ['Figma', 'Airbnb', 'Design Co'],
          isDefault: false,
          updatedAgo: '1 week ago',
          pages: 1,
          modifiedDate: '30 Apr 2025',
          atsScore: 90,
          status: 'Completed',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          lastOpenedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'demo-5',
          title: 'Data Analyst',
          targetRole: 'Senior Business Intelligence Analyst',
          skills: ['Python', 'R', 'Tableau', 'Power BI', 'SQL', 'Data Modeling'],
          companies: ['Snowflake', 'Databricks', 'Palantir'],
          isDefault: false,
          updatedAgo: '2 weeks ago',
          pages: 1,
          modifiedDate: '20 Apr 2025',
          atsScore: 68,
          status: 'Draft',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          lastOpenedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          id: 'demo-6',
          title: 'Backend Engineer (Legacy)',
          targetRole: 'Backend Engineer',
          skills: ['Java', 'Spring Boot', 'MySQL'],
          companies: ['Oracle'],
          isDefault: false,
          updatedAgo: '1 month ago',
          pages: 1,
          modifiedDate: '10 Mar 2025',
          atsScore: 60,
          status: 'Archived',
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          lastOpenedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: rawResumes, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (rawResumes && rawResumes.length > 0) {
        const resumeIds = rawResumes.map(r => r.id);
        const [{ data: skillsData }, { data: expData }] = await Promise.all([
          supabase.from('skills').select('resume_id, name').in('resume_id', resumeIds),
          supabase.from('experiences').select('resume_id, company_name').in('resume_id', resumeIds),
        ]);

        const skillsMap: Record<string, string[]> = {};
        (skillsData || []).forEach(s => {
          if (!skillsMap[s.resume_id]) skillsMap[s.resume_id] = [];
          if (s.name) skillsMap[s.resume_id].push(s.name);
        });

        const compMap: Record<string, string[]> = {};
        (expData || []).forEach(e => {
          if (!compMap[e.resume_id]) compMap[e.resume_id] = [];
          if (e.company_name) compMap[e.resume_id].push(e.company_name);
        });

        setResumes(
          rawResumes.map(r => ({
            ...toResumeItem(r),
            skills: skillsMap[r.id] || [],
            companies: compMap[r.id] || [],
          }))
        );
      } else {
        setResumes([]);
      }
    } catch (err: any) {
      console.error('[Resumes] fetch error:', err?.message ?? err);
      setErrorMsg('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Initialize state from URL query parameters or localStorage if present
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const fParam = searchParams.get('filter');
        const sParam = searchParams.get('sort');
        const qParam = searchParams.get('q');
        const vParam = searchParams.get('view');
        const savedSort = localStorage.getItem('resume_ai_sort_by');
        const savedView = localStorage.getItem('resume_ai_view_mode') as 'list' | 'grid' | null;

        if (fParam) setStatusFilter(fParam);
        if (sParam) {
          setSortBy(sParam);
        } else if (savedSort) {
          setSortBy(savedSort);
        }
        if (vParam === 'grid' || vParam === 'list') {
          setViewMode(vParam);
        } else if (savedView === 'grid' || savedView === 'list') {
          setViewMode(savedView);
        }
        if (qParam) setSearchQuery(qParam);
      }

      const isDemo =
        typeof window !== 'undefined' &&
        localStorage.getItem('demo_user_logged_in') === 'true';

      if (isDemo) {
        setUserId('demo-user-id');
        fetchResumes('demo-user-id');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUserId(session.user.id);
      fetchResumes(session.user.id);
    };
    init();
  }, [router, fetchResumes]);

  // Global Keyboard Shortcuts (N, /, Delete, Ctrl+D, Esc)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isTyping =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (e.key === 'Escape') {
        if (isTyping) {
          (document.activeElement as HTMLElement)?.blur();
        }
        setSearchQuery('');
        return;
      }

      if (isTyping) return;

      // Shortcut: '/' -> Focus Search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
        return;
      }

      // Shortcut: 'N' or 'n' -> Create Resume
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleCreateNew();
        return;
      }

      // Shortcut: 'Ctrl + D' or 'Cmd + D' -> Duplicate Resume
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (resumes.length > 0) {
          handleDuplicate(resumes[0].id);
        }
        return;
      }

      // Shortcut: 'Delete' -> Delete Selected
      if (e.key === 'Delete') {
        e.preventDefault();
        if (resumes.length > 0) {
          handleDelete(resumes[0].id);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resumes]);

  // Helper to sync state changes to URL query parameters without reloading
  const updateUrlParams = (filterVal: string, sortVal: string, queryVal: string, viewVal?: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (filterVal && filterVal !== 'all') params.set('filter', filterVal);
    if (sortVal && sortVal !== 'newest') params.set('sort', sortVal);
    if (queryVal && queryVal.trim()) params.set('q', queryVal.trim());
    if (viewVal && viewVal !== 'list') params.set('view', viewVal);

    const newQueryStr = params.toString();
    const newUrl = newQueryStr ? `${window.location.pathname}?${newQueryStr}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  /* ───────── Actions ───────── */
  const handleCreateNew = () => {
    logActivity('created', 'New Resume');
    router.push('/editor/new-' + Date.now());
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMsg('Only PDF and DOCX files are supported.');
      return;
    }

    setIsImporting(true);
    setImportProgress(10);
    setImportStep('Reading file…');
    setErrorMsg(null);

    try {
      // Step 1 – read / extract text
      await new Promise(r => setTimeout(r, 400));
      setImportProgress(30);
      setImportStep('Extracting text content…');

      let extractedText = '';
      if (ext === 'docx') {
        try { extractedText = await file.text(); } catch { /* binary fallback */ }
      }
      // For PDF, text extraction needs a worker; we store a placeholder and let the editor handle it
      extractedText = extractedText || `Imported from: ${file.name}`;

      setImportProgress(60);
      setImportStep('Creating draft resume…');
      await new Promise(r => setTimeout(r, 300));

      const resumeName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ');

      let newId = 'import-' + Date.now();

      if (userId !== 'demo-user-id') {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: userId,
            title: resumeName,
            summary: extractedText.substring(0, 500) || null,
            status: 'Draft',
            completion_score: 50,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data?.id) newId = data.id;
      } else {
        // Demo mode – add optimistically
        const newItem: ResumeItem = {
          id: newId,
          title: resumeName,
          isDefault: false,
          updatedAgo: 'Just now',
          pages: 1,
          modifiedDate: 'Today',
          atsScore: 50,
          status: 'Draft',
        };
        setResumes(prev => [newItem, ...prev]);
      }

      setImportProgress(90);
      setImportStep('Finalising…');
      await new Promise(r => setTimeout(r, 300));
      setImportProgress(100);

      logActivity('created', resumeName);
      setSuccessMsg(`"${resumeName}" imported successfully!`);
      setTimeout(() => setSuccessMsg(null), 5000);

      if (userId !== 'demo-user-id') await fetchResumes(userId);
      router.push(`/editor/${newId}`);
    } catch (err: any) {
      console.error('[Resumes] import error:', err?.message ?? err);
      setErrorMsg('Failed to import resume. Please try again.');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      setImportStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    const target = resumes.find(r => r.id === id);
    if (target) logActivity('deleted', target.title);

    // Soft delete first: update status to 'Archived' and set deleted_at
    setResumes(prev => prev.filter(r => r.id !== id));

    if (userId && userId !== 'demo-user-id') {
      const { error } = await supabase
        .from('resumes')
        .update({
          status: 'Archived',
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('[Resumes] soft delete error:', error.message);
        setErrorMsg('Failed to delete resume.');
        if (userId) fetchResumes(userId);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    const target = resumes.find(r => r.id === id);
    if (!target) return;

    const newId = 'dup-' + Date.now();
    const newTitle = `Copy of ${target.title}`;

    if (userId && userId !== 'demo-user-id') {
      try {
        // 1. Duplicate master resume row
        const { data: newResume, error: rErr } = await supabase
          .from('resumes')
          .insert({
            user_id: userId,
            title: newTitle,
            target_role: target.targetRole || null,
            status: 'Draft',
            completion_score: target.atsScore,
          })
          .select('id')
          .single();

        if (rErr) throw rErr;
        const targetId = newResume?.id || newId;

        // 2. Duplicate child records (Experience, Education, Projects, Skills, Certificates)
        const [{ data: exp }, { data: edu }, { data: proj }, { data: sk }, { data: cert }] = await Promise.all([
          supabase.from('experiences').select('*').eq('resume_id', id),
          supabase.from('education').select('*').eq('resume_id', id),
          supabase.from('projects').select('*').eq('resume_id', id),
          supabase.from('skills').select('*').eq('resume_id', id),
          supabase.from('certificates').select('*').eq('resume_id', id),
        ]);

        if (exp && exp.length > 0) {
          await supabase.from('experiences').insert(exp.map(e => ({ ...e, id: undefined, resume_id: targetId })));
        }
        if (edu && edu.length > 0) {
          await supabase.from('education').insert(edu.map(e => ({ ...e, id: undefined, resume_id: targetId })));
        }
        if (proj && proj.length > 0) {
          await supabase.from('projects').insert(proj.map(p => ({ ...p, id: undefined, resume_id: targetId })));
        }
        if (sk && sk.length > 0) {
          await supabase.from('skills').insert(sk.map(s => ({ ...s, id: undefined, resume_id: targetId })));
        }
        if (cert && cert.length > 0) {
          await supabase.from('certificates').insert(cert.map(c => ({ ...c, id: undefined, resume_id: targetId })));
        }

        logActivity('duplicated', newTitle);
        router.push(`/editor/${targetId}`);
        return;
      } catch (err: any) {
        console.error('[Resumes] duplicate error:', err?.message ?? err);
      }
    }

    // Demo mode fallback
    const newItem: ResumeItem = {
      ...target,
      id: newId,
      title: newTitle,
      isDefault: false,
      updatedAgo: 'Just now',
      modifiedDate: 'Today',
    };
    setResumes(prev => [newItem, ...prev]);
    logActivity('duplicated', newTitle);
    router.push(`/editor/${newId}`);
  };

  const handleRename = async (id: string, newTitle: string) => {
    // Optimistic update
    setResumes(prev => prev.map(r => r.id === id ? { ...r, title: newTitle, updatedAgo: 'Just now' } : r));
    logActivity('edited', newTitle);
    setSuccessMsg(`Renamed to "${newTitle}".`);
    setTimeout(() => setSuccessMsg(null), 3000);

    if (userId && userId !== 'demo-user-id') {
      try {
        const { error } = await supabase
          .from('resumes')
          .update({ title: newTitle, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error('[Resumes] rename error:', err?.message ?? err);
        setErrorMsg('Failed to rename resume.');
        if (userId) fetchResumes(userId);
      }
    }
  };

  /* ───────── Filtering & sorting ───────── */
  const filtered = resumes
    .filter(r => {
      // 1. Text search across Name, Role, Skills, Company
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const inTitle = r.title.toLowerCase().includes(q);
        const inRole = (r.targetRole ?? '').toLowerCase().includes(q);
        const inSkills = (r.skills ?? []).some(s => s.toLowerCase().includes(q));
        const inCompanies = (r.companies ?? []).some(c => c.toLowerCase().includes(q));
        if (!inTitle && !inRole && !inSkills && !inCompanies) return false;
      }

      // 2. Status / Category Filter
      if (statusFilter === 'draft') return r.status === 'Draft';
      if (statusFilter === 'completed') return r.status === 'Completed' || r.status === 'Published';
      if (statusFilter === 'archived') return r.status === 'Archived';
      if (statusFilter === 'recently_updated' || statusFilter === 'highest_ats' || statusFilter === 'all') {
        return r.status !== 'Archived';
      }
      if (statusFilter === 'default') return !!r.isDefault;
      if (statusFilter === 'ats') return r.atsScore >= 80;

      return r.status !== 'Archived';
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        const timeA = new Date(a.createdAt || a.modifiedDate).getTime();
        const timeB = new Date(b.createdAt || b.modifiedDate).getTime();
        return timeA - timeB;
      }
      if (sortBy === 'highest_score' || statusFilter === 'highest_ats') {
        return b.atsScore - a.atsScore;
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'last_opened') {
        const timeA = new Date(a.lastOpenedAt || a.createdAt || a.modifiedDate).getTime();
        const timeB = new Date(b.lastOpenedAt || b.createdAt || b.modifiedDate).getTime();
        return timeB - timeA;
      }
      // Default: 'newest'
      const timeA = new Date(a.createdAt || a.modifiedDate).getTime();
      const timeB = new Date(b.createdAt || b.modifiedDate).getTime();
      return timeB - timeA;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ───────── Render ───────── */
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans antialiased flex selection:bg-[#111827] selection:text-white pb-20 md:pb-0">
      <Sidebar />

      <div className="flex-1 md:ml-[220px] min-h-screen flex flex-col justify-between">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="space-y-6 pb-8">
          {/* Top Navbar */}
          <Header onCreateNew={handleCreateNew} onImport={handleImport} />

          {/* Notification toasts */}
          {(errorMsg || successMsg) && (
            <div className="px-6 space-y-2">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button onClick={() => setErrorMsg(null)} className="font-bold hover:underline ml-3 cursor-pointer">✕</button>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                  <button onClick={() => setSuccessMsg(null)} className="font-bold hover:underline ml-3 cursor-pointer">✕</button>
                </div>
              )}
            </div>
          )}

          {/* Statistics Cards */}
          <StatsCard />

          {/* Filters Bar */}
          <Filters
            searchQuery={searchQuery}
            onSearchChange={q => {
              setSearchQuery(q);
              setCurrentPage(1);
              updateUrlParams(statusFilter, sortBy, q);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={f => {
              setStatusFilter(f);
              setCurrentPage(1);
              updateUrlParams(f, sortBy, searchQuery);
            }}
            sortBy={sortBy}
            onSortChange={s => {
              setSortBy(s);
              if (typeof window !== 'undefined') {
                localStorage.setItem('resume_ai_sort_by', s);
              }
              updateUrlParams(statusFilter, s, searchQuery);
            }}
            viewMode={viewMode}
            onViewModeChange={m => {
              setViewMode(m);
              if (typeof window !== 'undefined') {
                localStorage.setItem('resume_ai_view_mode', m);
              }
              updateUrlParams(statusFilter, sortBy, searchQuery, m);
            }}
            allResumes={resumes}
            onSelectSuggestion={id => {
              const match = resumes.find(r => r.id === id);
              if (match) {
                setSearchQuery(match.title);
                updateUrlParams(statusFilter, sortBy, match.title);
              }
            }}
          />

          {/* Main workspace */}
          <div className="px-6 flex flex-col lg:flex-row gap-6 items-start">
            {/* Resume list */}
            <div className="flex-1 w-full space-y-3.5">
              {loading ? (
                <div className="space-y-3.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs flex items-center gap-4">
                      <Skeleton className="w-12 h-14 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    </div>
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <EmptyState
                  icon="📄"
                  title="No resumes found."
                  description={
                    searchQuery
                      ? 'Try adjusting your search query or clear filters.'
                      : 'Create your first resume or import an existing PDF / DOCX.'
                  }
                  actionLabel={searchQuery ? 'Clear Search' : 'Create Resume'}
                  onAction={searchQuery ? () => setSearchQuery('') : handleCreateNew}
                />
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-3.5'}>
                  {paginated.map(resume => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      viewMode={viewMode}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onRename={handleRename}
                    />
                  ))}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-[320px] shrink-0 space-y-5">
              <ResumeInsights resumes={resumes} loading={loading} />
              <RecentActivity />
              <TipsCard resumes={resumes} />
            </div>
          </div>
        </div>
      </div>

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

      <MobileNav />
    </div>
  );
}
