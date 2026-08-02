-- Add PROJECTS table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(255),
    link_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_resume_id ON public.projects(resume_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects of their resumes"
    ON public.projects FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = projects.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can insert projects into their resumes"
    ON public.projects FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = projects.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can update projects of their resumes"
    ON public.projects FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = projects.resume_id AND public.resumes.user_id = auth.uid()));

CREATE POLICY "Users can delete projects of their resumes"
    ON public.projects FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.resumes WHERE public.resumes.id = projects.resume_id AND public.resumes.user_id = auth.uid()));
