'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
  setValue?: UseFormSetValue<FullResumeFormValues>;
  watch?: UseFormWatch<FullResumeFormValues>;
}

const inputCls =
  'w-full px-3 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors';

export default function ExperienceForm({ control, register, setValue, watch }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' });
  const [loadingAiIndex, setLoadingAiIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) =>
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleRewriteExperience = async (index: number) => {
    if (!setValue || !watch) return;
    setLoadingAiIndex(index);
    try {
      const position = watch(`experiences.${index}.position`) || 'Role';
      const company = watch(`experiences.${index}.companyName`) || 'Company';
      const description = watch(`experiences.${index}.description`) || '';

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rewriteExperience', position, company, description }),
      });

      const data = await res.json();
      if (data.result) {
        setValue(`experiences.${index}.description`, data.result, {
          shouldValidate: true,
          shouldTouch: true,
          shouldDirty: true,
        });
      }
    } catch (err) {
      console.error('Error rewriting experience:', err);
    } finally {
      setLoadingAiIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#18181B]">Work Experience</h3>
          <p className="text-xs text-[#71717A]">List your most recent positions first.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ companyName: '', position: '', isCurrent: false, description: '', startDate: '', endDate: '', location: '' })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer"
        >
          + Add Experience
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border-2 border-dashed border-[#E4E4E7]">
          <p className="text-xs text-[#71717A]">No experience added. Click &quot;+ Add Experience&quot; above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-2xl bg-white border border-[#E4E4E7] overflow-hidden">
              {/* Collapsible Header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#FAFAF9]"
                onClick={() => toggleCollapse(index)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-sm shrink-0">
                    💼
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#18181B] truncate">
                      {watch ? watch(`experiences.${index}.position`) || 'Position' : `Experience ${index + 1}`}
                    </p>
                    <p className="text-[11px] text-[#71717A] truncate">
                      {watch ? watch(`experiences.${index}.companyName`) || 'Company' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remove(index); }}
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-[#B91C1C] hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
                  <span className="text-[#71717A] text-xs">{collapsed[index] ? '▼' : '▲'}</span>
                </div>
              </div>

              {/* Collapsible Body */}
              {!collapsed[index] && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#E4E4E7]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Company Name</label>
                      <input type="text" {...register(`experiences.${index}.companyName`)} placeholder="Acme Inc." className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Position / Role</label>
                      <input type="text" {...register(`experiences.${index}.position`)} placeholder="Senior Designer" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Start Date</label>
                      <input type="date" {...register(`experiences.${index}.startDate`)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">End Date</label>
                      <input type="date" {...register(`experiences.${index}.endDate`)} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Location</label>
                      <input type="text" {...register(`experiences.${index}.location`)} placeholder="San Francisco, CA" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#71717A]">Description & Achievements</label>
                      {setValue && watch && (
                        <button
                          type="button"
                          onClick={() => handleRewriteExperience(index)}
                          disabled={loadingAiIndex === index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#27272A] text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {loadingAiIndex === index ? '✨ Rewriting...' : '✨ AI Rewrite'}
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      {...register(`experiences.${index}.description`)}
                      placeholder="Led the design of a SaaS platform used by 100k+ users daily..."
                      className={`${inputCls} resize-none leading-relaxed`}
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`experiences.${index}.isCurrent`)}
                      className="rounded border-[#E4E4E7] accent-[#111827]"
                    />
                    <span className="text-xs text-[#71717A]">I currently work here</span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
