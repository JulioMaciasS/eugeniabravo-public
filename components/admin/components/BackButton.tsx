import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  href = '/admin', 
  label = 'Volver al Dashboard',
  className = ''
}) => {
  return (
    <Link
      href={href}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 
        hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
        ${className}
      `}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default BackButton;
