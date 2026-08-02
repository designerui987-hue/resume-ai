export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_role: string | null;
          summary: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          location: string | null;
          website_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          status: 'Draft' | 'Published' | 'Archived';
          completion_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          target_role?: string | null;
          summary?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          location?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          status?: 'Draft' | 'Published' | 'Archived';
          completion_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          target_role?: string | null;
          summary?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          location?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          status?: 'Draft' | 'Published' | 'Archived';
          completion_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          resume_id: string;
          company_name: string;
          position: string;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          company_name: string;
          position: string;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          company_name?: string;
          position?: string;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          resume_id: string;
          institution: string;
          degree: string;
          field_of_study: string | null;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          gpa: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          institution: string;
          degree: string;
          field_of_study?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          gpa?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          institution?: string;
          degree?: string;
          field_of_study?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          gpa?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          resume_id: string;
          name: string;
          category: string;
          proficiency_level: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          name: string;
          category?: string;
          proficiency_level?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          name?: string;
          category?: string;
          proficiency_level?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
  };
}
