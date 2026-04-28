import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    const adminUser = await db.user.findFirst({
      where: { role: 'admin' },
    })

    let passwordMatches = false

    if (adminUser) {
      // Compare with stored password in DB
      passwordMatches = password === adminUser.password
    } else {
      // Fallback to env variable (for first login before DB user exists)
      const envPassword = process.env.ADMIN_PASSWORD || 'laredoute2024'
      passwordMatches = password === envPassword
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set('admin-auth', 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
