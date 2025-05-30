import React from 'react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TextEditor({ content, onChange }: TextEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Treść notatki</label>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Wprowadź treść notatki..."
      />
    </div>
  );
}
