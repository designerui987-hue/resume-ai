'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { MobileNav } from '@/components/ui/MobileNav';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('John Doe');
  const [title, setTitle] = useState('Senior Product Designer');
  const [email, setEmail] = useState('john.doe@example.com');
  const [location, setLocation] = useState('San Francisco, CA');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans antialiased pb-20 md:pb-0">
      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[220px] min-h-screen">
        <TopHeader />
        <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">Public Profile</h1>
          <p className="text-xs text-[#71717A] dark:text-zinc-400 mt-1">Manage your identity, avatar, and contact defaults across resumes.</p>
        </div>

        {/* Profile Card */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#E4E4E7] dark:border-zinc-800">
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700"
              />
              <div>
                <button type="button" className="px-3.5 py-1.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-xs font-semibold text-[#18181B] dark:text-white hover:bg-zinc-100">
                  Change Avatar
                </button>
                <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {saved && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">✓ Profile saved</span>}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-semibold hover:bg-[#27272A] cursor-pointer shadow-xs"
            >
              Update Profile
            </button>
          </div>
        </form>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
