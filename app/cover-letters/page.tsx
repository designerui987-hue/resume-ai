'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';

export default function CoverLettersPage() {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [companyName, setCompanyName] = useState('Stripe');
  const [targetRole, setTargetRole] = useState('Staff Product Designer');
  const [skills, setSkills] = useState('Figma, Design Systems, UX Research, Prototyping');
  const [loading, setLoading] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState(
    `Dear Hiring Manager at Stripe,\n\nI am writing to express my strong enthusiasm for the Staff Product Designer position. With 6+ years of experience leading product design initiatives for high-growth SaaS applications, I have consistently driven product innovation, simplified complex workflows, and elevated design quality across platforms.\n\nAt my previous roles, I led end-to-end design systems, conducted qualitative user research, and partnered with engineering to ship performant digital experiences. My technical proficiency in Figma, Design Systems, UX Research, Prototyping aligns directly with Stripe's commitment to craftsman-level software design.\n\nThank you for considering my application. I welcome the opportunity to discuss how my background and design leadership can contribute to Stripe's continued success.\n\nSincerely,\nAlex Morgan`
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateCoverLetter',
          fullName,
          targetRole,
          companyName,
          skills: skills.split(',').map((s) => s.trim()),
        }),
      });
      const data = await res.json();
      if (data.result) {
        setCoverLetterText(data.result);
      }
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans antialiased pb-20 md:pb-0">
      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-[220px] min-h-screen flex flex-col justify-between">
        <div>
          <TopHeader />
          <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">AI Cover Letter Generator</h1>
              <p className="text-xs text-[#71717A] dark:text-zinc-400 mt-1">Craft a personalized, high-converting cover letter tailored to your target company in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <form onSubmit={handleGenerate} className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#18181B] dark:text-white">Role &amp; Company Specs</h3>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1">Target Position / Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#18181B] dark:text-zinc-200 mb-1">Key Skills &amp; Highlights</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#18181B] dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-bold text-xs shadow-xs hover:bg-[#27272A] disabled:opacity-50 cursor-pointer transition-all mt-2"
                >
                  {loading ? 'Generating Cover Letter...' : '✨ Generate Cover Letter'}
                </button>
              </form>

              {/* Letter Output Display */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#E4E4E7] dark:border-zinc-800">
                  <span className="text-xs font-bold text-[#18181B] dark:text-white">Generated Cover Letter</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetterText);
                      alert('Cover letter copied to clipboard!');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-zinc-700 text-[11px] font-semibold text-[#18181B] dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Copy Letter
                  </button>
                </div>

                <textarea
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-xl bg-[#FAFAF9] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-xs text-[#18181B] dark:text-zinc-100 font-mono leading-relaxed focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
