import React from 'react'
import { Download } from 'lucide-react'
import { Note } from '../../types'

interface NoteHeaderProps {
  note: Note
  onDownload: () => void
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({ note, onDownload }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
        <p className="text-gray-500 mt-2">
          Dodane przez {note.user_profiles?.username}
        </p>
      </div>
      {note.file_path && (
        <button
          onClick={onDownload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Pobierz
        </button>
      )}
    </div>
  )
}
