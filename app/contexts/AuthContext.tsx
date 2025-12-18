'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { createClient } from '@/app/lib/supabase'
import type { User, Session, AuthMFAEnrollResponse, AuthMFAChallengeResponse, AuthMFAVerifyResponse, AuthMFAListFactorsResponse } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  getAALLevel: () => Promise<{ aal: string | null; error: any }>  // MFA methods
  enrollMFA: () => Promise<AuthMFAEnrollResponse>
  challengeMFA: (factorId: string) => Promise<AuthMFAChallengeResponse>
  verifyMFA: (factorId: string, challengeId: string, code: string) => Promise<AuthMFAVerifyResponse>
  unenrollMFA: (factorId: string) => Promise<{ error: any }>
  getMFAFactors: () => Promise<AuthMFAListFactorsResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Use useMemo to ensure we only create one client instance
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // Empty dependency array since supabase is memoized
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshSession = async () => {
    // First try to refresh the session
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Error refreshing session:', error)
      
      // If refresh fails, try to get the current session
      const { data: { session: currentSession }, error: getError } = await supabase.auth.getSession()
      
      if (!getError && currentSession) {
        setSession(currentSession)
        setUser(currentSession.user)
      }
    } else {
      setSession(session)
      setUser(session?.user ?? null)
    }
  }

  const getAALLevel = async () => {
    try {
      // Use Supabase's built-in method to get AAL level
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) {
        console.error('Error getting AAL level:', error)
        return { aal: null, error }
      }
      return { aal: data?.currentLevel || null, error: null }
    } catch (error) {
      console.error('Exception getting AAL level:', error)
      return { aal: null, error }
    }
  }

  // MFA Methods
  const enrollMFA = async (): Promise<AuthMFAEnrollResponse> => {
    return await supabase.auth.mfa.enroll({ factorType: 'totp' })
  }

  const challengeMFA = async (factorId: string): Promise<AuthMFAChallengeResponse> => {
    return await supabase.auth.mfa.challenge({ factorId })
  }

  const verifyMFA = async (factorId: string, challengeId: string, code: string): Promise<AuthMFAVerifyResponse> => {
    const result = await supabase.auth.mfa.verify({ factorId, challengeId, code })
    
    // If verification is successful, immediately refresh the session to get updated AAL
    if (!result.error && result.data) {
      // Force a session refresh to get the updated AAL level
      const { data: { session: updatedSession }, error: refreshError } = await supabase.auth.refreshSession()
      
      if (!refreshError && updatedSession) {
        setSession(updatedSession)
        setUser(updatedSession.user)
      }
    }
    
    return result
  }

  const unenrollMFA = async (factorId: string) => {
    return await supabase.auth.mfa.unenroll({ factorId })
  }

  const getMFAFactors = async () => {
    return await supabase.auth.mfa.listFactors()
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
    getAALLevel,
    enrollMFA,
    challengeMFA,
    verifyMFA,
    unenrollMFA,
    getMFAFactors,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
