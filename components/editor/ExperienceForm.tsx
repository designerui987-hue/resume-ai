'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Copy, Trash2, Sparkles, GripVertical } from 'lucide-react';
import AITextarea from '@/components/editor/AITextarea';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
  setValue?: UseFormSetValue<FullResumeFormValues>;
  watch?: UseFormWatch<FullResumeFormValues>;
}

const inputCls =
  'w-full px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all';

export default function ExperienceForm({ control, register, setValue, watch }: Props) {
  const { fields, append, remove, swap, insert } = useFieldArray({ control, name: 'experiences' });
  const [loadingAiIndex, setLoadingAiIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) =>
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleDuplicate = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!watch) return;
    const current = watch(`experiences.${index}`);
    insert(index + 1, { ...current, companyName: `${current.companyName || 'Company'} (Copy)` });
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#18181B]">Work Experience</h3>
          <p className="text-[11px] text-[#71717A]">List your positions with quantifiable achievements.</p>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => append({ companyName: '', position: '', isCurrent: false, description: '', startDate: '', endDate: '', location: '' })}
        >
          + Add Experience
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="py-8 text-center rounded-xl border-2 border-dashed border-[#E4E4E7] bg-[#FAFAF9]">
          <p className="text-xs text-[#71717A]">No experience added yet. Click &quot;+ Add Experience&quot; above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const company = watch ? watch(`experiences.${index}.companyName`) : '';
            const position = watch ? watch(`experiences.${index}.position`) : '';
            const isFilled = !!company && !!position;

            return (
              <div key={field.id} className="rounded-xl bg-white border border-[#E4E4E7] overflow-hidden shadow-2xs hover:border-[#111827] transition-all">
                {/* Collapsible Card Header */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer bg-[#FAFAF9] hover:bg-zinc-100 transition-colors select-none"
                  onClick={() => toggleCollapse(index)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="w-4 h-4 text-[#71717A] shrink-0 cursor-grab" />
                    <span className="text-sm shrink-0">💼</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#18181B] truncate">
                          {position || `Experience ${index + 1}`}
                        </p>
                        {isFilled && <span className="text-[10px] text-emerald-600 font-bold">✓ Valid</span>}
                      </div>
                      <p className="text-[10px] text-[#71717A] truncate">
                        {company || 'Click to edit details'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Move Up, Move Down, Duplicate, Delete, Collapse */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index > 0 && swap(index, index - 1)}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index < fields.length - 1 && swap(index, index + 1)}
                      disabled={index === fields.length - 1}
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleDuplicate(index, e)}
                      title="Duplicate Section Entry"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => remove(index)}
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggleCollapse(index)}
                      className="text-[#71717A] text-[10px] px-1 hover:text-[#18181B]"
                    >
                      {collapsed[index] ? '▼' : '▲'}
                    </button>
                  </div>
                </div>

                {/* Collapsible Card Body */}
                {!collapsed[index] && (
                  <div className="p-4 space-y-3 border-t border-[#E4E4E7] bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Company Name *</label>
                        <input
                          type="text"
                          {...register(`experiences.${index}.companyName`)}
                          placeholder="Acme Inc."
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Position / Role *</label>
                        <input
                          type="text"
                          {...register(`experiences.${index}.position`)}
                          placeholder="Senior Product Designer"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Start Date</label>
                        <input type="date" {...register(`experiences.${index}.startDate`)} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">End Date</label>
                        <input type="date" {...register(`experiences.${index}.endDate`)} className={inputCls} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Location</label>
                        <input type="text" {...register(`experiences.${index}.location`)} placeholder="San Francisco, CA" className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-[#71717A]">Description & Key Achievements</label>
                        {setValue && watch && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRewriteExperience(index)}
                            disabled={loadingAiIndex === index}
                            className="h-6 text-[10px] px-2"
                          >
                            <Sparkles className="w-3 h-3 text-[#111827]" />
                            {loadingAiIndex === index ? 'Rewriting...' : 'AI Rewrite'}
                          </Button>
                        )}
                      </div>
                      <AITextarea
                        rows={3}
                        {...register(`experiences.${index}.description`)}
                        placeholder="• Led design of core SaaS platform used by 100k+ daily users..."
                        className={`${inputCls} resize-none leading-relaxed`}
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        {...register(`experiences.${index}.isCurrent`)}
                        className="rounded border-[#E4E4E7] accent-[#111827]"
                      />
                      <span className="text-[11px] text-[#71717A]">I currently work here</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


