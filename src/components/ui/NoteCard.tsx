import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Star, User } from 'lucide-react';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  currentUserId?: string;
  onDelete: (noteId: string, userId: string) => void;
}

export default function NoteCard({ note, currentUserId, onDelete }: NoteCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/notes/${note.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id, note.user_id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-60 flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {note.user_profiles?.avatar_url ? (
                <img
                  src={note.user_profiles.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {note.title}
              </h2>
              <div className="text-sm text-gray-500 mt-1 h-10 overflow-hidden">
                <p className="truncate">{note.user_profiles?.username}</p>
                {note.user_profiles?.university && (
                  <p className="text-xs text-gray-400 truncate">
                    {note.user_profiles.university}
                    {note.user_profiles.major && ` - ${note.user_profiles.major}`}
                  </p>
                )}
              </div>
            </div>
          </div>
          {note.user_id === currentUserId && (
            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
              aria-label="Usuń notatkę"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="mt-4 space-y-2 flex-1">
          <p className="text-sm text-gray-600 truncate">
            Przedmiot: {note.subjects?.name}
          </p>
          <p className="text-sm text-gray-600 truncate">
            Prowadzący: {note.professors?.name}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {new Date(note.created_at || '').toLocaleDateString()}
          </span>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(note.average_rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-blue-600">
              {note.file_type === 'text' ? 'Notatka tekstowa' : note.file_type?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}