'use client';

import { useCreatePost } from './useCreatePost';
import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { validateImageFile } from '@/app/lib/storage-helpers';
import { Editor } from '@tinymce/tinymce-react';
import {
  Autocomplete,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Category } from '@/interfaces/PostInterface';
import BackButton from '@/components/admin/components/BackButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NewPostPage() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const {
    form,
    setForm,
    previewImage,
    categories,
    authors,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleCategoryChange,
    handleAuthorChange,
    handleImageUpload,
    handleSubmit,
    createNewCategory,
    deleteCategory,
  } = useCreatePost();

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory = await createNewCategory(newCategoryName.trim());
      if (newCategory) {
        setNewCategoryName('');
        setOpenDialog(false);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      await deleteCategory(categoryId);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    handleImageUpload(e);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] md:mx-auto p-8 bg-white">
        <div className="mb-6">
          <BackButton href="/admin/posts" label="Volver a Posts" />
        </div>
        <LoadingSpinner 
          size="lg" 
          text="Preparando editor..." 
          className="py-20"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] md:mx-auto p-8 bg-white">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton href="/admin/posts" label="Volver a Posts" />
      </div>

      <div className="flex flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Crear Nuevo Artículo</h1>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors hover:cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="post-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors hover:cursor-pointer"
          >
            {isSubmitting && <CircularProgress size={16} className="mr-2" color="inherit" />}
            <span>Create Post</span>
          </button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left column - Main fields */}
          <div className="col-span-3 md:col-span-2 space-y-6">
            <div>
              <TextField
                label="Título"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
              />
            </div>
            
            <div>
              <TextField
                select
                label="Autor"
                name="author_id"
                value={form.author_id}
                onChange={(e) => handleAuthorChange(e.target.value)}
                required
                fullWidth
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value=""></option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name} {author.role && `(${author.role})`}
                  </option>
                ))}
              </TextField>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido
              </label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={form.content}
                onEditorChange={(content: string) => handleInputChange({ target: { name: 'content', value: content } } as any)}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="col-span-3 md:col-span-1 space-y-6">
            {/* Visibility */}
            <div>
              <TextField
                select
                label="Visibilidad"
                name="visibility"
                value={form.visibility}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="PUBLIC">Público</option>
                <option value="PRIVATE">Privado</option>
              </TextField>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categorías
                </label>
                <IconButton
                  size="small"
                  onClick={() => setOpenDialog(true)}
                  color="primary"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
              
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option: Category) => option.name}
                value={categories.filter(cat => form.categories.includes(cat.id))}
                onChange={(_, selectedCategories) => {
                  handleCategoryChange(selectedCategories.map(cat => cat.id));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Seleccionar categorías"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, className, ...tagProps } = getTagProps({ index });
                    return (
                      <div
                        key={key}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-1 mb-1"
                        {...tagProps}
                      >
                        {option.name}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCategory(option.id)}
                          className="ml-1 text-blue-600 hover:text-red-600"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    );
                  })
                }
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Imagen Destacada
              </label>
              
              {previewImage ? (
                <div className="relative mb-4">
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center shadow-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Haz clic para subir</span> o arrastra una imagen aquí
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG hasta 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                id="image-upload"
              />
              
              <label
                htmlFor="image-upload"
                className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {previewImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de Categoría"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddCategory} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
