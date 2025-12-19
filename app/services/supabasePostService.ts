import { createClient, Database, isSupabaseConfigured } from '@/app/lib/supabase'
import { generateCategorySlug, generateSlug } from '@/app/utils/slugUtils'

// Type definitions for our data
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostCategory = Database['public']['Tables']['post_categories']['Row']

// Manual type definition for Author (until database schema is updated)
export type Author = {
  id: string
  name: string
  role: string | null
  description: string | null
  profile_picture_url: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export type PostWithCategories = Post & {
  post_categories: (PostCategory & {
    categories: Category
  })[],
  author_data?: Author
}

export type PostWithCategoriesAndAuthor = Post & {
  post_categories: (PostCategory & {
    categories: Category
  })[],
  authors?: Author
}

const demoImage = '/images/blog/sample-article.svg'
const demoProfileImage = '/images/portrait-placeholder.svg'
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

let demoCategories: Category[] = [
  { id: 'demo-cat-civil', name: 'Derecho Civil', created_at: daysAgo(120) },
  { id: 'demo-cat-laboral', name: 'Derecho Laboral', created_at: daysAgo(110) },
  { id: 'demo-cat-familia', name: 'Derecho Familiar', created_at: daysAgo(100) },
  { id: 'demo-cat-mercantil', name: 'Derecho Mercantil', created_at: daysAgo(90) },
  { id: 'demo-cat-fiscal', name: 'Derecho Fiscal', created_at: daysAgo(80) },
]

let demoAuthors: Author[] = [
  {
    id: 'demo-author-1',
    name: 'Laura Gomez',
    role: 'Abogada Principal',
    description: 'Especialista en derecho civil y familiar con enfoque en soluciones practicas.',
    profile_picture_url: demoProfileImage,
    email: 'laura@eugeniabravodemo.com',
    created_at: daysAgo(200),
    updated_at: daysAgo(10),
  },
  {
    id: 'demo-author-2',
    name: 'Carlos Vega',
    role: 'Abogado Asociado',
    description: 'Experiencia en derecho mercantil y contratos para empresas.',
    profile_picture_url: demoProfileImage,
    email: 'carlos@eugeniabravodemo.com',
    created_at: daysAgo(180),
    updated_at: daysAgo(12),
  },
  {
    id: 'demo-author-3',
    name: 'Ana Ruiz',
    role: 'Consultora Legal',
    description: 'Asesora en derecho laboral y cumplimiento normativo.',
    profile_picture_url: demoProfileImage,
    email: 'ana@eugeniabravodemo.com',
    created_at: daysAgo(160),
    updated_at: daysAgo(14),
  },
]

let demoPosts: PostWithCategories[] = [
  {
    id: 'demo-post-1',
    title: 'Guia basica de contratos civiles',
    content: '<p>Resumen practico sobre contratos, clausulas esenciales y recomendaciones iniciales.</p>',
    excerpt: 'Guia rapida para entender contratos civiles y sus clausulas clave.',
    image: demoImage,
    author: demoAuthors[0].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(2),
    date: daysAgo(2),
    slug: generateSlug('Guia basica de contratos civiles'),
    post_categories: [
      {
        post_id: 'demo-post-1',
        category_id: 'demo-cat-civil',
        created_at: daysAgo(2),
        categories: demoCategories[0],
      },
    ],
    author_data: demoAuthors[0],
  },
  {
    id: 'demo-post-2',
    title: 'Checklist de despido justo',
    content: '<p>Pasos esenciales para evaluar un despido conforme a la normativa vigente.</p>',
    excerpt: 'Listado de verificacion para procesos de despido y comunicacion interna.',
    image: demoImage,
    author: demoAuthors[2].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(6),
    date: daysAgo(6),
    slug: generateSlug('Checklist de despido justo'),
    post_categories: [
      {
        post_id: 'demo-post-2',
        category_id: 'demo-cat-laboral',
        created_at: daysAgo(6),
        categories: demoCategories[1],
      },
    ],
    author_data: demoAuthors[2],
  },
  {
    id: 'demo-post-3',
    title: 'Planificacion patrimonial en 2024',
    content: '<p>Estrategias para organizar activos y anticipar escenarios fiscales.</p>',
    excerpt: 'Claves para planificar patrimonio con enfoque fiscal y familiar.',
    image: demoImage,
    author: demoAuthors[1].name,
    visibility: 'PRIVATE',
    created_at: daysAgo(12),
    date: daysAgo(12),
    slug: generateSlug('Planificacion patrimonial en 2024'),
    post_categories: [
      {
        post_id: 'demo-post-3',
        category_id: 'demo-cat-fiscal',
        created_at: daysAgo(12),
        categories: demoCategories[4],
      },
    ],
    author_data: demoAuthors[1],
  },
  {
    id: 'demo-post-4',
    title: 'Mediacion familiar: primeros pasos',
    content: '<p>Como iniciar un proceso de mediacion con acuerdos sostenibles.</p>',
    excerpt: 'Primeros pasos para una mediacion familiar efectiva.',
    image: demoImage,
    author: demoAuthors[0].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(20),
    date: daysAgo(20),
    slug: generateSlug('Mediacion familiar primeros pasos'),
    post_categories: [
      {
        post_id: 'demo-post-4',
        category_id: 'demo-cat-familia',
        created_at: daysAgo(20),
        categories: demoCategories[2],
      },
    ],
    author_data: demoAuthors[0],
  },
  {
    id: 'demo-post-5',
    title: 'Clausulas clave en contratos mercantiles',
    content: '<p>Elementos esenciales para contratos de servicios y compraventa.</p>',
    excerpt: 'Clausulas esenciales para contratos mercantiles modernos.',
    image: demoImage,
    author: demoAuthors[1].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(35),
    date: daysAgo(35),
    slug: generateSlug('Clausulas clave en contratos mercantiles'),
    post_categories: [
      {
        post_id: 'demo-post-5',
        category_id: 'demo-cat-mercantil',
        created_at: daysAgo(35),
        categories: demoCategories[3],
      },
    ],
    author_data: demoAuthors[1],
  },
  {
    id: 'demo-post-6',
    title: 'Actualizacion de plazos procesales',
    content: '<p>Resumen de cambios recientes y como afectan a clientes y empresas.</p>',
    excerpt: 'Cambios recientes en plazos procesales y su impacto.',
    image: demoImage,
    author: demoAuthors[2].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(60),
    date: daysAgo(60),
    slug: generateSlug('Actualizacion de plazos procesales'),
    post_categories: [],
    author_data: demoAuthors[2],
  },
  {
    id: 'demo-post-7',
    title: 'Estrategias para proteger activos',
    content: '<p>Herramientas para blindaje patrimonial y cumplimiento.</p>',
    excerpt: 'Estrategias legales para proteger activos con enfoque preventivo.',
    image: demoImage,
    author: demoAuthors[1].name,
    visibility: 'PRIVATE',
    created_at: daysAgo(90),
    date: daysAgo(90),
    slug: generateSlug('Estrategias para proteger activos'),
    post_categories: [
      {
        post_id: 'demo-post-7',
        category_id: 'demo-cat-fiscal',
        created_at: daysAgo(90),
        categories: demoCategories[4],
      },
    ],
    author_data: demoAuthors[1],
  },
  {
    id: 'demo-post-8',
    title: 'Custodia compartida: criterios recientes',
    content: '<p>Lineamientos actuales para evaluar la custodia compartida.</p>',
    excerpt: 'Criterios recientes para la custodia compartida en tribunales.',
    image: demoImage,
    author: demoAuthors[0].name,
    visibility: 'PUBLIC',
    created_at: daysAgo(120),
    date: daysAgo(120),
    slug: generateSlug('Custodia compartida criterios recientes'),
    post_categories: [
      {
        post_id: 'demo-post-8',
        category_id: 'demo-cat-familia',
        created_at: daysAgo(120),
        categories: demoCategories[2],
      },
    ],
    author_data: demoAuthors[0],
  },
]

const sortPostsByDate = (posts: PostWithCategories[], sortOrder: 'asc' | 'desc' = 'desc') =>
  [...posts].sort((a, b) => {
    const aDate = new Date(a.created_at).getTime()
    const bDate = new Date(b.created_at).getTime()
    return sortOrder === 'asc' ? aDate - bDate : bDate - aDate
  })

const filterPostsByVisibility = (posts: PostWithCategories[], visibility: 'PUBLIC' | 'PRIVATE' | 'ALL') => {
  if (visibility === 'ALL') return posts
  return posts.filter(post => post.visibility === visibility)
}

const filterPostsByCategory = (posts: PostWithCategories[], categoryId: string | null) => {
  if (!categoryId) return posts
  if (categoryId === 'uncategorized') {
    return posts.filter(post => !post.post_categories || post.post_categories.length === 0)
  }
  return posts.filter(post =>
    post.post_categories?.some(pc => pc.category_id === categoryId)
  )
}

const filterPostsBySearch = (posts: PostWithCategories[], searchTerm: string) => {
  if (!searchTerm) return posts
  const lowerTerm = searchTerm.toLowerCase()
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerTerm) ||
    (post.excerpt || '').toLowerCase().includes(lowerTerm)
  )
}

