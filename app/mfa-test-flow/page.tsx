'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/lib/supabase'
import { useState } from 'react'

export default function MFATestPage() {
  const { user, getMFAFactors, getAALLevel } = useAuth()
  const [testCode, setTestCode] = useState('')
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testMFAFlow = async () => {
    if (!user || !testCode) {
      setTestResult('Please enter a test code')
      return
    }

    setLoading(true)
    setTestResult('Testing MFA flow...\n')

    try {
      // Step 1: Get MFA factors
      const { data: factors, error: factorsError } = await getMFAFactors()
      if (factorsError) {
        setTestResult(prev => prev + `❌ Error getting factors: ${factorsError.message}\n`)
        return
      }

      const verifiedFactors = factors?.all?.filter(f => f.status === 'verified') || []
      if (verifiedFactors.length === 0) {
        setTestResult(prev => prev + `❌ No verified MFA factors found\n`)
        return
      }

      const factor = verifiedFactors[0]
      setTestResult(prev => prev + `✅ Found verified factor: ${factor.id}\n`)

      // Step 2: Create challenge
      setTestResult(prev => prev + `🎯 Creating MFA challenge...\n`)
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id })
      
      if (challengeError) {
        setTestResult(prev => prev + `❌ Challenge error: ${challengeError.message}\n`)
        return
      }

      setTestResult(prev => prev + `✅ Challenge created: ${challenge.id}\n`)

      // Step 3: Get session before verification
      const { data: { session: beforeSession } } = await supabase.auth.getSession()
      const beforeAal = (beforeSession as any)?.aal
      
      // Also check using Supabase's built-in AAL API
      const { aal: beforeAALApi, error: aalError } = await getAALLevel()
      
      setTestResult(prev => prev + `📊 AAL before verification (session): ${beforeAal || 'undefined'}\n`)
      setTestResult(prev => prev + `📊 AAL before verification (API): ${beforeAALApi || 'undefined'}\n`)
      if (aalError) {
        setTestResult(prev => prev + `⚠️ AAL API error: ${aalError.message}\n`)
      }

      // Step 4: Verify with test code
      setTestResult(prev => prev + `🔐 Verifying with code: ${testCode}...\n`)
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({ 
        factorId: factor.id, 
        challengeId: challenge.id, 
        code: testCode 
      })

      if (verifyError) {
        setTestResult(prev => prev + `❌ Verification error: ${verifyError.message}\n`)
        return
      }

      setTestResult(prev => prev + `✅ Verification successful!\n`)

      // Step 5: Check session immediately after verification
      const { data: { session: afterSession } } = await supabase.auth.getSession()
      const afterAal = (afterSession as any)?.aal
      
      // Check using API as well
      const { aal: afterAALApi } = await getAALLevel()
      
      setTestResult(prev => prev + `📊 AAL immediately after verification (session): ${afterAal || 'undefined'}\n`)
      setTestResult(prev => prev + `📊 AAL immediately after verification (API): ${afterAALApi || 'undefined'}\n`)

      // Step 6: Try refresh session
      setTestResult(prev => prev + `🔄 Refreshing session...\n`)
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
      
      let refreshedAALApi = 'undefined'
      if (refreshError) {
        setTestResult(prev => prev + `❌ Refresh error: ${refreshError.message}\n`)
      } else {
        const refreshedAal = (refreshedSession as any)?.aal
        const { aal: refreshedAALApiResult } = await getAALLevel()
        refreshedAALApi = refreshedAALApiResult || 'undefined'
        setTestResult(prev => prev + `📊 AAL after refresh (session): ${refreshedAal || 'undefined'}\n`)
        setTestResult(prev => prev + `📊 AAL after refresh (API): ${refreshedAALApi}\n`)
      }

      // Step 7: Wait and check again
      setTestResult(prev => prev + `⏳ Waiting 2 seconds and checking again...\n`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { data: { session: finalSession } } = await supabase.auth.getSession()
      const finalAal = (finalSession as any)?.aal
      const { aal: finalAALApi } = await getAALLevel()
      
      setTestResult(prev => prev + `📊 Final AAL check (session): ${finalAal || 'undefined'}\n`)
      setTestResult(prev => prev + `📊 Final AAL check (API): ${finalAALApi || 'undefined'}\n`)

      // Summary
      setTestResult(prev => prev + `\n🏁 SUMMARY:\n`)
      setTestResult(prev => prev + `Before (session): ${beforeAal || 'undefined'} | (API): ${beforeAALApi || 'undefined'}\n`)
      setTestResult(prev => prev + `After (session): ${afterAal || 'undefined'} | (API): ${afterAALApi || 'undefined'}\n`)
      setTestResult(prev => prev + `Refreshed (session): ${(refreshedSession as any)?.aal || 'undefined'} | (API): ${refreshedAALApi}\n`)
      setTestResult(prev => prev + `Final (session): ${finalAal || 'undefined'} | (API): ${finalAALApi || 'undefined'}\n`)

      if (finalAal === 'aal2' || finalAALApi === 'aal2') {
        setTestResult(prev => prev + `\n🎉 SUCCESS: AAL2 achieved through ${finalAal === 'aal2' ? 'session' : 'API'}!\n`)
      } else {
        setTestResult(prev => prev + `\n❌ ISSUE: AAL2 not achieved via either method. This confirms a Supabase configuration problem.\n`)
        setTestResult(prev => prev + `\n🔧 WORKAROUND: The session-based MFA implementation should still work.\n`)
      }

    } catch (error) {
      setTestResult(prev => prev + `💥 Exception: ${error}\n`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">MFA Flow Test</h1>
        <p>Please log in first at <a href="/admin" className="text-blue-600">/admin</a></p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 MFA Flow Test</h1>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Instructions</h2>
        <p>This will test the complete MFA verification flow to see where the AAL update is failing.</p>
        <p className="text-sm text-gray-600 mt-1">Enter a current 6-digit code from your authenticator app and click Test.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter current 6-digit MFA code:
          </label>
          <input
            type="text"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-32 p-2 border rounded text-center text-lg tracking-wider"
            maxLength={6}
          />
        </div>

        <button
          onClick={testMFAFlow}
          disabled={loading || testCode.length !== 6}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test MFA Flow'}
        </button>

        {testResult && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
