'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FullResumeFormValues } from '@/types/resume';

interface Props {
  register: UseFormRegister<FullResumeFormValues>;
  errors: FieldErrors<FullResumeFormValues>;
}

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="block text-[11px] font-semibold text-[#71717A]">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      {error && <span className="text-[10px] font-bold text-rose-600 animate-in fade-in">{error}</span>}
    </div>
    {children}
  </div>
);

const inputCls =
  'w-full px-3 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all shadow-2xs';

export default function PersonalInfoForm({ register, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-bold text-[#18181B]">Personal Information</h3>
        <p className="text-[11px] text-[#71717A]">Add your contact details and basic information for recruiters.</p>
      </div>

      {/* Card wrapper */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
        {/* Photo upload compact banner */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7]">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-center shrink-0 text-base shadow-2xs">
            📷
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#18181B]">Profile Photo (Optional)</p>
            <p className="text-[10px] text-[#71717A]">JPG, PNG or WEBP up to 2MB</p>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] hover:bg-zinc-50 cursor-pointer transition-colors shadow-2xs"
          >
            Upload
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label="Full Name" required error={errors.personal?.fullName?.message}>
            <input
              type="text"
              {...register('personal.fullName')}
              placeholder="Alex Morgan"
              className={`${inputCls} ${errors.personal?.fullName ? 'border-rose-400 focus:ring-rose-600 bg-rose-50/20' : ''}`}
            />
          </Field>

          <Field label="Job Title" required error={errors.personal?.title?.message}>
            <input
              type="text"
              {...register('personal.title')}
              placeholder="Senior Product Designer"
              className={`${inputCls} ${errors.personal?.title ? 'border-rose-400 focus:ring-rose-600 bg-rose-50/20' : ''}`}
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              {...register('personal.contactEmail')}
              placeholder="alex.morgan@email.com"
              className={inputCls}
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="text"
              {...register('personal.contactPhone')}
              placeholder="+1 (555) 123-4567"
              className={inputCls}
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              {...register('personal.location')}
              placeholder="San Francisco, CA, USA"
              className={inputCls}
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              type="url"
              {...register('personal.linkedinUrl')}
              placeholder="linkedin.com/in/alexmorgan"
              className={inputCls}
            />
          </Field>

          <Field label="Portfolio / Website">
            <input
              type="text"
              {...register('personal.websiteUrl')}
              placeholder="alexmorgan.design"
              className={inputCls}
            />
          </Field>

          <Field label="GitHub URL">
            <input
              type="url"
              {...register('personal.githubUrl')}
              placeholder="github.com/alexmorgan"
              className={inputCls}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}


