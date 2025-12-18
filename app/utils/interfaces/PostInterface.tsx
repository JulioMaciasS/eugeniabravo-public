export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface Category {
  id: string;
  name: string;
}

export interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    date?: string;
    author?: string;
    categories?: {
      items: PostCategories[] | null;
    } | null;
  }

  export interface PostCategories {
    [x: string]: any;
    category: Category;
  }

  // POSTFORM.tsx
  export default interface PostForm {
    title: string;
    categories: Category[] | undefined;
    excerpt: string;
    content: string;
    image: string;
    date?: string;
    author?: string;
    visibility: Visibility;
  }