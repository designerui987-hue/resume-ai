import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().optional(),
  title: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  location: z.string().optional(),
  websiteUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

export const summarySchema = z.object({
  summary: z.string().optional(),
});

export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  proficiencyLevel: z.string().optional(),
});

export const skillsSchema = z.object({
  skills: z.array(skillItemSchema),
});

export const experienceItemSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
});

export const experiencesSchema = z.object({
  experiences: z.array(experienceItemSchema),
});

export const educationItemSchema = z.object({
  id: z.string().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  gpa: z.string().optional(),
});

export const educationsSchema = z.object({
  educations: z.array(educationItemSchema),
});

export const projectItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  linkUrl: z.string().optional(),
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema),
});

export const fullResumeSchema = z.object({
  personal: personalInfoSchema,
  summary: summarySchema,
  skills: z.array(skillItemSchema),
  experiences: z.array(experienceItemSchema),
  educations: z.array(educationItemSchema),
  projects: z.array(projectItemSchema),
});

export type FullResumeFormValues = z.infer<typeof fullResumeSchema>;
