import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function checkAuth(request: NextRequest): NextResponse | null {
  // Try standard cookie API first
  let authCookie = request.cookies.get('laredoute-admin-v2')
  
  // Fallback: parse raw Cookie header manually (for standalone/reverse-proxy deployments)
  if (!authCookie || authCookie.value.length < 10) {
    const rawCookieHeader = request.headers.get('cookie') || ''
    const match = rawCookieHeader.match(/laredoute-admin-v2=([^;]+)/)
    if (match && match[1] && match[1].length >= 10) {
      console.log('[Auth] Cookie found via raw header fallback')
      return null // Auth OK via fallback
    }
    
    console.log('[Auth] No valid auth cookie found. Cookies:', rawCookieHeader.substring(0, 200))
    return NextResponse.json(
      { error: 'Non autorisé. Veuillez vous reconnecter.' },
      { status: 401 }
    )
  }
  return null // Auth OK
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    if (key) {
      const content = await db.siteContent.findUnique({ where: { key } })
      if (!content) {
        return NextResponse.json(
          { error: 'Contenu non trouvé' },
          { status: 404 }
        )
      }
      return NextResponse.json(content)
    }

    if (category) {
      const contents = await db.siteContent.findMany({
        where: { category },
        orderBy: { createdAt: 'asc' },
      })
      return NextResponse.json(contents)
    }

    const contents = await db.siteContent.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(contents)
  } catch (error) {
    console.error('[Content API] GET error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { key, category, title, content } = body

    if (!key || !category || !content) {
      return NextResponse.json(
        { error: 'Les champs key, category et content sont requis' },
        { status: 400 }
      )
    }

    const siteContent = await db.siteContent.create({
      data: { key, category, title, content },
    })

    return NextResponse.json(siteContent, { status: 201 })
  } catch (error) {
    console.error('[Content API] POST error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du contenu', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, key, ...data } = body

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID ou key requis pour la mise à jour' },
        { status: 400 }
      )
    }

    const whereClause = id ? { id } : { key }

    const updated = await db.siteContent.update({
      where: whereClause,
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Content API] PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const key = searchParams.get('key')

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID ou key requis pour la suppression' },
        { status: 400 }
      )
    }

    const whereClause = id ? { id } : { key }

    await db.siteContent.delete({ where: whereClause })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Content API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contenu', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
