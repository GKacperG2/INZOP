import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LoadingSpinner, AvatarUpload } from '../components/ui'
import { ProfileForm, PasswordChangeForm } from '../components/form'
import { useSettings } from '../hooks'

export default function Settings() {
  const navigate = useNavigate()
  const {
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
  } = useSettings()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Wstecz
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Ustawienia konta</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarUpload
              avatarPreview={avatarPreview}
              onAvatarChange={handleAvatarChange}
            />

            <ProfileForm
              profile={profile}
              onProfileChange={handleProfileChange}
            />

            <PasswordChangeForm
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}