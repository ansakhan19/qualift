import { renderToBuffer } from '@react-pdf/renderer'
import { buildApplicationGuide } from '@/lib/pdf/ApplicationGuide'

/**
 * Generates the personalized Fair Fares guide PDF and returns it directly —
 * no email required. The browser downloads it as a file.
 */
export async function POST(req) {
  try {
    const { progress } = await req.json()
    const doc = buildApplicationGuide(progress)
    const pdfBuffer = await renderToBuffer(doc)

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Fair_Fares_Guide.pdf"',
      },
    })
  } catch (err) {
    console.error('download-guide error:', err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
