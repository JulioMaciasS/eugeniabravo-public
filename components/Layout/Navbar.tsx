"use client"

import React, { useState, useEffect } from 'react';
import { Scale, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { SupabasePostService, Category } from '@/app/services/supabasePostService';
import { generateCategorySlug } from '@/app/utils/slugUtils';

const logoImage = '/images/brand-logo.svg';

// Articles Dropdown Component
function ArticlesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === '/articulos';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await SupabasePostService.fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    // Force navigation even if on the same route
    if (pathname === '/articulos') {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/articulos"
        title="Artículos Jurídicos"
        className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'text-[#009483] bg-[#009483]/10 font-bold shadow-sm' 
            : 'text-[#616161] hover:text-[#009483] hover:bg-gray-100/80'
        }`}
      >
        Artículos
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 pt-1 w-64 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <button
              onClick={() => handleNavigation('/articulos')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#009483] transition-colors font-medium"
            >
              Todos los Artículos
            </button>
            <div className="border-t border-gray-100 mt-2 pt-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleNavigation(`/articulos?categoria=${generateCategorySlug(category.name)}`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#009483] transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile Articles Dropdown Component
function MobileArticlesDropdown({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === '/articulos';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await SupabasePostService.fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigation = (href: string) => {
    onClose();
    // Force navigation even if on the same route
    if (pathname === '/articulos') {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 mx-2 rounded-lg text-base font-medium transition-all duration-200 ${
          isActive 
            ? 'text-[#009483] bg-[#009483]/10 font-bold shadow-sm' 
            : 'text-[#616161] hover:text-[#009483] hover:bg-gray-100/80'
        }`}
      >
        <span>Artículos</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="ml-4 space-y-1">
          <button
            onClick={() => handleNavigation('/articulos')}
            className="block w-full text-left px-4 py-2 mx-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-[#009483] transition-colors font-medium"
          >
            Todos los Artículos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleNavigation(`/articulos?categoria=${generateCategorySlug(category.name)}`)}
              className="block w-full text-left px-4 py-2 mx-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-[#009483] transition-colors"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// This component will handle all authentication-related UI
function AuthenticatedSection({ isMobile, onMobileClick }: { isMobile: boolean, onMobileClick?: () => void }) {
  const { signOut, user } = useAuth();

  if (!user) return null;

  if (isMobile) {
    return (
      <>
        <MobileNavLink href="/admin" onClick={onMobileClick || (() => {})}>Administrador</MobileNavLink>
        <button 
          onClick={signOut} 
          className="block px-4 py-3 mx-2 rounded-lg text-base text-center font-medium transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50/80 w-auto"
        >
          Cerrar Sesión
        </button>
      </>
    );
  }

  return (
    <>
      <NavLink href="/admin">Administrador</NavLink>
      <button 
        onClick={signOut} 
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50/80"
      >
        Cerrar Sesión
      </button>
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePageScroll = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-[12px] shadow-lg border-b border-gray-200/50' 
          : 'bg-white/95 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" onClick={handlePageScroll} className="flex items-center" title="EugeniaBravoDemo - Inicio">
              <img 
                src={logoImage} 
                className="max-h-14 transition-transform hover:scale-105" 
                alt="EugeniaBravoDemo Logo" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/">Inicio</NavLink>
            <ArticlesDropdown />
            <NavLink href="/servicios">Servicios</NavLink>
            <NavLink href="/contacto">Contacto</NavLink>
            <AuthenticatedSection isMobile={false} />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#616161] hover:text-[#009483] p-2 rounded-lg transition-all hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="h-[calc(100vh-80px)] px-2 pt-6 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-[12px] shadow-2xl border-t border-gray-200/50">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Inicio</MobileNavLink>
            <MobileArticlesDropdown onClose={() => setIsOpen(false)} />
            <MobileNavLink href="/servicios" onClick={() => setIsOpen(false)}>Servicios</MobileNavLink>
            <MobileNavLink href="/contacto" onClick={() => setIsOpen(false)}>Contacto</MobileNavLink>
            <AuthenticatedSection isMobile={true} onMobileClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      title={typeof children === 'string' ? children : href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'text-[#009483] bg-[#009483]/10 font-bold shadow-sm' 
          : 'text-[#616161] hover:text-[#009483] hover:bg-gray-100/80'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      title={typeof children === 'string' ? children : href}
      className={`block px-4 py-3 mx-2 rounded-lg text-base text-center font-medium transition-all duration-200 ${
        isActive 
          ? 'text-[#009483] bg-[#009483]/10 font-bold shadow-sm' 
          : 'text-[#616161] hover:text-[#009483] hover:bg-gray-100/80'
      }`}
    >
      {children}
    </Link>
  );
};
