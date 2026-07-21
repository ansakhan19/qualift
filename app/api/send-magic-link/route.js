import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { upsertSession, getSessionByEmail } from '@/lib/db'
import { sendMagicLink } from '@/lib/email'

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

    upsertSession({
      id:            sessionId,
      email:         normalised,
      token,
      tokenExpiresAt: expiresAt,
      progress:      merged,
    })

    await sendMagicLink({ to: normalised, token, progress: merged })

    return NextResponse.json({ ok: true, sessionId })
  } catch (err) {
    console.error('[send-magic-link]', err)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
