/** @type {import('next').NextConfig} */
const supabaseAssetsHost = process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME || 'your-project.supabase.co'

const nextConfig = {
  // Server external packages (moved from experimental in Next.js 15+)
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Image optimization with remotePatterns (replaces deprecated domains)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseAssetsHost,
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Redirects for SEO - force canonical domain
  async redirects() {
    return [
      // Redirect non-www to www (if using www as canonical)
      // Note: This is typically handled at the hosting/CDN level (Vercel, Netlify, etc.)
      // but including here as a fallback
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'eugeniabravodemo.com',
          },
        ],
        destination: 'https://www.eugeniabravodemo.com/:path*',
        permanent: true,
      },
    ]
  },
  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
