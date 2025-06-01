// Types and interfaces for the application

export interface Subject {
  id: string;
  name: string;
}

export interface Professor {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  subject_id: string;
  professor_id: string;
  year: number;
  user_id: string;
  file_path?: string;
  file_type?: 'pdf' | 'image' | 'text';
  content?: string;
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  subjects?: {
    name: string;
  };
  professors?: {
    name: string;
  };
  user_profiles?: {
    username: string;
    university: string | null;
    major: string | null;
    avatar_url: string | null;
  };
}

export interface CreateNoteData {
  title: string;
  subject_id: string;
  professor_id: string;
  year: number;
  user_id: string;
  file_path?: string;
  file_type?: 'pdf' | 'image' | 'text';
  content?: string;
}

export type NoteType = 'file' | 'text';

export interface AddNoteFormData {
  title: string;
  subject: string;
  professor: string;
  year: string;
  noteType: NoteType;
  file: File | null;
  content: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  university: string | null;
  major: string | null;
  study_start_year: number | null;
}

export interface Rating {
  id: string;
  stars: number;
  comment: string;
  user_id: string;
  user_profiles: {
    username: string;
    avatar_url: string | null;
  };
  created_at: string;
}