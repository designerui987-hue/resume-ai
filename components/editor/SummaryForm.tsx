'use client';

import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import AITextarea from '@/components/editor/AITextarea';

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
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-[#18181B]">Professional Summary</h3>
        <p className="text-[11px] text-[#71717A]">Write a compelling elevator pitch highlighting your core experience and achievements.</p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[#71717A]">Summary Overview</label>
          {setValue && watch && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={loadingAi}
              className="h-7 text-xs font-semibold"
            >
              {loadingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
                  <span>AI Generate</span>
                </>
              )}
            </Button>
          )}
        </div>

        <AITextarea
          rows={7}
          {...register('summary.summary')}
          placeholder="Results-driven Product Designer with 6+ years of experience crafting modern web applications..."
          className="w-full px-3.5 py-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all resize-none leading-relaxed shadow-2xs"
        />
        <div className="flex justify-between items-center text-[10px] text-[#71717A]">
          <span>Tip: Keep summary between 2-4 sentences for optimal ATS impact.</span>
          <span className="font-mono">{charCount} / 500</span>
        </div>
      </div>
    </div>
  );
}


