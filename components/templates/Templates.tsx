'use client';

import React from 'react';
import { FullResumeFormValues } from '@/types/resume';

interface TemplateProps {
  data: FullResumeFormValues;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personal, summary, skills, experiences, educations, projects } = data;

  return (
    <div
      id="resume-preview-document"
      className="w-full bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-xl min-h-[1122px] max-w-[794px] mx-auto font-sans border border-slate-200 text-[13px] leading-normal"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Modern Header: Indigo accents & badge style */}
      <header className="border-b-2 border-indigo-600 pb-5 mb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {personal?.fullName || 'YOUR FULL NAME'}
        </h1>
        <p className="text-sm font-semibold text-indigo-600 mt-1 uppercase tracking-wide">
          {personal?.title || 'PROFESSIONAL TITLE'}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3 font-medium">
          {personal?.contactEmail && (
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              ✉️ {personal.contactEmail}
            </span>
          )}
          {personal?.contactPhone && (
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              📞 {personal.contactPhone}
            </span>
          )}
          {personal?.location && (
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              📍 {personal.location}
            </span>
          )}
          {personal?.websiteUrl && <span>🌐 {personal.websiteUrl}</span>}
          {personal?.linkedinUrl && <span>LinkedIn: {personal.linkedinUrl}</span>}
          {personal?.githubUrl && <span>GitHub: {personal.githubUrl}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary?.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-4 border-indigo-600 px-2.5 py-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line px-1">
            {summary.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-4 border-indigo-600 px-2.5 py-1 mb-2.5">
            Work Experience
          </h2>
          <div className="space-y-4 px-1">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">
                    {exp.position} <span className="font-semibold text-indigo-600">@ {exp.companyName}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {exp.startDate || 'Start'} – {exp.isCurrent ? 'Present' : exp.endDate || 'End'}
                  </span>
                </div>
                {exp.location && <p className="text-[11px] text-slate-500 italic mb-1">{exp.location}</p>}
                {exp.description && (
                  <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-4 border-indigo-600 px-2.5 py-1 mb-2.5">
            Projects
          </h2>
          <div className="space-y-3 px-1">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">
                    {proj.name}
                    {proj.technologies && (
                      <span className="font-normal text-indigo-600 text-[11px] ml-2">
                        [{proj.technologies}]
                      </span>
                    )}
                  </h3>
                  {proj.linkUrl && <span className="text-[11px] text-slate-600">{proj.linkUrl}</span>}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-4 border-indigo-600 px-2.5 py-1 mb-2.5">
            Education
          </h2>
          <div className="space-y-2.5 px-1">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <p className="text-[11px] text-slate-600">{edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {edu.startDate} – {edu.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border-l-4 border-indigo-600 px-2.5 py-1 mb-2">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5 px-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personal, summary, skills, experiences, educations, projects } = data;

  return (
    <div
      id="resume-preview-document"
      className="w-full bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-xl min-h-[1122px] max-w-[794px] mx-auto font-serif border border-slate-200 text-[13px] leading-normal"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Classic Executive Professional Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wider uppercase">
          {personal?.fullName || 'YOUR FULL NAME'}
        </h1>
        <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-widest">
          {personal?.title || 'PROFESSIONAL TITLE'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personal?.contactEmail && <span>{personal.contactEmail}</span>}
          {personal?.contactPhone && <span>| {personal.contactPhone}</span>}
          {personal?.location && <span>| {personal.location}</span>}
          {personal?.websiteUrl && <span>| {personal.websiteUrl}</span>}
          {personal?.linkedinUrl && <span>| LinkedIn: {personal.linkedinUrl}</span>}
          {personal?.githubUrl && <span>| GitHub: {personal.githubUrl}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary?.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-1.5 text-center">
            Executive Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line text-justify">
            {summary.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2 text-center">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">
                    {exp.companyName} — <span className="font-normal italic">{exp.position}</span>
                  </h3>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {exp.startDate || 'Start'} – {exp.isCurrent ? 'Present' : exp.endDate || 'End'}
                  </span>
                </div>
                {exp.location && <p className="text-[11px] text-slate-500 italic">{exp.location}</p>}
                {exp.description && (
                  <p className="text-xs text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2 text-center">
            Notable Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">
                    {proj.name} {proj.technologies ? `(${proj.technologies})` : ''}
                  </h3>
                  {proj.linkUrl && <span className="text-[11px] text-slate-600">{proj.linkUrl}</span>}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2 text-center">
            Education & Certifications
          </h2>
          <div className="space-y-2.5">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {edu.institution} — <span className="font-normal italic">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  </h3>
                </div>
                <span className="text-[11px] text-slate-600 font-medium">
                  {edu.startDate} – {edu.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-1.5 text-center">
            Core Competencies
          </h2>
          <div className="text-xs text-slate-800 leading-relaxed text-center">
            {skills.map((skill) => skill.name).filter(Boolean).join(' • ')}
          </div>
        </section>
      )}
    </div>
  );
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personal, summary, skills, experiences, educations, projects } = data;

  return (
    <div
      id="resume-preview-document"
      className="w-full bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-xl min-h-[1122px] max-w-[794px] mx-auto font-mono border border-slate-200 text-[12px] leading-relaxed"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Clean Minimalist Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {personal?.fullName || 'YOUR FULL NAME'}
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          {personal?.title || 'PROFESSIONAL TITLE'}
        </p>
        <p className="text-[11px] text-slate-500 mt-2">
          {[personal?.contactEmail, personal?.contactPhone, personal?.location, personal?.websiteUrl, personal?.linkedinUrl, personal?.githubUrl]
            .filter(Boolean)
            .join(' / ')}
        </p>
      </header>

      {/* Summary */}
      {summary?.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            // SUMMARY
          </h2>
          <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">
            {summary.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
            // EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-slate-900">
                    {exp.position} @ {exp.companyName}
                  </h3>
                  <span className="text-[10.5px] text-slate-500">
                    {exp.startDate || 'Start'} - {exp.isCurrent ? 'Present' : exp.endDate || 'End'}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[11.5px] text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
            // PROJECTS
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-slate-900">
                    {proj.name} {proj.technologies ? `[${proj.technologies}]` : ''}
                  </h3>
                </div>
                {proj.description && (
                  <p className="text-[11.5px] text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
            // EDUCATION
          </h2>
          <div className="space-y-2">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <h3 className="text-[12px] font-bold text-slate-900">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} - {edu.institution}
                </h3>
                <span className="text-[10.5px] text-slate-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            // SKILLS
          </h2>
          <p className="text-[11.5px] text-slate-700">
            {skills.map((s) => s.name).filter(Boolean).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
}
