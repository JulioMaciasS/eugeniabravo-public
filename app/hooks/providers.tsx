// app/providers.tsx
'use client';

import { AuthProvider } from '@/app/contexts/AuthContext';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </AuthProvider>
  );
}