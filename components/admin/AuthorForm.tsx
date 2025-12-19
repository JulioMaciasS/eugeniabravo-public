"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X, Camera, Trash2 } from 'lucide-react';
import { SupabasePostService, Author } from '@/app/services/supabasePostService';
import { 
  validateImageFile, 
  uploadProfilePictureToSupabase, 
  deleteProfilePictureFromSupabase, 
  createPreviewUrl, 
  revokePreviewUrl 
} from '@/app/lib/storage-helpers';
import BackButton from './components/BackButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '@/app/lib/demo-mode';

interface AuthorFormProps {
  authorId?: string;
  isEditing?: boolean;
}

export default function AuthorForm({ authorId, isEditing = false }: AuthorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [originalProfilePicture, setOriginalProfilePicture] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const demoMode = DEMO_MODE;
  const [author, setAuthor] = useState<Partial<Author>>({
    name: '',
    role: '',
    description: '',
    profile_picture_url: '',
    email: ''
  });

  // Load author data if editing
  useEffect(() => {
    if (isEditing && authorId) {
      fetchAuthor();
    }
  }, [isEditing, authorId]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchAuthor = async () => {
    if (!authorId) return;
    
    setLoading(true);
    try {
      const fetchedAuthor = await SupabasePostService.getAuthorById(authorId);
      if (fetchedAuthor) {
        setAuthor(fetchedAuthor);
        setOriginalProfilePicture(fetchedAuthor.profile_picture_url || '');
      }
    } catch (error) {
      console.error('Error fetching author:', error);
      alert('Error al cargar el autor');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (demoMode) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Clean up previous preview
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(createPreviewUrl(file));
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    if (demoMode) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await uploadProfilePictureToSupabase(selectedFile);
      
      setAuthor(prev => ({
        ...prev,
        profile_picture_url: uploadedUrl
      }));

      // Clean up
      setSelectedFile(null);
      if (previewUrl) {
        revokePreviewUrl(previewUrl);
        setPreviewUrl('');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (demoMode) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }
    if (author.profile_picture_url && author.profile_picture_url !== originalProfilePicture) {
      try {
        await deleteProfilePictureFromSupabase(author.profile_picture_url);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setAuthor(prev => ({
      ...prev,
      profile_picture_url: ''
    }));

    // Clean up file selection
    setSelectedFile(null);
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoMode) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }
    
    // Check if there's a pending file upload
    if (selectedFile) {
      alert('Por favor, sube la imagen seleccionada antes de guardar');
      return;
    }
    
    // Validation
    if (!author.name?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && authorId) {
        await SupabasePostService.updateAuthor(authorId, {
          name: author.name,
          role: author.role || null,
          description: author.description || null,
          profile_picture_url: author.profile_picture_url || null,
          email: author.email || null
        });
      } else {
        await SupabasePostService.createAuthor({
          name: author.name,
          role: author.role || null,
          description: author.description || null,
          profile_picture_url: author.profile_picture_url || null,
          email: author.email || null
        });
      }
      
      router.push('/admin/authors');
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Error al guardar el autor. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Author, value: string) => {
    setAuthor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LoadingSpinner size="lg" text="Cargando autor..." className="py-12" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Autor' : 'Crear Nuevo Autor'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Modifica los datos del autor' : 'Completa los datos del nuevo autor'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Foto de Perfil
            </label>
            
            {/* Upload Method Selector */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                disabled={demoMode}
                className={`px-4 py-2 rounded-lg border ${
                  uploadMethod === 'file'
                    ? 'bg-[#009483] text-white border-[#009483]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                disabled={demoMode}
                className={`px-4 py-2 rounded-lg border ${
                  uploadMethod === 'url'
                    ? 'bg-[#009483] text-white border-[#009483]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                URL Externa
              </button>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : author.profile_picture_url ? (
                    <img
                      src={author.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {uploadMethod === 'file' ? (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#009483] file:text-white hover:file:bg-[#007a6b] disabled:opacity-60"
                      disabled={demoMode}
                    />
                    
                    {selectedFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Archivo seleccionado: {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={uploading || demoMode}
                          className="bg-[#009483] text-white px-3 py-1 rounded text-sm hover:bg-[#007a6b] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? 'Subiendo...' : 'Subir'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={author.profile_picture_url || ''}
                      onChange={(e) => handleInputChange('profile_picture_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                )}

                {(author.profile_picture_url || previewUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={demoMode}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar imagen</span>
                  </button>
                )}
                
                <p className="text-sm text-gray-500">
                  {uploadMethod === 'file' 
                    ? 'Formatos soportados: JPEG, PNG, GIF, WEBP (máx. 5MB)'
                    : 'URL de la imagen de perfil del autor'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={author.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
              placeholder="Ej: EugeniaBravoDemo"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo/Rol
            </label>
            <input
              type="text"
              value={author.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
              placeholder="Ej: Abogada Principal"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={author.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
              placeholder="eugenia@ejemplo.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={author.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
              placeholder="Breve descripción del autor, su experiencia y especialidades..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/authors')}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={saving || !author.name?.trim() || uploading || !!selectedFile || demoMode}
              className="flex-1 bg-[#009483] text-white px-4 py-2 rounded-lg hover:bg-[#007a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              title={demoMode ? DEMO_MODE_MESSAGE : undefined}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Actualizar Autor' : 'Crear Autor'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
