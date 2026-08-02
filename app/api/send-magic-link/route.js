import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { upsertSession, getSessionByEmail } from '@/lib/db'
import { logToSheet } from '@/lib/sheetsLog'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function POST(req) {
  try {
    const { email, progress } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalised = email.toLowerCase().trim()
    const existing   = getSessionByEmail(normalised)
    const sessionId  = existing?.id ?? uuid()
    const token      = uuid()
    const expiresAt  = Date.now() + TOKEN_TTL_MS

    // Merge incoming progress with any existing stored progress
    const storedProgress = existing ? JSON.parse(existing.progress || '{}') : {}
    const merged = { ...storedProgress, ...progress, email: normalised, sessionId }

    // Save the session, this is what the admin export and the Google Sheet
    // log both read from. No email is sent, Qualift doesn't use an email
    // provider, this just records the address for follow-up.
    upsertSession({
      id:            sessionId,
      email:         normalised,
      token,
      tokenExpiresAt: expiresAt,
      progress:      merged,
    })

    // Log to the Google Sheet, this is the easy no-setup way to see
    // captured emails and it doesn't depend on the database surviving a redeploy.
    await logToSheet({
      email:       normalised,
      studentType: merged.studentType,
      eligibility: merged.eligibility?.status,
      stage:       merged.currentStage,
    })

    return NextResponse.json({ ok: true, sessionId })
  } catch (err) {
    console.error('[send-magic-link]', err)
    return NextResponse.json({ error: 'Failed to save your email, try again' }, { status: 500 })
  }
}
