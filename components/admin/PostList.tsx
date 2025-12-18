"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Edit2, Trash2, RefreshCw, Search, Eye, PlusCircle } from 'lucide-react';
import { debounce } from 'lodash';
import { SupabasePostService } from '@/app/services/supabasePostService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BackButton from './components/BackButton';

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const result = await SupabasePostService.fetchPosts(visibility, selectedCategoryId);
      setPosts(result);
      setNextToken(null); // Supabase doesn't use pagination tokens like this
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!nextToken) return;
    setLoading(true);
    
    try {
      const result = await SupabasePostService.fetchPosts(visibility, selectedCategoryId);
      setPosts([...posts, ...result]);
      setNextToken(null);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update posts when filters change
  useEffect(() => {
    if (!searchTerm || searchTerm === '') {
      fetchPosts();
    } else {
      debouncedSearch(searchTerm, selectedCategoryId || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, visibility]);

  // MARK: Delete Post
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await SupabasePostService.deletePost(id);
      
      if (success) {
        // Update UI - remove the deleted post
        setPosts(posts.filter(post => post.id !== id));
        
        // Optionally refresh the full list
        await fetchPosts();
      } else {
        alert('Error al eliminar el artículo. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el artículo. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId || null);
  };

  // Updated search function
  const debouncedSearch = debounce(async (term: string, categoryID?: string) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await SupabasePostService.fetchPosts(visibility, selectedCategoryId);
      setPosts(result);
      setNextToken(null);
      
      if (result.length === 0) {
        setSearchError('No posts found matching your criteria');
      }
    } catch (err) {
      console.error('Error searching posts:', err);
      setSearchError('Error searching posts');
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      debouncedSearch(searchTerm, selectedCategoryId || undefined);
    } else {
      fetchPosts();
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPosts(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Error al actualizar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const columnWidths = {
    title: 'w-[25%] min-w-[200px]',
    categories: 'w-[20%] min-w-[180px]',
    visibility: 'w-[10%] min-w-[100px]',
    date: 'w-[15%] min-w-[150px]',
    author: 'w-[15%] min-w-[120px]',
    actions: 'w-[15%] min-w-[120px]'
  };

  return (
    <div className="min-h-[calc(100vh-80px)] md:mx-auto p-8 bg-white">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>
      
      <div className="flex flex-row justify-between mb-8">
        
      <div >
      <h1 className="text-3xl font-bold text-navy-900">Blog Posts</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <Link
            href="/admin/posts/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm whitespace-nowrap min-w-[120px]"
          >
            <PlusCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>New Post</span>
          </Link>
        </div>

      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        {/* Category Filter Dropdown */}
        <div className="mb-4 md:mb-0">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategoryId || ''}
            onChange={handleCategoryChange}
            className="block bg-gray-200 min-w-fit pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility Filter Dropdown */}
        <div>
          <label htmlFor="visibility-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Visibility:
          </label>
          <select
            id="visibility-filter"
            value={visibility}
            onChange={handleVisibilityChange}
            className="block bg-gray-200 min-w-fit pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="ALL">Todos</option>
            <option value="PUBLIC">Público</option>
            <option value="PRIVATE">Privado</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 h-11"
          />

          <button
            type="submit"
            className="px-6 py-2 rounded-lg h-11 w-fit transition-colors bg-navy-600 text-white hover:bg-navy-700"
          >
            <div className='flex items-center'>
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </div>
          </button>
        </div>
        {searchError && (
          <p className="mt-2 text-red-500 text-sm">{searchError}</p>
        )}
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-scroll min-h-full h-fit p-3">
        {/* Single combined table */}
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.title}`}>Título</th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.categories}`}>Categories</th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.visibility}`}>Visibility</th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.date}`}>Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.author}`}>Autor</th>
              <th className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${columnWidths.actions}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className={`px-6 py-4 whitespace-nowrap ${columnWidths.title}`}>
                    <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${columnWidths.categories}`}>
                    {post.postCategories?.items?.map((pc: any) => (
                      pc?.category && (
                        <span
                          key={pc.category.id}
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-navy-100 text-navy-800 mr-2"
                        >
                          {pc.category.name}
                        </span>
                      )
                    )) || (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${columnWidths.visibility}`}>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.visibility === 'PUBLIC'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.visibility || 'PRIVATE'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${columnWidths.date}`}>
                    {post.date ? new Date(post.date).toLocaleString() : 'N/A'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${columnWidths.author}`}>
                    {post.author || 'Desconocido'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${columnWidths.actions}`}>
                    <Link href={'/admin/posts/preview/' + post.id + '?from=posts'} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Eye className="inline h-5 w-5" />
                    </Link>
                    <Link href={`/admin/posts/edit/${post.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="inline h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No hay artículos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Botón Cargar Más */}
        {nextToken && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMorePosts}
              className="shadow-md bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar Más'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
