import { NextResponse } from 'next/server'
import { getSessionByToken, clearToken } from '@/lib/db'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const session = getSessionByToken(token)

  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
  }

  if (session.token_expires_at < Date.now()) {
    return NextResponse.json({ error: 'Link has expired — request a new one' }, { status: 401 })
  }

  // One-time use: clear the token after successful verification
  clearToken(session.id)

  const progress = JSON.parse(session.progress || '{}')

  return NextResponse.json({
    ok:        true,
    sessionId: session.id,
    email:     session.email,
    progress,
  })
}
