/**
 * Qualift email capture webhook.
 *
 * Setup:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Paste this whole file in, replacing the placeholder code
 * 3. Click Deploy -> New deployment -> type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL (ends in /exec)
 * 5. Add it to Railway as the GOOGLE_SHEETS_WEBHOOK_URL variable
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Emails')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Emails')

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Email', 'Student type', 'Eligibility', 'Stage'])
    sheet.setFrozenRows(1)
  }

  var data = JSON.parse(e.postData.contents)

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
