import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Ensure DATABASE_URL is set and the database directory exists
function ensureDatabase() {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    // Default to relative path if not set
    process.env.DATABASE_URL = 'file:./db/custom.db'
  }

  // Resolve the actual file path from the DATABASE_URL
  const urlValue = process.env.DATABASE_URL
  if (urlValue.startsWith('file:')) {
    let dbPath = urlValue.replace('file:', '')
    // Remove leading slashes from absolute paths like file:/home/...
    if (dbPath.startsWith('/') && !dbPath.startsWith('//')) {
      // This is an absolute path - keep it as is
    } else if (dbPath.startsWith('./')) {
      // Relative path - resolve from project root
      const projectRoot = path.resolve(process.cwd())
      dbPath = path.resolve(projectRoot, dbPath)
    }

    // Ensure the directory exists
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
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
