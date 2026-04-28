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
      DATABASE_URL: process.env.DATABASE_URL || 'NOT SET',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '***set***' : 'NOT SET',
      cwd: process.cwd(),
    },
  }

  // Check database connectivity
  try {
    const userCount = await db.user.count()
    const productCount = await db.product.count()
    const contentCount = await db.siteContent.count()
    const imageCount = await db.siteImage.count()

    // Get admin user info (without exposing password)
    const adminUser = await db.user.findFirst({ where: { role: 'admin' } })

    health.database = {
      connected: true,
      users: userCount,
      products: productCount,
      contents: contentCount,
      images: imageCount,
      adminExists: !!adminUser,
      adminEmail: adminUser?.email || 'none',
    }
  } catch (error) {
    health.database = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check file system
  try {
    const dbUrlValue = process.env.DATABASE_URL || ''
    const dbPath = dbUrlValue.replace('file:', '')
    const resolvedPath = dbPath.startsWith('./')
      ? path.resolve(process.cwd(), dbPath)
      : dbPath
    const dbExists = fs.existsSync(resolvedPath)
    const dbDir = path.dirname(resolvedPath)
    const dirExists = fs.existsSync(dbDir)
    let dbSize = 0
    if (dbExists) {
      try { dbSize = fs.statSync(resolvedPath).size } catch { /* ignore */ }
    }

    health.filesystem = {
      dbPath: resolvedPath,
      dbExists,
      dbSizeBytes: dbSize,
      dbDir,
      dirExists,
    }

    // Check upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    health.filesystem.uploadDir = uploadDir
    health.filesystem.uploadDirExists = fs.existsSync(uploadDir)
  } catch (error) {
    health.filesystem = {
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check .env file
  try {
    const envPath = path.join(process.cwd(), '.env')
    const envExists = fs.existsSync(envPath)
    let envContent = ''
    if (envExists) {
      envContent = fs.readFileSync(envPath, 'utf-8').trim()
    }
    health.envFile = {
      path: envPath,
      exists: envExists,
      content: envContent,
    }
  } catch {
    health.envFile = { exists: false }
  }

  const isHealthy = (health.database as Record<string, unknown>)?.connected === true

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  })
}
