"use client"

import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';
import { SupabasePostService } from '@/app/services/supabasePostService';
import DashboardCard from './components/DashboardCard';
import { FileText, FolderOpen, Clock, PlusCircle, User, Calendar, TrendingUp, Users } from 'lucide-react';
import ActionCard from './components/ActionCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  publicPosts: number;
  privatePosts: number;
  totalCategories: number;
  lastPostDate: string | null;
  thisMonthPosts: number;
  isLoading: boolean;
  error: string | null;
}

const AdminHome: React.FC = () => {
  const { user } = useAuth();
  const demoUser = {
    email: 'demo@eugeniabravodemo.com',
    user_metadata: { full_name: 'Demo Admin' },
    last_sign_in_at: new Date().toISOString(),
  };
  const displayUser = user || (!isSupabaseConfigured() ? demoUser : null);
  const [stats, setStats] = useState<DashboardStats>({
    publicPosts: 0,
    privatePosts: 0,
    totalCategories: 0,
    lastPostDate: null,
    thisMonthPosts: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const allPosts = await SupabasePostService.fetchPostsIncludingUncategorized('ALL');
        const categories = await SupabasePostService.fetchCategories();
        const publicPosts = allPosts.filter(post => post.visibility === 'PUBLIC');
        const privatePosts = allPosts.filter(post => post.visibility === 'PRIVATE');
        const mostRecent = allPosts
          .slice()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthPosts = allPosts.filter(post =>
          new Date(post.created_at).getTime() >= startOfMonth.getTime()
        );

        setStats({
          publicPosts: publicPosts.length,
          privatePosts: privatePosts.length,
          totalCategories: categories.length,
          lastPostDate: mostRecent?.created_at || null,
          thisMonthPosts: thisMonthPosts.length,
          isLoading: false,
          error: null
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar las estadísticas del panel';
        setStats(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
      }
    }
    fetchStats();
  }, []);

  if (stats.isLoading) {
    return (
      <div className="h-full min-h-[calc(100vh-80px)] w-full max-w-7xl mx-auto p-8">
        <LoadingSpinner 
          size="lg" 
          text="Cargando panel..." 
          className="py-20"
        />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-800 text-center">{stats.error}</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='h-full min-h-[calc(100vh-80px)] w-full max-w-7xl mx-auto p-8'>
      {/* Header Section with User Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-navy-900 mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona tu blog desde el panel de administración
            </p>
          </div>
          
          {/* User Info Card */}
          {displayUser && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[280px]">
              <div className="flex items-center space-x-3">
                <div className="bg-[#009483] rounded-full p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">
                    {displayUser.user_metadata?.full_name || 'Administrador'}
                  </p>
                  <p className="text-sm text-gray-600">{displayUser.email}</p>
                  <p className="text-xs text-gray-500">
                    Conectado desde {new Date(displayUser.last_sign_in_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Artículos Públicos"
          value={stats.publicPosts.toString()}
          icon={<FileText className="h-8 w-8 text-green-600" />}
        />
        <DashboardCard
          title="Borradores"
          value={stats.privatePosts.toString()}
          icon={<FileText className="h-8 w-8 text-amber-600" />}
        />
        <DashboardCard
          title="Categorías"
          value={stats.totalCategories.toString()}
          icon={<FolderOpen className="h-8 w-8 text-blue-600" />}
        />
        <DashboardCard
          title="Este Mes"
          value={stats.thisMonthPosts.toString()}
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
        />
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[#009483]" />
          Actividad Reciente
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Último artículo publicado</p>
            <p className="font-medium text-navy-900">
              {formatDate(stats.lastPostDate)}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            title="Gestionar Artículos"
            description="Ver y editar todos los artículos del blog"
            icon={<FileText className="h-6 w-6" />}
            to="/admin/posts"
          />
           <ActionCard
            title="Gestionar Categorías"
            description="Organizar y gestionar las categorías"
            icon={<FolderOpen className="h-6 w-6" />}
            to="/admin/categories"
          />
          <ActionCard
            title="Gestionar Autores"
            description="Administrar los autores de los artículos"
            icon={<Users className="h-6 w-6" />}
            to="/admin/authors"
          />
          <ActionCard
            title="Crear Nuevo Artículo"
            description="Comienza a escribir un nuevo artículo"
            icon={<PlusCircle className="h-6 w-6" />}
            to="/admin/posts/new"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
