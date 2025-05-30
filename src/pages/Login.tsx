import { AuthForm, AuthField } from '../components/auth'
import { useLogin } from '../hooks'

export default function Login() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin()

  return (
    <AuthForm
      title="Zaloguj się do BazUuu"
      linkText="Lub"
      linkTo="/register"
      linkLabel="utwórz nowe konto"
      onSubmit={handleSubmit}
      submitText="Zaloguj się"
    >
      <AuthField
        id="email-address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Adres e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-t-md"
      />
      <AuthField
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-b-md"
      />
    </AuthForm>
  )
}