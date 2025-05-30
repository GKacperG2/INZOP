import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionLink,
  actionOnClick,
  icon 
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="mb-4">
        {icon || <PlusCircle className="w-12 h-12 text-gray-400 mx-auto" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionText && (actionLink || actionOnClick) && (
        actionOnClick ? (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {actionText}
          </button>
        ) : actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {actionText}
          </Link>
        ) : null
      )}
    </div>
  );
}
