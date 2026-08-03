'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Target, CheckSquare, Settings, Menu, X } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Resumes', icon: FileText, href: '/dashboard' },
    { label: 'Job Match', icon: Target, href: '/job-match' },
    { label: 'ATS Checker', icon: CheckSquare, href: '/ats-checker' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-[#E4E4E7] dark:border-zinc-800 flex items-center justify-around z-40 px-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#111827] dark:text-white font-bold'
                  : 'text-[#71717A] dark:text-zinc-400 hover:text-[#18181B]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setIsOpen((p) => !p)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-[#71717A] dark:text-zinc-400 hover:text-[#18181B]"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-72 bg-white dark:bg-zinc-900 h-full p-6 space-y-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7] dark:border-zinc-800">
                <div className="flex items-center gap-2 font-bold text-sm text-[#18181B] dark:text-white">
                  <div className="w-6 h-6 rounded-lg bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                    R
                  </div>
                  <span>ResumeAI</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-[#71717A] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 pt-4 text-xs font-semibold">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  🏠 Dashboard
                </Link>
                <Link href="/templates" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  🎨 Templates
                </Link>
                <Link href="/job-match" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  🎯 Job Match
                </Link>
                <Link href="/ats-checker" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  ✅ ATS Checker
                </Link>
                <Link href="/cover-letters" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  ✉️ Cover Letters
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  ⚙️ Settings
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  👤 Profile
                </Link>
                <Link href="/pricing" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#18181B] dark:text-zinc-200">
                  💎 Pricing &amp; Plans
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E4E4E7] dark:border-zinc-800">
              <Link
                href="/login"
                onClick={() => {
                  if (typeof window !== 'undefined') localStorage.removeItem('demo_user_logged_in');
                  setIsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-bold block text-center shadow-xs"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
