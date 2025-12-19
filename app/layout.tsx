// app/layout.tsx
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Providers from './hooks/providers'
import Navbar from '@/components/Layout/Navbar'
import FooterWrapper from '@/components/Layout/FooterWrapper'
import { ChevronUp } from 'lucide-react'
import ScrollToTop from '@/components/ui/ScrollToTop'
import ClientAnalytics from './analytics/ClientAnalytics'

const inter = Inter({ subsets: ['latin'] })
const COOKIE_SCRIPT_ID = process.env.NEXT_PUBLIC_COOKIE_SCRIPT_ID
const ENABLE_COOKIE_SCRIPT = process.env.NEXT_PUBLIC_ENABLE_COOKIE_SCRIPT === 'true' && Boolean(COOKIE_SCRIPT_ID)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const ENABLE_GA = process.env.NEXT_PUBLIC_ENABLE_GA === 'true' && Boolean(GA_MEASUREMENT_ID)

export const metadata = {
  title: 'EugeniaBravoDemo',
  description: 'Abogada Especialista - Navegando por complejos panoramas legales con claridad y precisión',
  icons: {
    icon: [
      { url: '/images/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/images/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/icons/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/images/icons/android-icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/icons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/images/icons/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/images/icons/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/images/icons/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/images/icons/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/images/icons/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/images/icons/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/images/icons/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/images/icons/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/images/icons/apple-icon-180x180.png', sizes: '180x180' },
    ],
    shortcut: '/images/icons/favicon.ico',
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/images/icons/ms-icon-144x144.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />
        {ENABLE_COOKIE_SCRIPT && COOKIE_SCRIPT_ID ? (
          <Script
            src={`https://cdn.cookie-script.com/s/${COOKIE_SCRIPT_ID}.js`}
            strategy="afterInteractive"
          />
        ) : null}
        {ENABLE_GA && GA_MEASUREMENT_ID ? (
          <>
            {/* Load GA after hydration */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className={inter.className}>
        <ClientAnalytics />
        <Providers>
          <div className="min-h-[calc(100vh-80px)] bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 80px)" }}>
                  <main className="min-h-[calc(100vh)] w-full pt-20 bg-white">
              {children}
              </main>
            </div>
            <FooterWrapper />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  )
}
