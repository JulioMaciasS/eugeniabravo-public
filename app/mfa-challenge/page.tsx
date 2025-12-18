'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/lib/supabase'

export default function MFAChallengePage() {
  const router = useRouter()
  const { challengeMFA, verifyMFA, getMFAFactors, refreshSession, session } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [factorId, setFactorId] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const supabase = createClient()

  useEffect(() => {
    initMFAChallenge()
  }, [])
  const initMFAChallenge = async () => {
    try {
      // Get user's MFA factors
      const { data: factors, error: factorsError } = await getMFAFactors()
      
      if (factorsError) {
        console.error('Error getting MFA factors:', factorsError)
        alert('Error accessing MFA settings')
        router.push('/admin')
        return
      }
      
      if (!factors || !factors.all || factors.all.length === 0) {
        router.push('/admin')
        return
      }

      // Only use verified factors
      const verifiedFactors = factors.all.filter(factor => factor.status === 'verified')
      if (verifiedFactors.length === 0) {
        router.push('/admin')
        return
      }

      const factor = verifiedFactors[0] // Use first verified factor
      setFactorId(factor.id)

      // Create challenge
      const { data: challenge, error: challengeError } = await challengeMFA(factor.id)
      
      if (challengeError) {
        console.error('Challenge error:', challengeError)
        alert('Error creating MFA challenge: ' + challengeError.message)
        return
      }

      if (challenge) {
        setChallengeId(challenge.id)
      }
    } catch (error) {
      console.error('MFA challenge init error:', error)
      alert('Error initializing MFA challenge')
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code || !factorId || !challengeId) {
      alert('Please enter the verification code')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await verifyMFA(factorId, challengeId, code)
      
      if (error) {
        console.error('MFA verification error:', error)
        alert('Invalid verification code')
        setCode('')
        return
      }

      // Verify AAL level using Supabase's API
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      
      if (aalData?.currentLevel === 'aal2') {
        // Check for returnTo parameter
        const urlParams = new URLSearchParams(window.location.search)
        const returnTo = urlParams.get('returnTo') || '/admin'
        
        window.location.href = returnTo
      } else {
        setTimeout(() => {
          window.location.href = '/admin'
        }, 1000)
      }
    } catch (error) {
      console.error('MFA verification exception:', error)
      alert('Error verifying code')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full p-3 text-center text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 tracking-widest"
              maxLength={6}
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
