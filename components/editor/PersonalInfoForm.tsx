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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-semibold text-[#71717A] mb-1.5">
      {label}
      {required && <span className="text-[#B91C1C] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors';

export default function PersonalInfoForm({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#18181B] mb-1">Personal Information</h3>
        <p className="text-xs text-[#71717A]">Add your contact details and basic information.</p>
      </div>

      {/* Photo upload placeholder */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7]">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E4E4E7] flex items-center justify-center shrink-0 text-2xl">
          📷
        </div>
        <div>
          <p className="text-xs font-semibold text-[#18181B]">Upload Photo</p>
          <p className="text-[11px] text-[#71717A]">JPG, PNG up to 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input
            type="text"
            {...register('personal.fullName')}
            placeholder="Alex Morgan"
            className={inputCls}
          />
          {errors.personal?.fullName && (
            <p className="text-xs text-[#B91C1C] mt-1">{errors.personal.fullName.message}</p>
          )}
        </Field>

        <Field label="Job Title" required>
          <input
            type="text"
            {...register('personal.title')}
            placeholder="Senior Product Designer"
            className={inputCls}
          />
          {errors.personal?.title && (
            <p className="text-xs text-[#B91C1C] mt-1">{errors.personal.title.message}</p>
          )}
        </Field>

        <Field label="Email">
          <input
            type="email"
            {...register('personal.contactEmail')}
            placeholder="alex.morgan@email.com"
            className={inputCls}
          />
        </Field>

        <Field label="Phone">
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

        <Field label="LinkedIn">
          <input
            type="url"
            {...register('personal.linkedinUrl')}
            placeholder="linkedin.com/in/alexmorgan"
            className={inputCls}
          />
        </Field>

        <Field label="Portfolio">
          <input
            type="text"
            {...register('personal.websiteUrl')}
            placeholder="alexmorgan.design"
            className={inputCls}
          />
        </Field>

        <Field label="Website">
          <input
            type="url"
            {...register('personal.githubUrl')}
            placeholder="www.alexmorgan.com"
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}
