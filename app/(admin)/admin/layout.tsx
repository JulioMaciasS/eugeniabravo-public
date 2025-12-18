'use client';

import React from 'react';
import SidebarNav from '@/components/admin/layout/SidebarNav';
import SupabaseAuthWrapper from '@/components/SupabaseAuthWrapper';

function ArgEspacioLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthWrapper>
      <div className="min-h-[calc(100vh-80px)] flex">
        
        {/* Sidebar - hover to expand */}
        <SidebarNav />

        {/* Main content - always accounts for collapsed sidebar */}
        <main className="flex-1 ml-16 transition-all duration-300">
          {children}
        </main>

      </div>
    </SupabaseAuthWrapper>
  );
}

// Export the layout
export default ArgEspacioLayout;