import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if authenticated
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Verify current password - check database first, then fallback to env
    const adminUser = await db.user.findFirst({
      where: { role: 'admin' },
    })

    let currentPasswordMatches = false

    if (adminUser) {
      // Compare with stored password
      currentPasswordMatches = currentPassword === adminUser.password
    } else {
      // Fallback to env variable
      const envPassword = process.env.ADMIN_PASSWORD || 'laredoute2024'
      currentPasswordMatches = currentPassword === envPassword
    }

    if (!currentPasswordMatches) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe actuel incorrect' },
        { status: 401 }
      )
    }

    // Update or create the admin user with new password
    if (adminUser) {
      await db.user.update({
        where: { id: adminUser.id },
        data: { password: newPassword },
      })
    } else {
      // Create admin user if it doesn't exist
      await db.user.create({
        data: {
          email: 'admin@laredoutesarl.com',
          name: 'Administrateur',
          password: newPassword,
          role: 'admin',
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Mot de passe modifié avec succès' })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
