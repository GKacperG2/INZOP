import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Note } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          subjects (name),
          professors (name),
          user_profiles (username, university, major, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      const errorMessage = 'Nie udało się załadować notatek';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string, userId: string, currentUserId?: string) => {
    if (userId !== currentUserId) {
      toast.error('Możesz usuwać tylko własne notatki');
      return false;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Notatka została usunięta');
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Nie udało się usunąć notatki');
      return false;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    deleteNote
  };
}