"use client"
import React, { useEffect, useState, Suspense } from 'react';
import { ArrowLeft, ArrowRight, Filter, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SupabasePostService, PostWithCategories, Category } from '@/app/services/supabasePostService';
import PostCardComponent from '@/components/blog/PostCardComponent';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { generateCategorySlug } from '@/app/utils/slugUtils';
import { H1 } from '@/components/ui/Typography';
import { getCategoryMetadata } from '@/app/utils/categoryMetadata';

function ArticulosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [posts, setPosts] = useState<PostWithCategories[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // newest first by default
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  
  const POSTS_PER_PAGE = 6; // Optimized for better layout (2 posts max per row, 3 rows = 6 total)
  const FEATURED_CATEGORY_ID = '978c2796-10e1-409b-8824-1707d90bc2e0';

  // Get initial category from URL params
  useEffect(() => {
    if (searchParams) {
      const categorySlug = searchParams.get('categoria');
      if (categorySlug) {
        // Find the category ID from the slug when categories are loaded
        // This will be handled in the categories effect
      }
    }
  }, [searchParams]);

  // Update URL when category selection changes
  const updateUrlParams = (categoryIds: string[]) => {
    if (!router || !pathname) return;
    
    const params = new URLSearchParams();
    if (categoryIds.length > 0) {
      // Convert first selected category ID to slug for URL
      const category = categories.find(cat => cat.id === categoryIds[0]);
      if (category) {
        params.set('categoria', generateCategorySlug(category.name));
      }
    }
    
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(url, { scroll: false });
  };

  // Fetch categories on component mount
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await SupabasePostService.fetchCategories();
      setCategories(fetchedCategories);
      
      // After categories are loaded, check URL for initial category selection
      if (searchParams) {
        const categorySlug = searchParams.get('categoria');
        if (categorySlug) {
          const matchingCategory = fetchedCategories.find(
            cat => generateCategorySlug(cat.name) === categorySlug
          );
          if (matchingCategory) {
            setSelectedCategories([matchingCategory.id]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error al cargar las categorías');
    }
  };

  // Update page metadata and canonical URL based on selected category
  useEffect(() => {
    const categorySlug = searchParams?.get('categoria');
    const currentCategory = categories.find(
      cat => generateCategorySlug(cat.name) === categorySlug
    );
    const categoryMeta = categorySlug ? getCategoryMetadata(categorySlug) : null;

    // Update document title
    if (currentCategory) {
      document.title = `${currentCategory.name} | Artículos Jurídicos | EugeniaBravoDemo`;
    } else {
      document.title = 'Artículos Jurídicos | EugeniaBravoDemo';
    }

    // Update canonical URL
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    if (currentCategory && categorySlug) {
      // Each category page has its own canonical URL
      canonical.href = `https://www.eugeniabravodemo.com/articulos?categoria=${categorySlug}`;
    } else {
      canonical.href = 'https://www.eugeniabravodemo.com/articulos';
    }
    document.head.appendChild(canonical);

    // Update meta description
    let existingDescription = document.querySelector('meta[name="description"]');
    if (!existingDescription) {
      existingDescription = document.createElement('meta');
      existingDescription.setAttribute('name', 'description');
      document.head.appendChild(existingDescription);
    }
    
    if (categoryMeta) {
      // Use the custom category description
      existingDescription.setAttribute('content', categoryMeta.description);
    } else if (currentCategory) {
      // Fallback generic description
      existingDescription.setAttribute(
        'content',
        `Artículos especializados en ${currentCategory.name}. Información legal actualizada y asesoramiento profesional por EugeniaBravoDemo.`
      );
    } else {
      // Main page description
      existingDescription.setAttribute(
        'content',
        'Explora artículos sobre derecho civil, penal, laboral, mercantil y más. Contenido legal especializado y actualizado.'
      );
    }

    // Add robots meta tag to ensure indexing
    let existingRobots = document.querySelector('meta[name="robots"]');
    if (!existingRobots) {
      existingRobots = document.createElement('meta');
      existingRobots.setAttribute('name', 'robots');
      document.head.appendChild(existingRobots);
    }
    existingRobots.setAttribute('content', 'index, follow');

    return () => {
      const canonicalToRemove = document.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) {
        canonicalToRemove.remove();
      }
    };
  }, [searchParams, categories]);

  // Fetch posts with pagination based on selected categories and search
  const fetchPosts = async (page: number = 1, appendToExisting: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      let result;
      
      // Use search if there's a search term, otherwise use regular fetch
      if (searchTerm.trim()) {
        result = await SupabasePostService.searchPostsWithPagination(
          searchTerm.trim(),
          'PUBLIC',
          selectedCategories.length > 0 ? selectedCategories[0] : null,
          POSTS_PER_PAGE,
          offset,
          sortOrder
        );
      } else if (selectedCategories.length === 0) {
        // Fetch all public posts including those without categories
        result = await SupabasePostService.fetchPostsIncludingUncategorizedWithPagination(
          'PUBLIC', 
          null, 
          POSTS_PER_PAGE, 
          offset,
          sortOrder
        );
      } else {
        // For multiple selected categories, we'll need to combine results
        // This is a limitation of pagination with multiple category filtering
        // For now, we'll use the first selected category for pagination
        result = await SupabasePostService.fetchPostsIncludingUncategorizedWithPagination(
          'PUBLIC', 
          selectedCategories[0], 
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
      setError('Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch posts when categories selection or search changes
  useEffect(() => {
    fetchPosts(1);
    setCurrentPage(1);
  }, [selectedCategories, searchTerm]);

  // Fetch posts when sort order changes
  useEffect(() => {
    if (posts.length > 0 || searchTerm.trim()) { // Refetch if we have posts or if searching
      fetchPosts(1);
      setCurrentPage(1);
    }
  }, [sortOrder]);

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    updateUrlParams(newSelectedCategories);
  };

  // Clear all category selections
  const clearCategoryFilters = () => {
    setSelectedCategories([]);
    updateUrlParams([]);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Pagination logic - now all server-side
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts; // filteredPosts now contains server results

  // Optimized page change handler
  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    fetchPosts(page);
    
    // Smooth scroll to top with reduced distance for better UX
    window.scrollTo({ 
      top: document.querySelector('h1')?.offsetTop || 0, 
      behavior: 'smooth' 
    });
  };

  // Generate pagination numbers with ellipsis for large page counts
  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => 
      item !== arr[index - 1] && (item !== 1 || index === 0)
    );
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoría desconocida';
  };

  // Get current category info for display
  const currentCategorySlug = searchParams?.get('categoria');
  const currentCategory = categories.find(
    cat => generateCategorySlug(cat.name) === currentCategorySlug
  );
  const categoryMeta = currentCategorySlug ? getCategoryMetadata(currentCategorySlug) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <H1 variant="public">
            {currentCategory ? currentCategory.name : 'Artículos'}
          </H1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto hidden sm:block">
            {categoryMeta?.intro || 'Explora nuestros artículos sobre diversos temas legales. Encuentra información valiosa y actualizada para resolver tus dudas jurídicas.'}
          </p>
          {currentCategory && (
            <button
              onClick={clearCategoryFilters}
              className="mt-4 text-sm text-[#009483] hover:text-[#007a6b] font-medium"
            >
              ← Ver todos los artículos
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Bar, Sort Button and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-3xl mx-auto">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent shadow-sm"
              />
            </div>
            <div className='flex flex-row gap-2 sm:gap-4'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg transition-colors whitespace-nowrap shadow-sm ${
                showFilters 
                  ? 'bg-gray-100 hover:bg-gray-200' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Filtros</span>
              <span className="sm:hidden">Filtros</span>
              {selectedCategories.length > 0 && (
                <span className="bg-[#009483] text-white text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            <button
              onClick={toggleSortOrder}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 w-auto sm:w-44 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm"
              title={`Ordenar por fecha ${sortOrder === 'desc' ? 'ascendente' : 'descendente'}`}
            >
              {sortOrder === 'desc' ? (
                <>
                  <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden sm:inline">Más recientes</span>
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden sm:inline">Más antiguos</span>
                </>
              )}
            </button>
           </div>
 
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 text-center">
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-gray-700 font-medium text-sm sm:text-base">Categorías:</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mb-3 sm:mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-[#009483] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                
                {/* Uncategorized filter */}
                <button
                  onClick={() => handleCategoryToggle('uncategorized')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes('uncategorized')
                      ? 'bg-[#009483] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sin categoría
                </button>
              </div>
              
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearCategoryFilters}
                  className="text-[#009483] hover:text-[#007a6b] font-medium text-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#009483]" />
            <span className="ml-2 text-gray-600">Cargando artículos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPosts(1)}
              className="bg-[#009483] text-white px-6 py-2 rounded-lg hover:bg-[#007a6b] transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Posts Grid with optimized layout */}
        {!loading && !error && currentPosts.length > 0 && (
          <>
            {/* Posts count indicator */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 text-sm">
                {searchTerm.trim() ? (
                  <>Mostrando {currentPosts.length} de {totalCount} resultados</>
                ) : (
                  <>Mostrando {startIndex + 1}-{Math.min(endIndex, totalCount)} de {totalCount} artículos</>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-gray-600 text-sm">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {currentPosts.map((post) => (
                <PostCardComponent
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No se encontraron artículos que coincidan con tu búsqueda.
            </p>
            {(searchTerm || selectedCategories.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  clearCategoryFilters();
                }}
                className="text-[#009483] hover:text-[#007a6b] font-medium"
              >
                Limpiar filtros y ver todos los artículos
              </button>
            )}
          </div>
        )}

        {/* Enhanced Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </button>
            
            {/* Page numbers with ellipsis */}
            <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
              {getPaginationNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-[#009483] text-white shadow-sm'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Articulos() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#009483]" />
          <span className="text-gray-600">Cargando artículos...</span>
        </div>
      </div>
    }>
      <ArticulosContent />
    </Suspense>
  );
}
