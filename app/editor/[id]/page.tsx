'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import PreviewPane from '@/components/preview/PreviewPane';
import CoverLetterModal from '@/components/modals/CoverLetterModal';
import AIAssistantDrawer from '@/components/ai/AIAssistantDrawer';
import { Button } from '@/components/ui/button';
import { calculateDynamicATSScore } from '@/lib/ats';
import { logActivity } from '@/lib/activityLogger';
import {
  RotateCcw,
  RotateCw,
  Share2,
  ArrowLeft,
  Sparkles,
  Download,
  Edit3,
  Loader2,
  CheckSquare,
  ChevronDown,
} from 'lucide-react';
import ATSDrawer from '@/components/modals/ATSDrawer';

type ActiveSection =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'experiences'
  | 'educations'
  | 'projects';

interface SectionItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  canDelete: boolean;
}

const SECTIONS: { id: ActiveSection; label: string; icon: string; description: string }[] = [
  { id: 'personal', label: 'Personal Info', icon: '👤', description: 'Contact details & basic info' },
  { id: 'summary', label: 'Summary', icon: '📝', description: 'Professional background' },
  { id: 'experiences', label: 'Experience', icon: '💼', description: 'Work history' },
  { id: 'educations', label: 'Education', icon: '🎓', description: 'Degrees & qualifications' },
  { id: 'skills', label: 'Skills', icon: '⚡', description: 'Technical & soft skills' },
  { id: 'projects', label: 'Projects', icon: '🚀', description: 'Featured work' },
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
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeTitle);
  const [isExporting, setIsExporting] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showAtsDrawer, setShowAtsDrawer] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(45);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const sidebarWidth = isSidebarCollapsed ? 64 : 220;
      const availableWidth = window.innerWidth - sidebarWidth;
      const newEditorWidth = e.clientX - sidebarWidth;
      let newPreviewWidth = ((availableWidth - newEditorWidth) / availableWidth) * 100;
      newPreviewWidth = Math.max(30, Math.min(65, newPreviewWidth));
      setPreviewWidth(newPreviewWidth);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSidebarCollapsed]);

  const [zoomLevel, setZoomLevel] = useState(90);
  const [shareToast, setShareToast] = useState(false);

  // Sidebar state & actions
  const [sections, setSections] = useState<SectionItem[]>([
    { id: 'personal', label: 'Personal Information', icon: '👤', description: 'Contact details & basic info', canDelete: false },
    { id: 'summary', label: 'Summary', icon: '📝', description: 'Professional background', canDelete: true },
    { id: 'experiences', label: 'Experience', icon: '💼', description: 'Work history', canDelete: true },
    { id: 'educations', label: 'Education', icon: '🎓', description: 'Degrees & qualifications', canDelete: true },
    { id: 'skills', label: 'Skills', icon: '⚡', description: 'Technical & soft skills', canDelete: true },
    { id: 'projects', label: 'Projects', icon: '🚀', description: 'Featured work', canDelete: true },
  ]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState('');

  // Undo / Redo History Stack
  const [history, setHistory] = useState<FullResumeFormValues[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

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

  const formData = watch();

  // Dynamic ATS Score calculated from active form data
  const atsDetails = calculateDynamicATSScore({
    title: formData.personal?.title,
    summary: formData.summary?.summary,
    skills: formData.skills,
    experiences: formData.experiences,
    contact_email: formData.personal?.contactEmail,
    location: formData.personal?.location,
  });

  // Keep track of seconds since last save
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSavedAt) {
        setSecondsAgo(Math.floor((Date.now() - lastSavedAt) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  // History recorder for Undo/Redo
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const last = prev[historyIndex];
        if (last && JSON.stringify(last) === JSON.stringify(formData)) return prev;
        const next = [...prev.slice(0, historyIndex + 1), formData];
        setHistoryIndex(next.length - 1);
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, loading]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      reset(prev);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      reset(next);
      setHistoryIndex(historyIndex + 1);
    }
  };



  const handleZoomIn = () => setZoomLevel((prev) => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 10));
  

  

  // Load resume data
  useEffect(() => {
    async function loadResumeData() {
      if (!resumeId) return;

      if (resumeId.startsWith('demo-') || (typeof window !== 'undefined' && localStorage.getItem('demo_user_logged_in') === 'true')) {
        const demoTitle = 'Senior Product Designer';
        setResumeTitle(demoTitle);
        setTitleInput(demoTitle);
        const demoValues: FullResumeFormValues = {
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
              description: 'Focused on user-centered design, prototyping, and qualitative research methods.',
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
        };
        reset(demoValues);
        setHistory([demoValues]);
        setHistoryIndex(0);
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
        if (resumeData) {
          const title = resumeData.title || 'Untitled Resume';
          setResumeTitle(title);
          setTitleInput(title);
        }

        const [{ data: expData }, { data: eduData }, { data: skillData }, { data: projData }] =
          await Promise.all([
            supabase.from('experiences').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('education').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('skills').select('*').eq('resume_id', resumeId).order('display_order'),
            supabase.from('projects').select('*').eq('resume_id', resumeId).order('display_order'),
          ]);

        const loadedValues: FullResumeFormValues = {
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
          educations: (eduData || []).map((ed) => ({ id: ed.id, institution: ed.institution, degree: ed.degree, fieldOfStudy: ed.field_of_study || '', location: ed.location || '', startDate: ed.start_date || '', endDate: ed.end_date || '', isCurrent: ed.is_current || false, gpa: ed.gpa || '', description: ed.description || '' })),
          projects: (projData || []).map((p) => ({ id: p.id, name: p.name, description: p.description || '', technologies: p.technologies || '', linkUrl: p.link_url || '' })),
        };

        reset(loadedValues);
        setHistory([loadedValues]);
        setHistoryIndex(0);
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
          setLastSavedAt(Date.now());
          setSecondsAgo(0);
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
          await supabase.from('education').insert(values.educations.map((ed, idx) => ({ resume_id: resumeId, institution: ed.institution || 'School', degree: ed.degree || 'Degree', field_of_study: ed.fieldOfStudy || null, location: ed.location || null, start_date: ed.startDate || null, end_date: ed.endDate || null, is_current: ed.isCurrent, gpa: ed.gpa || null, description: ed.description || null, display_order: idx })));

        try {
          await supabase.from('projects').delete().eq('resume_id', resumeId);
          if (values.projects.length > 0)
            await supabase.from('projects').insert(values.projects.map((p, idx) => ({ resume_id: resumeId, name: p.name || 'Project', description: p.description || null, technologies: p.technologies || null, link_url: p.linkUrl || null, display_order: idx })));
        } catch {}

        setSaveState('saved');
        setLastSavedAt(Date.now());
        setSecondsAgo(0);
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

  // Keyboard Shortcuts Listener (Ctrl+S, Ctrl+Z, Ctrl+Shift+Z, Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl + S: Save
      if (isCtrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmit(saveToSupabase)();
      }

      // Ctrl + Shift + Z or Ctrl + Y: Redo
      else if (isCtrlOrCmd && ((e.shiftKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        handleRedo();
      }

      // Ctrl + Z: Undo
      else if (isCtrlOrCmd && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl + /: Toggle AI Drawer
      else if (isCtrlOrCmd && e.key === '/') {
        e.preventDefault();
        setShowAiPanel((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, saveToSupabase, handleUndo, handleRedo]);

  const handleTitleSave = async () => {
    const trimmed = titleInput.trim();
    if (!trimmed) {
      setTitleInput(resumeTitle);
      setIsEditingTitle(false);
      return;
    }
    setResumeTitle(trimmed);
    setIsEditingTitle(false);
    logActivity('edited', trimmed);
    if (resumeId && !resumeId.startsWith('demo-')) {
      await supabase.from('resumes').update({ title: trimmed, updated_at: new Date().toISOString() }).eq('id', resumeId);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

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

  // Keyboard shortcut: Cmd/Ctrl+J to toggle AI panel, Cmd+Z Undo, Cmd+Shift+Z Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setShowAiPanel((p) => !p);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-7 w-7 text-[#111827]" />
          <p className="text-xs text-[#71717A] font-medium">Loading resume editor...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic section completion status
  const getSectionStatus = (sectionId: string): { status: 'complete' | 'warning' | 'empty'; icon: string; dotColor: string; label: string } => {
    switch (sectionId) {
      case 'personal': {
        const p = formData.personal;
        if (p?.fullName && p?.title && p?.contactEmail) {
          return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        }
        if (p?.fullName || p?.title) {
          return { status: 'warning', icon: '⚠', dotColor: 'bg-amber-500', label: 'Incomplete' };
        }
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      case 'summary': {
        const sum = formData.summary?.summary || '';
        if (sum.length > 50) return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        if (sum.length > 0) return { status: 'warning', icon: '⚠', dotColor: 'bg-amber-500', label: 'Incomplete' };
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      case 'experiences': {
        const exp = formData.experiences || [];
        if (exp.length > 0 && exp.some((e) => e.description)) {
          return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        }
        if (exp.length > 0) return { status: 'warning', icon: '⚠', dotColor: 'bg-amber-500', label: 'Incomplete' };
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      case 'educations': {
        const edu = formData.educations || [];
        if (edu.length > 0) return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      case 'skills': {
        const sk = formData.skills || [];
        if (sk.length >= 4) return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        if (sk.length > 0) return { status: 'warning', icon: '⚠', dotColor: 'bg-amber-500', label: 'Incomplete' };
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      case 'projects': {
        const pr = formData.projects || [];
        if (pr.length > 0) return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
        return { status: 'empty', icon: '○', dotColor: 'bg-zinc-300', label: 'Empty' };
      }
      default:
        return { status: 'complete', icon: '✓', dotColor: 'bg-emerald-500', label: 'Complete' };
    }
  };

  const completedCount = sections.filter((s) => getSectionStatus(s.id).status === 'complete').length;

  const moveSection = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    setSections(next);
  };

  const handleAddSection = (title: string, icon = '✨') => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const id = 'custom-' + Date.now();
    const newSec: SectionItem = {
      id,
      label: trimmed,
      icon,
      description: 'Custom Section',
      canDelete: true,
    };
    setSections((prev) => [...prev, newSec]);
    setActiveSection(id as any);
    setCustomSectionInput('');
    setShowAddSectionModal(false);
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sections.length <= 1) return;
    const filtered = sections.filter((s) => s.id !== id);
    setSections(filtered);
    if (activeSection === id) {
      setActiveSection(filtered[0].id as any);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-zinc-200 selection:text-zinc-900 antialiased flex flex-col h-screen overflow-hidden">
      
      {/* ─── Header ─── */}
      <header className="h-14 bg-white border-b border-[#E4E4E7] flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 overflow-x-auto whitespace-nowrap select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/resumes">
            <Button variant="ghost" size="sm" title="Back to Resumes">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>

          <div className="h-4 w-px bg-[#E4E4E7]" />

          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setTitleInput(resumeTitle);
                  setIsEditingTitle(false);
                }
              }}
              className="px-2 py-0.5 text-xs font-bold text-[#18181B] bg-white border border-[#111827] rounded-md focus:outline-none max-w-[160px] sm:max-w-[220px] shadow-2xs"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors text-xs font-bold text-[#18181B] group/title cursor-pointer max-w-[160px] sm:max-w-[220px]"
              title="Click to rename"
            >
              <span className="truncate">{resumeTitle}</span>
              <Edit3 className="w-3 h-3 text-[#71717A] opacity-60 group-hover/title:opacity-100 shrink-0" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#FAFAF9] border border-[#E4E4E7] text-[11px] font-medium text-[#71717A]">
            {saveState === 'saving' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                <span className="text-[#D97706] font-semibold">Saving...</span>
              </>
            ) : saveState === 'error' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                <span className="text-[#DC2626] font-semibold">Save failed</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                <span>
                  {saveState === 'saved' || secondsAgo < 5
                    ? 'Saved just now'
                    : `Saved ${secondsAgo}s ago`}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (⌘Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (⌘⇧Z)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>

          <div className="h-4 w-px bg-[#E4E4E7] hidden md:block" />

          <div className="relative">
            <select
              value={activeTemplate}
              onChange={(e) => setActiveTemplate(e.target.value as TemplateType)}
              className="px-2.5 py-1 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] text-[11px] font-bold text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#111827] cursor-pointer transition-all appearance-none pr-6 shadow-2xs"
            >
              <option value="modern">Modern Template</option>
              <option value="professional">Professional Template</option>
              <option value="minimal">Minimal Template</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#71717A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="h-4 w-px bg-[#E4E4E7]" />

          <button
            type="button"
            onClick={() => setShowAtsDrawer(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${atsDetails.badgeBg} ${atsDetails.borderClass} text-xs font-bold ${atsDetails.badgeText} hover:opacity-90 transition-all cursor-pointer shadow-2xs`}
            title="Click to open ATS Optimization Check"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: atsDetails.colorHex }} />
            <span>{atsDetails.overallScore}% ATS</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={showAiPanel ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAiPanel((p) => !p)}
            title="Toggle AI Assistant (⌘J)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare} title="Copy share link">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </Button>
        </div>
      </header>

      {shareToast && (
        <div className="fixed top-16 right-6 z-50 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Resume share link copied to clipboard!</span>
        </div>
      )}

      {/* ─── CSS Grid Workspace Layout with Sticky Left Sidebar ─── */}
      <div className="flex-1 grid overflow-hidden bg-[#FAFAF9] transition-all duration-200" style={{ gridTemplateColumns: isSidebarCollapsed ? `64px minmax(0, ${100 - previewWidth}fr) auto minmax(0, ${previewWidth}fr)` : `220px minmax(0, ${100 - previewWidth}fr) auto minmax(0, ${previewWidth}fr)` }}>
        
        {/* ── Column 1: Redesigned Sticky Left Sidebar ── */}
        <aside className="sticky top-14 h-[calc(100vh-56px)] hidden lg:flex flex-col bg-white border-r border-[#E4E4E7] justify-between shrink-0 select-none z-20">
          <div className="p-3 space-y-3 overflow-y-auto flex-1">
            {/* Sidebar Header & Collapse Toggle */}
            <div className="flex items-center justify-between px-1">
              {!isSidebarCollapsed ? (
                <>
                  <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">SECTIONS</p>
                  <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {completedCount}/{sections.length} Done
                  </span>
                </>
              ) : null}
              <button
                onClick={() => setIsSidebarCollapsed((p) => !p)}
                className="p-1 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors mx-auto"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? '➔' : '⬅'}
              </button>
            </div>

            {/* Section Item List */}
            <nav className="space-y-1">
              {sections.map((section, idx) => {
                const isActive = activeSection === section.id;
                const statusInfo = getSectionStatus(section.id);
                return (
                  <div
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`group/sec relative w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-100 text-[#18181B] font-bold shadow-2xs'
                        : 'text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]'
                    }`}
                    title={isSidebarCollapsed ? `${section.label} (${statusInfo.label})` : undefined}
                  >
                    {/* Left Icon + Title */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isActive && !isSidebarCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#111827] rounded-r-full" />
                      )}
                      <span className="text-sm shrink-0">{section.icon}</span>

                      {!isSidebarCollapsed && (
                        <span className="text-xs truncate max-w-[110px]">{section.label}</span>
                      )}
                    </div>

                    {/* Completion Status + Progress Dot + Reorder & Delete controls */}
                    {!isSidebarCollapsed ? (
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Status Icon Indicator (✓ / ⚠ / ○) */}
                        <span
                          className={`text-xs font-bold ${
                            statusInfo.status === 'complete'
                              ? 'text-emerald-600'
                              : statusInfo.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-zinc-400'
                          }`}
                        >
                          {statusInfo.icon}
                        </span>

                        {/* Progress Dot */}
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />

                        {/* Hover Actions: Reorder Up/Down & Delete */}
                        <div className="hidden group-hover/sec:flex items-center gap-0.5 ml-1 bg-white border border-[#E4E4E7] rounded-md px-0.5 shadow-2xs">
                          <button
                            onClick={(e) => moveSection(idx, 'up', e)}
                            disabled={idx === 0}
                            className="p-0.5 hover:text-[#18181B] text-[#71717A] disabled:opacity-20 text-[10px]"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => moveSection(idx, 'down', e)}
                            disabled={idx === sections.length - 1}
                            className="p-0.5 hover:text-[#18181B] text-[#71717A] disabled:opacity-20 text-[10px]"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          {section.canDelete && (
                            <button
                              onClick={(e) => handleDeleteSection(section.id, e)}
                              className="p-0.5 hover:text-rose-600 text-[#71717A] text-[10px]"
                              title="Delete Section"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Collapsed Mode Progress Dot */
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor} mx-auto`} />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions: Add Custom Section & AI Toggle */}
          <div className="p-3 border-t border-[#E4E4E7] space-y-2 bg-[#FAFAF9]">
            {!isSidebarCollapsed ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[#18181B] bg-white border-[#E4E4E7]"
                >
                  <span>+ Add Custom Section</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAiPanel((p) => !p)}
                  className="w-full flex items-center justify-between text-xs text-[#71717A]"
                >
                  <span className="flex items-center gap-1">✨ AI Tools</span>
                  <span className="text-[10px] font-mono">⌘J</span>
                </Button>
              </>
            ) : (
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="w-full p-2 rounded-lg bg-white border border-[#E4E4E7] hover:bg-zinc-100 flex items-center justify-center text-xs font-bold text-[#18181B]"
                title="Add Section"
              >
                +
              </button>
            )}
          </div>
        </aside>

        {/* ── Column 2: Center Editor ── */}
        <main className="flex flex-col bg-white border-r border-[#E4E4E7] overflow-y-auto justify-between">
          <div className="p-5 lg:p-6 space-y-6 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Section {sections.findIndex((s) => s.id === activeSection) + 1} of {sections.length}
                </span>
                <h2 className="text-sm font-bold text-[#18181B]">
                  {sections.find((s) => s.id === activeSection)?.label || 'Section Editor'}
                </h2>
              </div>

              <div className="lg:hidden flex items-center gap-1">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] text-xs font-semibold text-[#18181B] bg-white focus:outline-none"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit(saveToSupabase)} className="space-y-6">
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
              {activeSection.startsWith('custom-') && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-[#18181B]">
                      {sections.find((s) => s.id === activeSection)?.label}
                    </h3>
                    <p className="text-[11px] text-[#71717A]">Add custom details for this section.</p>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Enter custom content, certifications, or details..."
                    className="w-full px-3 py-2 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] resize-none"
                  />
                </div>
              )}
            </form>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#E4E4E7] px-5 py-3 flex items-center justify-between z-10 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSection);
                if (idx > 0) setActiveSection(sections[idx - 1].id as any);
              }}
              disabled={sections.findIndex((s) => s.id === activeSection) === 0}
            >
              ← Previous
            </Button>

            <span className="text-[11px] text-[#71717A] font-medium hidden sm:inline">
              Autosaving on edit
            </span>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSection);
                if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id as any);
              }}
              disabled={sections.findIndex((s) => s.id === activeSection) === sections.length - 1}
            >
              Next →
            </Button>
          </div>
        </main>

        
        {/* ── Resizer ── */}
        <div 
          className="hidden lg:block w-1.5 cursor-col-resize bg-zinc-200 hover:bg-indigo-400 z-50 transition-colors"
          onMouseDown={(e) => {
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />

        {/* ── Column 3: Right Preview ── */}
        <PreviewPane data={formData} template={activeTemplate as any} onSectionClick={(sec) => setActiveSection(sec as any)} />
      </div>

      {/* Add Custom Section Dialog */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white border border-[#E4E4E7] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18181B]">Add Custom Section</h3>
              <button onClick={() => setShowAddSectionModal(false)} className="text-xs text-[#71717A] hover:text-[#18181B]">✕</button>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#71717A]">Quick Presets</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { title: 'Certifications', icon: '📜' },
                  { title: 'Languages', icon: '🌐' },
                  { title: 'Awards & Honors', icon: '🏆' },
                  { title: 'Volunteer Work', icon: '🤝' },
                ].map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => handleAddSection(preset.title, preset.icon)}
                    className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-xs font-semibold text-[#18181B] cursor-pointer"
                  >
                    {preset.icon} {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Name Input */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-semibold text-[#71717A]">Or Custom Section Title</p>
              <input
                type="text"
                value={customSectionInput}
                onChange={(e) => setCustomSectionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSection(customSectionInput, '✨');
                }}
                placeholder="e.g. Publications, Speaking..."
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddSectionModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAddSection(customSectionInput, '✨')}
                disabled={!customSectionInput.trim()}
              >
                Add Section
              </Button>
            </div>
          </div>
        </div>
      )}

      <CoverLetterModal
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        defaultFullName={formData.personal?.fullName}
        defaultTargetRole={formData.personal?.title}
        defaultSkills={(formData.skills || []).map((s) => s.name).filter(Boolean) as string[]}
      />

      <AIAssistantDrawer
        isOpen={showAiPanel}
        onClose={() => setShowAiPanel(false)}
        targetRole={formData.personal?.title || 'Professional'}
        fullName={formData.personal?.fullName || ''}
        currentSummary={formData.summary?.summary || ''}
        skills={(formData.skills || []).map((s) => s.name).filter(Boolean) as string[]}
        onSummaryGenerated={(text) => {
          setValue('summary.summary', text, { shouldValidate: true, shouldDirty: true });
          setActiveSection('summary');
        }}
        onCoverLetterOpen={() => setIsCoverLetterModalOpen(true)}
      />

      <ATSDrawer
        isOpen={showAtsDrawer}
        onClose={() => setShowAtsDrawer(false)}
        atsDetails={atsDetails}
        formData={formData}
        onImproveResume={() => setShowAiPanel(true)}
        onRunCheck={() => {
          // Re-trigger calculation state
        }}
      />
    </div>
  );
}
