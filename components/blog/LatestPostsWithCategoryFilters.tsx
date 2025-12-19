import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Filter, Loader2, Search, Tag } from 'lucide-react';
import Link from "next/link";
import { SupabasePostService, PostWithCategories, Category } from '@/app/services/supabasePostService';
import { debounce } from 'lodash';
import PostCardComponent from './PostCardComponent';

export default function LatestPostsWithCategoryFilters() {
  const [posts, setPosts] = useState<PostWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  const POSTS_PER_PAGE = 9;

  const fetchCategories = async () => {
    try {
      const data = await SupabasePostService.fetchCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async (page: number = 1, categoryIds: string[] = [], search: string = '') => {
    setLoading(true);
    try {
      const allPosts = await SupabasePostService.fetchPostsIncludingUncategorized('PUBLIC');
      const lowerSearch = search.trim().toLowerCase();
      let filteredPosts = allPosts;

      if (lowerSearch) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(lowerSearch) ||
          (post.excerpt || '').toLowerCase().includes(lowerSearch)
        );
      }

      if (categoryIds.length > 0) {
        filteredPosts = filteredPosts.filter(post =>
          post.post_categories?.some((pc: PostWithCategories['post_categories'][number]) =>
            categoryIds.includes(pc.category_id)
          )
        );
      }

      const totalCount = filteredPosts.length;
      const from = (page - 1) * POSTS_PER_PAGE;
      const pagedPosts = filteredPosts.slice(from, from + POSTS_PER_PAGE);
      setPosts(pagedPosts);
      setTotalPosts(totalCount);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((term: string) => {
    setCurrentPage(1);
    fetchPosts(1, selectedCategories, term);
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    setCurrentPage(1);
    fetchPosts(1, newSelectedCategories, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchPosts(newPage, selectedCategories, searchTerm);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setCurrentPage(1);
    fetchPosts(1, [], '');
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (loading && posts.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 flex-grow h-full w-full items-center justify-center">
            <Loader2 size={64} className="animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Error loading posts
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchPosts(currentPage, selectedCategories, searchTerm)}
              className="bg-[#009483] text-white px-6 py-2 rounded-lg hover:bg-[#2a8d81]"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            Últimos Artículos
          </h2>
          <p className="text-xl text-gray-600">
            Explora nuestros artículos más recientes sobre diversos temas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filtros
              {selectedCategories.length > 0 && (
                <span className="bg-[#009483] text-white text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-[#009483] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[#009483] hover:text-[#2a8d81] text-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron artículos con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {posts.map((post) => (
                <PostCardComponent key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </button>

                <span className="text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/articulos"
            className="inline-flex items-center gap-2 bg-[#009483] text-white px-6 py-3 rounded-lg hover:bg-[#2a8d81] transition-colors"
          >
            Ver todos los artículos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
