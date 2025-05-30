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
  error?: string;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  allowAdd = false,
  onAdd,
  label,
  required = false,
  error
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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes((searchTerm || displayValue).toLowerCase())
  ).slice(0, 5); // Limit to 5 results for better UI

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setDisplayValue(term);
    setIsOpen(true);
    
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
    if (displayValue.trim() && onAdd) {
      onAdd(displayValue.trim());
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

  const showAddOption = allowAdd && displayValue && 
    !filteredOptions.some(option => 
      option.name.toLowerCase() === displayValue.toLowerCase()
    );

  const shouldShowDropdown = isOpen && displayValue.length >= 2 && filteredOptions.length > 0;

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
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
          required={required}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {displayValue && (
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

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {!displayValue && (
        <p className="mt-1 text-sm text-gray-500">
          Wpisz minimum 2 znaki aby wyszukać
        </p>
      )}

      {showAddOption && (
        <button
          type="button"
          onClick={handleAddNew}
          className="mt-2 w-full flex items-center justify-center px-3 py-2 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate-pulse"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj "{displayValue}"
        </button>
      )}

      {shouldShowDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
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
        </div>
      )}
    </div>
  );
}