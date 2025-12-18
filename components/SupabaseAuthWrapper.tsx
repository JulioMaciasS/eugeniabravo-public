'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SupabaseAuthWrapperProps {
  children: React.ReactNode
}

export default function SupabaseAuthWrapper({ children }: SupabaseAuthWrapperProps) {
  const { user, loading, getMFAFactors, session, getAALLevel } = useAuth()
  const router = useRouter()
  const [mfaStatus, setMfaStatus] = useState<'checking' | 'required' | 'verified' | 'none'>('checking')

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (!user || !session) {
        setMfaStatus('none')
        return
      }

      try {
        const { data: factors, error } = await getMFAFactors()
        if (error) {
          console.error('Error getting MFA factors:', error)
          setMfaStatus('none')
          return
        }

        const verifiedFactors = factors?.all?.filter(f => f.status === 'verified') || []

        if (verifiedFactors.length === 0) {
          // No MFA required
          setMfaStatus('none')
          return
        }

        // Check AAL level using Supabase's reliable API
        const { aal, error: aalError } = await getAALLevel()
        if (aalError) {
          console.error('Error getting AAL level:', aalError)
          setMfaStatus('none')
          return
        }

        if (aal === 'aal2') {
          setMfaStatus('verified')
        } else {
          setMfaStatus('required')
        }

      } catch (error) {
        console.error('❌ Exception checking MFA status:', error)
        setMfaStatus('none')
      }
    }

    checkMFAStatus()
  }, [user, session, getMFAFactors, getAALLevel])

  // Handle MFA requirement
  useEffect(() => {
    if (mfaStatus === 'required') {
      const currentPath = window.location.pathname
      if (!currentPath.startsWith('/mfa-challenge') && !currentPath.startsWith('/mfa-debug')) {
        router.push('/mfa-challenge')
      }
    }
  }, [mfaStatus, router])

  // Loading states
  if (loading || mfaStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Panel de Administración
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Inicia sesión para acceder al panel
            </p>
          </div>
          <Auth
            supabaseClient={createClient()}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1f2937',
                    brandAccent: '#374151',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Iniciar sesión',
                  loading_button_label: 'Iniciando sesión...',
                  social_provider_text: 'Iniciar sesión con {{provider}}',
                  link_text: '¿Ya tienes una cuenta? Inicia sesión',
                },
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Registrarse',
                  loading_button_label: 'Registrándose...',
                  social_provider_text: 'Registrarse con {{provider}}',
                  link_text: '¿No tienes una cuenta? Regístrate',
                },
                forgotten_password: {
                  email_label: 'Correo electrónico',
                  button_label: 'Enviar instrucciones',
                  loading_button_label: 'Enviando instrucciones...',
                  link_text: '¿Olvidaste tu contraseña?',
                },
              },
            }}
          />
        </div>
      </div>
    )
  }

  // MFA required but not verified - will be handled by redirect effect
  if (mfaStatus === 'required') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to MFA verification...</p>
        </div>
      </div>
    )
  }

  // User authenticated and MFA verified (or not required)
  return <>{children}</>
}

// Import statements needed at the top
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/app/lib/supabase'
