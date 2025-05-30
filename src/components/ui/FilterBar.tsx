import { useState } from 'react';
import { Search, Filter, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

export interface FilterOptions {
  searchTerm: string;
  selectedSubject: string;
  selectedProfessor: string;
  selectedUniversity: string;
  sortBy: 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc';
}

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  subjects: Array<{ id: string; name: string }>;
  professors: Array<{ id: string; name: string }>;
  universities: Array<string>;
  totalResults: number;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  subjects,
  professors,
  universities,
  totalResults
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedSubject: '',
      selectedProfessor: '',
      selectedUniversity: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.selectedSubject || 
                          filters.selectedProfessor || filters.selectedUniversity;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-700"
        >
          <Filter className="w-5 h-5 text-gray-500" />
          <span>Filtry i sortowanie</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Szukaj po tytule..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Subject Filter */}
            <SearchableDropdown
              options={subjects}
              value={filters.selectedSubject}
              onChange={(value: string) => handleFilterChange('selectedSubject', value)}
              placeholder="Wszystkie przedmioty"
            />

            {/* Professor Filter */}
            <SearchableDropdown
              options={professors}
              value={filters.selectedProfessor}
              onChange={(value: string) => handleFilterChange('selectedProfessor', value)}
              placeholder="Wszyscy prowadzący"
            />

            {/* University Filter */}
            <select
              value={filters.selectedUniversity}
              onChange={(e) => handleFilterChange('selectedUniversity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Wszystkie uczelnie</option>
              {universities.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <div className="relative md:col-span-2 lg:col-span-1">
              <SortAsc className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
                <option value="title-asc">Tytuł A-Z</option>
                <option value="title-desc">Tytuł Z-A</option>
                <option value="rating-desc">Najwyżej oceniane</option>
                <option value="rating-asc">Najniżej oceniane</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600 border-t pt-4">
            Znaleziono {totalResults} {totalResults === 1 ? 'notatkę' : totalResults < 5 ? 'notatki' : 'notatek'}
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                (przefiltrowane z {subjects.length + professors.length + universities.length} dostępnych)
              </span>
            )}
          </div>
        </>
      )}

      {/* Collapsed view - show active filters */}
      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Szukaj: {filters.searchTerm}
            </span>
          )}
          {filters.selectedSubject && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Przedmiot: {filters.selectedSubject}
            </span>
          )}
          {filters.selectedProfessor && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Prowadzący: {filters.selectedProfessor}
            </span>
          )}
          {filters.selectedUniversity && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Uczelnia: {filters.selectedUniversity}
            </span>
          )}
          <span className="text-sm text-gray-600">
            ({totalResults} {totalResults === 1 ? 'wynik' : totalResults < 5 ? 'wyniki' : 'wyników'})
          </span>
        </div>
      )}
    </div>
  );
}
