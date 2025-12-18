import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, User, Lock, Loader2 } from 'lucide-react';
import { PostWithCategories, SupabasePostService } from '@/app/services/supabasePostService';
import DOMPurify from 'dompurify';

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + 'assets/default-cover.jpg'

export default function BlogPostPreview() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<PostWithCategories | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      const post = await SupabasePostService.fetchPostById(id);
      setPost(post);
    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError('Error al cargar el artículo.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    } else {
      setError('No se proporcionó ID del artículo.');
      setLoading(false);
    }
  }, [id]);

  const sanitizedContent = DOMPurify.sanitize(post?.content || '');

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 flex-grow h-full w-full items-center justify-center">
            <Loader2 size={64} className="animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-8 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl  text-navy-900">
            {error || 'Artículo no encontrado'}
          </h1>
          <Link href="/articulos" className="text-[#009483] hover:text-[#2a8d81] inline-flex items-center mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a el panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-12">
      <article className="w-screen md:w-[768px] mx-auto px-4">
        <Link href="/admin/posts" className="text-[#009483] hover:text-[#2a8d81] inline-flex items-center mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a el panel
        </Link>
        
        <img
          src={post.image || DEFAULT_IMAGE}
          alt={post.title}
          className="w-full h-64 object-contain rounded-lg mb-8"
        />
        
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(post.created_at ?? '').toLocaleDateString()}
          </span>
          <div className="flex flex-wrap gap-2">
            {post.post_categories?.map((pc) => (
              <span key={pc.categories.id} className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {pc.categories.name}
              </span>
            ))}
          </div>
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </span>
          {post.visibility === 'PRIVATE' && (
            <span className="flex items-center text-[#009483]">
              <Lock className="h-4 w-4 mr-1" />
              Privado
            </span>
          )}
        </div>

        <h1 className="text-4xl  text-navy-900 mb-6">
          {post.title}
        </h1>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>
    </div>
  );
}