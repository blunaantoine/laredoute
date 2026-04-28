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
      DATABASE_URL: process.env.DATABASE_URL ? '***set***' : 'NOT SET',
      cwd: process.cwd(),
    },
  }

  // Check database connectivity
  try {
    const userCount = await db.user.count()
    const productCount = await db.product.count()
    const contentCount = await db.siteContent.count()
    const imageCount = await db.siteImage.count()
    health.database = {
      connected: true,
      users: userCount,
      products: productCount,
      contents: contentCount,
      images: imageCount,
    }
  } catch (error) {
    health.database = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check file system
  try {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './db/custom.db'
    const resolvedPath = dbPath.startsWith('./')
      ? path.resolve(process.cwd(), dbPath)
      : dbPath
    const dbExists = fs.existsSync(resolvedPath)
    const dbDir = path.dirname(resolvedPath)
    const dirExists = fs.existsSync(dbDir)

    health.filesystem = {
      dbPath: resolvedPath,
      dbExists,
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
    health.envFile = {
      path: envPath,
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
