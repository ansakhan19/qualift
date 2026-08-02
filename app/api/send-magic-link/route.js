import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { upsertSession, getSessionByEmail } from '@/lib/db'
import { sendMagicLink } from '@/lib/email'
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

    // Track the email first. This is the part that must always succeed,
    // it's what the admin export reads from. Email delivery is best-effort
    // on top of it, a Resend outage should never make us lose the lead.
    upsertSession({
      id:            sessionId,
      email:         normalised,
      token,
      tokenExpiresAt: expiresAt,
      progress:      merged,
    })

    // Log to the Google Sheet too, this is the easy no-setup way to see
    // captured emails and it doesn't depend on the database surviving a redeploy.
    await logToSheet({
      email:       normalised,
      studentType: merged.studentType,
      eligibility: merged.eligibility?.status,
      stage:       merged.currentStage,
    })

    let emailSent = true
    try {
      await sendMagicLink({ to: normalised, token, progress: merged })
    } catch (err) {
      emailSent = false
      console.error('[send-magic-link] email delivery failed, email was still tracked', err)
    }

    return NextResponse.json({ ok: true, sessionId, emailSent })
  } catch (err) {
    console.error('[send-magic-link]', err)
    return NextResponse.json({ error: 'Failed to save your email, try again' }, { status: 500 })
  }
}
