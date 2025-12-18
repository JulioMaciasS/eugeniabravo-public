"use client"

import { useState } from 'react'
import { Copy, Check, Facebook, X, Linkedin, Mail, Share } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
  excerpt?: string
}

export default function ShareButton({ title, url, excerpt }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const shareText = excerpt || title
  
  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          '_blank',
          'width=600,height=400'
        )
      }
    },
    {
      name: 'X (Twitter)',
      icon: X,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
          '_blank',
          'width=600,height=400'
        )
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
          '_blank',
          'width=600,height=400'
        )
      }
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`
      }
    }
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-[#009483] text-white font-medium rounded-lg hover:bg-[#007a6b] transition-colors"
        aria-label="Compartir artículo"
      >
        <Share className="h-4 w-4 mr-2" />
        Compartir
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Compartir artículo
              </h3>
              
              {/* Social media options */}
              <div className="space-y-1 mb-3">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.name}
                      onClick={() => {
                        option.action()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {option.name}
                    </button>
                  )
                })}
                
                {/* Native share (Others) - if available */}
                {typeof window !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Share className="h-4 w-4 mr-3" />
                    Otros...
                  </button>
                )}
              </div>
              
              {/* Copy link */}
              <div className="border-t pt-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-3 text-green-600" />
                      <span className="text-green-600">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-3" />
                      Copiar enlace
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
