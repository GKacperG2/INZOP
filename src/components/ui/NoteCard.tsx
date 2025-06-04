import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Star, User, Calendar, BookOpen, GraduationCap } from 'lucide-react';
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

  const getRandomGradient = () => {
    const gradients = [
      'from-pink-500 to-purple-500',
      'from-cyan-500 to-blue-500',
      'from-green-400 to-cyan-500',
      'from-violet-500 to-purple-500',
      'from-yellow-400 to-orange-500',
      'from-red-500 to-pink-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getRandomGradient()} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3 min-w-0">
            <div className="flex-shrink-0">
              {note.user_profiles?.avatar_url ? (
                <img
                  src={note.user_profiles.avatar_url}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-2 ring-white">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {note.title}
              </h2>
              <div className="mt-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {note.user_profiles?.username}
                </p>
                {note.user_profiles?.university && (
                  <p className="text-sm text-gray-500 truncate">
                    {note.user_profiles.university}
                    {note.user_profiles.major && ` • ${note.user_profiles.major}`}
                  </p>
                )}
              </div>
            </div>
          </div>
          {note.user_id === currentUserId && (
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              aria-label="Usuń notatkę"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-6 space-y-3 flex-grow">
          <div className="flex items-center text-gray-600">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{note.subjects?.name}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{note.professors?.name}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{new Date(note.created_at || '').toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            note.file_type === 'text' 
              ? 'bg-purple-100 text-purple-700'
              : note.file_type === 'pdf'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {note.file_type === 'text' ? 'Notatka' : note.file_type?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}