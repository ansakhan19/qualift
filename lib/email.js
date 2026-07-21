import { Resend } from 'resend'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM    = process.env.EMAIL_FROM || 'Qualift <noreply@qualift.app>'

export async function sendMagicLink({ to, token, progress }) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const link = `${APP_URL}/auth/verify?token=${token}`
  const stage = getStageLabel(progress?.currentStage)

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f8fc;font-family:Inter,system-ui,sans-serif">
  <div style="max-width:480px;margin:32px auto;background:white;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">

    <div style="background:#7F77DD;padding:24px 28px">
      <div style="font-size:22px;font-weight:600;color:white;letter-spacing:-0.3px">Qualift</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:3px">Fair Fares application readiness</div>
    </div>

    <div style="padding:28px">
      <p style="font-size:16px;font-weight:500;color:#1a1a2e;margin:0 0 8px">Your progress link is ready</p>
      <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 24px">
        Click below to pick up exactly where you left off${stage ? ` — <strong style="color:#3C3489">${stage}</strong>` : ''}.
        Works on any device, any browser.
      </p>

      <a href="${link}" style="display:block;background:#7F77DD;color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-size:15px;font-weight:500;margin-bottom:20px">
        Continue my Fair Fares application →
      </a>

      <div style="background:#f7f7f9;border-radius:8px;padding:12px 14px;margin-bottom:20px">
        <p style="font-size:12px;color:#64748b;margin:0 0 4px;font-weight:500">CAN'T CLICK THE BUTTON?</p>
        <p style="font-size:11px;color:#94a3b8;margin:0;word-break:break-all">${link}</p>
      </div>

      <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.5">
        This link expires in <strong>7 days</strong>. If you didn't request this, you can safely ignore this email.
        Qualift is not affiliated with HRA or the MTA.
      </p>
    </div>

    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;background:#f7f7f9">
      <p style="font-size:11px;color:#94a3b8;margin:0">
        Qualift helps NYC residents prepare for the Fair Fares program.
        Your email is only used to restore your progress.
      </p>
    </div>
  </div>
</body>
</html>`

  const text = `Your Qualift progress link\n\nContinue your Fair Fares application:\n${link}\n\nThis link expires in 7 days.\n\nQualift is not affiliated with HRA or the MTA.`

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Continue your Fair Fares application — Qualift',
    html,
    text,
  })
}

function getStageLabel(stage) {
  const labels = {
    1: 'Your profile',
    2: 'Eligibility check',
    3: 'Document list',
    4: 'Document collection',
    5: 'Getting missing documents',
    6: 'Readiness review',
    7: 'All docs verified',
    8: 'Application walkthrough',
    9: 'Submission guide',
  }
  return labels[stage] || null
}
