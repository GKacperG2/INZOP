import React from 'react'
import { Rating } from '../../types'
import { StarRating } from '../ui'

interface RatingListProps {
  ratings: Rating[]
}

export const RatingList: React.FC<RatingListProps> = ({ ratings }) => {
  if (ratings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No ratings yet. Be the first to rate this note!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div key={rating.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {rating.user_profiles.username}
              </span>
              <StarRating rating={rating.stars} onRatingChange={() => {}} readonly />
            </div>
            <span className="text-sm text-gray-500">
              {new Date(rating.created_at).toLocaleDateString()}
            </span>
          </div>
          {rating.comment && (
            <p className="text-gray-700 mt-2">{rating.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
