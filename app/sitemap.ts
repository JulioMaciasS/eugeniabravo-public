import { MetadataRoute } from 'next'
import { SupabasePostService } from '@/app/services/supabasePostService'
import { generateCategorySlug } from '@/app/utils/slugUtils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eugeniabravodemo.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Legal pages
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic blog posts
  let blogPosts: any[] = []
  try {
    blogPosts = await SupabasePostService.fetchPostsIncludingUncategorized('PUBLIC')
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  const dynamicPages = blogPosts.map((post) => ({
    url: `${baseUrl}/articulos/${post.slug || post.id}`,
    lastModified: new Date(post.created_at || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages - these provide unique value and should be indexed
  let categories: any[] = []
  try {
    categories = await SupabasePostService.fetchCategories()
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/articulos?categoria=${generateCategorySlug(category.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...dynamicPages, ...categoryPages]
}
