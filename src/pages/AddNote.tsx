import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { AddNoteForm } from '../components/form'
import { useAddNote } from '../hooks'
import { AddNoteFormData } from '../types'

export default function AddNote() {
  const navigate = useNavigate()
  const { submitNote, loading } = useAddNote()
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSubmit = async (formData: AddNoteFormData) => {
    try {
      await submitNote(formData)
      setShowThankYou(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch {
      // Error handling is done in the hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 transform animate-[scale-up_0.5s_ease-out]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-[slide-up_0.5s_ease-out]">
                Dziękujemy!
              </h2>
              <p className="text-gray-600 animate-[fade-in_0.5s_ease-out]">
                Twoja notatka została dodana pomyślnie
              </p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Dodaj nową notatkę"
        onBack={() => navigate(-1)}
      />
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <AddNoteForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}