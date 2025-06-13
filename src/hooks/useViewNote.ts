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

  const fetchRatings = useCallback(async () => {
    if (!id) return

    try {
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          id,
          stars,
          comment,
          user_id,
          created_at,
          user_profiles (
            username,
            avatar_url
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
    } catch (error) {
      console.error('Error fetching ratings:', error)
    }
  }, [id, user?.id])

  const fetchNoteAndRatings = useCallback(async () => {
    if (!id) return

    try {
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select(`
          *,
          user_profiles (username, university, major, avatar_url),
          subjects (name),
          professors (name)
        `)
        .eq('id', id)
        .single()

      if (noteError) throw noteError
      setNote(noteData)

      await fetchRatings()
    } catch {
      toast.error('Nie udało się załadować notatki')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, fetchRatings])

  useEffect(() => {
    if (id) {
      fetchNoteAndRatings()
    }
  }, [id, fetchNoteAndRatings])

  // Add cross-tab communication using localStorage events
  useEffect(() => {
    if (!id) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `note-rating-updated-${id}`) {
        // Another tab updated a rating for this note, refresh our data
        console.log('Detected rating update from another tab')
        fetchNoteAndRatings()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [id, fetchNoteAndRatings])

  // Also add real-time subscription as backup
  useEffect(() => {
    if (!id) return

    const channel = supabase
      .channel(`note-ratings-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Note updated via real-time:', payload)
          setNote(prev => prev ? { ...prev, ...payload.new } : null)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'ratings',
          filter: `note_id=eq.${id}`,
        },
        () => {
          console.log('Rating changed via real-time')
          fetchRatings()
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, fetchRatings])

  // Add periodic refresh as ultimate fallback (every 2 minutes)
  useEffect(() => {
    if (!id) return

    const interval = setInterval(() => {
      console.log('Periodic refresh of ratings')
      fetchRatings()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [id, fetchRatings])

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
      
      // Notify other tabs about the rating update
      localStorage.setItem(`note-rating-updated-${id}`, Date.now().toString())
      localStorage.removeItem(`note-rating-updated-${id}`)
      
      // Refresh our own data
      await fetchRatings()
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