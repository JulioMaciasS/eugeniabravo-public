'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import QRCode from 'qrcode'

export default function MFASetup() {
  const { enrollMFA, verifyMFA, getMFAFactors, unenrollMFA, challengeMFA, user } = useAuth()
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [factorId, setFactorId] = useState<string>('')
  const [challengeId, setChallengeId] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [factors, setFactors] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    checkExistingFactors()
  }, [])
  const checkExistingFactors = async () => {
    const { data: factors, error } = await getMFAFactors()
    if (!error && factors) {
      const allFactors = factors.all || []
      // Only consider verified factors as enrolled
      const verifiedFactors = allFactors.filter(factor => factor.status === 'verified')
      setFactors(verifiedFactors)
      setIsEnrolled(verifiedFactors.length > 0)
    }
  }

  const cleanupUnverifiedFactors = async () => {
    const { data: factors, error } = await getMFAFactors()
    if (!error && factors) {
      const unverifiedFactors = factors.all?.filter(factor => factor.status === 'unverified') || []
      
      // Remove any unverified factors
      for (const factor of unverifiedFactors) {
        try {
          await unenrollMFA(factor.id)
          console.log('Cleaned up unverified factor:', factor.id)
        } catch (cleanupError) {
          console.warn('Failed to cleanup unverified factor:', cleanupError)
        }
      }
    }
  }

  const handleEnrollMFA = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      // First, clean up any existing unverified factors
      await cleanupUnverifiedFactors()
      
      const { data, error } = await enrollMFA()
      
      if (error) {
        console.error('MFA enrollment error:', error)
        const errorMsg = error.message || 'Error setting up 2FA'
        setErrorMessage(errorMsg)
        return
      }      if (data) {
        setFactorId(data.id)
        // Check if this is a TOTP factor
        if (data.type === 'totp' && 'totp' in data) {
          setSecret(data.totp?.secret || '')
          
          // Generate QR code with error handling
          const qrCodeUrl = data.totp?.qr_code || ''
          const secret = data.totp?.secret || ''
          
          if (qrCodeUrl && secret) {
            try {
              // First, try with the original URI
              const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
                errorCorrectionLevel: 'L',
                margin: 1,
                width: 256
              })
              setQrCode(qrCodeDataUrl)
              console.log('QR code generated successfully')
            } catch (qrError) {
              console.warn('Original QR code too large, creating simplified version:', qrError)
              
              try {
                // Create a simpler TOTP URI if the original is too long
                const issuer = 'EugeniaBravoDemo'
                const accountName = user?.email || 'admin@eugeniabravodemo.com'
                const simplifiedUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
                
                const simplifiedQrCode = await QRCode.toDataURL(simplifiedUri, {
                  errorCorrectionLevel: 'L',
                  margin: 1,
                  width: 256
                })
                setQrCode(simplifiedQrCode)
                console.log('Simplified QR code generated successfully')
              } catch (simplifiedError) {
                console.warn('Even simplified QR code failed, will show manual setup only:', simplifiedError)
                setQrCode('')
              }
            }
          } else {
            console.warn('Missing QR code URL or secret in enrollment response')
          }
        } else {
          console.error('Unexpected enrollment response format:', data)
        }
      }
    } catch (error) {
      console.error('MFA enrollment exception:', error)
      setErrorMessage('Error setting up 2FA. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyMFA = async () => {
    if (!factorId || !verificationCode) {
      setErrorMessage('Please enter the verification code')
      return
    }

    setLoading(true)
    setErrorMessage('')
    try {
      // For enrollment, we need to first create a challenge, then verify it
      const { data: challengeData, error: challengeError } = await challengeMFA(factorId)
      
      if (challengeError) {
        console.error('MFA challenge error:', challengeError)
        alert('Error creating verification challenge. Please try again.')
        return
      }

      if (!challengeData?.id) {
        alert('Error creating verification challenge. Please try again.')
        return
      }

      // Now verify with the challenge ID
      const { data, error } = await verifyMFA(factorId, challengeData.id, verificationCode)
      
      if (error) {
        console.error('MFA verification error:', error)
        alert('Invalid verification code. Please try again.')
        setVerificationCode('')
        return
      }

      alert('2FA setup completed successfully!')
      setIsEnrolled(true)
      await checkExistingFactors()
      
      // Reset form
      setQrCode('')
      setSecret('')
      setFactorId('')
      setVerificationCode('')
      setChallengeId('')
    } catch (error) {
      console.error('MFA verification exception:', error)
      alert('Error verifying code. Please try again.')
      setVerificationCode('')
    } finally {
      setLoading(false)
    }
  }
  const handleUnenrollMFA = async (factorId: string) => {
    if (!confirm('Are you sure you want to disable 2FA?')) return

    setLoading(true)
    try {
      // First, we need to create a challenge to verify MFA before unenrolling
      const { data: challengeData, error: challengeError } = await challengeMFA(factorId)
      
      if (challengeError) {
        console.error('MFA challenge error for unenrollment:', challengeError)
        alert('Error creating verification challenge for disabling 2FA. Please try again.')
        return
      }

      if (!challengeData?.id) {
        alert('Error creating verification challenge. Please try again.')
        return
      }

      // Prompt user for verification code
      const verificationCode = prompt('Enter your 6-digit verification code to disable 2FA:')
      if (!verificationCode || verificationCode.length !== 6) {
        alert('Please enter a valid 6-digit verification code')
        return
      }

      // Verify the MFA to achieve AAL2
      const { data: verifyData, error: verifyError } = await verifyMFA(factorId, challengeData.id, verificationCode)
      
      if (verifyError) {
        console.error('MFA verification error for unenrollment:', verifyError)
        alert('Invalid verification code. Please try again.')
        return
      }

      // Now we can unenroll with AAL2
      const { error } = await unenrollMFA(factorId)
      
      if (error) {
        console.error('MFA unenrollment error:', error)
        alert('Error disabling 2FA: ' + error.message)
        return
      }

      alert('2FA disabled successfully')
      setIsEnrolled(false)
      await checkExistingFactors()
    } catch (error) {
      console.error('MFA unenrollment exception:', error)
      alert('Error disabling 2FA')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSetup = async () => {
    if (factorId) {
      setLoading(true)
      try {
        // Remove the unverified factor
        await unenrollMFA(factorId)
      } catch (error) {
        console.warn('Error cleaning up during cancel:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Reset the setup state
    setQrCode('')
    setSecret('')
    setFactorId('')
    setVerificationCode('')
    setChallengeId('')
  }

  if (isEnrolled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            2FA is enabled for your account
          </div>
          
          {factors.map((factor) => (
            <div key={factor.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <span className="font-medium">TOTP Authenticator</span>
                <span className="text-sm text-gray-500 ml-2">
                  (Status: {factor.status})
                </span>
              </div>
              <button
                onClick={() => handleUnenrollMFA(factor.id)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Disable
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Set up Two-Factor Authentication</h3>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      {!secret ? (
        <div>
          <p className="text-gray-600 mb-4">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <button
            onClick={handleEnrollMFA}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Enable 2FA'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {qrCode && (
            <div>
              <h4 className="font-medium mb-2">1. Scan QR Code</h4>
              <p className="text-sm text-gray-600 mb-3">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <img src={qrCode} alt="QR Code" className="border rounded" />
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-2">{qrCode ? '2. Or enter this secret manually:' : '1. Enter this secret in your authenticator app:'}</h4>
            <p className="text-sm text-gray-600 mb-2">
              Open your authenticator app and add a new account manually using this secret:
            </p>
            <div className="bg-gray-100 p-3 rounded border">
              <div className="font-mono text-sm break-all">{secret}</div>
              <button
                onClick={() => navigator.clipboard?.writeText(secret)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{qrCode ? '3.' : '2.'} Enter verification code:</h4>
            <p className="text-sm text-gray-600 mb-2">
              Enter the 6-digit code from your authenticator app:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
          </div>
            <div className="space-y-2">
            <button
              onClick={handleVerifyMFA}
              disabled={loading || !verificationCode}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
            </button>
            
            <button
              onClick={handleCancelSetup}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel Setup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
