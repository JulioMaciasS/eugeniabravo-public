'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function MFATestPage() {
  const { user, session, getMFAFactors } = useAuth()
  const [factors, setFactors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testMFA = async () => {
      if (user && session) {
        try {
          console.log('🧪 Testing MFA for user:', user.email)
          const { data: factorData, error } = await getMFAFactors()
          
          if (error) {
            console.error('❌ Error getting MFA factors:', error)
          } else {
            console.log('📋 MFA factors:', factorData)
            setFactors(factorData?.all || [])
          }
        } catch (error) {
          console.error('❌ Exception:', error)
        }
      }
      setLoading(false)
    }
    
    testMFA()
  }, [user, session, getMFAFactors])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in first at <a href="/admin" className="text-blue-600">/admin</a></div>
  }

  const verifiedFactors = factors.filter(f => f.status === 'verified')
  const unverifiedFactors = factors.filter(f => f.status === 'unverified')
  const sessionAal = (session as any)?.aal

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 MFA Test Results</h1>
      
      <div className="grid gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">User Info</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Session Info</h2>
          <p><strong>AAL Level:</strong> {sessionAal || 'Not set'}</p>
          <p><strong>Session Valid:</strong> {session ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">MFA Status</h2>
          <p><strong>Total Factors:</strong> {factors.length}</p>
          <p><strong>Verified Factors:</strong> {verifiedFactors.length}</p>
          <p><strong>Unverified Factors:</strong> {unverifiedFactors.length}</p>
        </div>

        {factors.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Factor Details</h2>
            {factors.map((factor, index) => (
              <div key={factor.id} className="mb-2 p-2 border rounded">
                <p><strong>Factor {index + 1}:</strong></p>
                <p>ID: {factor.id}</p>
                <p>Type: {factor.type}</p>
                <p>Status: <span className={factor.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}>{factor.status}</span></p>
              </div>
            ))}
          </div>
        )}

        <div className={`p-4 rounded-lg ${verifiedFactors.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <h2 className="font-semibold mb-2">Expected Behavior</h2>
          {verifiedFactors.length > 0 ? (
            sessionAal === 'aal2' ? (
              <p className="text-green-600">✅ You have MFA enabled and verified (AAL2). You should be able to access admin panel.</p>
            ) : (
              <p className="text-red-600">❌ You have MFA enabled but not verified in this session (AAL1). You should be redirected to MFA challenge.</p>
            )
          ) : (
            <p className="text-blue-600">ℹ️ You don't have MFA enabled. You can access admin panel directly.</p>
          )}
        </div>
      </div>
    </div>
  )
}
