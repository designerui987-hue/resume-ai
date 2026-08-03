'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateId = 'modern' | 'professional' | 'minimal' | 'executive' | 'classic' | 'creative';
type FilterTab = 'all' | TemplateId;

interface Template {
  id: TemplateId;
  name: string;
  description: string;
  tags: FilterTab[];
  badge?: string;
  badgeColor?: string;
  accentColor: string;
  previewBg: string;
  popular?: boolean;
  pro?: boolean;
}

// ─── Template data ────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a balanced layout.',
    tags: ['modern'],
    accentColor: '#4F46E5',
    previewBg: '#EEF2FF',
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional and professional layout perfect for any industry.',
    tags: ['professional'],
    accentColor: '#0F172A',
    previewBg: '#F8FAFC',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and minimal layout with clear typography.',
    tags: ['minimal'],
    accentColor: '#71717A',
    previewBg: '#FAFAF9',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold sidebar design to highlight your leadership and experience.',
    tags: ['executive', 'professional'],
    accentColor: '#1E3A5F',
    previewBg: '#EFF6FF',
    badge: 'Pro',
    badgeColor: '#B45309',
    pro: true,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless design with refined typography and spacing.',
    tags: ['classic', 'professional', 'minimal'],
    accentColor: '#374151',
    previewBg: '#F9FAFB',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching layout for designers and creative professionals.',
    tags: ['creative'],
    accentColor: '#7C3AED',
    previewBg: '#F5F3FF',
    badge: 'New',
    badgeColor: '#15803D',
    pro: true,
  },
];

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'modern', label: 'Modern' },
  { id: 'professional', label: 'Professional' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Creative' },
  { id: 'executive', label: 'Executive' },
];

// ─── Sample resume data for previews ─────────────────────────────────────────

const SAMPLE_DATA = {
  name: 'ALEX MORGAN',
  title: 'Senior Product Designer',
  email: 'alex.morgan@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexmorgan',
  website: 'alexmorgan.design',
  summary:
    'Product designer with 6+ years of experience designing intuitive digital products for startups and enterprise companies. Passionate about solving complex problems through user-centered design and delivering impactful experiences.',
  experiences: [
    {
      role: 'Senior Product Designer',
      company: 'Acme Inc.',
      period: '2021 – Present',
      bullets: [
        'Led the design of a SaaS platform used by 100k+ users daily.',
        'Collaborated with product managers and engineers to define and ship new features.',
        'Conducted user research and usability testing to improve product experience.',
      ],
    },
    {
      role: 'Product Designer',
      company: 'Design Co.',
      period: '2019 – 2021',
      bullets: [
        'Designed and shipped 10+ features used by millions of users.',
        'Created design systems and reusable components.',
        'Improved user engagement by 30% through redesign initiatives.',
      ],
    },
  ],
  education: [
    { degree: 'Master of Design', school: 'Stanford University', period: '2017 – 2019' },
    { degree: 'Bachelor of Fine Arts in Design', school: 'UC Berkeley', period: '2013 – 2017' },
  ],
  skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'Framer', 'Webflow'],
};

// ─── Mini Resume Previews ─────────────────────────────────────────────────────

