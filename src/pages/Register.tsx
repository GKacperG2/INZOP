import { AuthForm, AuthField } from '../components/auth'
import { useRegister } from '../hooks'

export default function Register() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    handleSubmit
  } = useRegister()

  return (
    <AuthForm
      title="Utwórz swoje konto"
      linkText="Lub"
      linkTo="/login"
      linkLabel="zaloguj się na swoje konto"
      onSubmit={handleSubmit}
      submitText="Utwórz konto"
    >
      <AuthField
        id="username"
        name="username"
        type="text"
        placeholder="Nazwa użytkownika"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="rounded-t-md"
      />
      <AuthField
        id="email-address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Adres e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthField
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthField
        id="confirm-password"
        name="confirm-password"
        type="password"
        autoComplete="new-password"
        placeholder="Potwierdź hasło"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="rounded-b-md"
      />
    </AuthForm>
  )
}