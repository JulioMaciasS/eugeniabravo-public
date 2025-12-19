"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { RefreshCw, Search, PlusCircle, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SupabasePostService, PostWithCategories, Category } from '@/app/services/supabasePostService';
import AdminPostCard from './AdminPostCard';
import BackButton from './components/BackButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '@/app/lib/demo-mode';

export default function SupabasePostList() {
  const [posts, setPosts] = useState<PostWithCategories[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const demoMode = DEMO_MODE;

  const POSTS_PER_PAGE = 18; // Increased from 6 to 18

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE' | 'ALL');
  };

  // MARK: Fetch Categories
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await SupabasePostService.fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // MARK: Fetch posts with pagination (server-side search and filtering)
  const fetchPosts = async (page: number = 1, appendToExisting: boolean = false) => {
    setLoading(true);
    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      let result;
      
      // Use search if there's a search term, otherwise use regular fetch
      if (searchTerm.trim()) {
        result = await SupabasePostService.searchPostsWithPagination(
          searchTerm.trim(),
          visibility,
          selectedCategoryId,
          POSTS_PER_PAGE,
          offset,
          sortOrder
        );
      } else if (selectedCategoryId) {
        result = await SupabasePostService.fetchPostsIncludingUncategorizedWithPagination(
          visibility, 
          selectedCategoryId, 
          POSTS_PER_PAGE, 
          offset,
          sortOrder
        );
      } else {
        result = await SupabasePostService.fetchPostsIncludingUncategorizedWithPagination(
          visibility, 
          null, 
          POSTS_PER_PAGE, 
          offset,
          sortOrder
        );
      }
      
      // Posts are now sorted by the server, no need for client-side sorting
      const sortedPosts = result.posts;
      
      if (appendToExisting && page > 1) {
        // Only append when explicitly requested (for "load more" functionality)
        setPosts(prev => [...prev, ...sortedPosts]);
        setFilteredPosts(prev => [...prev, ...sortedPosts]);
      } else {
        // Replace posts for pagination (default behavior)
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      }
      
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCategories();
    fetchPosts(1); // Fetch initial posts
  }, []);

  // Fetch posts when category, visibility, or search changes
  useEffect(() => {
    fetchPosts(1);
    setCurrentPage(1);
  }, [selectedCategoryId, visibility, searchTerm]);

  // Fetch posts when sort order changes
  useEffect(() => {
    if (categories.length > 0) { // Only refetch if we already have categories loaded
      fetchPosts(1);
      setCurrentPage(1);
    }
  }, [sortOrder]);

  // MARK: Delete Post
  const handleDelete = async (id: string) => {
    if (demoMode) {
      alert(DEMO_MODE_MESSAGE);
      return;
    }
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    setDeletingPostId(id);
    try {
      await SupabasePostService.deletePost(id);
      
      // Update UI - remove the deleted post
      setPosts(posts.filter(post => post.id !== id));
      setFilteredPosts(filteredPosts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post. Inténtalo de nuevo.');
    } finally {
      setDeletingPostId(null);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Pagination logic - now all server-side
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const displayPosts = filteredPosts; // filteredPosts now contains server results

  // Optimized page change handler
  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    fetchPosts(page);
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: document.querySelector('h1')?.offsetTop || 0, 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Posts</h1>
          <Link 
            href="/admin/posts/new"
            className="bg-[#009483] text-white px-4 py-2 rounded-lg hover:bg-[#007a6b] transition-colors flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Post
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="uncategorized">Sin categoría</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={visibility}
            onChange={handleVisibilityChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
          >
            <option value="ALL">Todos</option>
            <option value="PUBLIC">Públicos</option>
            <option value="PRIVATE">Privados</option>
          </select>

          {/* Sort Button */}
          <button
            onClick={toggleSortOrder}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            title={`Ordenar por fecha ${sortOrder === 'desc' ? 'ascendente' : 'descendente'}`}
          >
            {sortOrder === 'desc' ? (
              <>
                <ArrowDown className="h-4 w-4" />
                Más recientes
              </>
            ) : (
              <>
                <ArrowUp className="h-4 w-4" />
                Más antiguos
              </>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchPosts(1)}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && posts.length === 0 && (
        <LoadingSpinner 
          size="lg" 
          text="Cargando posts..." 
          className="py-12"
        />
      )}

      {/* Posts Grid */}
      {!loading && displayPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm.trim() ? 'No se encontraron posts que coincidan con tu búsqueda.' : 'No se encontraron posts.'}
          </p>
        </div>
      ) : (
        <>
          {/* Results counter */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {searchTerm.trim() ? (
                <>Mostrando {displayPosts.length} de {totalCount} resultados</>
              ) : (
                <>Mostrando {displayPosts.length} posts • Página {currentPage} de {totalPages}</>
              )}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {displayPosts.map((post) => (
              <AdminPostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                isDeleting={deletingPostId === post.id}
              />
            ))}
          </div>

          {/* Pagination - show for both search and normal browsing */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
