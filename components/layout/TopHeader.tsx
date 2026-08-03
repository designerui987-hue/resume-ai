'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ats' | 'download' | 'reminder' | 'subscription';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'ATS Scan Completed',
    message: 'Your ATS score for "Senior Frontend Developer" reached 88%',
    timestamp: '10m ago',
    read: false,
    type: 'ats',
  },
  {
    id: 'n-2',
    title: 'Resume Downloaded',
    message: 'Downloaded PDF for "Product Manager"',
    timestamp: '1h ago',
    read: false,
    type: 'download',
  },
  {
    id: 'n-3',
    title: 'New Reminder',
    message: 'Upcoming interview with Acme Inc. tomorrow at 10:00 AM',
    timestamp: '3h ago',
    read: false,
    type: 'reminder',
  },
  {
    id: 'n-4',
    title: 'Subscription Update',
    message: 'Your Pro Subscription renewed successfully',
    timestamp: '1d ago',
    read: true,
    type: 'subscription',
  },
];

export function TopHeader({ title, subtitle, actions }: TopHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resumes, setResumes] = useState<any[]>([]);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  
  const [searchRef, setSearchRef] = useState<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const TEMPLATES = [
    { id: 't-1', title: 'Professional Modern', type: 'Template', link: '/templates' },
    { id: 't-2', title: 'Creative Minimal', type: 'Template', link: '/templates' },
    { id: 't-3', title: 'Executive Standard', type: 'Template', link: '/templates' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();

          if (prof) setProfile(prof);
        } catch {
          // ignore
        }
      } else if (typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true') {
        setUser({
          id: 'demo-user-id',
          email: 'alex.morgan@example.com',
          user_metadata: { full_name: 'Alex Morgan' },
        } as unknown as User);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!user) return;
      if (user.id === 'demo-user-id') {
        setResumes([{ id: 'demo-1', title: 'Senior Frontend Developer' }]);
        setCoverLetters([{ id: 'demo-1', job_title: 'Product Designer', company_name: 'Acme Inc.' }]);
        setJobs([{ id: 'demo-1', job_title: 'UI/UX Designer', company: 'Acme Inc.' }]);
        return;
      }

      try {
        const [rRes, cRes, jRes] = await Promise.all([
          supabase.from('resumes').select('id, title').eq('user_id', user.id),
          supabase.from('cover_letters').select('id, job_title, company_name').eq('user_id', user.id),
          supabase.from('job_tracker').select('id, job_title, company').eq('user_id', user.id)
        ]);
        setResumes(rRes.data || []);
        setCoverLetters(cRes.data || []);
        setJobs(jRes.data || []);
      } catch (err) {
        // ignore
      }
    };
    fetchSearchData();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    
    resumes.forEach(r => {
      if (r.title?.toLowerCase().includes(query)) {
        results.push({ id: `r-${r.id}`, title: r.title, type: 'Resume', icon: '📄', link: `/editor/${r.id}` });
      }
    });
    
    coverLetters.forEach(c => {
      if (c.job_title?.toLowerCase().includes(query) || c.company_name?.toLowerCase().includes(query)) {
        results.push({ id: `c-${c.id}`, title: `${c.job_title} at ${c.company_name || 'Company'}`, type: 'Cover Letter', icon: '✉️', link: `/cover-letters` });
      }
    });
    
    jobs.forEach(j => {
      if (j.job_title?.toLowerCase().includes(query) || j.company?.toLowerCase().includes(query)) {
        results.push({ id: `j-${j.id}`, title: `${j.job_title} at ${j.company || 'Company'}`, type: 'Job Application', icon: '📌', link: `/job-match` });
      }
    });
    
    TEMPLATES.forEach(t => {
      if (t.title.toLowerCase().includes(query)) {
        results.push({ id: t.id, title: t.title, type: t.type, icon: '🎨', link: t.link });
      }
    });
    
    setSearchResults(results.slice(0, 6));
    setSelectedIndex(0);
  }, [searchQuery, resumes, coverLetters, jobs]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        router.push(selected.link);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const rawName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : 'Alex Morgan');

  const formattedFullName = rawName
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const initials =
    formattedFullName
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AM';

  return (
    <div className="w-full">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#E4E4E7] bg-white px-6 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
        {/* Left: Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-sm" ref={searchContainerRef}>
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors"
            />
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#E4E4E7] shadow-lg rounded-xl overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul className="py-2">
                    {searchResults.map((res, index) => (
                      <li key={res.id}>
                        <Link 
                          href={res.link}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className={`flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${index === selectedIndex ? 'bg-zinc-50 border-l-2 border-[#111827]' : 'border-l-2 border-transparent hover:bg-zinc-50'}`}
                        >
                          <span className="text-base">{res.icon}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#18181B]">{res.title}</span>
                            <span className="text-[10px] text-[#71717A]">{res.type}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-[#71717A]">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsSearchOpen(false);
              }}
              className="p-2 rounded-xl border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] hover:bg-zinc-50 relative cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E4E4E7] shadow-xl rounded-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#18181B]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-medium text-[#71717A]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead} 
                        className="text-[11px] font-semibold text-[#18181B] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleClearAll} 
                        className="text-[11px] font-medium text-[#71717A] hover:text-rose-600 cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E4E4E7]/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#71717A]">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${n.read ? 'bg-white hover:bg-zinc-50' : 'bg-blue-50/40 hover:bg-blue-50/70'}`}
                      >
                        <div className="text-sm mt-0.5 shrink-0">
                          {n.type === 'ats' && '✅'}
                          {n.type === 'download' && '📥'}
                          {n.type === 'reminder' && '🔔'}
                          {n.type === 'subscription' && '💳'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs ${n.read ? 'font-medium text-[#18181B]' : 'font-bold text-[#18181B]'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-[#71717A] shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[#71717A] mt-0.5 leading-snug line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 border-l border-[#E4E4E7] pl-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={formattedFullName}
                className="w-8 h-8 rounded-full object-cover border border-[#E4E4E7]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#18181B] leading-tight">{formattedFullName}</p>
              <p className="text-[10px] text-[#71717A]">Premium Plan</p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title Header (If provided) */}
      {title && (
        <div className="px-6 md:px-8 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-[#71717A] mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
    </div>
  );
}
