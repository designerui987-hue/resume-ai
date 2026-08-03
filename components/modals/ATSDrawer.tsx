'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ATSScoreDetails } from '@/lib/ats';
import { FullResumeFormValues } from '@/types/resume';

interface ATSDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  atsDetails: ATSScoreDetails;
  formData: FullResumeFormValues;
  onImproveResume: () => void;
  onRunCheck: () => void;
}

export default function ATSDrawer({
  isOpen,
  onClose,
  atsDetails,
  formData,
  onImproveResume,
  onRunCheck,
}: ATSDrawerProps) {
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleRunCheck = () => {
    setIsChecking(true);
    onRunCheck();
    setTimeout(() => {
      setIsChecking(false);
    }, 800);
  };

  // Derive dynamic issues and missing keywords from actual formData
  const existingSkillNames = (formData.skills || [])
    .map((s) => s.name?.toLowerCase())
    .filter(Boolean);

  const recommendedKeywords = ['TypeScript', 'React', 'Node.js', 'Agile', 'CI/CD', 'Docker', 'Leadership', 'Problem Solving'];
  const missingKeywords = recommendedKeywords.filter(
    (kw) => !existingSkillNames.some((sk) => sk?.includes(kw.toLowerCase()))
  );

  const formattingIssues = [];
  if (!formData.personal?.location) formattingIssues.push('Missing location details');
  if (!formData.personal?.contactEmail) formattingIssues.push('Missing email address');
  if (!formData.summary?.summary || formData.summary.summary.length < 50) formattingIssues.push('Summary is too short or empty (< 50 chars)');
  if (!formData.experiences || formData.experiences.length === 0) formattingIssues.push('No work experiences added');
  if (!formData.educations || formData.educations.length === 0) formattingIssues.push('No education history provided');

  const suggestions = [];
  if (missingKeywords.length > 0) suggestions.push(`Add key technical skills like ${missingKeywords.slice(0, 3).join(', ')} to boost keyword matching.`);
  if (!formData.personal?.linkedinUrl) suggestions.push('Include a LinkedIn profile URL for enhanced recruiter verification.');
  if (formData.experiences?.some((e) => !e.description || e.description.length < 30)) {
    suggestions.push('Expand work experience descriptions with measurable outcomes & bullet points.');
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E4E7] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E4E4E7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181B]">ATS Optimization Check</h2>
              <p className="text-[11px] text-[#71717A]">Applicant Tracking System Parser Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Overall Score Meter */}
          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500"
                style={{ borderColor: atsDetails.colorHex }}
              >
                <span className="text-2xl font-black text-[#18181B] tracking-tight">{atsDetails.overallScore}</span>
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-widest">OUT OF 100</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#18181B]">
                {atsDetails.overallScore >= 80 ? 'Great ATS Compatibility 🎉' : atsDetails.overallScore >= 60 ? 'Needs Improvement ⚠️' : 'Critical ATS Issues 🚨'}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Your resume matches key structural standards for automated scanners.
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 text-left">
              <div className="p-2.5 bg-white rounded-xl border border-[#E4E4E7]">
                <p className="text-[10px] font-semibold text-[#71717A]">Content Quality</p>
                <p className="text-xs font-bold text-[#18181B] mt-0.5">{atsDetails.contentScore}%</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E4E4E7]">
                <p className="text-[10px] font-semibold text-[#71717A]">Formatting</p>
                <p className="text-xs font-bold text-[#18181B] mt-0.5">{atsDetails.formattingScore}%</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E4E4E7]">
                <p className="text-[10px] font-semibold text-[#71717A]">Keywords</p>
                <p className="text-xs font-bold text-[#18181B] mt-0.5">{atsDetails.keywordsScore}%</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E4E4E7]">
                <p className="text-[10px] font-semibold text-[#71717A]">Readability</p>
                <p className="text-xs font-bold text-[#18181B] mt-0.5">{atsDetails.readabilityScore}%</p>
              </div>
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Missing Industry Keywords
              </h3>
              <span className="text-[10px] font-bold text-[#71717A] bg-zinc-100 px-2 py-0.5 rounded-full">
                {missingKeywords.length} Missing
              </span>
            </div>
            
            {missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-1 bg-white border border-amber-200 text-amber-800 text-[11px] font-medium rounded-md shadow-2xs"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All core industry keywords detected!</span>
              </div>
            )}
          </div>

          {/* Formatting & Content Issues */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              Formatting & Layout Checks
            </h3>
            {formattingIssues.length > 0 ? (
              <div className="space-y-1.5">
                {formattingIssues.map((issue, idx) => (
                  <div key={idx} className="p-2.5 bg-rose-50/50 border border-rose-200/60 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No formatting errors found.</span>
              </div>
            )}
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Optimization Suggestions
            </h3>
            <div className="space-y-2">
              {suggestions.map((sugg, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] flex items-start gap-2 shadow-2xs">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{sugg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E4E4E7] bg-[#FAFAF9] flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCheck}
            disabled={isChecking}
            className="flex-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Run Check</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onClose();
              onImproveResume();
            }}
            className="flex-1"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Improve Resume</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
