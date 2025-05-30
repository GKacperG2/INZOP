import React from 'react'
import { Upload } from 'lucide-react'

interface AvatarUploadProps {
  avatarPreview: string | null
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarPreview,
  onAvatarChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Zdjęcie profilowe
      </label>
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span>Zmień zdjęcie</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onAvatarChange}
          />
        </label>
      </div>
    </div>
  )
}
