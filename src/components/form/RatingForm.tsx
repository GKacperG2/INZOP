import React from 'react'
import { StarRating } from '../ui'

interface RatingFormProps {
  userRating: number
  comment: string
  submitting: boolean
  onRatingChange: (rating: number) => void
  onCommentChange: (comment: string) => void
  onSubmit: () => void
  existingRatingId: string | null
}

export const RatingForm: React.FC<RatingFormProps> = ({
  userRating,
  comment,
  submitting,
  onRatingChange,
  onCommentChange,
  onSubmit,
  existingRatingId
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {existingRatingId ? 'Zaktualizuj swoją ocenę' : 'Oceń tę notatkę'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ocena
          </label>
          <StarRating
            rating={userRating}
            onRatingChange={onRatingChange}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Komentarz (opcjonalny)
          </label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Podziel się swoimi przemyśleniami na temat tej notatki..."
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting || userRating === 0}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting 
            ? 'Wysyłanie...' 
            : existingRatingId 
              ? 'Zaktualizuj ocenę' 
              : 'Wyślij ocenę'
          }
        </button>
      </div>
    </div>
  )
}
