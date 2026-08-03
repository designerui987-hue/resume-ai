'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';

export default function JobMatchPage() {
  const [jobDescription, setJobDescription] = useState(
    `We're looking for a Senior Frontend Developer to join our team and help build exceptional web experiences. You will work with modern technologies and collaborate with cross-functional teams.\n\nKey Responsibilities:\n• Build responsive, performant, and accessible web applications\n• Collaborate with designers and backend engineers\n• Write clean, scalable, and maintainable code\n• Participate in code reviews and technical discussions\n\nRequirements:\n• 5+ years of experience in frontend development\n• Strong proficiency in React, TypeScript, and JavaScript (ES6+)\n• Experience with state management (Redux, Zustand)\n• Familiarity with RESTful APIs and GraphQL\n• Knowledge of HTML, CSS, Tailwind CSS, and modern UI libraries`
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex font-sans antialiased text-[#18181B]">
      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 md:ml-[220px] min-h-screen">
        <TopHeader />

        <div className="p-8 space-y-6">
          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#18181B]">Job Match</h1>
              <p className="text-xs text-[#71717A] mt-0.5">Compare your resume with a job description and get AI-powered recommendations.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs font-bold text-[#18181B]">Upload JD</button>
              <button className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold flex items-center gap-1.5"><span>✨</span> Analyze Match</button>
            </div>
          </div>

          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Job Description TextArea */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#18181B]">
                <span>Job Description</span>
                <span className="text-[11px] text-[#71717A] font-normal">{jobDescription.length}/5000</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
                className="w-full p-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Overall Match Donut */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs flex flex-col items-center justify-between">
              <span className="text-xs font-bold text-[#18181B] self-start">Overall Match</span>
              <div className="relative w-32 h-32 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E4E4E7" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#15803D" strokeWidth="8" strokeDasharray="283" strokeDashoffset="51" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#18181B]">82%</span>
                  <span className="text-[10px] text-[#15803D] font-bold">Great Match</span>
                </div>
              </div>
              <p className="text-[11px] text-[#71717A] text-center">Your resume matches 82% of the job requirements.</p>
              <button className="w-full mt-3 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#18181B]">View Full Analysis</button>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#71717A] text-[11px]">Job Title</span>
                <p className="font-bold text-[#18181B]">Senior Frontend Developer</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-[#E4E4E7]">
                <span className="text-[#71717A] text-[11px]">Experience Level</span>
                <p className="font-bold text-[#18181B]">Senior (5+ years)</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-[#E4E4E7]">
                <span className="text-[#71717A] text-[11px]">Job Type</span>
                <p className="font-bold text-[#18181B]">Full-time</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-[#E4E4E7]">
                <span className="text-[#71717A] text-[11px]">Skills Matched</span>
                <p className="font-bold text-[#18181B]">16 / 22</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-[#E4E4E7]">
                <span className="text-[#71717A] text-[11px]">Keywords Matched</span>
                <p className="font-bold text-[#18181B]">28 / 38</p>
              </div>
            </div>
          </div>

          {/* Middle Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[#18181B]">Skills Match</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E4E4E7" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#15803D" strokeWidth="10" strokeDasharray="283" strokeDashoffset="76" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#18181B]">73%</span>
                    <span className="text-[9px] text-[#71717A]">Matched</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-600"></span><span className="text-[#71717A]">Matched</span><span className="font-bold ml-auto">16</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-[#71717A]">Partial Match</span><span className="font-bold ml-auto">3</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-[#71717A]">Missing</span><span className="font-bold ml-auto">3</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-400"></span><span className="text-[#71717A]">Not Found</span><span className="font-bold ml-auto">2</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[#18181B]">Top Matched Skills</h3>
              <div className="space-y-2.5 text-xs">
                {['React', 'JavaScript (ES6+)', 'TypeScript', 'HTML', 'CSS'].map((skill, idx) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between font-semibold"><span>✓ {skill}</span><span className="text-[#71717A]">{100 - idx * 5}%</span></div>
                    <div className="w-full h-1.5 bg-[#FAFAF9] border border-[#E4E4E7] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${100 - idx * 5}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[#18181B]">Missing Skills</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {['GraphQL', 'Next.js', 'Jest'].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 font-medium">✕ {s}</span>
                ))}
              </div>
              <button className="w-full mt-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#18181B]">How to Add These Skills</button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
                <span>✨</span> AI Recommendation
              </div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                You have a strong match for this role! Focus on adding the missing skills (GraphQL, Next.js, Jest) and keywords to increase your score. Highlight your experience with modern frameworks and include measurable achievements.
              </p>
              <div className="flex gap-3 pt-2">
                <button className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold">Optimize Resume</button>
                <button className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs font-bold text-[#18181B]">Create Cover Letter</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
