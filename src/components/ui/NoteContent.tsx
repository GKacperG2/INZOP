import React from 'react'

interface NoteContentProps {
  content: string
}

export const NoteContent: React.FC<NoteContentProps> = ({ content }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Note Content</h2>
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
          {content}
        </pre>
      </div>
    </div>
  )
}
