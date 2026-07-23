import { renderToBuffer } from '@react-pdf/renderer'
import { buildApplicationGuide } from '@/lib/pdf/ApplicationGuide'
import { Resend } from 'resend'
import React from 'react'

const FROM = process.env.EMAIL_FROM || 'Qualift <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req) {
  try {
    const { email, progress } = await req.json()

    if (!email) return Response.json({ ok: false, error: 'No email provided' }, { status: 400 })

    // Generate PDF buffer
    const doc = buildApplicationGuide(progress)
    const pdfBuffer = await renderToBuffer(doc)

    // Send via Resend with attachment
    const resend = new Resend(process.env.RESEND_API_KEY)
    const name = [progress?.application?.firstName, progress?.application?.lastName].filter(Boolean).join(' ') || 'there'

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Your Fair Fares application guide — Qualift',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f8fc;font-family:Inter,system-ui,sans-serif">
  <div style="max-width:480px;margin:32px auto;background:white;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
    <div style="background:#7F77DD;padding:24px 28px">
      <div style="font-size:22px;font-weight:600;color:white">Qualift</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:3px">Fair Fares application readiness</div>
    </div>
    <div style="padding:28px">
      <p style="font-size:16px;font-weight:500;color:#1a1a2e;margin:0 0 12px">Hi ${name}, your guide is ready 🎉</p>
      <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px">
        Your personalized Fair Fares application guide is attached as a PDF. Open it on your phone while you apply — it has your information pre-filled and walks you through every step from creating your HRA account to submitting your documents.
      </p>
      <div style="background:#f7f7f9;border-radius:10px;padding:14px 16px;margin-bottom:20px">
        <p style="font-size:12px;font-weight:600;color:#3C3489;margin:0 0 8px">📎 Attachment: Fair_Fares_Guide.pdf</p>
        <ul style="font-size:12px;color:#64748b;margin:0;padding-left:16px;line-height:1.8">
          <li>Create your HRA ACCESS account</li>
          <li>Fill every form field (pre-filled with your info)</li>
          <li>Upload your documents in the right order</li>
          <li>Submit and track your application</li>
        </ul>
      </div>
      <a href="https://a069-access.nyc.gov/accesshra/" style="display:block;background:#1D9E75;color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-size:15px;font-weight:500;margin-bottom:20px">
        Open HRA ACCESS to apply →
      </a>
      <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.5">
        Questions? HRA Infoline: <strong>718-557-1399</strong> (Mon–Fri, 8am–5pm).<br/>
        Qualift is not affiliated with HRA or the MTA.
      </p>
    </div>
  </div>
</body>
</html>`,
      text: `Hi ${name},\n\nYour personalized Fair Fares application guide is attached.\n\nApply at: https://a069-access.nyc.gov/accesshra/\n\nHRA Infoline: 718-557-1399\n\nQualift is not affiliated with HRA or the MTA.`,
      attachments: [
        {
          filename: 'Fair_Fares_Guide.pdf',
          content: pdfBuffer.toString('base64'),
        },
      ],
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('send-guide error:', err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
