import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

interface AuthFormProps {
  title: string
  linkText: string
  linkTo: string
  linkLabel: string
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  submitText: string
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  linkText,
  linkTo,
  linkLabel,
  onSubmit,
  children,
  submitText
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {linkText}{' '}
            <Link to={linkTo} className="font-medium text-indigo-600 hover:text-indigo-500">
              {linkLabel}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {children}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
