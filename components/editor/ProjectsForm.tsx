'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
  watch?: UseFormWatch<FullResumeFormValues>;
}

const inputCls =
  'w-full px-3 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors';

export default function ProjectsForm({ control, register, watch }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) =>
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#18181B]">Projects</h3>
          <p className="text-xs text-[#71717A]">Showcase your most impressive work.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ name: '', description: '', technologies: '', linkUrl: '' })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer"
        >
          + Add Project
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border-2 border-dashed border-[#E4E4E7]">
          <p className="text-xs text-[#71717A]">No projects added. Click &quot;+ Add Project&quot; above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-2xl bg-white border border-[#E4E4E7] overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#FAFAF9]"
                onClick={() => toggleCollapse(index)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-sm shrink-0">
                    🚀
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#18181B] truncate">
                      {watch ? watch(`projects.${index}.name`) || 'Project Name' : `Project ${index + 1}`}
                    </p>
                    <p className="text-[11px] text-[#71717A] truncate">
                      {watch ? watch(`projects.${index}.technologies`) || 'Technologies' : ''}
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

              {!collapsed[index] && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#E4E4E7]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Project Name</label>
                      <input type="text" {...register(`projects.${index}.name`)} placeholder="AI Resume Builder" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Technologies Used</label>
                      <input type="text" {...register(`projects.${index}.technologies`)} placeholder="Next.js, TypeScript, Supabase" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Link / Repo URL</label>
                      <input type="url" {...register(`projects.${index}.linkUrl`)} placeholder="https://github.com/username/project" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] mb-1.5">Description & Impact</label>
                    <textarea
                      rows={3}
                      {...register(`projects.${index}.description`)}
                      placeholder="Built a real-time AI-powered resume builder with instant PDF generation and autosaving..."
                      className={`${inputCls} resize-none leading-relaxed`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
