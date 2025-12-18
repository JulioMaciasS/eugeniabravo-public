// app/articulos/[slug]/page.tsx
import { Suspense } from 'react'
import BlogPostComponent from '@/components/blog/BlogPostComponent'
import LoadingBlogPost from '@/components/blog/LoadingBlogPost'
import { SupabasePostService } from '@/app/services/supabasePostService'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await SupabasePostService.fetchPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Artículo no encontrado | EugeniaBravoDemo',
      description: 'El artículo solicitado no fue encontrado.'
    }
  }

  return {
    title: `${post.title} | EugeniaBravoDemo`,
    description: post.excerpt,
    alternates: { 
      canonical: `https://www.eugeniabravodemo.com/articulos/${slug}` 
    },
    openGraph: {
      siteName: 'EugeniaBravoDemo',
      title: post.title,
      description: post.excerpt,
      url: `https://www.eugeniabravodemo.com/articulos/${slug}`,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : ['EugeniaBravoDemo'],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@EugeniaBravoDemo',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Fetch the post to verify it exists
  const { slug } = await params
  const post = await SupabasePostService.fetchPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingBlogPost />}>
      <BlogPostComponent slug={slug} />
    </Suspense>
  )
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const posts = await SupabasePostService.fetchPostsIncludingUncategorized('PUBLIC')
    
    return posts.map((post) => ({
      slug: post.slug || post.id, // Fallback to ID if slug is missing
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
