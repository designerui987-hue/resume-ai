'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { MobileNav } from '@/components/ui/MobileNav';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'api' | 'notifications' | 'billing'>('general');
  const [apiKey, setApiKey] = useState('sk-gemini-••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

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
        <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">Settings</h1>
          <p className="text-xs text-[#71717A] dark:text-zinc-400 mt-1">Manage your account preferences, AI keys, and subscriptions.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E4E7] dark:border-zinc-800 gap-6 text-xs font-semibold text-[#71717A] dark:text-zinc-400">
          {(['general', 'account', 'api', 'notifications', 'billing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition-colors border-b-2 -mb-px cursor-pointer ${
                activeTab === tab
                  ? 'border-[#111827] dark:border-white text-[#18181B] dark:text-white font-bold'
                  : 'border-transparent hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              {tab === 'api' ? 'AI & API Keys' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'general' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-6">
              <h3 className="text-sm font-bold text-[#18181B] dark:text-white">General Preferences</h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="John's Career Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Default Export Format</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none">
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="txt">Plain Text (.txt)</option>
                    <option value="docx">Microsoft Word (.docx)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-semibold text-[#18181B] dark:text-zinc-200">Autosave Editor State</p>
                    <p className="text-[11px] text-[#71717A] dark:text-zinc-400">Automatically save resume modifications in real time.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#111827]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-6">
              <h3 className="text-sm font-bold text-[#18181B] dark:text-white">AI Engine &amp; API Integration</h3>
              <p className="text-xs text-[#71717A] dark:text-zinc-400">Configure your custom Gemini / OpenAI keys for unlimited high-speed generations.</p>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">Gemini API Key</label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#71717A]"
                    >
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1.5">AI Model Selection</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none">
                    <option value="gemini-flash">Gemini 2.5 Flash (Fast &amp; Accurate)</option>
                    <option value="gemini-pro">Gemini 3.0 Pro (High Intelligence)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-white">Active Plan: Pro Subscriber</h3>
                  <p className="text-xs text-[#71717A] dark:text-zinc-400">$9 / month • Renews on Sep 1, 2026</p>
                </div>
                <Link href="/pricing" className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold">
                  Manage Plan
                </Link>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {saved && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">✓ Saved successfully</span>}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-semibold hover:bg-[#27272A] cursor-pointer shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </form>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