function ModernPreview() {
  return (
    <div className="bg-white h-full p-4 text-[5px] leading-tight font-sans overflow-hidden">
      <div className="border-b-2 border-indigo-600 pb-2 mb-2">
        <div className="text-[8px] font-black text-slate-900 tracking-tight">{SAMPLE_DATA.name}</div>
        <div className="text-[6px] font-semibold text-indigo-600 uppercase tracking-wide mt-0.5">{SAMPLE_DATA.title}</div>
        <div className="flex flex-wrap gap-x-2 text-[4.5px] text-slate-600 mt-1">
          <span className="bg-slate-100 px-1 rounded">{SAMPLE_DATA.email}</span>
          <span className="bg-slate-100 px-1 rounded">{SAMPLE_DATA.phone}</span>
          <span className="bg-slate-100 px-1 rounded">{SAMPLE_DATA.location}</span>
        </div>
      </div>
      <div className="text-[4.5px] font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-2 border-indigo-600 px-1.5 py-0.5 mb-1">SUMMARY</div>
      <div className="text-[4.5px] text-slate-700 mb-2 leading-[1.6]">{SAMPLE_DATA.summary}</div>
      <div className="text-[4.5px] font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-2 border-indigo-600 px-1.5 py-0.5 mb-1">EXPERIENCE</div>
      {SAMPLE_DATA.experiences.map((exp, i) => (
        <div key={i} className="mb-1.5">
          <div className="flex justify-between">
            <span className="text-[4.5px] font-bold text-slate-900">{exp.role} <span className="text-indigo-600">@ {exp.company}</span></span>
            <span className="text-[4px] text-slate-500">{exp.period}</span>
          </div>
          {exp.bullets.map((b, j) => <div key={j} className="text-[4px] text-slate-600 leading-[1.5]">• {b}</div>)}
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-2 border-indigo-600 px-1.5 py-0.5 mb-1 mt-1.5">EDUCATION</div>
      {SAMPLE_DATA.education.map((edu, i) => (
        <div key={i} className="flex justify-between mb-0.5">
          <div><div className="text-[4.5px] font-bold text-slate-900">{edu.degree}</div><div className="text-[4px] text-slate-500">{edu.school}</div></div>
          <span className="text-[4px] text-slate-500">{edu.period}</span>
        </div>
      ))}
    </div>
  );
}

function ProfessionalPreview() {
  return (
    <div className="bg-white h-full p-4 text-[5px] leading-tight font-serif overflow-hidden">
      <div className="border-b-2 border-slate-900 pb-2 mb-2 text-center">
        <div className="text-[8px] font-bold text-slate-900 uppercase tracking-wider">{SAMPLE_DATA.name}</div>
        <div className="text-[5.5px] font-semibold text-slate-700 uppercase tracking-widest mt-0.5">{SAMPLE_DATA.title}</div>
        <div className="flex flex-wrap justify-center gap-x-1 text-[4px] text-slate-600 mt-1">
          <span>{SAMPLE_DATA.email}</span><span>|</span><span>{SAMPLE_DATA.phone}</span><span>|</span><span>{SAMPLE_DATA.location}</span>
        </div>
      </div>
      <div className="text-[4.5px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-1 text-center">EXECUTIVE SUMMARY</div>
      <div className="text-[4.5px] text-slate-800 mb-2 text-justify leading-[1.6]">{SAMPLE_DATA.summary}</div>
      <div className="text-[4.5px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-1 text-center">PROFESSIONAL EXPERIENCE</div>
      {SAMPLE_DATA.experiences.map((exp, i) => (
        <div key={i} className="mb-1.5">
          <div className="flex justify-between">
            <span className="text-[4.5px] font-bold text-slate-900">{exp.company} — <span className="font-normal italic">{exp.role}</span></span>
            <span className="text-[4px] text-slate-600">{exp.period}</span>
          </div>
          {exp.bullets.map((b, j) => <div key={j} className="text-[4px] text-slate-700 leading-[1.5]">• {b}</div>)}
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-1 text-center mt-1.5">EDUCATION</div>
      {SAMPLE_DATA.education.map((edu, i) => (
        <div key={i} className="flex justify-between mb-0.5">
          <span className="text-[4.5px] font-bold text-slate-900">{edu.school} — <span className="font-normal italic">{edu.degree}</span></span>
          <span className="text-[4px] text-slate-600">{edu.period}</span>
        </div>
      ))}
    </div>
  );
}

function MinimalPreview() {
  return (
    <div className="bg-white h-full p-4 text-[5px] leading-tight font-mono overflow-hidden">
      <div className="mb-3">
        <div className="text-[8px] font-bold text-slate-900">{SAMPLE_DATA.name}</div>
        <div className="text-[5px] text-slate-600 mt-0.5">{SAMPLE_DATA.title}</div>
        <div className="text-[4px] text-slate-500 mt-1">{SAMPLE_DATA.email} / {SAMPLE_DATA.phone} / {SAMPLE_DATA.location}</div>
      </div>
      <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">// SUMMARY</div>
      <div className="text-[4.5px] text-slate-700 mb-2 leading-[1.6]">{SAMPLE_DATA.summary}</div>
      <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">// EXPERIENCE</div>
      {SAMPLE_DATA.experiences.map((exp, i) => (
        <div key={i} className="mb-1.5">
          <div className="flex justify-between">
            <span className="text-[4.5px] font-bold text-slate-900">{exp.role} @ {exp.company}</span>
            <span className="text-[4px] text-slate-500">{exp.period}</span>
          </div>
          {exp.bullets.map((b, j) => <div key={j} className="text-[4px] text-slate-600 leading-[1.5]">• {b}</div>)}
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1 mt-1.5">// EDUCATION</div>
      {SAMPLE_DATA.education.map((edu, i) => (
        <div key={i} className="mb-0.5">
          <span className="text-[4.5px] font-bold text-slate-900">{edu.degree} – {edu.school}</span>
          <span className="text-[4px] text-slate-500 ml-1">{edu.period}</span>
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1 mt-1.5">// SKILLS</div>
      <div className="text-[4px] text-slate-700">{SAMPLE_DATA.skills.join(', ')}</div>
    </div>
  );
}

function ExecutivePreview() {
  return (
    <div className="bg-white h-full flex overflow-hidden text-[4.5px] font-sans">
      <div className="w-1/3 bg-[#1E3A5F] text-white p-2.5 flex flex-col shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-400 mx-auto mb-1.5 flex items-center justify-center text-[6px] font-black">AM</div>
        <div className="text-[5px] font-bold text-white text-center leading-tight mb-0.5">{SAMPLE_DATA.name}</div>
        <div className="text-[3.5px] text-blue-200 text-center mb-2 uppercase tracking-wide">{SAMPLE_DATA.title}</div>
        <div className="text-[3.5px] font-bold text-blue-200 uppercase tracking-widest mb-0.5 mt-1">CONTACT</div>
        <div className="text-[3.5px] text-blue-100 leading-[1.8]">
          <div>{SAMPLE_DATA.email}</div>
          <div>{SAMPLE_DATA.phone}</div>
          <div>{SAMPLE_DATA.location}</div>
          <div>{SAMPLE_DATA.linkedin}</div>
        </div>
        <div className="text-[3.5px] font-bold text-blue-200 uppercase tracking-widest mb-0.5 mt-1.5">SKILLS</div>
        {SAMPLE_DATA.skills.map((s, i) => (
          <div key={i} className="text-[3.5px] text-blue-100 leading-[1.8]">{s}</div>
        ))}
      </div>
      <div className="flex-1 p-2.5">
        <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">SUMMARY</div>
        <div className="text-[3.8px] text-slate-700 mb-1.5 leading-[1.6]">{SAMPLE_DATA.summary}</div>
        <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">EXPERIENCE</div>
        {SAMPLE_DATA.experiences.map((exp, i) => (
          <div key={i} className="mb-1">
            <div className="flex justify-between">
              <span className="text-[4px] font-bold text-slate-900">{exp.role}</span>
              <span className="text-[3.5px] text-slate-500">{exp.period}</span>
            </div>
            <div className="text-[3.5px] text-slate-600 mb-0.5">{exp.company}</div>
            {exp.bullets.slice(0, 2).map((b, j) => <div key={j} className="text-[3.5px] text-slate-600 leading-[1.5]">• {b}</div>)}
          </div>
        ))}
        <div className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1 mt-1">EDUCATION</div>
        {SAMPLE_DATA.education.map((edu, i) => (
          <div key={i} className="flex justify-between mb-0.5">
            <div><div className="text-[4px] font-bold text-slate-900">{edu.degree}</div><div className="text-[3.5px] text-slate-500">{edu.school}</div></div>
            <span className="text-[3.5px] text-slate-500">{edu.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassicPreview() {
  return (
    <div className="bg-white h-full p-4 text-[5px] leading-tight overflow-hidden">
      <div className="text-center mb-2 border-b-2 border-gray-800 pb-2">
        <div className="text-[8px] font-black text-gray-900 tracking-tight">{SAMPLE_DATA.name}</div>
        <div className="text-[5px] text-gray-700 font-medium mt-0.5">{SAMPLE_DATA.title}</div>
        <div className="text-[4px] text-gray-500 mt-1">
          {SAMPLE_DATA.email} · {SAMPLE_DATA.phone} · {SAMPLE_DATA.location}
        </div>
      </div>
      <div className="text-[4.5px] font-bold text-gray-900 uppercase tracking-widest mb-0.5">SUMMARY</div>
      <div className="text-[4.5px] text-gray-700 mb-1.5 leading-[1.6]">{SAMPLE_DATA.summary}</div>
      <div className="text-[4.5px] font-bold text-gray-900 uppercase tracking-widest mb-0.5 mt-1">EXPERIENCE</div>
      {SAMPLE_DATA.experiences.map((exp, i) => (
        <div key={i} className="mb-1.5">
          <div className="flex justify-between">
            <span className="text-[4.5px] font-bold text-gray-900">{exp.role}, {exp.company}</span>
            <span className="text-[4px] text-gray-500">{exp.period}</span>
          </div>
          {exp.bullets.map((b, j) => <div key={j} className="text-[4px] text-gray-700 leading-[1.5]">• {b}</div>)}
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-gray-900 uppercase tracking-widest mb-0.5 mt-1">EDUCATION</div>
      {SAMPLE_DATA.education.map((edu, i) => (
        <div key={i} className="flex justify-between mb-0.5">
          <span className="text-[4.5px] font-bold text-gray-900">{edu.degree}, {edu.school}</span>
          <span className="text-[4px] text-gray-500">{edu.period}</span>
        </div>
      ))}
      <div className="text-[4.5px] font-bold text-gray-900 uppercase tracking-widest mb-0.5 mt-1">SKILLS</div>
      <div className="text-[4px] text-gray-700">{SAMPLE_DATA.skills.join(' · ')}</div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className="bg-white h-full overflow-hidden text-[4.5px] font-sans">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white p-3">
        <div className="text-[8px] font-black tracking-tight">{SAMPLE_DATA.name}</div>
        <div className="text-[5px] font-medium text-purple-200 mt-0.5">{SAMPLE_DATA.title}</div>
        <div className="flex gap-2 text-[4px] text-purple-200 mt-1">
          <span>{SAMPLE_DATA.email}</span><span>·</span><span>{SAMPLE_DATA.location}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-0.5">
          <div className="w-2 h-0.5 bg-violet-600 rounded" />
          <div className="text-[4.5px] font-bold text-violet-700 uppercase tracking-widest">SUMMARY</div>
        </div>
        <div className="text-[4.5px] text-slate-700 mb-1.5 leading-[1.6]">{SAMPLE_DATA.summary}</div>
        <div className="flex items-center gap-1 mb-0.5">
          <div className="w-2 h-0.5 bg-violet-600 rounded" />
          <div className="text-[4.5px] font-bold text-violet-700 uppercase tracking-widest">EXPERIENCE</div>
        </div>
        {SAMPLE_DATA.experiences.map((exp, i) => (
          <div key={i} className="mb-1">
            <div className="flex justify-between">
              <span className="text-[4.5px] font-bold text-slate-900">{exp.role}</span>
              <span className="text-[4px] text-slate-500">{exp.period}</span>
            </div>
            <div className="text-[4px] text-violet-600 mb-0.5">{exp.company}</div>
            {exp.bullets.slice(0, 2).map((b, j) => <div key={j} className="text-[4px] text-slate-600 leading-[1.5]">• {b}</div>)}
          </div>
        ))}
        <div className="flex flex-wrap gap-0.5 mt-1.5">
          {SAMPLE_DATA.skills.map((s, i) => (
            <span key={i} className="px-1 py-0.5 rounded bg-violet-50 text-violet-700 text-[3.5px] font-medium border border-violet-200">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEW_COMPONENTS: Record<TemplateId, React.FC> = {
  modern: ModernPreview,
  professional: ProfessionalPreview,
  minimal: MinimalPreview,
  executive: ExecutivePreview,
  classic: ClassicPreview,
  creative: CreativePreview,
};

// ─── Template Card ────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: Template;
  isFavorited: boolean;
  onToggleFavorite: (id: TemplateId) => void;
  onUse: (id: TemplateId) => void;
  isVisible: boolean;
}

function TemplateCard({ template, isFavorited, onToggleFavorite, onUse, isVisible }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false);
  const PreviewComponent = PREVIEW_COMPONENTS[template.id];

  return (
    <div
      className={`group relative rounded-2xl border border-[#E4E4E7] bg-white overflow-hidden transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } hover:border-[#111827] hover:shadow-lg`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview Area */}
      <div className="relative h-56 overflow-hidden bg-[#FAFAF9] border-b border-[#E4E4E7]">
        {/* Lazy-loaded mini resume preview */}
        {isVisible && (
          <div className="absolute inset-0">
            <PreviewComponent />
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-[#111827]/80 flex flex-col items-center justify-center gap-3 transition-all duration-200 backdrop-blur-[1px] ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => onUse(template.id)}
            className="px-5 py-2.5 rounded-xl bg-white text-[#111827] text-xs font-bold hover:bg-zinc-100 transition-colors shadow-lg cursor-pointer"
          >
            Use Template
          </button>
          <button className="px-4 py-1.5 rounded-xl border border-white/40 text-white text-xs font-semibold hover:bg-white/10 cursor-pointer">
            Preview Full
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {template.popular && (
            <span className="px-2 py-0.5 rounded-full bg-[#111827] text-white text-[10px] font-bold">Popular</span>
          )}
          {template.badge && (
            <span
              className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: template.badgeColor }}
            >
              {template.badge}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(template.id); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isFavorited
              ? 'bg-[#111827] text-white'
              : 'bg-white/90 text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-[#111827]'
          } shadow-sm`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="w-3.5 h-3.5"
            fill={isFavorited ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#18181B]">{template.name}</h3>
            {template.pro && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E4E4E7] text-[10px] font-bold text-[#71717A]">PRO</span>
            )}
          </div>
          <p className="text-xs text-[#71717A] mt-0.5 line-clamp-1">{template.description}</p>
        </div>
        <button
          onClick={() => onUse(template.id)}
          className="shrink-0 ml-3 px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer transition-colors"
        >
          Use
        </button>
      </div>
    </div>
  );
}

import { Sidebar } from '@/components/resumes/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [favorites, setFavorites] = useState<Set<TemplateId>>(new Set());
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  const cardRef = useCallback((node: HTMLDivElement | null, id: string) => {
    if (!node) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    observerRef.current.observe(node);
  }, []);

  // Animate cards in staggered on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(new Set(TEMPLATES.map((t) => t.id)));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesFilter = activeFilter === 'all' || t.tags.includes(activeFilter as TemplateId);
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (id: TemplateId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleUse = (id: TemplateId) => {
    const demoId = `demo-${Date.now()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTemplate', id);
      localStorage.setItem('demo_user_logged_in', 'true');
    }
    router.push(`/editor/${demoId}?template=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex font-sans antialiased text-[#18181B]">
      {/* ─── Sidebar ─── */}
      <Sidebar />

      {/* ─── Main Content ─── */}
      <main className="flex-1 md:ml-[220px] min-h-screen">
        <TopHeader />

        {/* Page body */}
        <div className="px-6 md:px-8 py-8">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#18181B]">Templates</h1>
            <p className="text-sm text-[#71717A] mt-1">Choose a professional template and start building your resume.</p>
          </div>

          {/* Filter tabs + Filters button */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    activeFilter === tab.id
                      ? 'bg-[#111827] text-white'
                      : 'text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] text-xs font-semibold text-[#71717A] hover:text-[#18181B] hover:border-[#111827] cursor-pointer transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Favorites section */}
          {favorites.size > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-3">⭐ Favorites</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TEMPLATES.filter((t) => favorites.has(t.id)).map((template, idx) => (
                  <div
                    key={template.id}
                    ref={(node) => cardRef(node, `fav-${template.id}`)}
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    <TemplateCard
                      template={template}
                      isFavorited={favorites.has(template.id)}
                      onToggleFavorite={toggleFavorite}
                      onUse={handleUse}
                      isVisible={visibleCards.has(`fav-${template.id}`) || visibleCards.has(template.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-semibold text-[#18181B]">No templates found</p>
              <p className="text-xs text-[#71717A] mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((template, idx) => (
                <div
                  key={template.id}
                  ref={(node) => cardRef(node, template.id)}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <TemplateCard
                    template={template}
                    isFavorited={favorites.has(template.id)}
                    onToggleFavorite={toggleFavorite}
                    onUse={handleUse}
                    isVisible={visibleCards.has(template.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
