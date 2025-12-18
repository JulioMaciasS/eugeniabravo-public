'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';
import PostForm, { Visibility, Category } from '@/interfaces/PostInterface';
import { useCreatePost } from '../../new/useCreatePost';
import { Author } from '@/app/services/supabasePostService';
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
  const supabase = createClient();
  
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

        // Fetch authors
        const { data: authorsData, error: authorsError } = await supabase
          .from('authors')
          .select('*')
          .order('name');

        if (authorsError) throw authorsError;
        setAuthors(authorsData || []);

        // Fetch post with categories
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            post_categories (
              category_id,
              categories (
                id,
                name
              )
            )
          `)
          .eq('id', postId)
          .single();

        if (postError) throw postError;

        if (post) {
          const categoryIds = post.post_categories?.map((pc: any) => pc.category_id) || [];
          
          setForm({
            title: post.title || '',
            categories: categoryIds,
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || '',
            author: post.author || '',
            author_id: post.author_id || '',
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
  }, [postId, supabase, router]);

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
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!form.title || !form.content) {
        alert('Title and content are required');
        return;
      }

      // Generate excerpt from content if not provided
      const autoExcerpt = form.excerpt.trim() || generateExcerpt(form.content);

      // Update the post
      const { error: postError } = await supabase
        .from('posts')
        .update({
          title: form.title,
          content: form.content,
          excerpt: autoExcerpt,
          image: form.image,
          author: form.author || user?.email || 'Anonymous',
          author_id: form.author_id || null, // Add author_id
          visibility: form.visibility,
        })
        .eq('id', postId);

      if (postError) throw postError;

      // Update post-category relationships
      // First, delete existing relationships
      const { error: deleteError } = await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', postId);

      if (deleteError) throw deleteError;

      // Then, create new relationships
      if (form.categories.length > 0) {
        const postCategories = form.categories.map(categoryId => ({
          post_id: postId,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(postCategories);

        if (categoryError) throw categoryError;
      }

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
