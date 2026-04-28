import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This endpoint resets the admin password to the value in ADMIN_PASSWORD env var
// It's a one-time setup endpoint - use it after deployment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { newPassword } = body

    // Find admin user
    const adminUser = await db.user.findFirst({
      where: { role: 'admin' },
    })

    const targetPassword = newPassword || process.env.ADMIN_PASSWORD || 'Antoine@228'

    if (adminUser) {
      await db.user.update({
        where: { id: adminUser.id },
        data: { password: targetPassword },
      })
      return NextResponse.json({
        success: true,
        message: `Mot de passe admin mis à jour`,
        email: adminUser.email,
      })
    } else {
      // Create admin user if not exists
      await db.user.create({
        data: {
          email: 'admin@laredoutesarl.com',
          name: 'Administrateur',
          password: targetPassword,
          role: 'admin',
        },
      })
      return NextResponse.json({
        success: true,
        message: 'Utilisateur admin créé',
        email: 'admin@laredoutesarl.com',
      })
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
