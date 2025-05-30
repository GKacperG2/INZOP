import React from 'react'
import { FormField } from '../ui'
import { UserProfile } from '../../types'

interface ProfileFormProps {
  profile: UserProfile | null
  onProfileChange: (field: keyof UserProfile, value: string | number | null) => void
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileChange
}) => {
  return (
    <div className="space-y-6">
      <FormField label="Nazwa użytkownika" required>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={profile?.username || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange('username', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Uniwersytet">
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={profile?.university || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange('university', e.target.value)}
          placeholder="Nazwa uniwersytetu"
        />
      </FormField>

      <FormField label="Kierunek studiów">
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={profile?.major || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange('major', e.target.value)}
          placeholder="Kierunek studiów"
        />
      </FormField>

      <FormField label="Rok rozpoczęcia studiów">
        <input
          type="number"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={profile?.study_start_year?.toString() || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange('study_start_year', parseInt(e.target.value) || null)}
          placeholder="RRRR"
          min={2000}
          max={new Date().getFullYear()}
        />
      </FormField>
    </div>
  )
}
