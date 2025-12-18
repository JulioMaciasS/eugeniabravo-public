'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  FolderOpen, 
  Tag,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import { SupabasePostService, PostWithCategories } from '@/app/services/supabasePostService';
import { Category } from '@/interfaces/PostInterface';
import Link from 'next/link';
import BackButton from '@/components/admin/components/BackButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface CategoryWithPostCount extends Category {
  postCount: number;
  posts?: PostWithCategories[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithPostCount[]>([]);
  const [uncategorizedPosts, setUncategorizedPosts] = useState<PostWithCategories[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showUncategorized, setShowUncategorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithPostCount | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories with post counts
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await SupabasePostService.fetchCategories();
      
      // Get post counts for each category
      const categoriesWithCounts = await Promise.all(
        fetchedCategories.map(async (category) => {
          const posts = await SupabasePostService.fetchPosts('ALL', category.id);
          return {
            ...category,
            postCount: posts.length
          };
        })
      );

      setCategories(categoriesWithCounts);

      // Fetch posts without categories
      const allPosts = await SupabasePostService.fetchPostsIncludingUncategorized('ALL');
      const postsWithoutCategories = allPosts.filter(post => 
        !post.post_categories || post.post_categories.length === 0
      );
      setUncategorizedPosts(postsWithoutCategories);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error loading categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = async (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    
    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
      
      // Load posts for this category if not already loaded
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex !== -1 && !categories[categoryIndex].posts) {
        try {
          const posts = await SupabasePostService.fetchPosts('ALL', categoryId);
          const updatedCategories = [...categories];
          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            posts
          };
          setCategories(updatedCategories);
        } catch (error) {
          console.error('Error fetching posts for category:', error);
        }
      }
    }
    
    setExpandedCategories(newExpanded);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setIsSubmitting(true);
    try {
      await SupabasePostService.createCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsCreateModalOpen(false);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!selectedCategory || !editCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setIsSubmitting(true);
    try {
      await SupabasePostService.updateCategory(selectedCategory.id, editCategoryName.trim());
      setEditCategoryName('');
      setSelectedCategory(null);
      setIsEditModalOpen(false);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      await SupabasePostService.deleteCategory(selectedCategory.id);
      setSelectedCategory(null);
      setIsDeleteModalOpen(false);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (category: CategoryWithPostCount) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (category: CategoryWithPostCount) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>
          <LoadingSpinner 
            size="lg" 
            text="Cargando categorías..." 
            className="py-20"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Gestión de Categorías</h1>
            <p className="text-gray-600">Administra las categorías de tus artículos</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#009483] text-white px-6 py-3 rounded-lg hover:bg-[#007a6b] transition-colors flex items-center gap-2 mt-4 sm:mt-0"
          >
            <PlusCircle className="h-5 w-5" />
            Nueva Categoría
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Categorías</p>
                <p className="text-2xl font-bold text-blue-900">{categories.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Categorías con Posts</p>
                <p className="text-2xl font-bold text-green-900">
                  {categories.filter(cat => cat.postCount > 0).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Categorías Vacías</p>
                <p className="text-2xl font-bold text-amber-900">
                  {categories.filter(cat => cat.postCount === 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Categorías</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Uncategorized Posts Row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => setShowUncategorized(!showUncategorized)}
                        className="mr-2 p-1 hover:bg-gray-200 rounded"
                      >
                        {showUncategorized ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <FolderOpen className="h-5 w-5 text-orange-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Sin categoría</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{uncategorizedPosts.length} posts</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {uncategorizedPosts.length > 0 ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Requiere atención
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Todo categorizado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span className="text-gray-400 text-xs">Sistema</span>
                  </td>
                </tr>
                
                {/* Uncategorized Posts Details */}
                {showUncategorized && uncategorizedPosts.map((post) => (
                  <tr key={`uncategorized-${post.id}`} className="bg-orange-50">
                    <td className="px-12 py-3">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.visibility === 'PUBLIC' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/articulos/${post.slug || post.id}`}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center"
                        title="Ver post"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {/* Regular Categories */}
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          <Tag className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{category.postCount} posts</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.postCount > 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            Sin uso
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar categoría"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar categoría"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Category Posts Details */}
                    {expandedCategories.has(category.id) && category.posts && category.posts.map((post) => (
                      <tr key={`${category.id}-${post.id}`} className="bg-gray-50">
                        <td className="px-12 py-3">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{post.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-md">{post.excerpt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(post.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.visibility === 'PUBLIC' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Link
                            href={`/admin/posts/preview/${post.id}?from=categories`}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center"
                            title="Vista previa del post"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay categorías disponibles</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-[#009483] hover:text-[#007a6b] font-medium"
              >
                Crear tu primera categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Categoría</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la categoría
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
                placeholder="Ej: Derecho Civil"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-[#009483] text-white rounded-lg hover:bg-[#007a6b] transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editar Categoría</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la categoría
              </label>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-2 bg-[#009483] text-white rounded-lg hover:bg-[#007a6b] transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-900">Eliminar Categoría</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-gray-900 font-medium">¿Estás seguro?</p>
                  <p className="text-gray-600 text-sm">Esta acción no se puede deshacer.</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Categoría:</strong> {selectedCategory.name}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Posts asociados:</strong> {selectedCategory.postCount}
                </p>
                {selectedCategory.postCount > 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Al eliminar esta categoría, se removerá de todos los posts asociados.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
