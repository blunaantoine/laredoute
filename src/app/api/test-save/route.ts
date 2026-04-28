import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    steps: [] as Array<{ step: string; success: boolean; details?: string; error?: string }>,
  }

  const addStep = (step: string, success: boolean, details?: string, error?: string) => {
    results.steps = [...(results.steps as Array<unknown>), { step, success, details, error }]
  }

  try {
    // Step 1: Check auth cookie
    const authCookie = request.cookies.get('laredoute-admin-v2')
    const rawCookieHeader = request.headers.get('cookie') || ''
    const hasCookieStandard = !!authCookie && authCookie.value.length >= 10
    const hasCookieFallback = /laredoute-admin-v2=[^;]{10,}/.test(rawCookieHeader)
    const isAuthenticated = hasCookieStandard || hasCookieFallback

    addStep('auth-check', isAuthenticated,
      `Standard: ${hasCookieStandard}, Fallback: ${hasCookieFallback}, Cookie header length: ${rawCookieHeader.length}`,
      !isAuthenticated ? 'No valid auth cookie found' : undefined
    )

    // Step 2: Check database connection
    try {
      await db.$connect()
      addStep('db-connect', true, 'Connected successfully')
    } catch (e) {
      addStep('db-connect', false, undefined, e instanceof Error ? e.message : String(e))
      return NextResponse.json(results, { status: 500 })
    }

    // Step 3: Check database file
    const dbUrl = process.env.DATABASE_URL || 'not set'
    let dbPath = dbUrl.replace('file:', '')
    if (dbPath.startsWith('./')) dbPath = path.resolve(process.cwd(), dbPath)
    const dbExists = fs.existsSync(dbPath)
    const dbStats = dbExists ? fs.statSync(dbPath) : null
    addStep('db-file', dbExists,
      `Path: ${dbPath}, Size: ${dbStats?.size || 0} bytes, Writable: ${dbExists ? (fs.constants.W_OK ? 'yes' : 'no') : 'N/A'}`
    )

    // Step 4: Test read
    try {
      const count = await db.siteContent.count()
      addStep('db-read', true, `Found ${count} content entries`)
    } catch (e) {
      addStep('db-read', false, undefined, e instanceof Error ? e.message : String(e))
    }

    // Step 5: Test write (create, read, update, delete)
    const testKey = `test-save-${Date.now()}`
    try {
      // Create
      const created = await db.siteContent.create({
        data: {
          key: testKey,
          category: 'test',
          content: 'TEST_VALUE_ORIGINAL',
        },
      })
      addStep('db-create', true, `Created with id: ${created.id}`)

      // Read back
      const readBack = await db.siteContent.findUnique({ where: { key: testKey } })
      addStep('db-readback', readBack?.content === 'TEST_VALUE_ORIGINAL',
        `Content: "${readBack?.content}"`)

      // Update
      const updated = await db.siteContent.update({
        where: { key: testKey },
        data: { content: 'TEST_VALUE_MODIFIED' },
      })
      addStep('db-update', updated.content === 'TEST_VALUE_MODIFIED',
        `Updated content: "${updated.content}"`)

      // Verify update
      const verifyUpdate = await db.siteContent.findUnique({ where: { key: testKey } })
      addStep('db-verify-update', verifyUpdate?.content === 'TEST_VALUE_MODIFIED',
        `Verified content: "${verifyUpdate?.content}"`)

      // Delete
      await db.siteContent.delete({ where: { key: testKey } })
      addStep('db-delete', true, 'Test entry deleted')

    } catch (e) {
      addStep('db-write-test', false, undefined, e instanceof Error ? e.message : String(e))
      // Cleanup
      try {
        await db.siteContent.delete({ where: { key: testKey } })
      } catch { /* ignore */ }
    }

    // Step 6: Check product save
    try {
      const firstProduct = await db.product.findFirst()
      if (firstProduct) {
        const originalTitle = firstProduct.title
        await db.product.update({
          where: { id: firstProduct.id },
          data: { title: 'TEST_PRODUCT_MODIFIED' },
        })
        const verifyProduct = await db.product.findUnique({ where: { id: firstProduct.id } })
        addStep('product-update', verifyProduct?.title === 'TEST_PRODUCT_MODIFIED',
          `Product title changed from "${originalTitle}" to "${verifyProduct?.title}"`)
        // Restore
        await db.product.update({
          where: { id: firstProduct.id },
          data: { title: originalTitle },
        })
        addStep('product-restore', true, 'Product title restored')
      } else {
        addStep('product-update', false, 'No products found to test')
      }
    } catch (e) {
      addStep('product-update', false, undefined, e instanceof Error ? e.message : String(e))
    }

    // Summary
    const allSteps = results.steps as Array<{ success: boolean }>
    const allPassed = allSteps.every(s => s.success)
    results.overall = allPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'
    results.environment = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL?.substring(0, 50) + '...',
      cwd: process.cwd(),
    }

    return NextResponse.json(results, { status: allPassed ? 200 : 500 })

  } catch (error) {
    addStep('fatal', false, undefined, error instanceof Error ? error.message : String(error))
    return NextResponse.json(results, { status: 500 })
  }
}
