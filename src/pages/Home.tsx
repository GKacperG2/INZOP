import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PlusCircle, BookOpen } from 'lucide-react'
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                BazUuu
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/add-note"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Dodaj notatkę
              </Link>
              <UserMenu />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-1/3 -z-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 right-1/3 -z-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Filter Section */}
        {notes.length > 0 && (
          <div className="backdrop-blur-sm bg-white/50 rounded-2xl p-1 mb-8">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              subjects={filterOptions.subjects}
              professors={filterOptions.professors}
              universities={filterOptions.universities}
              totalResults={filteredNotes.length}
            />
          </div>
        )}

        {/* Content Section */}
        {filteredNotes.length === 0 ? (
          notes.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                title="Witaj w BazUuu!"
                description="Rozpocznij swoją przygodę z dzieleniem się wiedzą. Dodaj swoją pierwszą notatkę!"
                actionText="Dodaj pierwszą notatkę"
                actionLink="/add-note"
                icon={<BookOpen className="w-16 h-16 text-indigo-600 mx-auto" />}
              />
            </div>
          ) : (
            <div className="mt-12">
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
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.map((note) => (
              <div key={note.id} className="transform hover:-translate-y-1 transition-all duration-200">
                <NoteCard
                  note={note}
                  currentUserId={user?.id}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home