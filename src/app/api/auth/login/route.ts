import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Generate a simple session token without crypto dependency
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const segments = []
  for (let s = 0; s < 4; s++) {
    let segment = ''
    for (let i = 0; i < 8; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return segments.join('-') + '-' + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Requête invalide' },
        { status: 400 }
      )
    }

    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    // Check database first for the admin user password
    let passwordMatches = false
    try {
      const adminUser = await db.user.findFirst({
        where: { role: 'admin' },
      })

      if (adminUser) {
        // Compare with stored password in DB
        passwordMatches = password === adminUser.password
      } else {
        // Fallback to env variable (for first login before DB user exists)
        const envPassword = process.env.ADMIN_PASSWORD || 'Antoine@228'
        passwordMatches = password === envPassword
      }
    } catch (dbError) {
      // If DB fails, fallback to env password
      console.error('DB error during login, using env fallback:', dbError)
      const envPassword = process.env.ADMIN_PASSWORD || 'Antoine@228'
      passwordMatches = password === envPassword
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const sessionToken = generateSessionToken()
    const response = NextResponse.json({ success: true })

    // Determine if we should use secure flag
    // In production behind Caddy (reverse proxy), the internal connection is HTTP
    // but the browser connects via HTTPS. We check x-forwarded-proto header.
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const origin = request.headers.get('origin') || ''
    const isSecure = forwardedProto === 'https' || origin.startsWith('https://') || process.env.NODE_ENV === 'production'
    
    console.log('[Login] Setting cookie - secure:', isSecure, 'forwardedProto:', forwardedProto, 'NODE_ENV:', process.env.NODE_ENV)
    
    // Use a new cookie name with version to invalidate old sessions
    response.cookies.set('laredoute-admin-v2', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Also clear the old cookie name if it exists
    response.cookies.set('admin-auth', '', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
