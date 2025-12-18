import { createClient, Database } from '@/app/lib/supabase'

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

/**
 * Post service that handles all blog post related operations using Supabase
 */
export class SupabasePostService {
  /**
   * Get all categories
   */
  static async fetchCategories() {
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
