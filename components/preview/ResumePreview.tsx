'use client';

import React from 'react';
import { FullResumeFormValues } from '@/types/resume';
import { ModernTemplate, ProfessionalTemplate, MinimalTemplate } from '@/components/templates/Templates';

export type TemplateType = 'modern' | 'professional' | 'minimal';

interface ResumePreviewProps {
  data: FullResumeFormValues;
  template?: TemplateType;
}

export default function ResumePreview({ data, template = 'modern' }: ResumePreviewProps) {
  if (template === 'professional') {
    return <ProfessionalTemplate data={data} />;
  }

  if (template === 'minimal') {
    return <MinimalTemplate data={data} />;
  }

  return <ModernTemplate data={data} />;
}
