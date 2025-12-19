'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured } from '@/app/lib/supabase';
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '@/app/lib/demo-mode';
import { useAuth } from '@/app/contexts/AuthContext';
import PostForm, { Visibility, Category } from '@/interfaces/PostInterface';
import { uploadImageToSupabase } from '@/app/lib/storage-helpers';
import { Author, SupabasePostService } from '@/app/services/supabasePostService';
import { generateExcerpt } from '@/app/utils/excerptUtils';

export interface UseCreatePostReturn {
  form: PostForm;
  setForm: React.Dispatch<React.SetStateAction<PostForm>>;
  categories: Category[];
  authors: Author[];
  isLoading: boolean;
  isSubmitting: boolean;
  previewImage: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCategoryChange: (categoryIds: string[]) => void;
  handleAuthorChange: (authorId: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  uploadImageToSupabase: (file: File) => Promise<string>;
  createNewCategory: (name: string) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
}

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

export function useCreatePost(): UseCreatePostReturn {
  const [form, setForm] = useState<PostForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const demoImage = '/images/blog/sample-article.svg';

  // Fetch categories on component mount
  const fetchCategories = useCallback(async () => {
    try {
      const data = await SupabasePostService.fetchCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Fetch authors on component mount
  const fetchAuthors = useCallback(async () => {
    try {
      const data = await SupabasePostService.fetchAuthors();
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchCategories(), fetchAuthors()]);
    setIsLoading(false);
  }, [fetchCategories, fetchAuthors]);

  useEffect(() => {
    fetchData();
    
    // Set author if user is authenticated
    if (user?.email) {
      setForm(prev => ({ ...prev, author: user.email || '' }));
    } else if (!isSupabaseConfigured()) {
      setForm(prev => ({ ...prev, author: 'demo@eugeniabravodemo.com' }));
    }
  }, [fetchData, user]);

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

  const createNewCategory = async (name: string): Promise<Category | null> => {
    try {
      if (DEMO_MODE) {
        alert(DEMO_MODE_MESSAGE);
        return null;
      }
      const newCategory = await SupabasePostService.createCategory(name);
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
      }
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      if (DEMO_MODE) {
        alert(DEMO_MODE_MESSAGE);
        return false;
      }
      await SupabasePostService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
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

      await SupabasePostService.createPost({
        title: form.title,
        excerpt: autoExcerpt,
        content: form.content,
        image: form.image,
        author: form.author || user?.email || 'Demo Admin',
        visibility: form.visibility,
        categoryIds: form.categories,
        date: new Date().toISOString(),
      });

      alert('Post created successfully!');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
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
