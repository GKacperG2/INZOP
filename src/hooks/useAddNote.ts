import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { noteService } from '../services/api';
import { AddNoteFormData, CreateNoteData } from '../types';

export function useAddNote() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitNote = async (formData: AddNoteFormData): Promise<void> => {
    if (!user) {
      toast.error('Użytkownik nie jest zalogowany');
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      let filePath: string | undefined;
      let fileType: 'pdf' | 'image' | 'text' | undefined;

      if (formData.noteType === 'file' && formData.file) {
        filePath = await noteService.uploadFile(user.id, formData.file);
        fileType = noteService.getFileType(formData.file);
      } else if (formData.noteType === 'text') {
        fileType = 'text';
      }

      const noteData: CreateNoteData = {
        title: formData.title,
        subject_id: formData.subject,
        professor_id: formData.professor,
        year: parseInt(formData.year),
        user_id: user.id,
        file_path: filePath,
        file_type: fileType,
        content: formData.noteType === 'text' ? formData.content : undefined
      };

      await noteService.create(noteData);
      toast.success('Notatka została dodana!');
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error('Wystąpił błąd podczas dodawania notatki');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitNote,
    loading
  };
}
