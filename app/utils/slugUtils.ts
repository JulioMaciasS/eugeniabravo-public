// Utility functions for generating SEO-friendly slugs

/**
 * Generate a slug from a title string
 * Handles Spanish characters and special cases
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    // Replace Spanish characters
    .replace(/[áàäâ]/gi, 'a')
    .replace(/[éèëê]/gi, 'e')
    .replace(/[íìïî]/gi, 'i')
    .replace(/[óòöô]/gi, 'o')
    .replace(/[úùüû]/gi, 'u')
    .replace(/[ñ]/gi, 'n')
    .replace(/[ç]/gi, 'c')
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 100 characters
    .substring(0, 100)
    // Remove trailing hyphen if we cut off at a hyphen
    .replace(/-$/, '');
}

/**
 * Create a unique slug by checking against existing slugs
 * This would typically be done on the server side
 */
export function createUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 0;
  
  while (existingSlugs.includes(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  
  return slug;
}

/**
 * Validate that a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  // Check that slug only contains lowercase letters, numbers, and hyphens
  // Must not start or end with hyphen
  // Must be between 1 and 100 characters
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return slugRegex.test(slug) && slug.length <= 100;
}

/**
 * Clean and validate a slug, generating a new one if invalid
 */
export function cleanSlug(input: string): string {
  const cleaned = generateSlug(input);
  return isValidSlug(cleaned) ? cleaned : 'articulo';
}

/**
 * Generate a URL-friendly slug from a category name
 */
export function generateCategorySlug(categoryName: string): string {
  return generateSlug(categoryName);
}

/**
 * Convert category slug back to a format suitable for lookup
 * This reverses the slug process for category matching
 */
export function categorySlugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
