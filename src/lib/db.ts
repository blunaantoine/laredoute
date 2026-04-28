import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Resolve the database path - use absolute path for reliability
function ensureDatabase() {
  let dbUrl = process.env.DATABASE_URL

  // If DATABASE_URL is not set, compute an absolute path
  if (!dbUrl) {
    // Default: /var/www/laredoutesarl/db/custom.db on server,
    // or <project_root>/db/custom.db in dev
    const projectRoot = path.resolve(process.cwd())
    const dbPath = path.resolve(projectRoot, 'db', 'custom.db')
    dbUrl = `file:${dbPath}`
    process.env.DATABASE_URL = dbUrl
    console.log(`[DB] DATABASE_URL not set, defaulting to: ${dbUrl}`)
  }

  // If DATABASE_URL uses a relative path, resolve it to absolute
  if (dbUrl.startsWith('file:')) {
    let dbPath = dbUrl.replace('file:', '')

    if (dbPath.startsWith('./')) {
      // Relative path - resolve from cwd to absolute
      const projectRoot = path.resolve(process.cwd())
      dbPath = path.resolve(projectRoot, dbPath)

      // Update DATABASE_URL to absolute path for reliability
      process.env.DATABASE_URL = `file:${dbPath}`
      console.log(`[DB] Resolved relative DATABASE_URL to absolute: file:${dbPath}`)
    }

    // Ensure the directory exists
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) {
      try {
        fs.mkdirSync(dbDir, { recursive: true })
        console.log(`[DB] Created database directory: ${dbDir}`)
      } catch (err) {
        console.error(`[DB] Failed to create database directory: ${dbDir}`, err)
      }
    }

    console.log(`[DB] Database path: ${dbPath} (exists: ${fs.existsSync(dbPath)})`)
  }
}

ensureDatabase()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
