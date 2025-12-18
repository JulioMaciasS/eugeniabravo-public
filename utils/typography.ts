// Typography standards for EugeniaBravoDemo website
// This file defines consistent text styles across the project

export const typography = {
  // Page Titles (Main headings for pages)
  pageTitle: {
    // Used for main page headers like "Artículos", "Contacto", etc. - STANDARDIZED
    public: "text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6",
    admin: "text-3xl font-bold text-navy-900 mb-2",
    hero: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider md:tracking-widest text-white mb-2 mx-auto animate-fade-in-down"
  },

  // Blog Post Titles
  blogTitle: {
    // Main title on blog post page
    main: "text-4xl font-bold text-gray-900 mb-6",
    // Card titles in listings
    card: "text-xl font-semibold text-gray-900 hover:text-[#009483] transition-colors",
    // Error states
    error: "text-2xl font-bold text-gray-900 mb-4"
  },

  // Section Headings (H2)
  sectionHeading: {
    // Main sections within pages
    primary: "text-3xl font-bold text-gray-900 mb-8",
    // Newsletter sections
    newsletter: "text-2xl sm:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6",
    // Admin sections
    admin: "text-2xl font-bold text-navy-900 mb-6",
    // Contact sections
    contact: "text-2xl font-bold text-gray-900 mb-6",
    // Hero subtitle
    heroSubtitle: "text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 px-2 animate-fade-in"
  },

  // Subsection Headings (H3)
  subsectionHeading: {
    // General subsections
    primary: "text-xl font-semibold text-gray-900 mb-4",
    // Large subsections
    large: "text-2xl font-bold text-gray-900 mb-4",
    // Author info
    author: "text-lg font-semibold text-gray-900",
    // Service sections
    service: "text-2xl text-navy-900",
    // Footer sections
    footer: "font-semibold text-lg mb-4 text-[#009483] text-left",
    // Modal/Form headings
    modal: "text-lg font-semibold text-gray-900",
    // Danger actions
    danger: "text-lg font-semibold text-red-900"
  },

  // Small Headings (H4-H6 equivalent)
  smallHeading: {
    // Dashboard cards
    card: "text-sm font-medium text-gray-600 uppercase tracking-wide mb-2",
    // Form labels
    label: "block text-sm font-medium text-gray-700 mb-2",
    // Contact info subsections
    contact: "font-semibold text-gray-900 mb-1"
  },

  // Body Text
  body: {
    // Standard body text
    primary: "text-gray-700 leading-relaxed",
    // Large body text (excerpts, lead paragraphs)
    large: "text-xl text-gray-700 leading-relaxed mb-8",
    // Small text
    small: "text-sm text-gray-600",
    // Extra small text
    xs: "text-xs text-gray-500",
    // Meta information
    meta: "text-sm text-gray-600"
  },

  // Special Text Styles
  special: {
    // Brand name
    brand: "text-2xl font-bold text-white mb-3",
    // Navigation active state
    navActive: "text-[#009483] bg-[#009483]/10 font-bold shadow-sm",
    // Link styles
    link: "text-[#009483] hover:text-[#007a6b] transition-colors",
    // Success messages
    success: "text-green-600",
    // Warning messages
    warning: "text-amber-600",
    // Error messages
    error: "text-red-600"
  },

  // Prose Styles (for blog content)
  prose: {
    // Blog post content styling
    content: `prose prose-lg max-w-none
      prose-headings:text-gray-900 
      prose-headings:font-bold
      prose-p:text-gray-700 
      prose-p:leading-relaxed
      prose-a:text-[#009483] 
      prose-a:no-underline 
      hover:prose-a:text-[#007a6b]
      prose-strong:text-gray-900
      prose-blockquote:border-l-4 
      prose-blockquote:border-[#009483] 
      prose-blockquote:bg-gray-50 
      prose-blockquote:py-2 
      prose-blockquote:px-4
      prose-code:bg-gray-100 
      prose-code:px-2 
      prose-code:py-1 
      prose-code:rounded
      prose-pre:bg-gray-100 
      prose-pre:border
      prose-img:rounded-lg 
      prose-img:shadow-md
      prose-table:table-auto
      prose-th:bg-gray-50`
  }
}

// Helper function to get typography class
export function getTypographyClass(category: keyof typeof typography, variant: string): string {
  const categoryStyles = typography[category] as Record<string, string>
  return categoryStyles[variant] || ""
}

// Type definitions for better TypeScript support
export type TypographyCategory = keyof typeof typography
export type PageTitleVariant = keyof typeof typography.pageTitle
export type BlogTitleVariant = keyof typeof typography.blogTitle
export type SectionHeadingVariant = keyof typeof typography.sectionHeading
export type SubsectionHeadingVariant = keyof typeof typography.subsectionHeading
export type SmallHeadingVariant = keyof typeof typography.smallHeading
export type BodyVariant = keyof typeof typography.body
export type SpecialVariant = keyof typeof typography.special
export type ProseVariant = keyof typeof typography.prose
