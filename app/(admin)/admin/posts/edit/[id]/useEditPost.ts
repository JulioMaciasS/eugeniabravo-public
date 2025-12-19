'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured } from '@/app/lib/supabase';
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '@/app/lib/demo-mode';
import { useAuth } from '@/app/contexts/AuthContext';
import PostForm, { Visibility, Category } from '@/interfaces/PostInterface';
import { useCreatePost } from '../../new/useCreatePost';
import { Author, SupabasePostService } from '@/app/services/supabasePostService';
import { generateExcerpt } from '@/app/utils/excerptUtils';

const initialForm: PostForm = {
  title: '',
  categories: [],
  excerpt: '',
  content: '',
  image: '',
  author: '',
  author_id: '',
  visibility: Visibility.PUBLIC,
};

export function useEditPost(postId: string) {
  const [form, setForm] = useState<PostForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  
  const router = useRouter();
  const { user } = useAuth();
  const demoImage = '/images/blog/sample-article.svg';
  
  // Import functions from useCreatePost
  const { 
    categories, 
    uploadImageToSupabase, 
    createNewCategory, 
    deleteCategory 
  } = useCreatePost();

  // Fetch post data and authors
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);

        const authorsData = await SupabasePostService.fetchAuthors();
        setAuthors(authorsData || []);

        const post = await SupabasePostService.fetchPostById(postId);

        if (post) {
          const categoryIds = post.post_categories?.map((pc: any) => pc.category_id || pc.categories?.id).filter(Boolean) || [];
          
          setForm({
            title: post.title || '',
            categories: categoryIds,
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || '',
            author: post.author || '',
            author_id: (post as any).author_id || '',
            visibility: post.visibility as Visibility || Visibility.PUBLIC,
          });

          if (post.image) {
            setPreviewImage(post.image);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading post');
        router.push('/admin/posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setForm(prev => ({ ...prev, categories: categoryIds }));
  };

  const handleAuthorChange = (authorId: string) => {
    // Update both author_id and author name for backwards compatibility
    const selectedAuthor = authors.find(author => author.id === authorId);
    setForm(prev => ({ 
      ...prev, 
      author_id: authorId,
      author: selectedAuthor?.name || '' 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (DEMO_MODE) {
        alert(DEMO_MODE_MESSAGE);
        return;
      }
      if (!isSupabaseConfigured()) {
        setPreviewImage(demoImage);
        setForm(prev => ({ ...prev, image: demoImage }));
        return;
      }
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Upload to Supabase
      const imageUrl = await uploadImageToSupabase(file);
      setForm(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (DEMO_MODE) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!form.title || !form.content) {
        alert('Title and content are required');
        return;
      }

      // Generate excerpt from content if not provided
      const autoExcerpt = form.excerpt.trim() || generateExcerpt(form.content);

      await SupabasePostService.updatePost(postId, {
        title: form.title,
        content: form.content,
        excerpt: autoExcerpt,
        image: form.image,
        author: form.author || user?.email || 'Demo Admin',
        visibility: form.visibility,
        categoryIds: form.categories,
      });

      alert('Post updated successfully!');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    setForm,
    categories,
    authors,
    isLoading,
    isSubmitting,
    previewImage,
    handleInputChange,
    handleCategoryChange,
    handleAuthorChange,
    handleImageUpload,
    handleSubmit,
    uploadImageToSupabase,
    createNewCategory,
    deleteCategory,
  };
}
