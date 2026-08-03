'use client';

import React from 'react';
import { FullResumeFormValues } from '@/types/resume';
import { ModernTemplate, ProfessionalTemplate, MinimalTemplate } from '@/components/templates/Templates';

export type TemplateType = 'modern' | 'professional' | 'minimal';

interface ResumePreviewProps {
  data: FullResumeFormValues;
  template?: TemplateType;
  onSectionClick?: (section: string) => void;
}

export default function ResumePreview({ data, template = 'modern', onSectionClick }: ResumePreviewProps) {
  if (template === 'professional') {
    return <ProfessionalTemplate data={data} onSectionClick={onSectionClick} />;
  }

  if (template === 'minimal') {
    return <MinimalTemplate data={data} onSectionClick={onSectionClick} />;
  }

  return <ModernTemplate data={data} onSectionClick={onSectionClick} />;
}
