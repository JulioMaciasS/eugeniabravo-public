"use client"

import { PostWithCategories, Category } from '@/app/services/supabasePostService'
import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + 'assets/default-cover.jpg'

export interface PostCardProps {
  post: PostWithCategories;
  categories?: Category[];
  hoverable?: boolean;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function PostCardComponent({ post, categories, hoverable = true }: PostCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get categories from props or from post data
  const displayCategories = categories || 
    (post.post_categories?.map(pc => pc.categories).filter(Boolean) || []);

  return (
    <a 
      key={post.id} 
      href={`/articulos/${post.slug || post.id}`}
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300
        ${hoverable ? "lg:hover:scale-105 lg:hover:shadow-md" : ""}
        ${isMobile 
          ? 'flex flex-col w-full h-[400px]' 
          : 'flex flex-row w-full h-[240px]'
        }
      `}
    >
      {/* Image Container */}
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

      {/* Content Container */}
      <div className={`
        p-4 flex flex-col justify-between
        ${isMobile 
          ? 'flex-1 h-[200px]' 
          : 'flex-1 w-[calc(100%-200px)]'
        }
      `}>
        <div className="flex-1 min-h-0">
          <h2 className={`
            font-semibold text-navy-900 mb-2 line-clamp-2
            ${isMobile ? 'text-lg' : 'text-base'}
          `}>
            {post.title}
          </h2>
          <p className={`
            text-gray-600 mb-3 line-clamp-2
            ${isMobile ? 'text-sm' : 'text-xs'}
          `}>
            {post.excerpt}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {/* Categories - only show first 2 */}
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
          
          {/* Date */}
          <div className={`
            flex items-center text-gray-500
            ${isMobile ? 'text-xs' : 'text-[10px]'}
          `}>
            <Clock className={`mr-1 ${isMobile ? 'h-3 w-3' : 'h-3 w-3'}`} />
            {formatDate(post.created_at)}
          </div>
        </div>
      </div>
    </a>
  )
}

export default PostCardComponent;
