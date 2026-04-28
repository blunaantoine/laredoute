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
      const image = await db.siteImage.findUnique({ where: { key } })
      if (!image) {
        return NextResponse.json(
          { error: 'Image non trouvée' },
          { status: 404 }
        )
      }
      return NextResponse.json(image)
    }

    if (category) {
      const images = await db.siteImage.findMany({
        where: { category },
        orderBy: { order: 'asc' },
      })
      return NextResponse.json(images)
    }

    const images = await db.siteImage.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('[Images API] GET error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { key, category, title, description, imageUrl, altText, order } = body

    if (!key || !category || !title || !imageUrl) {
      return NextResponse.json(
        { error: 'Les champs key, category, title et imageUrl sont requis' },
        { status: 400 }
      )
    }

    const siteImage = await db.siteImage.create({
      data: { key, category, title, description, imageUrl, altText, order },
    })

    return NextResponse.json(siteImage, { status: 201 })
  } catch (error) {
    console.error('[Images API] POST error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour la mise à jour' },
        { status: 400 }
      )
    }

    const updated = await db.siteImage.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Images API] PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'image', details: error instanceof Error ? error.message : String(error) },
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

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour la suppression' },
        { status: 400 }
      )
    }

    await db.siteImage.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Images API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
