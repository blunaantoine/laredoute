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
    const category = searchParams.get('category')
    const id = searchParams.get('id')
    const all = searchParams.get('all')

    if (id) {
      const product = await db.product.findUnique({ where: { id } })
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }
      return NextResponse.json(product)
    }

    const activeFilter = all === 'true' ? {} : { isActive: true }

    if (category) {
      const products = await db.product.findMany({
        where: { category, ...activeFilter },
        orderBy: { order: 'asc' },
      })
      return NextResponse.json(products)
    }

    const products = await db.product.findMany({
      where: activeFilter,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('[Products API] GET error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { category, subcategory, title, description, imageUrl, variants, order } = body

    if (!category || !title) {
      return NextResponse.json(
        { error: 'Les champs category et title sont requis' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: { category, subcategory, title, description, imageUrl, variants, order },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('[Products API] POST error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit', details: error instanceof Error ? error.message : String(error) },
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

    // Only allow updating valid product fields (security: prevent setting createdAt, etc.)
    const allowedFields = ['category', 'subcategory', 'title', 'description', 'imageUrl', 'variants', 'order', 'isActive']
    const filteredData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in data) {
        filteredData[key] = data[key]
      }
    }

    const updated = await db.product.update({
      where: { id },
      data: filteredData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Products API] PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit', details: error instanceof Error ? error.message : String(error) },
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
    const permanent = searchParams.get('permanent') === 'true'

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour la suppression' },
        { status: 400 }
      )
    }

    if (permanent) {
      // Hard delete: remove from database and clean up image file
      const product = await db.product.findUnique({ where: { id } })
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Try to delete the image file from disk
      if (product.imageUrl) {
        try {
          const { unlink } = await import('fs/promises')
          const { existsSync } = await import('fs')
          const path = await import('path')

          // Image URL format: /api/files/category/filename
          // File location: public/uploads/category/filename
          const urlPath = product.imageUrl.replace('/api/files/', '')
          const filePath = path.join(process.cwd(), 'public', 'uploads', urlPath)
          if (existsSync(filePath)) {
            await unlink(filePath)
            console.log('[Products API] Deleted image file:', filePath)
          }

          // Also try to remove from standalone directory
          const standalonePath = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads', urlPath)
          if (existsSync(standalonePath)) {
            await unlink(standalonePath)
            console.log('[Products API] Deleted standalone image file:', standalonePath)
          }
        } catch (imgError) {
          // Non-critical: image cleanup failed, but product is still deleted from DB
          console.error('[Products API] Warning: could not delete image file:', imgError)
        }
      }

      // Permanently delete from database
      await db.product.delete({ where: { id } })
      console.log('[Products API] Permanently deleted product:', id)
      return NextResponse.json({ success: true, permanent: true })
    }

    // Soft delete (default)
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true, permanent: false })
  } catch (error) {
    console.error('[Products API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
