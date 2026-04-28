import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

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

export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string || 'general'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = path.extname(file.name) || '.png'
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomSuffix}${ext}`

    // Create category directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const filePath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the URL path
    const url = `/uploads/${category}/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('[Upload API] POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du téléchargement du fichier', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
