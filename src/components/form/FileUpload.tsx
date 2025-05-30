import React from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({ onFileChange }: FileUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Plik (PDF lub zdjęcie)
      </label>
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="mt-1 block w-full"
      />
    </div>
  );
}
