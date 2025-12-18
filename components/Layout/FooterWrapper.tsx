"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import PortfolioBanner from './PortfolioBanner';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer completely on admin pages
  const isAdminPage = pathname.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }

  return (
    <>
      <Footer />
      <PortfolioBanner />
    </>
  );
}
