import { supabase } from '../lib/supabase';
import { Subject, Professor, CreateNoteData } from '../types';

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(name: string): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const professorService = {
  async getAll(): Promise<Professor[]> {
    const { data, error } = await supabase
      .from('professors')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(name: string): Promise<Professor> {
    const { data, error } = await supabase
      .from('professors')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const noteService = {
  async uploadFile(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from('notes')
      .upload(filePath, file);

    if (error) throw error;
    return filePath;
  },

  async create(noteData: CreateNoteData): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .insert([noteData]);

    if (error) throw error;
  },

  async update(noteId: string, noteData: Partial<CreateNoteData>): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update(noteData)
      .eq('id', noteId);

    if (error) throw error;
  },

  getFileType(file: File): 'pdf' | 'image' {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    return fileExt === 'pdf' ? 'pdf' : 'image';
  }
};