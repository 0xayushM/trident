/**
 * TRIDENT EXIM — Google Apps Script Web App
 *
 * HOW TO SET UP:
 * 1. Open your Google Sheet (create one if needed — any name works).
 * 2. Click Extensions → Apps Script.
 * 3. Delete all existing code and paste this entire file.
 * 4. Click Deploy → New deployment.
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL.
 * 6. Paste that URL into your .env.local file:
 *      GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
 * 7. Redeploy (Deploy → Manage deployments → Edit) every time you change this script.
 *
 * SHEETS CREATED AUTOMATICALLY:
 *   • Contact Responses  — contact form submissions
 *   • Quote Requests     — popup "free quote" form submissions
 *   • Traffic Analytics  — visitor traffic / UTM data
 */

// ─── Entry point ───────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.getActiveSpreadsheet();

    switch (data.type) {
      case 'contact': handleContact(ss, data); break;
      case 'quote':   handleQuote(ss, data);   break;
      case 'traffic': handleTraffic(ss, data); break;
      default: throw new Error('Unknown type: ' + data.type);
    }

    return ok();
  } catch (err) {
    return fail(err.message);
  }
}

// ─── Contact form ──────────────────────────────────────────────────────────────

function handleContact(ss, d) {
  const HEADERS = [
    'Timestamp', 'Full Name', 'Role / Position', 'Phone', 'Email',
    'Company', 'Help With', 'Page URL', 'Referrer',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'IP Address',
  ];
  const sheet = getOrCreateSheet(ss, 'Contact Responses', HEADERS);
  sheet.appendRow([
    fmtDate(d.timestamp),
    d.fullName   || '',
    d.role       || '',
    d.phone      || '',
    d.email      || '',
    d.company    || '',
    d.helpWith   || '',
    d.page       || '',
    d.referrer   || '',
    d.utm_source   || '',
    d.utm_medium   || '',
    d.utm_campaign || '',
    d.ip         || '',
  ]);
  autoResizeSheet(sheet);
}

// ─── Quote popup form ──────────────────────────────────────────────────────────

function handleQuote(ss, d) {
  const HEADERS = [
    'Timestamp', 'Full Name', 'Email', 'Phone',
    'What to Source', 'Destination Country',
    'Page URL', 'Referrer',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'IP Address',
  ];
  const sheet = getOrCreateSheet(ss, 'Quote Requests', HEADERS);
  sheet.appendRow([
    fmtDate(d.timestamp),
    d.fullName       || '',
    d.email          || '',
    d.phone          || '',
    d.whatToSource   || '',
    d.destination    || '',
    d.page           || '',
    d.referrer       || '',
    d.utm_source     || '',
    d.utm_medium     || '',
    d.utm_campaign   || '',
    d.ip             || '',
  ]);
  autoResizeSheet(sheet);
}

// ─── Traffic analytics ─────────────────────────────────────────────────────────

function handleTraffic(ss, d) {
  const HEADERS = [
    'Timestamp', 'Page URL', 'Referrer',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term',
    'Browser', 'OS', 'Device', 'Language',
    'Screen Resolution', 'Viewport',
    'Country', 'IP Address',
  ];
  const sheet = getOrCreateSheet(ss, 'Traffic Analytics', HEADERS);
  sheet.appendRow([
    fmtDate(d.timestamp),
    d.page       || '',
    d.referrer   || '',
    d.utm_source   || '',
    d.utm_medium   || '',
    d.utm_campaign || '',
    d.utm_content  || '',
    d.utm_term     || '',
    d.browser    || '',
    d.os         || '',
    d.device     || '',
    d.language   || '',
    d.screen     || '',
    d.viewport   || '',
    d.country    || '',
    d.ip         || '',
  ]);
  autoResizeSheet(sheet);
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a1a1a');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function autoResizeSheet(sheet) {
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function fmtDate(iso) {
  return iso ? new Date(iso) : new Date();
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function fail(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
