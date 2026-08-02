'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { fullResumeSchema, FullResumeFormValues } from '@/types/resume';
import PersonalInfoForm from '@/components/editor/PersonalInfoForm';
import SummaryForm from '@/components/editor/SummaryForm';
import SkillsForm from '@/components/editor/SkillsForm';
import ExperienceForm from '@/components/editor/ExperienceForm';
import EducationForm from '@/components/editor/EducationForm';
import ProjectsForm from '@/components/editor/ProjectsForm';
import ResumePreview, { TemplateType } from '@/components/preview/ResumePreview';
import CoverLetterModal from '@/components/modals/CoverLetterModal';

type ActiveSection =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'experiences'
  | 'educations'
  | 'projects';

const SECTIONS: { id: ActiveSection; label: string; icon: string; description: string }[] = [
  { id: 'personal', label: 'Personal Info', icon: '👤', description: 'Contact details & basic info' },
  { id: 'summary', label: 'Summary', icon: '📝', description: 'Professional background' },
  { id: 'experiences', label: 'Experience', icon: '💼', description: 'Work history' },
  { id: 'educations', label: 'Education', icon: '🎓', description: 'Degrees & qualifications' },
  { id: 'skills', label: 'Skills', icon: '⚡', description: 'Technical & soft skills' },
  { id: 'projects', label: 'Projects', icon: '🚀', description: 'Featured work' },
];

const AI_ACTIONS = [
  { label: 'Improve Summary', description: 'Make your summary stronger', icon: '✨' },
  { label: 'Rewrite Experience', description: 'Enhance your work experience', icon: '🔄' },
  { label: 'Key Skills Suggestion', description: 'Get relevant skills for your role', icon: '⚡' },
  { label: 'Check ATS Score', description: 'Analyze and improve ATS score', icon: '📊' },
  { label: 'Generate Cover Letter', description: 'Create a matching cover letter', icon: '✉️' },
  { label: 'Optimize for Job', description: 'Tailor resume for a job description', icon: '🎯' },
];

