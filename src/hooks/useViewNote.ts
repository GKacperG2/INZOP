import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Note, Rating } from '../types'

export const useViewNote = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [note, setNote] = useState<Note | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null)

  const fetchNoteAndRatings = useCallback(async () => {
    if (!id) return

    try {
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select(`
          *,
          user_profiles (username),
          subjects (name),
          professors (name)
        `)
        .eq('id', id)
        .single()

      if (noteError) throw noteError
      setNote(noteData)

      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          id,
          stars,
          comment,
          user_id,
          created_at,
          user_profiles (
            username
          )
        `)
        .eq('note_id', id)
        .order('created_at', { ascending: false })

      if (ratingsError) throw ratingsError
      
      // Transform the data to match the Rating interface
      const transformedRatings = ratingsData?.map(rating => ({
        ...rating,
        user_profiles: Array.isArray(rating.user_profiles) 
          ? rating.user_profiles[0] 
          : rating.user_profiles
      })) || []
      
      setRatings(transformedRatings)

      // Check if user has already rated
      const userExistingRating = ratingsData?.find(r => r.user_id === user?.id)
      if (userExistingRating) {
        setUserRating(userExistingRating.stars)
        setComment(userExistingRating.comment || '')
        setExistingRatingId(userExistingRating.id)
      } else {
        setUserRating(0)
        setComment('')
        setExistingRatingId(null)
      }
    } catch {
      toast.error('Nie udało się załadować notatki')
    } finally {
      setLoading(false)
    }
  }, [id, user?.id])

  useEffect(() => {
    if (id) {
      fetchNoteAndRatings()
    }
  }, [id, fetchNoteAndRatings])

  const handleDownload = async () => {
    if (!note?.file_path) {
      toast.error('Ta notatka nie zawiera pliku do pobrania')
      return
    }

    try {
      const { data, error } = await supabase.storage
        .from('notes')
        .download(note.file_path)

      if (error) throw error

      // Record download
      await supabase.from('downloads').insert([
        { note_id: id, user_id: user?.id }
      ])

      // Create download link
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = note.title || 'note'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Pobieranie rozpoczęte')
    } catch {
      toast.error('Nie udało się pobrać pliku')
    }
  }

  const handleSubmitRating = async () => {
    if (!userRating) {
      toast.error('Proszę wybrać ocenę przed wysłaniem')
      return
    }

    setSubmitting(true)
    try {
      let error
      if (existingRatingId) {
        // Update existing rating
        const { error: updateError } = await supabase
          .from('ratings')
          .update({
            stars: userRating,
            comment
          })
          .eq('id', existingRatingId)
        error = updateError
      } else {
        // Insert new rating
        const { error: insertError } = await supabase
          .from('ratings')
          .insert([{
            note_id: id,
            user_id: user?.id,
            stars: userRating,
            comment
          }])
        error = insertError
      }

      if (error) throw error

      toast.success(existingRatingId ? 'Ocena została zaktualizowana pomyślnie' : 'Ocena została dodana pomyślnie')
      await fetchNoteAndRatings()
    } catch {
      toast.error('Nie udało się wysłać oceny')
    } finally {
      setSubmitting(false)
    }
  }

  return {
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
  }
}
