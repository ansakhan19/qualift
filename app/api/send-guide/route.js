import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { buildApplicationGuide } from '@/lib/pdf/ApplicationGuide'

/**
 * Emails the personalized Fair Fares guide PDF to the student's saved email.
 * Delivery goes through the Google Apps Script webhook (Gmail), not a third
 * party email provider, see google-apps-script.gs. Requires
 * GOOGLE_SHEETS_WEBHOOK_URL to be set.
 */
export async function POST(req) {
  try {
    const { email, progress } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'No valid email provided' }, { status: 400 })
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { ok: false, error: 'Email sending is not configured yet, use the download button instead' },
        { status: 503 }
      )
    }

    const doc = buildApplicationGuide(progress)
    const pdfBuffer = await renderToBuffer(doc)
    const name = [progress?.application?.firstName, progress?.application?.lastName].filter(Boolean).join(' ') || null

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendGuide',
        email,
        name,
        pdfBase64: pdfBuffer.toString('base64'),
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || 'Email delivery failed')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-guide error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