export default function ResumeEditorPage() {
  const router = useRouter();
  const params = useParams();
  const resumeId = params?.id as string;

  const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');
  const [loading, setLoading] = useState(true);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [isExporting, setIsExporting] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FullResumeFormValues>({
    resolver: zodResolver(fullResumeSchema),
    defaultValues: {
      personal: { fullName: '', title: '', contactEmail: '', contactPhone: '', location: '', websiteUrl: '', linkedinUrl: '', githubUrl: '' },
      summary: { summary: '' },
      skills: [],
      experiences: [],
      educations: [],
      projects: [],
    },
  });

  // Load resume data
  useEffect(() => {
    async function loadResumeData() {
      if (!resumeId) return;

      if (resumeId.startsWith('demo-') || (typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true')) {
        setResumeTitle('Senior Product Designer');
        reset({
          personal: {
            fullName: 'Alex Morgan',
            title: 'Senior Product Designer',
            contactEmail: 'alex.morgan@email.com',
            contactPhone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            websiteUrl: 'alexmorgan.design',
            linkedinUrl: 'https://linkedin.com/in/alexmorgan',
            githubUrl: 'https://github.com/alexmorgan',
          },
          summary: {
            summary:
              'Product designer with 6+ years of experience designing intuitive digital products for startups and enterprise companies. Passionate about solving complex problems through user-centered design and delivering impactful experiences.',
          },
          skills: [
            { name: 'Figma', category: 'Design', proficiencyLevel: 'Expert' },
            { name: 'React', category: 'Frameworks', proficiencyLevel: 'Advanced' },
            { name: 'TypeScript', category: 'Languages', proficiencyLevel: 'Advanced' },
            { name: 'User Research', category: 'Soft Skills', proficiencyLevel: 'Expert' },
            { name: 'Prototyping', category: 'Design', proficiencyLevel: 'Expert' },
          ],
          experiences: [
            {
              companyName: 'Acme Inc.',
              position: 'Senior Product Designer',
              location: 'San Francisco, CA',
              startDate: '2021-01-01',
              endDate: '',
              isCurrent: true,
              description:
                '• Led the design of a SaaS platform used by 100k+ users daily.\n• Collaborated with product managers and engineers to define and ship new features.\n• Conducted user research and usability testing to improve product experience.',
            },
            {
              companyName: 'Design Co.',
              position: 'Product Designer',
              location: 'New York, NY',
              startDate: '2019-01-01',
              endDate: '2021-01-01',
              isCurrent: false,
              description:
                '• Designed and shipped 10+ features used by millions of users.\n• Created design systems and reusable components.\n• Improved user engagement by 30% through redesign initiatives.',
            },
          ],
          educations: [
            {
              institution: 'Stanford University',
              degree: 'Master of Design',
              fieldOfStudy: 'Human-Computer Interaction',
              location: 'Stanford, CA',
              startDate: '2017-09-01',
              endDate: '2019-05-01',
              isCurrent: false,
              gpa: '3.9',
            },
            {
              institution: 'University of California, Berkeley',
              degree: 'Bachelor of Fine Arts in Design',
              fieldOfStudy: 'Interaction Design',
              location: 'Berkeley, CA',
              startDate: '2013-09-01',
              endDate: '2017-05-01',
              isCurrent: false,
              gpa: '3.7',
            },
          ],
          projects: [
            {
              name: 'AI Resume Studio',
              technologies: 'Next.js, Supabase, Tailwind CSS',
              description: 'Built a real-time AI-powered resume builder with instant PDF generation and autosaving.',
              linkUrl: 'https://github.com/example/resume-ai',
            },
          ],
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: resumeData, error: resumeErr } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .single();

        if (resumeErr) throw resumeErr;
        if (resumeData) setResumeTitle(resumeData.title || 'Untitled Resume');

        const [{ data: expData }, { data: eduData }, { data: skillData }, { data: projData }] =
          await Promise.all([
            supabase.from('experiences').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('education').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('skills').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('projects').select('*').eq('resume_id', resumeId).order('display_order'),
          ]);

        reset({
          personal: {
            fullName: '',
            title: resumeData?.target_role || '',
            contactEmail: resumeData?.contact_email || '',
            contactPhone: resumeData?.contact_phone || '',
            location: resumeData?.location || '',
            websiteUrl: resumeData?.website_url || '',
            linkedinUrl: resumeData?.linkedin_url || '',
            githubUrl: resumeData?.github_url || '',
          },
          summary: { summary: resumeData?.summary || '' },
          skills: (skillData || []).map((s) => ({ id: s.id, name: s.name, category: s.category || 'General', proficiencyLevel: s.proficiency_level || 'Intermediate' })),
          experiences: (expData || []).map((e) => ({ id: e.id, companyName: e.company_name, position: e.position, location: e.location || '', startDate: e.start_date || '', endDate: e.end_date || '', isCurrent: e.is_current || false, description: e.description || '' })),
          educations: (eduData || []).map((ed) => ({ id: ed.id, institution: ed.institution, degree: ed.degree, fieldOfStudy: ed.field_of_study || '', location: ed.location || '', startDate: ed.start_date || '', endDate: ed.end_date || '', isCurrent: ed.is_current || false, gpa: ed.gpa || '' })),
          projects: (projData || []).map((p) => ({ id: p.id, name: p.name, description: p.description || '', technologies: p.technologies || '', linkUrl: p.link_url || '' })),
        });
      } catch (err) {
        console.error('Error loading resume:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResumeData();
  }, [resumeId, reset]);

  const saveToSupabase = useCallback(
    async (values: FullResumeFormValues) => {
      if (!resumeId) return;
      setSaveState('saving');

      if (resumeId.startsWith('demo-') || (typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true')) {
        setTimeout(() => {
          setSaveState('saved');
          setTimeout(() => setSaveState('idle'), 2500);
        }, 300);
        return;
      }

      try {
        const { error: resumeErr } = await supabase
          .from('resumes')
          .update({
            target_role: values.personal.title || null,
            summary: values.summary.summary || null,
            contact_email: values.personal.contactEmail || null,
            contact_phone: values.personal.contactPhone || null,
            location: values.personal.location || null,
            website_url: values.personal.websiteUrl || null,
            linkedin_url: values.personal.linkedinUrl || null,
            github_url: values.personal.githubUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resumeId);
        if (resumeErr) throw resumeErr;

        await supabase.from('skills').delete().eq('resume_id', resumeId);
        if (values.skills.length > 0)
          await supabase.from('skills').insert(values.skills.map((s, idx) => ({ resume_id: resumeId, name: s.name || 'Untitled Skill', category: s.category, proficiency_level: s.proficiencyLevel, display_order: idx })));

        await supabase.from('experiences').delete().eq('resume_id', resumeId);
        if (values.experiences.length > 0)
          await supabase.from('experiences').insert(values.experiences.map((e, idx) => ({ resume_id: resumeId, company_name: e.companyName || 'Company', position: e.position || 'Role', location: e.location || null, start_date: e.startDate || null, end_date: e.endDate || null, is_current: e.isCurrent, description: e.description || null, display_order: idx })));

        await supabase.from('education').delete().eq('resume_id', resumeId);
        if (values.educations.length > 0)
          await supabase.from('education').insert(values.educations.map((ed, idx) => ({ resume_id: resumeId, institution: ed.institution || 'School', degree: ed.degree || 'Degree', field_of_study: ed.fieldOfStudy || null, location: ed.location || null, start_date: ed.startDate || null, end_date: ed.endDate || null, is_current: ed.isCurrent, gpa: ed.gpa || null, display_order: idx })));

        try {
          await supabase.from('projects').delete().eq('resume_id', resumeId);
          if (values.projects.length > 0)
            await supabase.from('projects').insert(values.projects.map((p, idx) => ({ resume_id: resumeId, name: p.name || 'Project', description: p.description || null, technologies: p.technologies || null, link_url: p.linkUrl || null, display_order: idx })));
        } catch {}

        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2500);
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveState('error');
      }
    },
    [resumeId]
  );

  // Debounced autosave
  useEffect(() => {
    const subscription = watch(() => {
      const timer = setTimeout(() => {
        handleSubmit(saveToSupabase)();
      }, 1000);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, saveToSupabase]);

  const formData = watch();

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('resume-preview-document');
      if (!element) return;
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('resume-preview-document');
          if (el) { el.style.backgroundColor = '#ffffff'; el.style.color = '#0f172a'; }
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-7 w-7 text-[#111827]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-[#71717A] font-medium">Loading resume editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 antialiased">
      {/* ─── Top Navigation Bar ─── */}
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E4E4E7] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-sm font-bold text-[#18181B] leading-tight">{resumeTitle}</h1>
            <div className="flex items-center gap-1.5">
              {saveState === 'saving' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                  <span className="text-[11px] text-[#B45309]">Saving...</span>
                </>
              )}
              {saveState === 'saved' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  <span className="text-[11px] text-[#15803D] font-medium">Saved</span>
                </>
              )}
              {saveState === 'error' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                  <span className="text-[11px] text-[#B91C1C]">Save failed</span>
                </>
              )}
              {saveState === 'idle' && (
                <span className="text-[11px] text-[#71717A]">Autosave active</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Template Switcher */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7]">
            <span className="text-xs text-[#71717A] font-semibold px-2">Template</span>
            {(['modern', 'professional', 'minimal'] as TemplateType[]).map((tmpl) => (
              <button
                key={tmpl}
                type="button"
                onClick={() => setActiveTemplate(tmpl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  activeTemplate === tmpl
                    ? 'bg-white text-[#18181B] shadow-2xs border border-[#E4E4E7]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* AI Cover Letter */}
          <button
            onClick={() => setIsCoverLetterModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-[#18181B] border border-[#E4E4E7] cursor-pointer"
          >
            ✉️ Cover Letter
          </button>

          {/* Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="btn-micro inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-[#27272A] text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Exporting...</span>
              </>
            ) : (
              <>↓ Download</>
            )}
          </button>

          {/* Share placeholder */}
          <button className="btn-micro hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-[#18181B] border border-[#E4E4E7] cursor-pointer">
            Share
          </button>
        </div>
      </header>

      {/* ─── 3-Panel Layout ─── */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* ── Panel 1: Left Sidebar Navigation ── */}
        <aside className="w-52 shrink-0 hidden md:flex flex-col bg-white border-r border-[#E4E4E7] overflow-y-auto">
          <div className="p-4">
            <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-3">SECTIONS</p>
            <nav className="space-y-0.5">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-zinc-100 text-[#18181B] font-bold'
                      : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="text-xs font-semibold">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Add Section Button */}
          <div className="mt-auto p-4 border-t border-[#E4E4E7]">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] hover:bg-zinc-50 cursor-pointer">
              <span>+</span>
              <span>Add Section</span>
            </button>
          </div>
        </aside>

        {/* ── Panel 2: Center Form ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <form onSubmit={handleSubmit(saveToSupabase)} className="space-y-8">
              {activeSection === 'personal' && (
                <PersonalInfoForm register={register} errors={errors} />
              )}
              {activeSection === 'summary' && (
                <SummaryForm register={register} setValue={setValue} watch={watch} />
              )}
              {activeSection === 'skills' && (
                <SkillsForm control={control} register={register} />
              )}
              {activeSection === 'experiences' && (
                <ExperienceForm control={control} register={register} setValue={setValue} watch={watch} />
              )}
              {activeSection === 'educations' && (
                <EducationForm control={control} register={register} watch={watch} />
              )}
              {activeSection === 'projects' && (
                <ProjectsForm control={control} register={register} watch={watch} />
              )}

              {/* Section Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                    if (idx > 0) setActiveSection(SECTIONS[idx - 1].id);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                    if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].id);
                  }}
                  className="btn-micro px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-[#27272A] text-white cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Panel 3: Right - Live Preview + AI Panel ── */}
        <div className="hidden lg:flex w-[480px] xl:w-[540px] shrink-0 flex-col border-l border-[#E4E4E7] bg-white overflow-hidden">
          {/* Preview header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span className="text-xs font-semibold text-[#18181B]">Live Preview</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <button className="hover:text-[#18181B]">−</button>
              <span className="font-semibold">90%</span>
              <button className="hover:text-[#18181B]">+</button>
            </div>
          </div>

          {/* Preview + AI panels stack */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Live Resume Preview (sticky) */}
            <div className={`overflow-y-auto ${showAiPanel ? 'max-h-[55%]' : 'flex-1'} bg-zinc-50 p-4`}>
              <div className="origin-top" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                <ResumePreview data={formData} template={activeTemplate} />
              </div>
            </div>

            {/* AI Assistant Panel */}
            <div className="border-t border-[#E4E4E7] bg-white flex flex-col overflow-hidden">
              <button
                onClick={() => setShowAiPanel((p) => !p)}
                className="flex items-center justify-between px-4 py-3 w-full hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">✨</span>
                  <span className="text-xs font-bold text-[#18181B]">AI Assistant</span>
                </div>
                <span className="text-xs text-[#71717A]">{showAiPanel ? '▲' : '▼'}</span>
              </button>

              {showAiPanel && (
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                  <p className="text-xs text-[#71717A] mb-3">How can I help you today?</p>
                  {AI_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        if (action.label === 'Generate Cover Letter') {
                          setIsCoverLetterModalOpen(true);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E4E4E7] hover:border-[#111827] bg-[#FAFAF9] hover:bg-white transition-all text-left cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                          <span>{action.icon}</span>
                          <span>{action.label}</span>
                        </p>
                        <p className="text-[11px] text-[#71717A] mt-0.5">{action.description}</p>
                      </div>
                      <span className="text-xs text-[#71717A] shrink-0">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CoverLetterModal
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        defaultFullName={formData.personal?.fullName}
        defaultTargetRole={formData.personal?.title}
        defaultSkills={(formData.skills || []).map((s) => s.name).filter(Boolean) as string[]}
      />
    </div>
  );
}
