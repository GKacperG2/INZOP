import React from 'react'
import { FormField } from '../ui'

interface PasswordChangeFormProps {
  newPassword: string
  confirmPassword: string
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Zmiana hasła</h3>
      <FormField label="Nowe hasło">
        <input
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNewPasswordChange(e.target.value)}
          placeholder="Zostaw puste jeśli nie chcesz zmieniać"
        />
      </FormField>
      <FormField label="Potwierdź nowe hasło">
        <input
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfirmPasswordChange(e.target.value)}
        />
      </FormField>
    </div>
  )
}
