import React from 'react'
import { Note } from '../../types'

interface NoteDetailsProps {
  note: Note
}

export const NoteDetails: React.FC<NoteDetailsProps> = ({ note }) => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Przedmiot</p>
        <p className="font-medium">{note.subjects?.name}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Prowadzący</p>
        <p className="font-medium">{note.professors?.name}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Rok</p>
        <p className="font-medium">{note.year}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Średnia ocena</p>
        <p className="font-medium">
          {note.average_rating ? `${note.average_rating.toFixed(1)}/5` : 'Brak ocen'}
        </p>
      </div>
    </div>
  )
}
