"use client"

import { PostWithCategories } from '@/app/services/supabasePostService'
import { Clock, Edit2, Trash2, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '@/app/lib/demo-mode'

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + 'assets/default-cover.jpg'

export interface AdminPostCardProps {
  post: PostWithCategories;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function AdminPostCard({ post, onDelete, isDeleting = false }: AdminPostCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get categories from post data (matching public PostCardComponent logic)
  const displayCategories = post.post_categories?.map(pc => pc.categories).filter(Boolean) || [];

  const handleDelete = () => {
    onDelete(post.id);
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-[#009483]/30 transition-all duration-300
        ${isMobile 
          ? 'flex flex-col w-full h-auto' 
          : 'flex flex-row w-full h-[240px]'
        }
      `}
    >
      <div 
        className={`
          ${isMobile 
            ? 'w-full h-[200px] flex-shrink-0' 
            : 'w-[200px] h-full flex-shrink-0'
          }
        `}
      >
        <img
          src={post.image || DEFAULT_IMAGE}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`
        p-4 flex flex-col justify-between
        ${isMobile 
          ? 'flex-1' 
          : 'flex-1 w-[calc(100%-200px)]'
        }
      `}>
        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              post.visibility === 'PUBLIC' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {post.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </span>
          </div>

          <h3 className={`
            font-semibold text-navy-900 mb-2 line-clamp-2
            ${isMobile ? 'text-lg' : 'text-base'}
          `}>
            {post.title}
          </h3>
          
          <p className={`
            text-gray-600 mb-3 line-clamp-2
            ${isMobile ? 'text-sm' : 'text-xs'}
          `}>
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-2">
            {displayCategories && displayCategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {displayCategories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className={`
                      inline-flex items-center px-2 py-1 rounded-full font-medium bg-[#009483]/10 text-[#009483] w-fit
                      ${isMobile ? 'text-xs' : 'text-[10px]'}
                    `}
                  >
                    {category.name}
                  </span>
                ))}
                {displayCategories.length > 2 && (
                  <span className={`text-gray-500 ml-1 ${isMobile ? 'text-xs' : 'text-[10px]'}`}>
                    +{displayCategories.length - 2} más
                  </span>
                )}
              </div>
            )}
            {displayCategories.length === 0 && (
              <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-[10px]'}`}>
                Sin categoría
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/admin/posts/preview/${post.id}?from=posts`}
              className="p-2 text-gray-600 hover:text-[#009483] transition-colors rounded-md hover:bg-gray-100"
              title="Vista previa"
            >
              <Eye className="h-4 w-4" />
            </Link>
            
            <Link
              href={`/admin/posts/edit/${post.id}`}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
            
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title={DEMO_MODE ? DEMO_MODE_MESSAGE : 'Eliminar'}
              disabled={isDeleting || DEMO_MODE}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPostCard;
