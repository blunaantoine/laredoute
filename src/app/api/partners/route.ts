import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function checkAuth(request: NextRequest): NextResponse | null {
  const authCookie = request.cookies.get('laredoute-admin-v2')
  if (!authCookie || authCookie.value.length < 10) {
    return NextResponse.json(
      { error: 'Non autorisé. Veuillez vous reconnecter.' },
      { status: 401 }
    )
  }
  return null // Auth OK
}

export async function GET() {
  try {
    const partners = await db.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(partners)
  } catch (error) {
    console.error('[Partners API] GET error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des partenaires', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, description, logoUrl, documentUrl, order } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Le champ name est requis' },
        { status: 400 }
      )
    }

    const partner = await db.partner.create({
      data: { name, description, logoUrl, documentUrl, order },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error('[Partners API] POST error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du partenaire', details: error instanceof Error ? error.message : String(error) },
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

    const updated = await db.partner.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Partners API] PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du partenaire', details: error instanceof Error ? error.message : String(error) },
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

    await db.partner.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Partners API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du partenaire', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