const paginatePosts = (posts: PostWithCategories[], limit: number, offset: number) => {
  const totalCount = posts.length
  const pagedPosts = posts.slice(offset, offset + limit)
  return {
    posts: pagedPosts,
    totalCount,
    hasMore: offset + limit < totalCount,
  }
}

const updateDemoCategoryReferences = (categoryId: string, name: string) => {
  demoPosts = demoPosts.map(post => ({
    ...post,
    post_categories: post.post_categories?.map(pc =>
      pc.category_id === categoryId
        ? { ...pc, categories: { ...pc.categories, name } }
        : pc
    ) || [],
  }))
}

const updateDemoAuthorReferences = (authorId: string, updates: Partial<Author>) => {
  demoPosts = demoPosts.map(post => {
    if (!post.author_data || post.author_data.id !== authorId) {
      return post
    }
    const nextAuthor = { ...post.author_data, ...updates }
    return {
      ...post,
      author: nextAuthor.name,
      author_data: nextAuthor,
    }
  })
}

/**
 * Post service that handles all blog post related operations using Supabase
 */
export class SupabasePostService {
  /**
   * Get all categories
   */
  static async fetchCategories() {
    if (!isSupabaseConfigured()) {
      return [...demoCategories].sort((a, b) => a.name.localeCompare(b.name))
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  /**
   * Get posts with optional category and visibility filters
   */
  static async fetchPosts(
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL', 
    selectedCategoryId: string | null = null
  ) {
    if (!isSupabaseConfigured()) {
      const filtered = filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), selectedCategoryId)
      return sortPostsByDate(filtered)
    }
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            visibility,
            categories (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      // Add visibility filter if not ALL
      if (visibility !== 'ALL') {
        query = query.eq('visibility', visibility)
      }
      
      // If category selected, filter by category using inner join
      if (selectedCategoryId) {
        query = supabase
          .from('posts')
          .select(`
            *,
            post_categories!inner (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `)
          .eq('post_categories.category_id', selectedCategoryId)
          .order('created_at', { ascending: false })
        
        // Add visibility filter if not ALL
        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching posts:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  /**
   * Get posts without category filter (all posts)
   */
  static async fetchAllPosts(visibility: 'PUBLIC' | 'PRIVATE' | 'ALL') {
    if (!isSupabaseConfigured()) {
      return sortPostsByDate(filterPostsByVisibility(demoPosts, visibility))
    }
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            visibility,
            categories (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      // Add visibility filter if not ALL
      if (visibility !== 'ALL') {
        query = query.eq('visibility', visibility)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching all posts:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching all posts:', error)
      return []
    }
  }

  /**
   * Get a single post by ID
   */
  static async fetchPostById(id: string) {
    if (!isSupabaseConfigured()) {
      return demoPosts.find(post => post.id === id) || null
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            visibility,
            categories (
              id,
              name
            )
          ),
          authors (
            id,
            name,
            role,
            description,
            profile_picture_url,
            email
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching post by ID:', error)
        return null
      }
      
      // Transform the result to include author_data
      if (data && data.authors) {
        data.author_data = data.authors
        delete data.authors
      }
      
      return data
    } catch (error) {
      console.error('Error fetching post by ID:', error)
      return null
    }
  }

  /**
   * Create a new post
   */
  static async createPost(postData: {
    title: string
    excerpt: string
    content: string
    image?: string
    date?: string
    author?: string
    visibility: 'PUBLIC' | 'PRIVATE'
    categoryIds?: string[]
  }) {
    if (!isSupabaseConfigured()) {
      const newPostId = `demo-post-${Date.now()}`
      const categoryIds = postData.categoryIds || []
      const postCategories = categoryIds
        .map(categoryId => {
          const category = demoCategories.find(cat => cat.id === categoryId)
          if (!category) return null
          return {
            post_id: newPostId,
            category_id: categoryId,
            created_at: new Date().toISOString(),
            categories: category,
          }
        })
        .filter(Boolean) as PostWithCategories['post_categories']
      const createdAt = postData.date || new Date().toISOString()
      const authorData = demoAuthors.find(author => author.name === postData.author) || demoAuthors[0]
      const newPost: PostWithCategories = {
        id: newPostId,
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        image: postData.image || demoImage,
        author: postData.author || authorData.name,
        visibility: postData.visibility,
        created_at: createdAt,
        date: createdAt,
        slug: generateSlug(postData.title),
        post_categories: postCategories || [],
        author_data: authorData,
      }
      demoPosts = [newPost, ...demoPosts]
      return newPost
    }
    try {
      const supabase = createClient()
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          image: postData.image,
          date: postData.date,
          author: postData.author,
          visibility: postData.visibility,
        })
        .select()
        .single()
      
      if (postError) {
        console.error('Error creating post:', postError)
        throw postError
      }
      
      // Add categories if provided
      if (postData.categoryIds && postData.categoryIds.length > 0) {
        const categoryInserts = postData.categoryIds.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId,
          visibility: postData.visibility,
        }))
        
        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryInserts)
        
