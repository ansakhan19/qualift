import { NextResponse } from 'next/server'

// Qualift doesn't use an email provider. Emailing the PDF guide was removed,
// students use the Download PDF button instead (see /api/download-guide).
export async function POST() {
  return NextResponse.json(
    { error: 'Emailing the guide is no longer available, use the download button instead' },
    { status: 410 }
  )
}
