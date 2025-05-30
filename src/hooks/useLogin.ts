import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

export const useLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn(email, password)
      toast.success('Pomyślnie zalogowano!')
    } catch {
      toast.error('Nie udało się zalogować. Sprawdź swoje dane uwierzytelniające.')
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit
  }
}
