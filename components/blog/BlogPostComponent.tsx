"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Tag, User, Lock, ArrowLeft } from 'lucide-react';
import { SupabasePostService, PostWithCategories } from '@/app/services/supabasePostService';
import DOMPurify from 'dompurify';
import RecommendedPosts from './RecommendedPosts';
import AuthorInfo from './AuthorInfo';
import ShareButton from './ShareButton';
import { BlogTitle, H1 } from '@/components/ui/Typography';
import { typography } from '@/utils/typography';
import "./BlogPostComponent.css";

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + 'assets/default-cover.jpg'

interface BlogPostComponentProps {
  id?: string;
  slug?: string;
}

export default function BlogPostComponent({ id, slug }: BlogPostComponentProps) {
  const [post, setPost] = useState<PostWithCategories | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedPost: PostWithCategories | null = null;
      
      if (slug) {
        fetchedPost = await SupabasePostService.fetchPostBySlug(slug);
      } else if (id) {
        fetchedPost = await SupabasePostService.fetchPostById(id);
      } else {
        setError('No se proporcionó ID o slug del artículo');
        return;
      }
      
      if (!fetchedPost) {
        setError('Artículo no encontrado');
        return;
      }
      
      setPost(fetchedPost);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id || slug) {
      fetchPost();
    }
  }, [id, slug]);

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
            <H1 variant="public">Error</H1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/articulos"
              className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a artículos
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
            <H1 variant="public">Artículo no encontrado</H1>
            <Link 
              href="/articulos"
              className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a artículos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categories = post.post_categories?.map(pc => (pc as any).categories).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-8">
          <Link 
            href="/articulos"
            className="inline-flex items-center text-[#009483] hover:text-[#007a6b] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a artículos
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-12">
          {/* Privacy indicator */}
          {post.visibility === 'PRIVATE' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span className="font-medium">Contenido Privado</span>
              </div>
            </div>
          )}

          <BlogTitle variant="main">
            {post.title}
          </BlogTitle>

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
                  {categories.map((category, index) => (
                    <span key={category.id}>
                      {category.name}
                      {index < categories.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Share button */}
          <div className="mb-8">
            <ShareButton 
              title={post.title}
              url={`/articulos/${post.slug || post.id}`}
              excerpt={post.excerpt || undefined}
            />
          </div>

          {/* Featured image */}
 
            <div className="mb-8">
              <img
                src={post.image || DEFAULT_IMAGE}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className={`${typography.body.large} p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#009483]`}>
              {post.excerpt}
            </div>
          )}
        </header>

        {/* Article content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12 min-h-[500px]">
          <div 
            className={typography.prose.content}
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

      {/* Recommended Posts */}
      <RecommendedPosts currentPostId={post.id} />

              {/* Article footer */}
        <footer className="text-center">
          <Link 
            href="/articulos"
            className="inline-flex items-center px-6 py-3 bg-[#009483] text-white font-medium rounded-lg hover:bg-[#007a6b] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ver más artículos
          </Link>
        </footer>
        
    </div>
  );
}
