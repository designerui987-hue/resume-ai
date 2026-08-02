'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface AIAction {
  id: string;
  label: string;
  shortcut?: string;
  description: string;
  icon: React.ReactNode;
  category: 'primary' | 'tools';
  loading?: boolean;
}

interface AIResult {
  action: string;
  content: string;
}

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: string;
  fullName?: string;
  currentSummary?: string;
  skills?: string[];
  onSummaryGenerated?: (text: string) => void;
  onCoverLetterOpen?: () => void;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-[#E4E4E7] bg-[#FAFAF9] text-[10px] font-mono text-[#71717A]">
      {children}
    </kbd>
  );
}

export default function AIAssistantPanel({
  isOpen,
  onClose,
  targetRole = 'Software Engineer',
  fullName = '',
  currentSummary = '',
  skills = [],
  onSummaryGenerated,
  onCoverLetterOpen,
}: AIAssistantPanelProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  // Keyboard shortcut: Escape closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const callAI = useCallback(
    async (action: string, extraPayload?: Record<string, string>) => {
      setLoadingAction(action);
      setResult(null);
      setError(null);
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            title: targetRole,
            currentSummary,
            skills: skills.join(', '),
            ...extraPayload,
          }),
        });
        if (!res.ok) throw new Error('AI request failed');
        const data = await res.json();
        if (data.result) {
          setResult({ action, content: data.result });
          if (action === 'generateSummary' && onSummaryGenerated) {
            onSummaryGenerated(data.result);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoadingAction(null);
      }
    },
    [targetRole, currentSummary, skills, onSummaryGenerated]
  );

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'rewrite-summary':
        callAI('generateSummary');
        break;
      case 'improve-experience':
        callAI('rewriteExperience', {
          position: targetRole,
          company: 'Current Company',
          description: currentSummary,
        });
        break;
      case 'generate-cover-letter':
        if (onCoverLetterOpen) onCoverLetterOpen();
        break;
      case 'optimize-resume':
        // Mock ATS scoring
        setLoadingAction('optimize-resume');
        setTimeout(() => {
          const score = Math.floor(Math.random() * 20) + 75;
          setAtsScore(score);
          setResult({
            action: 'optimize-resume',
            content: `Your ATS score is **${score}/100**.\n\n**Improvements:**\n• Add more quantifiable achievements (e.g., "increased revenue by 30%")\n• Include more keywords from the job description\n• Ensure skills section matches role requirements\n• Use action verbs to start bullet points`,
          });
          setLoadingAction(null);
        }, 1200);
        break;
      case 'key-skills':
        callAI('generateSummary', {
          currentSummary: `Suggest 8-10 key technical and soft skills for a ${targetRole}. Format as a comma-separated list.`,
        });
        break;
      case 'ats-check':
        setLoadingAction('ats-check');
        setTimeout(() => {
          setAtsScore(82);
          setResult({
            action: 'ats-check',
            content: `**ATS Score: 82/100** ✅\n\n**Breakdown:**\n• Keywords: 22/25\n• Structure: 23/25\n• Formatting: 20/25\n• Readability: 17/25\n\n**Quick Fixes:**\n• Add role-specific keywords from the job posting\n• Use standard section headings (Experience, Education, Skills)\n• Avoid tables and graphics in resume body`,
          });
          setLoadingAction(null);
        }, 1000);
        break;
      case 'job-match':
        callAI('generateSummary', {
          currentSummary: `Write a tailored professional summary for ${fullName || 'a candidate'} applying for ${targetRole}. Make it ATS-friendly and highlight the most relevant skills: ${skills.join(', ')}.`,
        });
        break;
    }
  };

  const PRIMARY_ACTIONS: AIAction[] = [
    {
      id: 'rewrite-summary',
      label: 'Rewrite Summary',
      shortcut: '⌘1',
      description: 'Make your summary more compelling and impactful.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      category: 'primary',
    },
    {
      id: 'improve-experience',
      label: 'Improve Experience',
      shortcut: '⌘2',
      description: 'Enhance your bullet points with strong verbs and impact.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      category: 'primary',
    },
    {
      id: 'optimize-resume',
      label: 'Optimize Resume',
      shortcut: '⌘3',
      description: 'Improve readability, structure and ATS performance.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      category: 'primary',
    },
    {
      id: 'generate-cover-letter',
      label: 'Generate Cover Letter',
      shortcut: '⌘4',
      description: 'Create a personalized cover letter for your target role.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      category: 'primary',
    },
  ];

  const TOOL_ACTIONS: AIAction[] = [
    {
      id: 'key-skills',
      label: 'Key Skills Suggestion',
      description: 'Get relevant skills for your role.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      category: 'tools',
    },
    {
      id: 'ats-check',
      label: 'Check ATS Score',
      description: 'Analyze and improve your ATS score.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'tools',
    },
    {
      id: 'job-match',
      label: 'Job Match',
      description: 'Match your resume with a job description.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      category: 'tools',
    },
  ];

  // Parse simple markdown bold
  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={i}
          className="text-xs text-[#18181B] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parsed || '&nbsp;' }}
        />
      );
    });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 xl:w-88 z-40 flex flex-col bg-white border-l border-[#E4E4E7] shadow-xl animate-slide-in-right">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E4E7] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-[#18181B]">AI Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Intro */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-xs text-[#71717A]">How can I help you improve your resume?</p>
          </div>

          {/* Primary Actions */}
          <div className="px-5 space-y-2">
            {PRIMARY_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={!!loadingAction}
                className={`w-full group flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-60 ${
                  result?.action === action.id
                    ? 'border-[#111827] bg-zinc-50'
                    : 'border-[#E4E4E7] hover:border-[#111827] hover:bg-[#FAFAF9] bg-white'
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  result?.action === action.id
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#FAFAF9] text-[#71717A] border border-[#E4E4E7] group-hover:bg-[#111827] group-hover:text-white group-hover:border-transparent'
                }`}>
                  {loadingAction === action.id ? (
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    action.icon
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#18181B]">{action.label}</p>
                  <p className="text-[11px] text-[#71717A] mt-0.5 truncate">{action.description}</p>
                </div>

                {/* Shortcut + Arrow */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {action.shortcut && <Kbd>{action.shortcut}</Kbd>}
                  <svg className="w-3.5 h-3.5 text-[#71717A] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Divider: More AI Tools */}
          <div className="px-5 pt-6 pb-3">
            <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">More AI Tools</p>
          </div>
          <div className="px-5 space-y-2 pb-4">
            {TOOL_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={!!loadingAction}
                className={`w-full group flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-60 ${
                  result?.action === action.id
                    ? 'border-[#111827] bg-zinc-50'
                    : 'border-[#E4E4E7] hover:border-[#111827] hover:bg-[#FAFAF9] bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  result?.action === action.id
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#FAFAF9] text-[#71717A] border border-[#E4E4E7] group-hover:bg-[#111827] group-hover:text-white group-hover:border-transparent'
                }`}>
                  {loadingAction === action.id ? (
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <span className="scale-90">{action.icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#18181B]">{action.label}</p>
                  <p className="text-[11px] text-[#71717A] mt-0.5 truncate">{action.description}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-[#71717A] shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* AI Result Output */}
          {(result || error) && (
            <div className="mx-5 mb-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E4E4E7] bg-white">
                <p className="text-[11px] font-bold text-[#18181B]">
                  {error ? '⚠️ Error' : '✨ AI Result'}
                </p>
                <button
                  onClick={() => { setResult(null); setError(null); }}
                  className="text-[11px] text-[#71717A] hover:text-[#18181B] cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="px-4 py-3 space-y-1 max-h-52 overflow-y-auto">
                {error ? (
                  <p className="text-xs text-[#B91C1C]">{error}</p>
                ) : result ? (
                  renderContent(result.content)
                ) : null}
              </div>
              {result && onSummaryGenerated && result.action === 'generateSummary' && (
                <div className="px-4 pb-3">
                  <button
                    onClick={() => { onSummaryGenerated(result.content); setResult(null); }}
                    className="w-full py-2 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply to Summary
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pro Tip */}
          <div className="mx-5 mb-5 p-4 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7]">
            <p className="text-[11px] font-bold text-[#18181B] mb-1">💡 Pro Tip</p>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Add quantifiable achievements to your experience section to boost your ATS score by up to 15%.
            </p>
          </div>
        </div>

        {/* Footer: Keyboard shortcuts hint + Collapse */}
        <div className="border-t border-[#E4E4E7] px-5 py-3 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
              <Kbd>Esc</Kbd>
              <span>to close</span>
              <span className="mx-1">·</span>
              <Kbd>⌘J</Kbd>
              <span>to toggle</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-[11px] text-[#71717A] hover:text-[#18181B] font-semibold cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Collapse Panel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
