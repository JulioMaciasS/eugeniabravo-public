'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window { 
    dataLayer: any[]
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
const GA_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GA === 'true' && Boolean(GA_MEASUREMENT_ID)

export default function ClientAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_ENABLED) return
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}