        if (categoryError) {
          console.error('Error adding categories to post:', categoryError)
          // Note: Post was created but categories failed
        }
      }
      
      return post
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  /**
   * Update an existing post
   */
  static async updatePost(
    id: string,
    postData: {
      title?: string
      excerpt?: string
      content?: string
      image?: string
      date?: string
      author?: string
      visibility?: 'PUBLIC' | 'PRIVATE'
      categoryIds?: string[]
    }
  ) {
    if (!isSupabaseConfigured()) {
      const postIndex = demoPosts.findIndex(post => post.id === id)
      if (postIndex === -1) {
        throw new Error('Post not found')
      }
      const existing = demoPosts[postIndex]
      const updatedCategories = postData.categoryIds
        ? postData.categoryIds
            .map(categoryId => {
              const category = demoCategories.find(cat => cat.id === categoryId)
              if (!category) return null
              return {
                post_id: id,
                category_id: categoryId,
                created_at: existing.created_at,
                categories: category,
              }
            })
            .filter(Boolean) as PostWithCategories['post_categories']
        : existing.post_categories
      const updatedPost: PostWithCategories = {
        ...existing,
        title: postData.title ?? existing.title,
        excerpt: postData.excerpt ?? existing.excerpt,
        content: postData.content ?? existing.content,
        image: postData.image ?? existing.image,
        author: postData.author ?? existing.author,
        visibility: postData.visibility ?? existing.visibility,
        post_categories: updatedCategories,
      }
      const authorData = demoAuthors.find(author => author.name === updatedPost.author) || existing.author_data
      updatedPost.author_data = authorData
      demoPosts = demoPosts.map(post => (post.id === id ? updatedPost : post))
      return updatedPost
    }
    try {
      const supabase = createClient()
      
      const updateData: any = {}
      if (postData.title !== undefined) updateData.title = postData.title
      if (postData.excerpt !== undefined) updateData.excerpt = postData.excerpt
      if (postData.content !== undefined) updateData.content = postData.content
      if (postData.image !== undefined) updateData.image = postData.image
      if (postData.date !== undefined) updateData.date = postData.date
      if (postData.author !== undefined) updateData.author = postData.author
      if (postData.visibility !== undefined) updateData.visibility = postData.visibility
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (postError) {
        console.error('Error updating post:', postError)
        throw postError
      }
      
      // Update categories if provided
      if (postData.categoryIds !== undefined) {
        // First, remove existing categories
        await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', id)
        
        // Then add new categories
        if (postData.categoryIds.length > 0) {
          const categoryInserts = postData.categoryIds.map(categoryId => ({
            post_id: id,
            category_id: categoryId,
            visibility: postData.visibility || 'PUBLIC',
          }))
          
          const { error: categoryError } = await supabase
            .from('post_categories')
            .insert(categoryInserts)
          
          if (categoryError) {
            console.error('Error updating categories for post:', categoryError)
          }
        }
      }
      
      return post
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(id: string) {
    if (!isSupabaseConfigured()) {
      demoPosts = demoPosts.filter(post => post.id !== id)
      return true
    }
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting post:', error)
        throw error
      }
      
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  /**
   * Create a new category
   */
  static async createCategory(name: string) {
    if (!isSupabaseConfigured()) {
      const newCategory: Category = {
        id: `demo-cat-${Date.now()}`,
        name,
        created_at: new Date().toISOString(),
      }
      demoCategories = [...demoCategories, newCategory]
      return newCategory
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating category:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  /**
   * Update a category
   */
  static async updateCategory(id: string, name: string) {
    if (!isSupabaseConfigured()) {
      const category = demoCategories.find(cat => cat.id === id)
      if (!category) {
        throw new Error('Category not found')
      }
      const updatedCategory = { ...category, name }
      demoCategories = demoCategories.map(cat => (cat.id === id ? updatedCategory : cat))
      updateDemoCategoryReferences(id, name)
      return updatedCategory
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating category:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string) {
    if (!isSupabaseConfigured()) {
      demoCategories = demoCategories.filter(cat => cat.id !== id)
      demoPosts = demoPosts.map(post => ({
        ...post,
        post_categories: post.post_categories?.filter(pc => pc.category_id !== id) || [],
      }))
      return true
    }
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting category:', error)
        throw error
      }
      
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  /**
   * Get posts including those without categories (for public display)
   * This method ensures posts without categories are also visible
   */
  static async fetchPostsIncludingUncategorized(
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL', 
    selectedCategoryId: string | null = null
  ) {
    if (!isSupabaseConfigured()) {
      const filtered = filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), selectedCategoryId)
      return sortPostsByDate(filtered)
    }
    try {
      const supabase = createClient()
      
      if (selectedCategoryId) {
        // If filtering by category, use inner join to only get posts with that category
        let query = supabase
          .from('posts')
          .select(`
            *,
            post_categories!inner (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `)
          .eq('post_categories.category_id', selectedCategoryId)
          .order('created_at', { ascending: false })
        
        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error('Error fetching categorized posts:', error)
          return []
        }
        
        return data || []
      } else {
        // If not filtering by category, get all posts (including those without categories)
        let query = supabase
          .from('posts')
          .select(`
            *,
            post_categories (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `)
          .order('created_at', { ascending: false })
        
        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error('Error fetching all posts including uncategorized:', error)
          return []
        }
        
        return data || []
      }
    } catch (error) {
      console.error('Error fetching posts including uncategorized:', error)
      return []
    }
  }

  /**
   * Get a single post by slug (for SEO-friendly URLs)
   */
  static async fetchPostBySlug(slug: string): Promise<PostWithCategories | null> {
    if (!isSupabaseConfigured()) {
      return demoPosts.find(post => post.slug === slug && post.visibility === 'PUBLIC') || null
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            categories (
              id,
              name
            )
          ),
          authors (
            id,
            name,
            role,
            description,
            profile_picture_url,
            email
          )
        `)
        .eq('slug', slug)
        .eq('visibility', 'PUBLIC')
        .single()
      
      if (error) {
        console.error('Error fetching post by slug:', error)
        return null
      }
      
      // Transform the result to include author_data
      if (data && data.authors) {
        data.author_data = data.authors
        delete data.authors
      }
      
      return data || null
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  }

  /**
   * Get posts by category slug/name instead of ID
   */
  static async fetchPostsByCategorySlug(
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL',
    categorySlug: string
  ): Promise<PostWithCategories[]> {
    if (!isSupabaseConfigured()) {
      const category = demoCategories.find(cat => generateCategorySlug(cat.name) === categorySlug)
      if (!category) return []
      const filtered = filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), category.id)
      return sortPostsByDate(filtered)
    }
    try {
      const supabase = createClient()
      
      // First convert the slug back to a category name for lookup
      const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Get the category by name first
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('name', categoryName)
        .limit(1)
      
      if (categoryError || !categories || categories.length === 0) {
        console.error('Error finding category by slug:', categoryError)
        return []
      }
      
      const categoryId = categories[0].id
      
      // Now fetch posts with this category ID
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories!inner (
            id,
            categories (
              id,
              name
            )
          )
        `)
        .eq('post_categories.category_id', categoryId)
        .order('created_at', { ascending: false })
      
      // Add visibility filter if not ALL
      if (visibility !== 'ALL') {
        query = query.eq('visibility', visibility)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching posts by category slug:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching posts by category slug:', error)
      return []
    }
  }

  /**
   * Get recommended posts for a given post (based on categories or recent posts)
   */
  static async fetchRecommendedPosts(
    currentPostId: string,
    limit: number = 2
  ): Promise<PostWithCategories[]> {
    if (!isSupabaseConfigured()) {
      const currentPost = demoPosts.find(post => post.id === currentPostId)
      const categoryIds = currentPost?.post_categories?.map(pc => pc.category_id) || []
      let relatedPosts: PostWithCategories[] = []
      if (categoryIds.length > 0) {
        relatedPosts = demoPosts.filter(post =>
          post.id !== currentPostId &&
          post.post_categories?.some(pc => categoryIds.includes(pc.category_id))
        )
      }
      const sortedRelated = sortPostsByDate(relatedPosts)
      if (sortedRelated.length >= limit) {
        return sortedRelated.slice(0, limit)
      }
      const needed = limit - sortedRelated.length
      const latest = sortPostsByDate(
        demoPosts.filter(post => post.id !== currentPostId && post.visibility === 'PUBLIC')
      )
      const combined = [...sortedRelated, ...latest]
      const seen = new Set<string>()
      return combined.filter(post => {
        if (seen.has(post.id)) return false
        seen.add(post.id)
        return true
      }).slice(0, limit)
    }
    try {
      const supabase = createClient()
      
      // First, get the current post to find its categories
      const { data: currentPost, error: currentPostError } = await supabase
        .from('posts')
        .select(`
          id,
          post_categories (
            category_id
          )
        `)
        .eq('id', currentPostId)
        .single()
      
      if (currentPostError) {
        console.error('Error fetching current post for recommendations:', currentPostError)
        // Fallback to recent posts
        return this.fetchLatestPosts(limit, currentPostId)
      }
      
      const categoryIds = currentPost?.post_categories?.map((pc: any) => pc.category_id) || []
      
      if (categoryIds.length > 0) {
        // Get related post IDs from the same categories
        const { data: relatedPostIds, error: relatedIdsError } = await supabase
          .from('post_categories')
          .select('post_id')
          .in('category_id', categoryIds)
          .neq('post_id', currentPostId)
        
        if (relatedIdsError) {
          console.error('Error fetching related post IDs:', relatedIdsError)
          return this.fetchLatestPosts(limit, currentPostId)
        }
        
        const postIds = relatedPostIds?.map(item => item.post_id) || []
        
        if (postIds.length > 0) {
          // Get the actual posts
          const { data: relatedPosts, error: relatedError } = await supabase
            .from('posts')
            .select(`
              *,
              post_categories (
                id,
                categories (
                  id,
                  name
                )
              )
            `)
            .eq('visibility', 'PUBLIC')
            .in('id', postIds)
            .order('created_at', { ascending: false })
            .limit(limit)
          
          if (relatedError) {
            console.error('Error fetching related posts:', relatedError)
            return this.fetchLatestPosts(limit, currentPostId)
          }
          
          if (relatedPosts && relatedPosts.length >= limit) {
            return relatedPosts
          }
          
          // If we don't have enough related posts, fill with recent posts
          const needed = limit - (relatedPosts?.length || 0)
          const recentPosts = await this.fetchLatestPosts(needed, currentPostId)
          
          // Combine and deduplicate
          const combinedPosts = [...(relatedPosts || []), ...recentPosts]
          const seenIds = new Set<string>()
          const uniquePosts = combinedPosts.filter(post => {
            if (seenIds.has(post.id)) {
              return false
            }
            seenIds.add(post.id)
            return true
          })
          
          return uniquePosts.slice(0, limit)
        }
      }
      
      // No categories or no related posts, just return recent posts
      return this.fetchLatestPosts(limit, currentPostId)
    } catch (error) {
      console.error('Error fetching recommended posts:', error)
      return this.fetchLatestPosts(limit, currentPostId)
    }
  }

  /**
   * Get latest posts excluding a specific post ID
   */
  static async fetchLatestPosts(
    limit: number = 2,
    excludePostId?: string
  ): Promise<PostWithCategories[]> {
    if (!isSupabaseConfigured()) {
      const filtered = demoPosts.filter(post => post.visibility === 'PUBLIC' && post.id !== excludePostId)
      return sortPostsByDate(filtered).slice(0, limit)
    }
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            categories (
              id,
              name
            )
          )
        `)
        .eq('visibility', 'PUBLIC')
        .order('created_at', { ascending: false })
        .limit(limit + (excludePostId ? 1 : 0)) // Get one extra in case we need to exclude
      
      if (excludePostId) {
        query = query.neq('id', excludePostId)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching latest posts:', error)
        return []
      }
      
      return (data || []).slice(0, limit)
    } catch (error) {
      console.error('Error fetching latest posts:', error)
      return []
    }
  }

  /**
   * Get posts including those without categories (for public display) with pagination support
   * This method ensures posts without categories are also visible and supports efficient pagination
   */
  static async fetchPostsIncludingUncategorizedWithPagination(
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL', 
    selectedCategoryId: string | null = null,
    limit: number = 6,
    offset: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    if (!isSupabaseConfigured()) {
      const filtered = filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), selectedCategoryId)
      const sorted = sortPostsByDate(filtered, sortOrder)
      return paginatePosts(sorted, limit, offset)
    }
    try {
      const supabase = createClient()
      
      if (selectedCategoryId === 'uncategorized') {
        // If filtering for uncategorized posts, use the specific method
        return this.fetchUncategorizedPostsWithPagination(visibility, limit, offset, sortOrder);
      } else if (selectedCategoryId) {
        // If filtering by category, use inner join to only get posts with that category
        let query = supabase
          .from('posts')
          .select(`
            *,
            post_categories!inner (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `, { count: 'exact' })
          .eq('post_categories.category_id', selectedCategoryId)
          .order('created_at', { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1)
        
        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
        
        const { data, error, count } = await query
        
        if (error) {
          console.error('Error fetching categorized posts:', error)
          return { posts: [], totalCount: 0, hasMore: false }
        }
        
        return { 
          posts: data || [], 
          totalCount: count || 0,
          hasMore: (count || 0) > offset + limit
        }
      } else {
        // If not filtering by category, get all posts (including those without categories)
        let query = supabase
          .from('posts')
          .select(`
            *,
            post_categories (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `, { count: 'exact' })
          .order('created_at', { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1)
        
        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
        
        const { data, error, count } = await query
        
        if (error) {
          console.error('Error fetching all posts including uncategorized:', error)
          return { posts: [], totalCount: 0, hasMore: false }
        }
        
        return { 
          posts: data || [], 
          totalCount: count || 0,
          hasMore: (count || 0) > offset + limit
        }
      }
    } catch (error) {
      console.error('Error fetching posts including uncategorized:', error)
      return { posts: [], totalCount: 0, hasMore: false }
    }
  }

  /**
   * Search posts with pagination support
   */
  static async searchPostsWithPagination(
    searchTerm: string,
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL' = 'PUBLIC',
    selectedCategoryId: string | null = null,
    limit: number = 6,
    offset: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    if (!isSupabaseConfigured()) {
      const filtered = filterPostsBySearch(
        filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), selectedCategoryId),
        searchTerm.trim()
      )
      const sorted = sortPostsByDate(filtered, sortOrder)
      return paginatePosts(sorted, limit, offset)
    }
    try {
      const supabase = createClient()
      
      if (!searchTerm.trim()) {
        // If no search term, fall back to regular fetch
        if (selectedCategoryId === 'uncategorized') {
          return this.fetchUncategorizedPostsWithPagination(visibility, limit, offset, sortOrder);
        }
        return this.fetchPostsIncludingUncategorizedWithPagination(
          visibility, selectedCategoryId, limit, offset, sortOrder
        );
      }

      // Handle uncategorized posts search
      if (selectedCategoryId === 'uncategorized') {
        // First, get all post IDs that have categories
        const { data: categorizedPostIds } = await supabase
          .from('post_categories')
          .select('post_id')
        
        const categorizedIds = categorizedPostIds?.map(pc => pc.post_id) || []
        
        // Search in uncategorized posts only
        let query = supabase
          .from('posts')
          .select(`
            *,
            post_categories (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `, { count: 'exact' })
          .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1)

        // Exclude posts that have categories
        if (categorizedIds.length > 0) {
          query = query.not('id', 'in', `(${categorizedIds.join(',')})`)
        }

        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }

        const { data, error, count } = await query

        if (error) {
          console.error('Error searching uncategorized posts:', error)
          return { posts: [], totalCount: 0, hasMore: false }
        }

        return { 
          posts: data || [], 
          totalCount: count || 0,
          hasMore: (count || 0) > offset + limit
        }
      }

      // Build the base query with search
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            visibility,
            categories (
              id,
              name
            )
          )
        `, { count: 'exact' })
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      // Add visibility filter
      if (visibility !== 'ALL') {
        query = query.eq('visibility', visibility)
      }

      // Add category filter if specified
      if (selectedCategoryId) {
        // For category filtering with search, we need a different approach
        query = supabase
          .from('posts')
          .select(`
            *,
            post_categories!inner (
              id,
              visibility,
              categories (
                id,
                name
              )
            )
          `, { count: 'exact' })
          .eq('post_categories.category_id', selectedCategoryId)
          .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1)

        if (visibility !== 'ALL') {
          query = query.eq('visibility', visibility)
        }
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Error searching posts:', error)
        return { posts: [], totalCount: 0, hasMore: false }
      }

      return { 
        posts: data || [], 
        totalCount: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      return { posts: [], totalCount: 0, hasMore: false }
    }
  }

  /**
   * Get only uncategorized posts (posts without any categories) with pagination support
   */
  static async fetchUncategorizedPostsWithPagination(
    visibility: 'PUBLIC' | 'PRIVATE' | 'ALL' = 'PUBLIC',
    limit: number = 6,
    offset: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    if (!isSupabaseConfigured()) {
      const filtered = filterPostsByCategory(filterPostsByVisibility(demoPosts, visibility), 'uncategorized')
      const sorted = sortPostsByDate(filtered, sortOrder)
      return paginatePosts(sorted, limit, offset)
    }
    try {
      const supabase = createClient()
      
      // First, get all post IDs that have categories
      const { data: categorizedPostIds } = await supabase
        .from('post_categories')
        .select('post_id')
      
      const categorizedIds = categorizedPostIds?.map(pc => pc.post_id) || []
      
      // Then get posts that are NOT in the categorized list
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            id,
            visibility,
            categories (
              id,
              name
            )
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      // Exclude posts that have categories
      if (categorizedIds.length > 0) {
        query = query.not('id', 'in', `(${categorizedIds.join(',')})`)
      }

      if (visibility !== 'ALL') {
        query = query.eq('visibility', visibility)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching uncategorized posts:', error)
        return { posts: [], totalCount: 0, hasMore: false }
      }

      return { 
        posts: data || [], 
        totalCount: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error fetching uncategorized posts:', error)
      return { posts: [], totalCount: 0, hasMore: false }
    }
  }

  /**
   * Authors Management Methods
   */

  /**
   * Get all authors
   */
  static async fetchAuthors() {
    if (!isSupabaseConfigured()) {
      return [...demoAuthors].sort((a, b) => a.name.localeCompare(b.name))
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        console.error('Error fetching authors:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching authors:', error)
      return []
    }
  }

  /**
   * Create a new author
   */
  static async createAuthor(author: Omit<Author, 'id' | 'created_at' | 'updated_at'>) {
    if (!isSupabaseConfigured()) {
      const newAuthor: Author = {
        id: `demo-author-${Date.now()}`,
        name: author.name,
        role: author.role ?? null,
        description: author.description ?? null,
        profile_picture_url: author.profile_picture_url ?? demoProfileImage,
        email: author.email ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      demoAuthors = [...demoAuthors, newAuthor]
      return newAuthor
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('authors')
        .insert([author])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating author:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error creating author:', error)
      throw error
    }
  }

  /**
   * Update an existing author
   */
  static async updateAuthor(id: string, updates: Partial<Omit<Author, 'id' | 'created_at' | 'updated_at'>>) {
    if (!isSupabaseConfigured()) {
      const author = demoAuthors.find(item => item.id === id)
      if (!author) {
        throw new Error('Author not found')
      }
      const updatedAuthor = {
        ...author,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      demoAuthors = demoAuthors.map(item => (item.id === id ? updatedAuthor : item))
      updateDemoAuthorReferences(id, updatedAuthor)
      return updatedAuthor
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('authors')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating author:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error updating author:', error)
      throw error
    }
  }

  /**
   * Delete an author
   */
  static async deleteAuthor(id: string) {
    if (!isSupabaseConfigured()) {
      demoAuthors = demoAuthors.filter(author => author.id !== id)
      demoPosts = demoPosts.map(post => {
        if (!post.author_data || post.author_data.id !== id) return post
        return { ...post, author_data: undefined }
      })
      return true
    }
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting author:', error)
        throw error
      }
      
      return true
    } catch (error) {
      console.error('Error deleting author:', error)
      throw error
    }
  }

  /**
   * Get author by ID
   */
  static async getAuthorById(id: string) {
    if (!isSupabaseConfigured()) {
      return demoAuthors.find(author => author.id === id) || null
    }
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching author:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error fetching author:', error)
      return null
    }
  }
}
