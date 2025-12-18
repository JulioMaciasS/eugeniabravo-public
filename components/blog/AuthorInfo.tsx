import { User } from 'lucide-react';

interface AuthorData {
  id: string;
  name: string;
  role?: string | null;
  description?: string | null;
  profile_picture_url?: string | null;
  email?: string | null;
}

interface AuthorInfoProps {
  author: AuthorData;
  className?: string;
}

export default function AuthorInfo({ author, className = '' }: AuthorInfoProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#009483] ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Author Profile Picture */}
        <div className="flex-shrink-0">
          {author.profile_picture_url ? (
            <img
              src={author.profile_picture_url}
              alt={`Foto de perfil de ${author.name}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
            {author.role && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#009483] text-white">
                {author.role}
              </span>
            )}
          </div>
          
          {author.description && (
            <p className="text-gray-600 leading-relaxed">
              {author.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
