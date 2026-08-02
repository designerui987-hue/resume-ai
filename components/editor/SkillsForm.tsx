'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
}

const inputCls =
  'w-full px-3 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors';

const selectCls =
  'w-full px-3 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] focus:outline-none focus:border-[#111827] transition-colors';

export default function SkillsForm({ control, register }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      append({ name: newSkill.trim(), category: 'Technical', proficiencyLevel: 'Intermediate' });
      setNewSkill('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#18181B] mb-1">Skills</h3>
        <p className="text-xs text-[#71717A]">Add your technical and professional skills.</p>
      </div>

      {/* Quick Add Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          placeholder="Type a skill and press Enter..."
          className={inputCls}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          + Add
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="py-8 text-center rounded-2xl border-2 border-dashed border-[#E4E4E7]">
          <p className="text-xs text-[#71717A]">No skills added yet. Type a skill above and press Enter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E4E4E7]">
              <div className="flex-1">
                <input
                  type="text"
                  {...register(`skills.${index}.name`)}
                  placeholder="Skill name"
                  className={inputCls}
                />
              </div>
              <div className="w-32 shrink-0">
                <select {...register(`skills.${index}.category`)} className={selectCls}>
                  <option value="Technical">Technical</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div className="w-32 shrink-0">
                <select {...register(`skills.${index}.proficiencyLevel`)} className={selectCls}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#B91C1C] hover:bg-red-50 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => append({ name: '', category: 'Technical', proficiencyLevel: 'Intermediate' })}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#E4E4E7] hover:border-[#111827] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
      >
        + Add Skill Row
      </button>
    </div>
  );
}
