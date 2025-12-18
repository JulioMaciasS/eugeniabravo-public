'use client';

import { createClient } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Validates image file type and size
 */
export const validateImageFile = (file: File): string | null => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP)';
  }
  
  // 5MB max size
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }
  
  return null; // No validation errors
};

/**
 * Uploads image to Supabase Storage and returns the public URL
 */
export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image to storage');
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Deletes an image from Supabase Storage
 */
export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
  try {
    const supabase = createClient();
    
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get 'blog-images/filename.ext'
    
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);
    
    if (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image from storage');
    }
  } catch (error) {
    console.error('Error deleting from Supabase Storage:', error);
    // Don't throw error for deletion failures as they shouldn't block other operations
  }
};

/**
 * Creates a preview URL for a file
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free memory
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Uploads profile picture to Supabase Storage and returns the public URL
 */
export const uploadProfilePictureToSupabase = async (file: File): Promise<string> => {
  try {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload profile picture to storage');
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture to Supabase Storage:', error);
    throw new Error('Failed to upload profile picture. Please try again.');
  }
};

/**
 * Deletes a profile picture from Supabase Storage
 */
export const deleteProfilePictureFromSupabase = async (imageUrl: string): Promise<void> => {
  try {
    const supabase = createClient();
    
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get 'profile-pictures/filename.ext'
    
    // Only delete if it's a profile picture (not external URL)
    if (filePath.startsWith('profile-pictures/')) {
      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);
      
      if (error) {
        console.error('Delete error:', error);
        throw new Error('Failed to delete profile picture from storage');
      }
    }
  } catch (error) {
    console.error('Error deleting profile picture from Supabase Storage:', error);
    // Don't throw error for deletion failures as they shouldn't block other operations
  }
};
