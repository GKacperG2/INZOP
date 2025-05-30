import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Note, Rating, AddNoteFormData } from '../types'
import { noteService } from '../services/api'

export const useViewNote = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const fetchNoteAndRatings = useCallback(async () => {
    if (!id) return

    try {
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select(`
          *,
          user_profiles (username, university, major),
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
      
      const transformedRatings = ratingsData?.map(rating => ({
        ...rating,
        user_profiles: Array.isArray(rating.user_profiles) 
          ? rating.user_profiles[0] 
          : rating.user_profiles
      })) || []
      
      setRatings(transformedRatings)

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
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, user?.id, navigate])

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

      await supabase.from('downloads').insert([
        { note_id: id, user_id: user?.id }
      ])

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
        const { error: updateError } = await supabase
          .from('ratings')
          .update({
            stars: userRating,
            comment
          })
          .eq('id', existingRatingId)
        error = updateError
      } else {
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

      toast.success(existingRatingId ? 'Ocena została zaktualizowana' : 'Ocena została dodana')
      await fetchNoteAndRatings()
    } catch {
      toast.error('Nie udało się wysłać oceny')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (formData: AddNoteFormData) => {
    if (!note || !id) return

    setEditLoading(true)
    try {
      let filePath = note.file_path
      let fileType = note.file_type

      if (formData.noteType === 'file' && formData.file) {
        filePath = await noteService.uploadFile(user!.id, formData.file)
        fileType = noteService.getFileType(formData.file)
      } else if (formData.noteType === 'text') {
        filePath = null
        fileType = 'text'
      }

      await noteService.update(id, {
        title: formData.title,
        subject_id: formData.subject,
        professor_id: formData.professor,
        year: parseInt(formData.year),
        file_path: filePath,
        file_type: fileType,
        content: formData.noteType === 'text' ? formData.content : null
      })

      toast.success('Notatka została zaktualizowana')
      setIsEditing(false)
      await fetchNoteAndRatings()
    } catch {
      toast.error('Nie udało się zaktualizować notatki')
    } finally {
      setEditLoading(false)
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
    isEditing,
    setIsEditing,
    editLoading,
    handleDownload,
    handleSubmitRating,
    handleEditSubmit,
    canEdit: note?.user_id === user?.id
  }
}