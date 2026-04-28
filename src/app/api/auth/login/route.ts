import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHmac } from 'crypto'

// Generate a session token from password + timestamp
function generateSessionToken(password: string): string {
  const secret = process.env.SESSION_SECRET || 'laredoute-session-2026'
  return createHmac('sha256', secret).update(password + Date.now()).digest('hex').slice(0, 32)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    const sessionToken = generateSessionToken(password)
    const response = NextResponse.json({ success: true })

    // Use a new cookie name with version to invalidate old sessions
    response.cookies.set('laredoute-admin-v2', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
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
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
