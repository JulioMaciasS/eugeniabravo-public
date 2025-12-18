"use client"

import { useEffect, useState } from 'react';
import { SupabasePostService, PostWithCategories } from '@/app/services/supabasePostService';
import PostCardComponent from './PostCardComponent';
import { BookOpen, Loader2 } from 'lucide-react';

interface RecommendedPostsProps {
  currentPostId: string;
}

export default function RecommendedPosts({ currentPostId }: RecommendedPostsProps) {
  const [posts, setPosts] = useState<PostWithCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        setLoading(true);
        const recommendedPosts = await SupabasePostService.fetchRecommendedPosts(currentPostId, 2);
        setPosts(recommendedPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching recommended posts:', err);
        setError('Error al cargar posts recomendados');
      } finally {
        setLoading(false);
      }
    };

    if (currentPostId) {
      fetchRecommendedPosts();
    }
  }, [currentPostId]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Posts Recomendados
            </h3>
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#009483]" />
              <span className="ml-2 text-gray-600">Cargando recomendaciones...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null; // Don't show anything if there's an error or no posts
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* <BookOpen className="h-6 w-6 text-[#009483] mr-2" /> */}
            <h3 className="text-2xl font-bold text-gray-900">
            Otros artículos que podrían interesarte
            </h3>
          </div>
          {/* <p className="text-gray-600">
            Otros artículos que podrían interesarte
          </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post) => {
            const categories = post.post_categories?.map(pc => (pc as any).categories).filter(Boolean) || [];
            return (
              <PostCardComponent
                key={post.id}
                post={post}
                categories={categories}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
