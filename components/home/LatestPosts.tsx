"use client"

import { useEffect, useState, useRef } from 'react';
import { SupabasePostService, PostWithCategories } from '@/app/services/supabasePostService';
import PostCardComponent from '../blog/PostCardComponent';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LatestPostsSlider.module.css';

interface LatestPostsProps {
  isSection: boolean;
}

export default function LatestPosts({isSection}: LatestPostsProps) {
  const sectionClass = isSection
    ? "min-h-[calc(80vh-80px)] py-12 bg-white flex items-center justify-center"
    : "min-h-fit py-12 bg-gray-50";
  
  const [posts, setPosts] = useState<PostWithCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [postsPerSlide, setPostsPerSlide] = useState<number>(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await SupabasePostService.fetchPostsIncludingUncategorized('PUBLIC');
        
        // Sort by creation date and limit to 6 posts for slider
        const sortedPosts = fetchedPosts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        
        setPosts(sortedPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError('Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  // Handle responsive posts per slide and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      if (isMobileView) {
        setPostsPerSlide(1); // Mobile: 1 post per slide
      } else {
        setPostsPerSlide(6); // Desktop: Show all 6 posts (no slider)
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset current slide when posts per slide changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [postsPerSlide]);

  const totalSlides = Math.ceil(posts.length / postsPerSlide);
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
      setIsAutoPlaying(false); // Pause auto-play on manual navigation
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
      setIsAutoPlaying(false); // Pause auto-play on manual navigation
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setIsAutoPlaying(false); // Pause auto-play on manual navigation
  };

  // Touch handlers for swipe functionality
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canGoNext) {
      nextSlide();
    }
    if (isRightSwipe && canGoPrev) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canGoPrev) {
        prevSlide();
      } else if (e.key === 'ArrowRight' && canGoNext) {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoPrev, canGoNext]);

  // Auto-play functionality (only for mobile slider)
  useEffect(() => {
    if (!isAutoPlaying || !isMobile || totalSlides <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        if (prev >= totalSlides - 1) {
          return 0; // Loop back to first slide
        }
        return prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isMobile, totalSlides]);

  // Pause auto-play on hover (only for mobile)
  const handleMouseEnter = () => {
    if (autoPlayRef.current && isMobile) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isAutoPlaying || !isMobile || totalSlides <= 1) return;
    
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        if (prev >= totalSlides - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);
  };

  if (loading) {
    return (
      <section className={sectionClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Últimos Artículos
            </h2>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#009483]" />
              <span className="ml-2 text-gray-600">Cargando artículos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Últimos Artículos
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className={sectionClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Últimos Artículos
            </h2>
            <p className="text-gray-600">No hay artículos disponibles.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Últimos Artículos
          </h2>
          <p className="text-xl text-gray-600">
            Mantente al día con nuestros últimos artículos legales
          </p>
        </div>

        {isMobile ? (
          /* Mobile Slider */
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Slider Container */}
            <div 
              className="overflow-hidden" 
              ref={sliderRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <motion.div
                className="flex transition-transform duration-300 ease-in-out"
                animate={{
                  x: `-${currentSlide * 100}%`
                }}
                transition={{
                  type: "tween",
                  duration: 0.5
                }}
              >
                {posts.map((post, index) => {
                  const categories = post.post_categories?.map(pc => (pc as any).categories).filter(Boolean) || [];
                  return (
                    <div 
                      key={post.id}
                      className="w-full flex-shrink-0 flex justify-center"
                    >
                      <div className="w-full max-w-md">
                        <PostCardComponent
                          post={post}
                          categories={categories}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={!canGoPrev}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                    canGoPrev 
                      ? 'hover:bg-[#009483] hover:text-white cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Artículo anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={!canGoNext}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                    canGoNext 
                      ? 'hover:bg-[#009483] hover:text-white cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Siguiente artículo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? 'bg-[#009483] scale-110'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir a la página ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Desktop Grid */
          <div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {posts.map((post) => {
                const categories = post.post_categories?.map(pc => (pc as any).categories).filter(Boolean) || [];
                return (
                  <PostCardComponent
                    key={post.id}
                    post={post}
                    categories={categories}
                  />
                );
              })}
            </div>
            
            {/* View More Button */}
            <div className="text-center">
              <a
                href="/articulos"
                className="inline-flex items-center px-6 py-3 bg-[#009483] text-white font-medium rounded-lg hover:bg-[#007a6b] transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Ver más artículos
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
