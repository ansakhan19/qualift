import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

/**
 * Admin-only export of collected student emails.
 *
 * GET /api/admin/emails?key=YOUR_ADMIN_KEY          -> JSON
 * GET /api/admin/emails?key=YOUR_ADMIN_KEY&format=csv -> CSV download
 *
 * Protected by the ADMIN_KEY environment variable. If it is not set,
 * the endpoint is disabled entirely.
 */
export async function GET(req) {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) {
    return NextResponse.json({ error: 'Admin export is not configured (set ADMIN_KEY)' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  if (searchParams.get('key') !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const rows = db.prepare(`
    SELECT email, progress, created_at, updated_at
    FROM sessions
    ORDER BY created_at DESC
  `).all()

  const records = rows.map(r => {
    let stage = null, studentType = null, status = null
    try {
      const p = JSON.parse(r.progress || '{}')
      stage = p.currentStage ?? null
      studentType = p.studentType ?? null
      status = p.eligibility?.status ?? null
    } catch {}
    return {
      email: r.email,
      studentType,
      eligibility: status,
      stage,
      firstSeen: new Date(r.created_at).toISOString(),
      lastActive: new Date(r.updated_at).toISOString(),
    }
  })

  if (searchParams.get('format') === 'csv') {
    const header = 'email,student_type,eligibility,stage,first_seen,last_active'
    const lines = records.map(r =>
      [r.email, r.studentType ?? '', r.eligibility ?? '', r.stage ?? '', r.firstSeen, r.lastActive].join(',')
    )
    return new Response([header, ...lines].join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="qualift-student-emails.csv"',
      },
    })
  }

  return NextResponse.json({ count: records.length, students: records })
}
