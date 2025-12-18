export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Category {
  id: string;
  name: string;
}

export interface PostCategory {
  categories: Category;
}

export interface PostWithCategories {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  image?: string | null;
  author: string;
  author_id?: string | null; // Add author_id field
  author_data?: {
    id: string;
    name: string;
    role?: string | null;
    description?: string | null;
    profile_picture_url?: string | null;
    email?: string | null;
  } | null; // Add author data field
  visibility: string;
  created_at: string;
  date?: string;
  slug?: string | null;
  categories?: Category[];
  post_categories?: PostCategory[];
}

export default interface PostForm {
  title: string;
  categories: string[]; // Array of category IDs
  excerpt: string;
  content: string;
  image: string;
  author: string;
  author_id: string; // Add author_id field
  visibility: Visibility;
}
