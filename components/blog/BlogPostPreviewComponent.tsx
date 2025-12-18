'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, User, Lock } from 'lucide-react';
import { PostWithCategories, Category, SupabasePostService } from '@/app/services/supabasePostService';
import DOMPurify from 'dompurify';
import AuthorInfo from './AuthorInfo';
import './BlogPostComponent.css';

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + 'assets/default-cover.jpg';

interface BlogPostPreviewComponentProps {
  postId: string;
  referrer?: string | null;
}

export default function BlogPostPreviewComponent({ postId, referrer }: BlogPostPreviewComponentProps) {
  const [post, setPost] = useState<PostWithCategories | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get back URL based on referrer
  const getBackUrl = () => {
    switch (referrer) {
      case 'categories':
        return '/admin/categories';
      default:
        return '/admin/posts';
    }
  };

  const getBackLabel = () => {
    switch (referrer) {
      case 'categories':
        return 'Volver a categorías';
      default:
        return 'Volver al panel';
    }
  };

  // Configure DOMPurify
  useEffect(() => {
    if (typeof window !== 'undefined') {
      DOMPurify.addHook('afterSanitizeElements', function (node) {
        if (node.nodeName && node.nodeName === 'IMG') {
          const element = node as Element;
          const src = element.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            element.setAttribute('src', `${src}`);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await SupabasePostService.fetchPostById(postId);
        setPost(fetchedPost);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError('Failed to load the post.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCleanContent = (content: string) => {
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
          'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target'],
        ALLOW_DATA_ATTR: false
      });
    }
    return content;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href={getBackUrl()}
              className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getBackLabel()}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
            <Link 
              href={getBackUrl()}
              className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getBackLabel()}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categories = post.post_categories?.map(pc => pc.categories) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-8">
          <Link 
            href={getBackUrl()}
            className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getBackLabel()}
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-12">
          {/* Privacy indicator */}
          {post.visibility === 'PRIVATE' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span className="font-medium">Vista Previa - Contenido Privado</span>
              </div>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Article meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
            </div>

            {post.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
            )}

            {categories.length > 0 && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>
                  {categories.map((category: Category, index: number) => (
                    <span key={category.id}>
                      {category.name}
                      {index < categories.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Featured image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#009483]">
              {post.excerpt}
            </div>
          )}
        </header>

        {/* Article content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 
              prose-headings:font-bold
              prose-p:text-gray-700 
              prose-p:leading-relaxed
              prose-a:text-[#009483] 
              prose-a:no-underline 
              hover:prose-a:text-[#007a6b]
              prose-strong:text-gray-900
              prose-blockquote:border-l-4 
              prose-blockquote:border-[#009483] 
              prose-blockquote:bg-gray-50 
              prose-blockquote:py-2 
              prose-blockquote:px-4
              prose-code:bg-gray-100 
              prose-code:px-2 
              prose-code:py-1 
              prose-code:rounded
              prose-pre:bg-gray-100 
              prose-pre:border
              prose-img:rounded-lg 
              prose-img:shadow-md
              prose-table:table-auto
              prose-th:bg-gray-50"
            dangerouslySetInnerHTML={{ 
              __html: getCleanContent(post.content) 
            }}
          />
        </div>

        {/* Author Info */}
        {post.author_data && (
          <div className="mb-12">
            <AuthorInfo author={post.author_data} />
          </div>
        )}
      </article>
    </div>
  );
}