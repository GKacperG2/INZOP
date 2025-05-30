import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { validateEmail, validatePassword } from '../utils/validators'

export const useRegister = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!validateEmail(email)) {
      toast.error('Proszę wprowadzić prawidłowy adres e-mail')
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      toast.error('Hasło musi mieć co najmniej 6 znaków')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne')
      setLoading(false)
      return
    }

    if (username.trim().length < 2) {
      toast.error('Nazwa użytkownika musi mieć co najmniej 2 znaki')
      setLoading(false)
      return
    }

    try {
      await signUp(email, password, username)
      toast.success('Rejestracja pomyślna! Sprawdź swoją pocztę e-mail aby zweryfikować konto.')
    } catch {
      toast.error('Nie udało się utworzyć konta. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    loading,
    handleSubmit
  }
}
