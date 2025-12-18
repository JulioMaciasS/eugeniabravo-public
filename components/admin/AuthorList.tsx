"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { RefreshCw, Search, PlusCircle, Edit2, Trash2, User, Mail, Briefcase } from 'lucide-react';
import { SupabasePostService, Author } from '@/app/services/supabasePostService';
import BackButton from './components/BackButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deletingAuthorId, setDeletingAuthorId] = useState<string | null>(null);

  // Fetch authors
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const fetchedAuthors = await SupabasePostService.fetchAuthors();
      setAuthors(fetchedAuthors);
      setFilteredAuthors(fetchedAuthors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter authors by search term
  useEffect(() => {
    if (!authors || authors.length === 0) {
      setFilteredAuthors([]);
      return;
    }

    let filtered = authors;
    
    if (searchTerm.trim()) {
      filtered = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (author.role && author.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (author.email && author.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredAuthors(filtered);
  }, [searchTerm, authors]);

  // Load data on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Delete author
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este autor?')) {
      return;
    }

    setDeletingAuthorId(id);
    try {
      await SupabasePostService.deleteAuthor(id);
      
      // Update UI - remove the deleted author
      setAuthors(authors.filter(author => author.id !== id));
      setFilteredAuthors(filteredAuthors.filter(author => author.id !== id));
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Error al eliminar el autor. Inténtalo de nuevo.');
    } finally {
      setDeletingAuthorId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Autores</h1>
          <Link 
            href="/admin/authors/new"
            className="bg-[#009483] text-white px-4 py-2 rounded-lg hover:bg-[#007a6b] transition-colors flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Autor
          </Link>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009483] focus:border-transparent w-full"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAuthors}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && authors.length === 0 && (
        <LoadingSpinner 
          size="lg" 
          text="Cargando autores..." 
          className="py-12"
        />
      )}

      {/* Authors Grid */}
      {!loading && filteredAuthors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm.trim() ? 'No se encontraron autores que coincidan con tu búsqueda.' : 'No se encontraron autores.'}
          </p>
        </div>
      ) : (
        <>
          {/* Results counter */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {searchTerm.trim() ? (
                <>Mostrando {filteredAuthors.length} de {authors.length} autores</>
              ) : (
                <>Mostrando {filteredAuthors.length} autores</>
              )}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#009483]/30 transition-all duration-300 p-6"
              >
                {/* Author Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                    {author.profile_picture_url ? (
                      <img
                        src={author.profile_picture_url}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{author.name}</h3>
                    {author.role && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {author.role}
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Details */}
                {author.email && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Mail className="h-3 w-3 mr-2" />
                    {author.email}
                  </div>
                )}

                {author.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {author.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link
                    href={`/admin/authors/edit/${author.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="h-3 w-3" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    disabled={deletingAuthorId === author.id}
                  >
                    <Trash2 className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
