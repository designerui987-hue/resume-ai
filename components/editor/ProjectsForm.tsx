'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Copy, Trash2, GripVertical } from 'lucide-react';
import AITextarea from '@/components/editor/AITextarea';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
  watch?: UseFormWatch<FullResumeFormValues>;
}

const inputCls =
  'w-full px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all';

export default function ProjectsForm({ control, register, watch }: Props) {
  const { fields, append, remove, swap, insert } = useFieldArray({ control, name: 'projects' });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) =>
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleDuplicate = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!watch) return;
    const current = watch(`projects.${index}`);
    insert(index + 1, { ...current, name: `${current.name || 'Project'} (Copy)` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#18181B]">Projects</h3>
          <p className="text-[11px] text-[#71717A]">Showcase your featured projects and open-source contributions.</p>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => append({ name: '', description: '', technologies: '', linkUrl: '' })}
        >
          + Add Project
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="py-8 text-center rounded-xl border-2 border-dashed border-[#E4E4E7] bg-[#FAFAF9]">
          <p className="text-xs text-[#71717A]">No projects added yet. Click &quot;+ Add Project&quot; above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const name = watch ? watch(`projects.${index}.name`) : '';
            const techs = watch ? watch(`projects.${index}.technologies`) : '';
            const isFilled = !!name;

            return (
              <div key={field.id} className="rounded-xl bg-white border border-[#E4E4E7] overflow-hidden shadow-2xs hover:border-[#111827] transition-all">
                {/* Collapsible Header */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer bg-[#FAFAF9] hover:bg-zinc-100 transition-colors select-none"
                  onClick={() => toggleCollapse(index)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="w-4 h-4 text-[#71717A] shrink-0 cursor-grab" />
                    <span className="text-sm shrink-0">🚀</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#18181B] truncate">
                          {name || `Project ${index + 1}`}
                        </p>
                        {isFilled && <span className="text-[10px] text-emerald-600 font-bold">✓ Valid</span>}
                      </div>
                      <p className="text-[10px] text-[#71717A] truncate">
                        {techs || 'Click to edit details'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
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
                      title="Duplicate Entry"
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

                {/* Collapsible Body */}
                {!collapsed[index] && (
                  <div className="p-4 space-y-3 border-t border-[#E4E4E7] bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Project Name *</label>
                        <input
                          type="text"
                          {...register(`projects.${index}.name`)}
                          placeholder="AI Resume Builder"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Technologies Used</label>
                        <input
                          type="text"
                          {...register(`projects.${index}.technologies`)}
                          placeholder="Next.js, TypeScript, Supabase"
                          className={inputCls}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Live / GitHub Link URL</label>
                        <input
                          type="url"
                          {...register(`projects.${index}.linkUrl`)}
                          placeholder="https://github.com/username/project"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#71717A] mb-1">Description & Key Features</label>
                      <AITextarea
                        rows={3}
                        {...register(`projects.${index}.description`)}
                        placeholder="Built a high-performance web application with real-time editing and PDF generation..."
                        className={`${inputCls} resize-none leading-relaxed`}
                      />
                    </div>
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

