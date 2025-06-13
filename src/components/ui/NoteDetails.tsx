import React from 'react'
import { Note } from '../../types'
import { GraduationCap, Building2, BookOpen, User } from 'lucide-react'

interface NoteDetailsProps {
  note: Note
  averageRating: number
}

export const NoteDetails: React.FC<NoteDetailsProps> = ({ note, averageRating }) => {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
            {averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'Brak ocen'}
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o autorze</h3>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {note.user_profiles?.avatar_url ? (
              <img
                src={note.user_profiles.avatar_url}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-7 h-7 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Autor</p>
                <p className="font-medium">{note.user_profiles?.username}</p>
              </div>
            </div>
            
            {note.user_profiles?.university && (
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Uczelnia</p>
                  <p className="font-medium">{note.user_profiles.university}</p>
                </div>
              </div>
            )}
            
            {note.user_profiles?.major && (
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Kierunek</p>
                  <p className="font-medium">{note.user_profiles.major}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}