import React from 'react';
import { NoteType } from '../../types';

interface NoteTypeRadioProps {
  noteType: NoteType;
  onChange: (type: NoteType) => void;
}

export default function NoteTypeRadio({ noteType, onChange }: NoteTypeRadioProps) {
  return (
    <div className="space-x-4">
      <label className="inline-flex items-center">
        <input
          type="radio"
          value="file"
          checked={noteType === 'file'}
          onChange={(e) => onChange(e.target.value as NoteType)}
          className="form-radio text-indigo-600"
        />
        <span className="ml-2">Plik (PDF lub zdjęcie)</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          value="text"
          checked={noteType === 'text'}
          onChange={(e) => onChange(e.target.value as NoteType)}
          className="form-radio text-indigo-600"
        />
        <span className="ml-2">Notatka tekstowa</span>
      </label>
    </div>
  );
}
