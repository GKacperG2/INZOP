import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Subject, Professor, AddNoteFormData } from '../../types';
import { subjectService, professorService } from '../../services/api';
import { validateForm, isValidFileType } from '../../utils/validators';
import { VALIDATION_MESSAGES, FILE_UPLOAD_LIMITS } from '../../constants';
import FormField from '../ui/FormField';
import SubjectSelector from './SubjectSelector';
import ProfessorSelector from './ProfessorSelector';
import NoteTypeRadio from './NoteTypeRadio';
import FileUpload from './FileUpload';
import TextEditor from './TextEditor';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AddNoteFormProps {
  onSubmit: (formData: AddNoteFormData) => Promise<void>;
  loading: boolean;
}

export default function AddNoteForm({ onSubmit, loading }: AddNoteFormProps) {
  const [formData, setFormData] = useState<AddNoteFormData>({
    title: '',
    subject: '',
    professor: '',
    year: '',
    noteType: 'file',
    file: null,
    content: ''
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsData, professorsData] = await Promise.all([
        subjectService.getAll(),
        professorService.getAll()
      ]);
      setSubjects(subjectsData);
      setProfessors(professorsData);
    } catch {
      toast.error('Nie udało się załadować danych');
    }
  };

  const handleAddSubject = async (name: string) => {
    if (!name.trim()) {
      toast.error('Wprowadź nazwę przedmiotu');
      return;
    }

    try {
      const newSubjectData = await subjectService.create(name);
      setSubjects([...subjects, newSubjectData]);
      setFormData(prev => ({ ...prev, subject: newSubjectData.id }));
      toast.success('Dodano nowy przedmiot');
    } catch {
      toast.error('Nie udało się dodać przedmiotu');
    }
  };

  const handleAddProfessor = async (name: string) => {
    if (!name.trim()) {
      toast.error('Wprowadź nazwę prowadzącego');
      return;
    }

    try {
      const newProfessorData = await professorService.create(name);
      setProfessors([...professors, newProfessorData]);
      setFormData(prev => ({ ...prev, professor: newProfessorData.id }));
      toast.success('Dodano nowego prowadzącego');
    } catch {
      toast.error('Nie udało się dodać prowadzącego');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja formularza
    if (!validateForm.title(formData.title)) {
      toast.error(VALIDATION_MESSAGES.TITLE_TOO_SHORT);
      return;
    }

    if (formData.noteType === 'file') {
      if (!formData.file) {
        toast.error('Proszę wybrać plik');
        return;
      }
      
      if (!isValidFileType(formData.file)) {
        toast.error(VALIDATION_MESSAGES.INVALID_FILE_TYPE);
        return;
      }
      
      if (formData.file.size > FILE_UPLOAD_LIMITS.MAX_SIZE) {
        toast.error(VALIDATION_MESSAGES.FILE_TOO_LARGE);
        return;
      }
    }

    if (formData.noteType === 'text' && !validateForm.content(formData.content)) {
      toast.error(VALIDATION_MESSAGES.CONTENT_TOO_SHORT);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Tytuł" required>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </FormField>

        <FormField label="Przedmiot" required>
          <SubjectSelector
            subjects={subjects}
            selectedSubject={formData.subject}
            onSubjectChange={(subjectId) => setFormData(prev => ({ ...prev, subject: subjectId }))}
            onAddSubject={handleAddSubject}
          />
        </FormField>

        <FormField label="Prowadzący" required>
          <ProfessorSelector
            professors={professors}
            selectedProfessor={formData.professor}
            onProfessorChange={(professorId) => setFormData(prev => ({ ...prev, professor: professorId }))}
            onAddProfessor={handleAddProfessor}
          />
        </FormField>

        <FormField label="Rok" required>
          <input
            type="number"
            required
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            min="2000"
            max="2100"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </FormField>

        <FormField label="Typ notatki">
          <NoteTypeRadio
            noteType={formData.noteType}
            onChange={(type) => setFormData(prev => ({ ...prev, noteType: type }))}
          />
        </FormField>

        {formData.noteType === 'file' ? (
          <FileUpload
            onFileChange={(file) => setFormData(prev => ({ ...prev, file }))}
          />
        ) : (
          <TextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" color="white" />
              <span className="ml-2">Dodawanie...</span>
            </div>
          ) : (
            'Dodaj notatkę'
          )}
        </button>
      </form>
    </div>
  );
}
