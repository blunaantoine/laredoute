import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db'

export async function GET() {
  const health: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '***set***' : 'NOT SET',
    },
  }

  // Check database connectivity
  try {
    const userCount = await db.user.count()
    const productCount = await db.product.count()
    const contentCount = await db.siteContent.count()
    const imageCount = await db.siteImage.count()

    const adminUser = await db.user.findFirst({ where: { role: 'admin' } })

    health.database = {
      connected: true,
      users: userCount,
      products: productCount,
      contents: contentCount,
      images: imageCount,
      adminExists: !!adminUser,
    }
  } catch (error) {
    health.database = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check file system - without exposing sensitive paths
  try {
    const dbUrlValue = process.env.DATABASE_URL || ''
    const dbPath = dbUrlValue.replace('file:', '')
    const resolvedPath = dbPath.startsWith('./')
      ? path.resolve(process.cwd(), dbPath)
      : dbPath
    const dbExists = fs.existsSync(resolvedPath)
    let dbSize = 0
    if (dbExists) {
      try { dbSize = fs.statSync(resolvedPath).size } catch { /* ignore */ }
    }

    health.filesystem = {
      dbExists,
      dbSizeBytes: dbSize,
    }

    // Check upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    health.filesystem.uploadDirExists = fs.existsSync(uploadDir)
  } catch (error) {
    health.filesystem = {
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check .env file - only report existence, not content
  try {
    const envPath = path.join(process.cwd(), '.env')
    health.envFile = {
      exists: fs.existsSync(envPath),
    }
  } catch {
    health.envFile = { exists: false }
  }

  const isHealthy = (health.database as Record<string, unknown>)?.connected === true

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  })
}
