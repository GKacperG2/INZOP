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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!validateForm.title(formData.title)) {
      newErrors.title = VALIDATION_MESSAGES.TITLE_TOO_SHORT;
    }

    if (!formData.subject) {
      newErrors.subject = 'Wybierz lub dodaj przedmiot';
    }

    if (!formData.professor) {
      newErrors.professor = 'Wybierz lub dodaj prowadzącego';
    }

    if (!validateForm.year(formData.year)) {
      newErrors.year = VALIDATION_MESSAGES.INVALID_YEAR;
    }

    if (formData.noteType === 'file') {
      if (!formData.file) {
        newErrors.file = 'Proszę wybrać plik';
      } else if (!isValidFileType(formData.file)) {
        newErrors.file = VALIDATION_MESSAGES.INVALID_FILE_TYPE;
      } else if (formData.file.size > FILE_UPLOAD_LIMITS.MAX_SIZE) {
        newErrors.file = VALIDATION_MESSAGES.FILE_TOO_LARGE;
      }
    }

    if (formData.noteType === 'text' && !validateForm.content(formData.content)) {
      newErrors.content = VALIDATION_MESSAGES.CONTENT_TOO_SHORT;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubject = async (name: string) => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, subject: 'Wprowadź nazwę przedmiotu' }));
      return;
    }

    try {
      const newSubjectData = await subjectService.create(name);
      setSubjects([...subjects, newSubjectData]);
      setFormData(prev => ({ ...prev, subject: newSubjectData.id }));
      setErrors(prev => ({ ...prev, subject: '' }));
      toast.success('Dodano nowy przedmiot');
    } catch {
      toast.error('Nie udało się dodać przedmiotu');
    }
  };

  const handleAddProfessor = async (name: string) => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, professor: 'Wprowadź nazwę prowadzącego' }));
      return;
    }

    try {
      const newProfessorData = await professorService.create(name);
      setProfessors([...professors, newProfessorData]);
      setFormData(prev => ({ ...prev, professor: newProfessorData.id }));
      setErrors(prev => ({ ...prev, professor: '' }));
      toast.success('Dodano nowego prowadzącego');
    } catch {
      toast.error('Nie udało się dodać prowadzącego');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) {
      toast.error('Proszę poprawić błędy w formularzu');
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
            className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-0 ${
              errors.title
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </FormField>

        <FormField label="Przedmiot" required>
          <SubjectSelector
            subjects={subjects}
            selectedSubject={formData.subject}
            onSubjectChange={(subjectId) => {
              setFormData(prev => ({ ...prev, subject: subjectId }));
              setErrors(prev => ({ ...prev, subject: '' }));
            }}
            onAddSubject={handleAddSubject}
            error={errors.subject}
          />
        </FormField>

        <FormField label="Prowadzący" required>
          <ProfessorSelector
            professors={professors}
            selectedProfessor={formData.professor}
            onProfessorChange={(professorId) => {
              setFormData(prev => ({ ...prev, professor: professorId }));
              setErrors(prev => ({ ...prev, professor: '' }));
            }}
            onAddProfessor={handleAddProfessor}
            error={errors.professor}
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
            className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-0 ${
              errors.year
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
          )}
        </FormField>

        <FormField label="Typ notatki">
          <NoteTypeRadio
            noteType={formData.noteType}
            onChange={(type) => setFormData(prev => ({ ...prev, noteType: type }))}
          />
        </FormField>

        {formData.noteType === 'file' ? (
          <div>
            <FileUpload
              onFileChange={(file) => {
                setFormData(prev => ({ ...prev, file }));
                setErrors(prev => ({ ...prev, file: '' }));
              }}
            />
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
        ) : (
          <div>
            <TextEditor
              content={formData.content}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, content }));
                setErrors(prev => ({ ...prev, content: '' }));
              }}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
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