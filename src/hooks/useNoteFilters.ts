import { useState, useMemo } from 'react';
import { Note } from '../types';

export interface FilterOptions {
  searchTerm: string;
  selectedSubject: string;
  selectedProfessor: string;
  selectedUniversity: string;
  sortBy: 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc';
}

export function useNoteFilters(notes: Note[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    selectedSubject: '',
    selectedProfessor: '',
    selectedUniversity: '',
    sortBy: 'newest'
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const subjects = Array.from(
      new Set(notes.map(note => note.subjects?.name).filter(Boolean))
    ).map(name => ({ id: name!, name: name! }));

    const professors = Array.from(
      new Set(notes.map(note => note.professors?.name).filter(Boolean))
    ).map(name => ({ id: name!, name: name! }));

    const universities = Array.from(
      new Set(notes.map(note => note.user_profiles?.university).filter(Boolean))
    ) as string[];

    return { subjects, professors, universities };
  }, [notes]);

  // Apply filters and sorting
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      // Search term filter (title)
      if (filters.searchTerm && 
          !note.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Subject filter
      if (filters.selectedSubject && 
          note.subjects?.name !== filters.selectedSubject) {
        return false;
      }

      // Professor filter
      if (filters.selectedProfessor && 
          note.professors?.name !== filters.selectedProfessor) {
        return false;
      }

      // University filter
      if (filters.selectedUniversity && 
          note.user_profiles?.university !== filters.selectedUniversity) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        
        case 'title-asc':
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        
        case 'title-desc':
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        
        case 'rating-desc':
          return (b.calculated_average_rating || 0) - (a.calculated_average_rating || 0);
        
        case 'rating-asc':
          return (a.calculated_average_rating || 0) - (b.calculated_average_rating || 0);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, filters]);

  return {
    filters,
    setFilters,
    filteredNotes: filteredAndSortedNotes,
    filterOptions
  };
}
