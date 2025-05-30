import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { 
  LoadingSpinner, 
  NoteHeader, 
  NoteDetails, 
  NoteContent, 
  RatingList 
} from '../components/ui'
import { RatingForm } from '../components/form'
import { useViewNote } from '../hooks'

function ViewNote() {
  const navigate = useNavigate()
  const {
    note,
    ratings,
    userRating,
    setUserRating,
    comment,
    setComment,
    loading,
    submitting,
    existingRatingId,
    handleDownload,
    handleSubmitRating
  } = useViewNote()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Notatka nie znaleziona</h2>
          <p className="text-gray-600">Notatka, której szukasz nie istnieje.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Wstecz
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <NoteHeader note={note} onDownload={handleDownload} />
            <NoteDetails note={note} />
            
            {note.content && <NoteContent content={note.content} />}
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mt-8 space-y-8">
          {/* User Rating Form */}
          <div>
            <RatingForm
              userRating={userRating}
              comment={comment}
              submitting={submitting}
              onRatingChange={setUserRating}
              onCommentChange={setComment}
              onSubmit={handleSubmitRating}
              existingRatingId={existingRatingId}
            />
          </div>

          {/* All Ratings */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Wszystkie oceny ({ratings.length})
              </h3>
              <RatingList ratings={ratings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewNote
