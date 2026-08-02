-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Resume',
    target_role VARCHAR(255),
    summary TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    location VARCHAR(255),
    website_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
    completion_score INT DEFAULT 0 CHECK (completion_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    gpa VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General', -- e.g., Languages, Frameworks, Soft Skills
    proficiency_level VARCHAR(50) DEFAULT 'Intermediate', -- e.g., Beginner, Intermediate, Expert
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON public.experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_education_resume_id ON public.education(resume_id);
CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON public.skills(resume_id);

-- AUTOMATIC UPDATED_AT TRIGGER FOR RESUMES
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_resumes_updated_at ON public.resumes;
CREATE TRIGGER set_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- RESUMES POLICIES (Users can only manage their own resumes)
CREATE POLICY "Users can view their own resumes"
    ON public.resumes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes"
    ON public.resumes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
    ON public.resumes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
    ON public.resumes FOR DELETE
    USING (auth.uid() = user_id);

-- EXPERIENCES POLICIES (Inherit via resume ownership)
CREATE POLICY "Users can view experiences of their resumes"
    ON public.experiences FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = experiences.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can insert experiences into their resumes"
    ON public.experiences FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = experiences.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can update experiences of their resumes"
    ON public.experiences FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = experiences.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can delete experiences of their resumes"
    ON public.experiences FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = experiences.resume_id AND public.resumes.user_id = auth.uid()));

-- EDUCATION POLICIES
CREATE POLICY "Users can view education of their resumes"
    ON public.education FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = education.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can insert education into their resumes"
    ON public.education FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = education.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can update education of their resumes"
    ON public.education FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = education.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can delete education of their resumes"
    ON public.education FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = education.resume_id AND public.resumes.user_id = auth.uid()));

-- SKILLS POLICIES
CREATE POLICY "Users can view skills of their resumes"
    ON public.skills FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = skills.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can insert skills into their resumes"
    ON public.skills FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = skills.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can update skills of their resumes"
    ON public.skills FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = skills.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can delete skills of their resumes"
    ON public.skills FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = skills.resume_id AND public.resumes.user_id = auth.uid()));
