import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PlusCircle } from 'lucide-react'
import UserMenu from '../components/UserMenu'
import { LoadingSpinner, NoteCard, EmptyState, FilterBar } from '../components/ui'
import { useNotes, useNoteFilters } from '../hooks'

function Home() {
  const { user } = useAuth()
  const { notes, loading, deleteNote } = useNotes()
  const { filters, setFilters, filteredNotes, filterOptions } = useNoteFilters(notes)

  const handleDelete = (noteId: string, userId: string) => {
    deleteNote(noteId, userId, user?.id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notatki</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/add-note"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Dodaj notatkę
            </Link>
            <UserMenu />
          </div>
        </div>

        {notes.length > 0 && (
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            subjects={filterOptions.subjects}
            professors={filterOptions.professors}
            universities={filterOptions.universities}
            totalResults={filteredNotes.length}
          />
        )}

        {filteredNotes.length === 0 ? (
          notes.length === 0 ? (
            <EmptyState
              title="Brak notatek"
              description="Dodaj swoją pierwszą notatkę, aby rozpocząć!"
              actionText="Dodaj notatkę"
              actionLink="/add-note"
            />
          ) : (
            <EmptyState
              title="Brak wyników"
              description="Nie znaleziono notatek spełniających kryteria wyszukiwania."
              actionText="Wyczyść filtry"
              actionOnClick={() => setFilters({
                searchTerm: '',
                selectedSubject: '',
                selectedProfessor: '',
                selectedUniversity: '',
                sortBy: 'newest'
              })}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                currentUserId={user?.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home