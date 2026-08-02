'use client';

import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';

interface Props {
  register: UseFormRegister<FullResumeFormValues>;
  setValue?: UseFormSetValue<FullResumeFormValues>;
  watch?: UseFormWatch<FullResumeFormValues>;
}

export default function SummaryForm({ register, setValue, watch }: Props) {
  const [loadingAi, setLoadingAi] = useState(false);
  const summary = watch ? watch('summary.summary') || '' : '';
  const charCount = summary.length;

  const handleGenerateSummary = async () => {
    if (!setValue || !watch) return;
    setLoadingAi(true);
    try {
      const title = watch('personal.title') || 'Software Engineer';
      const currentSummary = watch('summary.summary') || '';

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateSummary', title, currentSummary }),
      });

      const data = await res.json();
      if (data.result) {
        setValue('summary.summary', data.result, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
      }
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#18181B] mb-1">Professional Summary</h3>
        <p className="text-xs text-[#71717A]">Write a short summary about your professional background.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#71717A]">Summary</label>
          {setValue && watch && (
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#27272A] text-white text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingAi ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <span>✨ AI Generate</span>
              )}
            </button>
          )}
        </div>

        <textarea
          rows={7}
          {...register('summary.summary')}
          placeholder="Product designer with 6+ years of experience designing intuitive digital products for startups and enterprise companies. Passionate about solving complex problems through user-centered design and delivering impactful experiences."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors resize-none leading-relaxed"
        />
        <div className="flex justify-end mt-1">
          <span className="text-[11px] text-[#71717A]">{charCount} / 500</span>
        </div>
      </div>
    </div>
  );
}
