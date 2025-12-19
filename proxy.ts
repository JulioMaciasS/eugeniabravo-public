import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If user is authenticated, check for MFA requirements
    if (!error && user) {
      // Check if user needs MFA verification
      const { data: { session } } = await supabase.auth.getSession()
      if (session && session.user.aud === 'authenticated') {
        // Check if user has MFA factors enrolled and verified
        const { data: factors } = await supabase.auth.mfa.listFactors()
        
        if (factors && factors.all && factors.all.length > 0) {
          // Only consider verified factors for MFA enforcement
          const verifiedFactors = factors.all.filter(factor => factor.status === 'verified')
          
          if (verifiedFactors.length > 0) {
            // Check the Authentication Assurance Level (AAL) using Supabase's API
            // AAL1 = password only, AAL2 = password + MFA
            const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
            const currentAAL = aalData?.currentLevel
            
            // Redirect to MFA challenge only if:
            // 1. AAL is not aal2
            // 2. User is not already on MFA challenge page
            // 3. User is not on MFA debug page
            if (currentAAL !== 'aal2' && 
                !request.nextUrl.pathname.startsWith('/mfa-challenge') &&
                !request.nextUrl.pathname.startsWith('/mfa-debug')) {
              // User has MFA enabled but hasn't verified in this session
              return NextResponse.redirect(new URL('/mfa-challenge', request.url))
            }
          }
        }
      }
    }
    // If not authenticated, let the component handle showing the login form
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}
