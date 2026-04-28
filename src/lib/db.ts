import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Ensure DATABASE_URL is set and the database directory exists
function ensureDatabase() {
  let dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    // Default to relative path if not set
    dbUrl = 'file:./db/custom.db'
    process.env.DATABASE_URL = dbUrl
  }

  // Resolve the actual file path from the DATABASE_URL
  if (dbUrl.startsWith('file:')) {
    let dbPath = dbUrl.replace('file:', '')

    if (dbPath.startsWith('/') && !dbPath.startsWith('//')) {
      // This is an absolute path - keep it as is
    } else if (dbPath.startsWith('./')) {
      // Relative path - resolve from project root (cwd)
      const projectRoot = path.resolve(process.cwd())
      dbPath = path.resolve(projectRoot, dbPath)

      // Update DATABASE_URL to absolute path for reliability
      process.env.DATABASE_URL = `file:${dbPath}`
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

    console.log(`[DB] Database path resolved to: ${dbPath}`)
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
