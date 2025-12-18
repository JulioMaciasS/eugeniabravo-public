'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window { 
    dataLayer: any[]
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

const GA_MEASUREMENT_ID = 'G-5HSRRWN6Q2'

export default function ClientAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}
