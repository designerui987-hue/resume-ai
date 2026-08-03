'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Control, useFieldArray, UseFormRegister, useWatch } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

interface Props {
  control: Control<FullResumeFormValues>;
  register: UseFormRegister<FullResumeFormValues>;
}

const SKILL_DICTIONARY: Record<string, string[]> = {
  Programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'HTML', 'CSS', 'Swift', 'Kotlin'],
  Frameworks: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'Django', 'Spring Boot', 'Tailwind CSS', 'React Native', 'Flutter'],
  Cloud: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Vercel', 'Netlify', 'CI/CD', 'GitHub Actions'],
  Databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Supabase', 'Firebase', 'GraphQL', 'Prisma'],
  'Soft Skills': ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Product Strategy', 'Agile', 'Mentoring', 'Public Speaking']
};

const ALL_SKILLS = Object.entries(SKILL_DICTIONARY).flatMap(([category, skills]) =>
  skills.map((name) => ({ name, category }))
);

const inputCls =
  'w-full px-3 py-2 pl-9 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all shadow-2xs';

export default function SkillsForm({ control, register }: Props) {
  const { append, remove } = useFieldArray({ control, name: 'skills' });
  const watchedSkills = useWatch({ control, name: 'skills' }) || [];
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; category: string }[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when input changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }
    
    const query = inputValue.toLowerCase();
    const filtered = ALL_SKILLS.filter(s => s.name.toLowerCase().includes(query))
      // Don't show skills already added
      .filter(s => !watchedSkills.some(ws => ws.name?.toLowerCase() === s.name.toLowerCase()))
      .slice(0, 6);
      
    setSuggestions(filtered);
    setHighlightedIndex(-1);
  }, [inputValue, watchedSkills]);

  const handleAddSkill = (name: string, category: string) => {
    if (!name.trim()) return;
    if (watchedSkills.some(s => s.name?.toLowerCase() === name.toLowerCase())) {
      setInputValue('');
      return;
    }
    
    append({ name: name.trim(), category, proficiencyLevel: 'Intermediate' });
    setInputValue('');
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        // Add highlighted suggestion
        handleAddSkill(suggestions[highlightedIndex].name, suggestions[highlightedIndex].category);
      } else if (inputValue.trim()) {
        // Add custom skill as 'Other'
        handleAddSkill(inputValue, 'Other');
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // Group skills for display
  const skillsWithIndex = watchedSkills.map((s, index) => ({ ...s, originalIndex: index }));
  const groupedSkills = skillsWithIndex.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skillsWithIndex>);
  
  const categoryOrder = ['Programming', 'Frameworks', 'Cloud', 'Databases', 'Soft Skills', 'Other', 'General', 'Technical'];
  const activeCategories = Object.keys(groupedSkills).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a);
    const idxB = categoryOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-[#18181B]">Skills & Expertise</h3>
        <p className="text-[11px] text-[#71717A]">Add your core technical skills, frameworks, and soft competencies.</p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-6">
        
        {/* Autocomplete Input */}
        <div className="relative" ref={wrapperRef}>
          <label className="block text-[11px] font-semibold text-[#71717A] mb-1.5">
            Search or add a skill
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsFocused(true);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. React, TypeScript, Product Strategy..."
              className={inputCls}
            />
          </div>
          
          {/* Dropdown Suggestions */}
          {isFocused && inputValue.trim() && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E4E4E7] rounded-xl shadow-lg overflow-hidden py-1">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, idx) => (
                  <div
                    key={suggestion.name}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                      highlightedIndex === idx ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                    }`}
                    onClick={() => handleAddSkill(suggestion.name, suggestion.category)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <span className="text-xs font-medium text-[#18181B]">{suggestion.name}</span>
                    <span className="text-[10px] font-medium text-[#A1A1AA] bg-[#FAFAF9] px-1.5 py-0.5 rounded border border-[#E4E4E7]">
                      {suggestion.category}
                    </span>
                  </div>
                ))
              ) : (
                <div 
                  className="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  onClick={() => handleAddSkill(inputValue, 'Other')}
                >
                  <span className="text-xs font-medium text-[#18181B]">Add &quot;{inputValue}&quot;</span>
                  <span className="text-[10px] font-medium text-[#A1A1AA] bg-[#FAFAF9] px-1.5 py-0.5 rounded border border-[#E4E4E7]">
                    Other
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grouped Skills Display */}
        {watchedSkills.length === 0 ? (
          <div className="py-8 text-center rounded-xl border-2 border-dashed border-[#E4E4E7] bg-[#FAFAF9]">
            <p className="text-xs text-[#71717A]">No skills added yet. Search above to add.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCategories.map(category => (
              <div key={category} className="space-y-2">
                <h4 className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map(skill => (
                    <div
                      key={skill.id || skill.originalIndex}
                      className="inline-flex items-center pl-2.5 pr-1 py-1 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] shadow-2xs group hover:border-[#111827] transition-all"
                    >
                      <span className="text-xs font-bold text-[#18181B] mr-2 truncate max-w-[150px]">
                        {skill.name}
                      </span>
                      {/* Hidden inputs to keep react-hook-form happy since we don't allow editing name here anymore */}
                      <input type="hidden" {...register(`skills.${skill.originalIndex}.name`)} value={skill.name || ''} />
                      <input type="hidden" {...register(`skills.${skill.originalIndex}.category`)} value={skill.category || ''} />
                      <input type="hidden" {...register(`skills.${skill.originalIndex}.proficiencyLevel`)} value={skill.proficiencyLevel || 'Intermediate'} />
                      
                      <button
                        type="button"
                        onClick={() => remove(skill.originalIndex)}
                        className="text-[#A1A1AA] hover:text-rose-600 hover:bg-rose-50 rounded-md p-0.5 transition-colors"
                        title="Remove Skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
