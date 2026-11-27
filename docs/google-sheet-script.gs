// Beside Learning — copy website enquiries into this Google Sheet.
//
// Setup (once):
// 1. Open the Google Sheet → Extensions → Apps Script.
// 2. Delete what's there, paste this whole file, and replace the SECRET below
//    with the same long random text you put in Cloudflare as SHEET_SECRET.
// 3. Save, then Deploy → New deployment → type "Web app":
//      Execute as: Me      Who has access: Anyone
//    Authorise when asked, then copy the "Web app URL" (ends in /exec) into
//    Cloudflare as SHEET_WEBHOOK_URL.

const SECRET = 'PASTE-THE-SAME-SECRET-AS-CLOUDFLARE';
const HEADER = ['Date', 'Name', 'Phone', 'Class', 'Board', 'Message', 'Contacted?', 'Notes'];

// Text starting with = + - @ would run as a formula; store it as plain text.
function plain(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput('bad request');
  }
  if (!d || d.secret !== SECRET || SECRET.indexOf('PASTE-') === 0) {
    return ContentService.createTextOutput('forbidden');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
    }
    sheet.appendRow([
      plain(d.date),
      plain(d.name),
      "'" + String(d.phone || ''), // keep +91 and leading zeros
      plain(d.klass),
      plain(d.board),
      plain(d.message),
      false,
      '',
    ]);
    sheet.getRange(sheet.getLastRow(), 7).insertCheckboxes();
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
