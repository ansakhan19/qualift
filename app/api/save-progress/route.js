import { NextResponse } from 'next/server'
import { updateProgress, getSessionById } from '@/lib/db'

export async function POST(req) {
  try {
    const { sessionId, progress } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })

    const session = getSessionById(sessionId)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    updateProgress(sessionId, progress)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[save-progress]', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
