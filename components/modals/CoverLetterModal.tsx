'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFullName?: string;
  defaultTargetRole?: string;
  defaultSkills?: string[];
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  defaultFullName = '',
  defaultTargetRole = '',
  defaultSkills = [],
}: CoverLetterModalProps) {
  const [fullName, setFullName] = useState(defaultFullName);
  const [companyName, setCompanyName] = useState('');
  const [targetRole, setTargetRole] = useState(defaultTargetRole);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateCoverLetter',
          fullName: fullName || 'Applicant',
          companyName: companyName || 'Target Company',
          targetRole: targetRole || 'Target Role',
          skills: defaultSkills,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setCoverLetter(data.result);
      }
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      alert('Cover letter copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✉️</span>
            <div>
              <h3 className="text-lg font-bold text-white">AI Cover Letter Generator</h3>
              <p className="text-xs text-slate-400">Generate a tailored cover letter powered by Gemini API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {!coverLetter ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google / Acme Corp"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role / Position *</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Gemini Generating...</span>
                  </>
                ) : (
                  <span>✨ Generate Cover Letter</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-line font-sans">
              {coverLetter}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCoverLetter(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                ← Regenerate
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg transition-all"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
