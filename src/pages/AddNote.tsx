import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { AddNoteForm } from '../components/form'
import { useAddNote } from '../hooks'
import { AddNoteFormData } from '../types'

export default function AddNote() {
  const navigate = useNavigate()
  const { submitNote, loading } = useAddNote()

  const handleSubmit = async (formData: AddNoteFormData) => {
    try {
      await submitNote(formData)
      navigate('/')
    } catch {
      // Error handling is done in the hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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