import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  allowAdd?: boolean;
  onAdd?: (name: string) => void;
  label?: string;
  required?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  allowAdd = false,
  onAdd,
  label,
  required = false
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display value when value prop changes
  useEffect(() => {
    const selectedOption = options.find(option => option.id === value || option.name === value);
    setDisplayValue(selectedOption ? selectedOption.name : '');
    setSearchTerm('');
  }, [value, options]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = searchTerm.length >= 2 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setDisplayValue(term);
    
    if (term.length >= 2) {
      setIsOpen(true);
    }
    
    // If input is cleared, clear the selection
    if (term === '') {
      onChange('');
    }
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option.id);
    setDisplayValue(option.name);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleAddNew = () => {
    if (searchTerm.trim() && onAdd) {
      onAdd(searchTerm.trim());
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    onChange('');
    setDisplayValue('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const showAddOption = allowAdd && searchTerm.length >= 2 && 
    !filteredOptions.some(option => 
      option.name.toLowerCase() === searchTerm.toLowerCase()
    );

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm.length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required={required}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (searchTerm.length >= 2 || filteredOptions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchTerm.length < 2 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Wpisz co najmniej 2 litery aby wyszukać
            </div>
          )}
          
          {searchTerm.length >= 2 && filteredOptions.length === 0 && !showAddOption && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Brak wyników
            </div>
          )}
          
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {option.name}
            </button>
          ))}
          
          {showAddOption && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Dodaj "{searchTerm}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
