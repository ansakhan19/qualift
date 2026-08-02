/**
 * Fire-and-forget logger that appends each captured email to a Google Sheet
 * via the Apps Script webhook (see google-apps-script.gs). This is the
 * primary place to see collected emails, it doesn't depend on the SQLite
 * database or a Railway volume, so it survives redeploys with zero setup.
 *
 * No-ops if GOOGLE_SHEETS_WEBHOOK_URL isn't set, so the app keeps working
 * even before this is configured.
 */
export async function logToSheet({ email, studentType, eligibility, stage }) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, studentType, eligibility, stage }),
    })
  } catch (err) {
    // Never let a Sheets outage break the app for a student
    console.error('[sheetsLog] failed to log email to Google Sheet', err)
  }
}
