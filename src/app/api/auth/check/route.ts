import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check new cookie name (v2) via standard API
    const authCookie = request.cookies.get('laredoute-admin-v2')

    if (authCookie && authCookie.value.length > 10) {
      return NextResponse.json({ authenticated: true })
    }

    // Fallback: parse raw Cookie header manually (for standalone/reverse-proxy deployments)
    const rawCookieHeader = request.headers.get('cookie') || ''
    const match = rawCookieHeader.match(/laredoute-admin-v2=([^;]+)/)
    if (match && match[1] && match[1].length > 10) {
      console.log('[Auth Check] Cookie found via raw header fallback')
      return NextResponse.json({ authenticated: true })
    }

    // Also clear old invalid cookies
    const response = NextResponse.json({ authenticated: false })

    // Clear old cookie if it exists but is not valid for v2
    const oldCookie = request.cookies.get('admin-auth')
    if (oldCookie) {
      response.cookies.set('admin-auth', '', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    )
  }
}
