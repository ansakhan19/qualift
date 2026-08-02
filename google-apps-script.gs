/**
 * Qualift email capture + guide-delivery webhook.
 *
 * Handles two actions, sent as JSON POST bodies:
 *  - { email, studentType, eligibility, stage }            -> logs a row to the Emails sheet
 *  - { action: 'sendGuide', email, name, pdfBase64 }        -> emails the PDF guide from your Gmail
 *
 * First-time setup for the sendGuide action: run testSendGuide() once from
 * the editor (function dropdown -> testSendGuide -> Run) and approve the
 * Gmail permission prompt. This is required because Apps Script only asks
 * for permission the moment the code actually calls GmailApp, running
 * sendGuideEmail directly with no input never reaches that line.
 *
 * Setup:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Paste this whole file in, replacing the placeholder code
 * 3. Click Deploy -> New deployment -> type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL (ends in /exec)
 * 5. Add it to Railway as the GOOGLE_SHEETS_WEBHOOK_URL variable
 *
 * If you already deployed this before adding the sendGuide action, edit the
 * existing deployment (Deploy -> Manage deployments -> pencil icon -> Deploy)
 * so the URL picks up this new version, no need to change the Railway variable.
 */
function doPost(e) {
  var data = JSON.parse(e.postData.contents)

  if (data.action === 'sendGuide') {
    return sendGuideEmail(data)
  }

  return logEmail(data)
}

function logEmail(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Emails')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Emails')

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Email', 'Student type', 'Eligibility', 'Stage'])
    sheet.setFrozenRows(1)
  }

  sheet.appendRow([
    new Date(),
    data.email || '',
    data.studentType || '',
    data.eligibility || '',
    data.stage || '',
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

function sendGuideEmail(data) {
  try {
    if (!data.email || !data.pdfBase64) {
      throw new Error('Missing email or PDF')
    }

    var name = data.name || 'there'
    var pdfBlob = Utilities.newBlob(
      Utilities.base64Decode(data.pdfBase64),
      'application/pdf',
      'Fair_Fares_Guide.pdf'
    )

    GmailApp.sendEmail(
      data.email,
      'Your Fair Fares application guide, Qualift',
      'Hi ' + name + ',\n\nYour personalized Fair Fares application guide is attached as a PDF. ' +
      'It has your information laid out in the order it appears on the HRA ACCESS form.\n\n' +
      'Apply at: https://a069-access.nyc.gov/accesshra/fairfares\n\n' +
      'Qualift is not affiliated with HRA or the MTA.',
      {
        htmlBody:
          '<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">' +
          '<p style="font-size:16px;font-weight:600;color:#1a1a2e">Hi ' + name + ', your guide is ready</p>' +
          '<p style="font-size:14px;color:#5c5548;line-height:1.6">' +
          'Your personalized Fair Fares application guide is attached as a PDF. It has your information ' +
          'laid out in the order it appears on the HRA ACCESS form.</p>' +
          '<p><a href="https://a069-access.nyc.gov/accesshra/fairfares" ' +
          'style="display:inline-block;background:#4F46E5;color:white;text-decoration:none;' +
          'padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500">Open HRA ACCESS to apply</a></p>' +
          '<p style="font-size:12px;color:#a69d8d">Qualift is not affiliated with HRA or the MTA.</p>' +
          '</div>',
        attachments: [pdfBlob],
        name: 'Qualift',
      }
    )

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Run this once manually (function dropdown -> testSendGuide -> Run) to
 * trigger the Gmail permission prompt. Sends a tiny real test PDF to your
 * own address so you can also confirm delivery works.
 */
function testSendGuide() {
  var fakePdf = Utilities.newBlob('test', 'text/plain').getBytes()
  var result = sendGuideEmail({
    email: Session.getActiveUser().getEmail(),
    name: 'Test',
    pdfBase64: Utilities.base64Encode(fakePdf),
  })
  console.log(result.getContent())
}
