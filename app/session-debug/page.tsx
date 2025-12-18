'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/lib/supabase'
import { useEffect, useState } from 'react'

export default function SessionDebugPage() {
  const { user, session, getMFAFactors, refreshSession } = useAuth()
  const [factors, setFactors] = useState<any[]>([])
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadSessionInfo = async () => {
    setLoading(true)
    try {
      if (user && session) {
        // Get MFA factors
        const { data: factorData, error: factorError } = await getMFAFactors()
        if (!factorError && factorData) {
          setFactors(factorData.all || [])
        }

        // Get fresh session
        const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession()
        if (!sessionError && freshSession) {
          setSessionDetails(freshSession)
        }
      }
    } catch (error) {
      console.error('Error loading session info:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSessionInfo()
  }, [user, session])

  const handleRefreshSession = async () => {
    console.log('🔄 Manually refreshing session...')
    await refreshSession()
    await loadSessionInfo()
  }

  const handleClearSessionStorage = () => {
    sessionStorage.removeItem('mfa_just_verified')
    sessionStorage.removeItem('mfa_redirect_count')
    console.log('🧹 Session storage cleared')
  }

  if (loading) {
    return <div className="p-8">Loading session information...</div>
  }

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
        <p>Please log in first at <a href="/admin" className="text-blue-600">/admin</a></p>
      </div>
    )
  }

  const verifiedFactors = factors.filter(f => f.status === 'verified')
  const sessionAal = sessionDetails?.aal
  const redirectCount = sessionStorage.getItem('mfa_redirect_count')
  const mfaJustVerified = sessionStorage.getItem('mfa_just_verified')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Session Debug Information</h1>
      
      <div className="grid gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">User Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Created:</strong> {new Date(user.created_at || '').toLocaleString()}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Session Information</h2>
          <p><strong>AAL Level:</strong> <span className={sessionAal === 'aal2' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{sessionAal || 'undefined'}</span></p>
          <p><strong>Access Token Valid:</strong> {sessionDetails?.access_token ? 'Yes' : 'No'}</p>
          <p><strong>Refresh Token Valid:</strong> {sessionDetails?.refresh_token ? 'Yes' : 'No'}</p>
          <p><strong>Expires At:</strong> {sessionDetails?.expires_at ? new Date(sessionDetails.expires_at * 1000).toLocaleString() : 'Unknown'}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">MFA Status</h2>
          <p><strong>Total Factors:</strong> {factors.length}</p>
          <p><strong>Verified Factors:</strong> <span className="font-bold text-green-600">{verifiedFactors.length}</span></p>
          <p><strong>Expected Behavior:</strong> {verifiedFactors.length > 0 ? 'MFA Required' : 'No MFA Required'}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Session Storage Debug</h2>
          <p><strong>MFA Just Verified Flag:</strong> {mfaJustVerified || 'Not set'}</p>
          <p><strong>Redirect Count:</strong> {redirectCount || '0'}</p>
        </div>

        {verifiedFactors.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">MFA Factor Details</h2>
            {verifiedFactors.map((factor, index) => (
              <div key={factor.id} className="mb-2 p-2 border rounded">
                <p><strong>Factor {index + 1}:</strong></p>
                <p>ID: {factor.id}</p>
                <p>Type: {factor.type}</p>
                <p>Status: <span className="text-green-600 font-bold">{factor.status}</span></p>
                <p>Created: {new Date(factor.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <div className={`p-4 rounded-lg ${sessionAal === 'aal2' ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="font-semibold mb-2">Diagnosis</h2>
          {verifiedFactors.length > 0 ? (
            sessionAal === 'aal2' ? (
              <div>
                <p className="text-green-600 font-bold">✅ WORKING CORRECTLY</p>
                <p>You have MFA enabled and your session shows AAL2. Everything is working as expected.</p>
              </div>
            ) : (
              <div>
                <p className="text-red-600 font-bold">❌ ISSUE DETECTED</p>
                <p>You have verified MFA factors but your session AAL is not aal2. This suggests:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Supabase MFA verification may not be working correctly</li>
                  <li>Session refresh is not updating the AAL level</li>
                  <li>There may be a configuration issue in Supabase</li>
                </ul>
              </div>
            )
          ) : (
            <div>
              <p className="text-blue-600 font-bold">ℹ️ NO MFA CONFIGURED</p>
              <p>You don't have MFA set up, so no verification is required.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={handleRefreshSession}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Session
            </button>
            <button
              onClick={handleClearSessionStorage}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Clear Session Storage
            </button>
            <a
              href="/mfa-challenge"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test MFA Challenge
            </a>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Raw Session Data</h2>
          <pre className="text-xs overflow-auto bg-white p-2 rounded border">
            {JSON.stringify(sessionDetails, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
