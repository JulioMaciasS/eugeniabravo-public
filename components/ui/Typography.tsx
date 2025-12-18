import React from 'react'
import { typography, TypographyCategory } from '@/utils/typography'

interface TypographyProps {
  variant: string
  category: TypographyCategory
  as?: keyof JSX.IntrinsicElements
  className?: string
  children: React.ReactNode
}

/**
 * Typography component for consistent text styling across the application
 * 
 * @example
 * <Typography variant="main" category="blogTitle" as="h1">
 *   Blog Post Title
 * </Typography>
 * 
 * @example
 * <Typography variant="primary" category="sectionHeading" as="h2">
 *   Section Heading
 * </Typography>
 */
export default function Typography({ 
  variant, 
  category, 
  as: Component = 'div', 
  className = '', 
  children 
}: TypographyProps) {
  const categoryStyles = typography[category] as Record<string, string>
  const baseStyles = categoryStyles[variant] || ''
  const combinedStyles = `${baseStyles} ${className}`.trim()

  return (
    <Component className={combinedStyles}>
      {children}
    </Component>
  )
}

// Convenience components for common heading levels
export function H1({ variant = 'public', className = '', children, ...props }: Omit<TypographyProps, 'category' | 'as'> & { variant?: keyof typeof typography.pageTitle }) {
  return (
    <Typography 
      category="pageTitle" 
      variant={variant} 
      as="h1" 
      className={className}
      {...props}
    >
      {children}
    </Typography>
  )
}

export function H2({ variant = 'primary', className = '', children, ...props }: Omit<TypographyProps, 'category' | 'as'> & { variant?: keyof typeof typography.sectionHeading }) {
  return (
    <Typography 
      category="sectionHeading" 
      variant={variant} 
      as="h2" 
      className={className}
      {...props}
    >
      {children}
    </Typography>
  )
}

export function H3({ variant = 'primary', className = '', children, ...props }: Omit<TypographyProps, 'category' | 'as'> & { variant?: keyof typeof typography.subsectionHeading }) {
  return (
    <Typography 
      category="subsectionHeading" 
      variant={variant} 
      as="h3" 
      className={className}
      {...props}
    >
      {children}
    </Typography>
  )
}

export function BlogTitle({ variant = 'main', className = '', children, ...props }: Omit<TypographyProps, 'category' | 'as'> & { variant?: keyof typeof typography.blogTitle }) {
  return (
    <Typography 
      category="blogTitle" 
      variant={variant} 
      as="h1" 
      className={className}
      {...props}
    >
      {children}
    </Typography>
  )
}

export function BodyText({ variant = 'primary', className = '', children, ...props }: Omit<TypographyProps, 'category' | 'as'> & { variant?: keyof typeof typography.body }) {
  return (
    <Typography 
      category="body" 
      variant={variant} 
      as="p" 
      className={className}
      {...props}
    >
      {children}
    </Typography>
  )
}
