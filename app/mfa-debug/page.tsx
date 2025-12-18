'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function MFADebugPage() {
  const { user, session, getMFAFactors } = useAuth()
  const [factors, setFactors] = useState<any[]>([])
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    const debugMFA = async () => {
      if (user && session) {
        // Get MFA factors
        const { data: factorData, error } = await getMFAFactors()
        if (!error && factorData) {
          setFactors(factorData.all || [])
        }
        
        // Get session info
        setSessionInfo(session)
      }
    }
    
    debugMFA()
  }, [user, session, getMFAFactors])

  if (!user) {
    return <div>Please log in first</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">MFA Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">User Information</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Session Information</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">MFA Factors</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(factors, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Analysis</h2>
          <ul className="space-y-1 text-sm">
            <li><strong>User ID:</strong> {user.id}</li>
            <li><strong>User Email:</strong> {user.email}</li>
            <li><strong>Session AAL:</strong> {(sessionInfo as any)?.aal || 'Not available'}</li>
            <li><strong>Total MFA Factors:</strong> {factors.length}</li>
            <li><strong>Verified Factors:</strong> {factors.filter(f => f.status === 'verified').length}</li>
            <li><strong>Unverified Factors:</strong> {factors.filter(f => f.status === 'unverified').length}</li>
            <li><strong>MFA Required:</strong> {factors.filter(f => f.status === 'verified').length > 0 ? 'Yes' : 'No'}</li>
            <li><strong>Current AAL Level:</strong> {
              (sessionInfo as any)?.aal === 'aal2' ? 'AAL2 (MFA Verified)' :
              (sessionInfo as any)?.aal === 'aal1' ? 'AAL1 (Password Only)' :
              'Unknown'
            }</li>
          </ul>
          
          {factors.filter(f => f.status === 'verified').length > 0 && (sessionInfo as any)?.aal === 'aal1' && (
            <div className="mt-4 p-3 bg-yellow-200 rounded">
              <strong>⚠️ Action Required:</strong> You have MFA enabled but are not verified in this session. 
              You should be redirected to the MFA challenge page.
            </div>
          )}
          
          {factors.filter(f => f.status === 'verified').length > 0 && (sessionInfo as any)?.aal === 'aal2' && (
            <div className="mt-4 p-3 bg-green-200 rounded">
              <strong>✅ All Good:</strong> You have MFA enabled and are properly verified (AAL2).
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
