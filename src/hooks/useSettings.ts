import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { UserProfile } from '../types'

export const useSettings = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user?.id)
            .single()

          if (error) throw error

          setProfile(data)
          if (data.avatar_url) {
            setAvatarPreview(data.avatar_url)
          }
        } catch {
          toast.error('Nie udało się załadować profilu')
        } finally {
          setLoading(false)
        }
      }
      
      fetchProfile()
    }
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null

    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${user?.id}/avatar.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const handleProfileChange = (field: keyof UserProfile, value: string | number | null) => {
    setProfile(prev => {
      if (!prev) return null
      
      // Handle empty strings for optional text fields
      if (field === 'university' || field === 'major') {
        return { ...prev, [field]: value === '' ? null : value }
      }
      
      return { ...prev, [field]: value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('Hasła nie są identyczne')
          return
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (passwordError) throw passwordError
      }

      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url
      if (avatarFile) {
        avatarUrl = await uploadAvatar()
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          username: profile?.username,
          avatar_url: avatarUrl,
          university: profile?.university || null,
          major: profile?.major || null,
          study_start_year: profile?.study_start_year || null
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      toast.success('Profil został zaktualizowany pomyślnie')
      setNewPassword('')
      setConfirmPassword('')
      setAvatarFile(null)
    } catch {
      toast.error('Nie udało się zaktualizować profilu')
    } finally {
      setSaving(false)
    }
  }

  return {
    profile,
    loading,
    saving,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    avatarPreview,
    handleAvatarChange,
    handleProfileChange,
    handleSubmit
  }
}
