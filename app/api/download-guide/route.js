import { renderToBuffer } from '@react-pdf/renderer'
import { buildApplicationGuide } from '@/lib/pdf/ApplicationGuide'

/**
 * NOT currently called by the app. The Download PDF button now generates
 * the PDF entirely in the browser (see components/SubmissionGuide.jsx) so
 * that application data never has to leave the student's device for a plain
 * download. Left here in case a server-rendered fallback is ever needed.
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
