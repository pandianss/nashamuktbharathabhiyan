/**
 * NMBA National Pledge Tracker — backend
 * Nasha Mukt Bharat Abhiyaan | National Pledge Against Drug Abuse | 18.08.2026
 *
 * Paste this into Extensions > Apps Script of your tracking Google Sheet,
 * then run "NMBA > Set up sheets" from the sheet menu and deploy as a Web app.
 * Full steps are in SETUP.md.
 *
 * Data model
 *   Branches  — the master list. One row per branch / office / unit / institution,
 *               carrying its organiser details, which pre-fill the submission form.
 *   Camps     — one row per camp. A branch may conduct any number of camps; each
 *               is recorded separately and the branch total is their sum.
 */

var BRANCH_SHEET = 'Branches';
var CAMP_SHEET   = 'Camps';
var PHOTO_FOLDER = 'NMBA Pledge Photos 2026';
var PLEDGE_DATE  = '2026-08-18';

var BRANCH_COLS = ['Code', 'PIN', 'Name', 'Type', 'Block', 'Organiser', 'Designation',
                   'Contact', 'Email', 'Target'];

var CAMP_COLS = ['Timestamp', 'Code', 'Branch', 'Date', 'Camp', 'Venue',
                 'Total', 'Women', 'Youth', 'Certificates',
                 'Latitude', 'Longitude', 'ConductedBy', 'Designation', 'Contact',
                 'Remarks', 'PhotoURL', 'PhotoFileId', 'Revisions'];

/* ------------------------------------------------------------------ menu */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('NMBA')
    .addItem('Set up sheets', 'setupSheets')
    .addItem('Load Dindigul branch master (57 branches)', 'loadBranchMaster')
    .addToUi();
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  header_(sheet_(ss, BRANCH_SHEET), BRANCH_COLS);
  header_(sheet_(ss, CAMP_SHEET), CAMP_COLS);
  SpreadsheetApp.getUi().alert(
    'Sheets ready.\n\n' +
    '1. Fill the "Branches" sheet — one row per branch / institution, with its ' +
    'organiser name, designation and contact. Give each a unique Code ' +
    '(e.g. DGL-PLN) and share that code only with that branch.\n\n' +
    '2. Camps submitted from the website land in the "Camps" sheet.');
}

function sheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function header_(sh, cols) {
  sh.getRange(1, 1, 1, cols.length).setValues([cols])
    .setFontWeight('bold').setBackground('#000080').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, cols.length);
}

/** Default PIN issued to every branch. Change it for an individual branch by
 *  editing that row's PIN cell in the Branches sheet. */
var DEFAULT_PIN = '3933';

/** The Dindigul branch master: [code, name, type]. Organiser, designation,
 *  contact, block and target are filled in by the Regional Office afterwards. */
var BRANCH_MASTER = [
  ['3933', 'Regional Office, Dindigul',        'Regional Office'],
  ['332',  'Dindigul Main',                    'Branch'],
  ['1314', 'Dindigul Fort',                    'Branch'],
  ['1830', 'Dindigul Collectorate',            'Government Office'],
  ['4069', 'Loan Processing Centre, Dindigul', 'Processing Centre'],
  ['2098', 'RM Colony',                        'Branch'],
  ['910',  'Sembatti',                         'Branch'],
  ['911',  'Kalwarpatti',                      'Branch'],
  ['924',  'Puduchatram',                      'Branch'],
  ['1013', 'Reddiapatti',                      'Branch'],
  ['1044', 'Lakshmipuram',                     'Branch'],
  ['1112', 'Nagayakottai',                     'Branch'],
  ['1152', 'Narikkalpatti',                    'Branch'],
  ['1220', 'Salaiyur',                         'Branch'],
  ['1221', 'Marambadi',                        'Branch'],
  ['1258', 'Oddanchatram',                     'Branch'],
  ['1316', 'Palayam',                          'Branch'],
  ['1317', 'N Paraipatti',                     'Branch'],
  ['1401', 'Silukkuwarpatti',                  'Branch'],
  ['1789', 'Tamaraikulam',                     'Branch'],
  ['2286', 'Batlagundu',                       'Branch'],
  ['2287', 'Andipatti',                        'Branch'],
  ['2288', 'Natham',                           'Branch'],
  ['2461', 'Vadamadurai',                      'Branch'],
  ['2464', 'Nilakottai',                       'Branch'],
  ['2685', 'Silapadi',                         'Branch'],
  ['2686', 'Chinnalapatti',                    'Branch'],
  ['2702', 'KK Patti',                         'Branch'],
  ['2703', 'PC Patti',                         'Branch'],
  ['2704', 'T Subbulapuram',                   'Branch'],
  ['2705', 'V Gopalpatti',                     'Branch'],
  ['2706', 'K Reddiarchatram',                 'Branch'],
  ['3164', 'Sendurai',                         'Branch'],
  ['3165', 'Ponnagaram',                       'Branch'],
  ['3166', 'Thadikombu',                       'Branch'],
  ['3346', 'Vangamanuthu',                     'Branch'],
  ['3347', 'Anaipatti',                        'Branch'],
  ['3436', 'Kodaikanal',                       'Branch'],
  ['3437', 'Dharumathupatti',                  'Branch'],
  ['3549', 'Ambilikai',                        'Branch'],
  ['3920', 'Balakrishnapuram',                 'Branch'],
  ['4153', 'Kosavapatti',                      'Branch'],
  ['232',  'Pannaikadu',                       'Branch'],
  ['237',  'Sithayamkottai',                   'Branch'],
  ['243',  'Pattiveeranpatti',                 'Branch'],
  ['230',  'Vedasandur',                       'Branch'],
  ['376',  'Palani',                           'Branch'],
  ['175',  'Ayakudi',                          'Branch'],
  ['883',  'Rasingapuram',                     'Branch'],
  ['174',  'Theni Allinagaram',                'Branch'],
  ['176',  'Cumbum',                           'Branch'],
  ['1560', 'Chinnamanur',                      'Branch'],
  ['1919', 'Uthamapalayam',                    'Branch'],
  ['1931', 'Periyakulam',                      'Branch'],
  ['2574', 'Bodinayakanur',                    'Branch'],
  ['3548', 'Boothipuram',                      'Branch'],
  ['1896', 'Theni Medical College',            'College / Institution']
];

function loadBranchMaster() {
  var sh = sheet_(SpreadsheetApp.getActiveSpreadsheet(), BRANCH_SHEET);
  if (sh.getLastRow() < 1) header_(sh, BRANCH_COLS);

  var seen = {};
  readRows_(sh).forEach(function (b) {
    seen[String(b.Code === undefined ? '' : b.Code).trim().toUpperCase()] = true;
  });

  var add = BRANCH_MASTER
    .filter(function (r) { return !seen[r[0]]; })
    .map(function (r) {
      // Code, PIN, Name, Type, Block, Organiser, Designation, Contact, Email, Target
      return [r[0], DEFAULT_PIN, r[1], r[2], '', '', '', '', '', 0];
    });

  if (add.length) {
    sh.getRange(sh.getLastRow() + 1, 1, add.length, BRANCH_COLS.length).setValues(add);
    sh.getRange(2, 1, sh.getLastRow() - 1, 2).setNumberFormat('@'); // keep codes/PINs as text
  }
  SpreadsheetApp.getUi().alert(
    add.length + ' branch(es) added; ' + (BRANCH_MASTER.length - add.length) + ' already present.\n\n' +
    'Every branch has the default PIN ' + DEFAULT_PIN + '. Fill in each branch\'s organiser, ' +
    'designation, contact and pledge target — those pre-fill the submission form.');
}

/* ------------------------------------------------------------- sheet i/o */

function readRows_(sh) {
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getDataRange().getValues();
  var head = values.shift();
  return values.map(function (row, i) {
    var o = { _row: i + 2 };
    head.forEach(function (h, c) { if (h) o[h] = row[c]; });
    return o;
  });
}

function branches_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BRANCH_SHEET);
  return readRows_(sh)
    .filter(function (b) { return String(b.Name || '').trim(); })
    .map(function (b) {
      return {
        code:   String(b.Code === undefined ? '' : b.Code).trim(),
        // The PIN itself is never sent to the browser — only whether one is set.
        pinReq: String(b.PIN === undefined ? '' : b.PIN).trim() !== '',
        name:   String(b.Name).trim(),
        type:   String(b.Type || 'Other').trim(),
        block:  String(b.Block || '').trim(),
        person: String(b.Organiser || '').trim(),
        desig:  String(b.Designation || '').trim(),
        phone:  String(b.Contact === undefined ? '' : b.Contact).trim(),
        email:  String(b.Email || '').trim(),
        target: Number(b.Target) || 0
      };
    });
}

function camps_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAMP_SHEET);
  return readRows_(sh)
    .filter(function (c) { return String(c.Branch || '').trim(); })
    .map(function (c) {
      return {
        unit:   String(c.Branch).trim(),
        date:   fmtDate_(c.Date),
        camp:   String(c.Camp || '').trim(),
        venue:  String(c.Venue || '').trim(),
        total:  Number(c.Total) || 0,
        women:  Number(c.Women) || 0,
        youth:  Number(c.Youth) || 0,
        cert:   Number(c.Certificates) || 0,
        lat:    String(c.Latitude === undefined ? '' : c.Latitude).trim(),
        lng:    String(c.Longitude === undefined ? '' : c.Longitude).trim(),
        by:     String(c.ConductedBy || '').trim(),
        desig:  String(c.Designation || '').trim(),
        rem:    String(c.Remarks || '').trim(),
        photo:  String(c.PhotoURL || '').trim(),
        rev:    Number(c.Revisions) || 0
      };
    });
}

function fmtDate_(v) {
  if (!v) return PLEDGE_DATE;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

/* -------------------------------------------------------------- read API */

function doGet(e) {
  var p = (e && e.parameter) || {};
  var out;
  try {
    out = { ok: true, branches: branches_(), camps: camps_(), pledgeDate: PLEDGE_DATE };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return reply_(out, p.callback);
}

/* ------------------------------------------------------------- write API */

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    try { body = JSON.parse(((e && e.parameter) || {}).payload || '{}'); } catch (e2) { body = {}; }
  }
  var cb = ((e && e.parameter) || {}).callback;
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    return reply_(submit_(body), cb);
  } catch (err) {
    return reply_({ ok: false, error: String((err && err.message) || err) }, cb);
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function submit_(b) {
  var code = String(b.code || '').trim().toUpperCase();
  var branchName = String(b.unit || '').trim();
  if (!code) return { ok: false, error: 'Branch code is required.' };
  if (!branchName) return { ok: false, error: 'Select your branch.' };

  // Read the raw master row so the PIN can be checked without ever exposing it.
  var raw = null;
  readRows_(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BRANCH_SHEET))
    .forEach(function (r) { if (String(r.Name || '').trim() === branchName) raw = r; });
  if (!raw) return { ok: false, error: 'Unknown branch. Contact the Regional Office.' };

  if (String(raw.Code === undefined ? '' : raw.Code).trim().toUpperCase() !== code) {
    return { ok: false, error: 'Branch code does not match this branch.' };
  }

  var pin = String(raw.PIN === undefined ? '' : raw.PIN).trim();
  if (pin && pin !== String(b.pin || '').trim()) {
    return { ok: false, error: 'Incorrect PIN for this branch.' };
  }

  var match = {
    name:   branchName,
    person: String(raw.Organiser || '').trim(),
    desig:  String(raw.Designation || '').trim(),
    phone:  String(raw.Contact === undefined ? '' : raw.Contact).trim()
  };

  var total = num_(b.total), women = num_(b.women), youth = num_(b.youth), cert = num_(b.cert);
  if (total <= 0) return { ok: false, error: 'Total pledges must be greater than zero.' };
  if (women > total) return { ok: false, error: 'Women cannot exceed the total.' };
  if (youth > total) return { ok: false, error: 'Youth cannot exceed the total.' };

  var date = String(b.date || PLEDGE_DATE).trim();
  var camp = String(b.camp || '').trim() || 'Camp 1';

  var sh = sheet_(SpreadsheetApp.getActiveSpreadsheet(), CAMP_SHEET);
  if (sh.getLastRow() < 1) header_(sh, CAMP_COLS);

  // Each camp is its own row, so a branch's camps add up. Re-submitting the
  // SAME camp name on the same date revises that camp instead of duplicating it.
  var existing = null;
  readRows_(sh).forEach(function (r) {
    if (String(r.Branch).trim() === branchName &&
        fmtDate_(r.Date) === date &&
        String(r.Camp || '').trim().toLowerCase() === camp.toLowerCase()) {
      existing = r;
    }
  });

  var photo = { url: existing ? String(existing.PhotoURL || '') : '',
                id:  existing ? String(existing.PhotoFileId || '') : '' };
  if (b.photo) {
    var saved = savePhoto_(b.photo, branchName, camp, date);
    if (saved.error) return { ok: false, error: saved.error };
    photo = saved;
  }

  var row = [
    new Date(), code, branchName, date, camp, String(b.venue || ''),
    total, women, youth, cert,
    String(b.lat || ''), String(b.lng || ''),
    String(b.by || match.person), String(b.desig || match.desig), String(b.phone || match.phone),
    String(b.rem || ''), photo.url, photo.id,
    existing ? (Number(existing.Revisions) || 0) + 1 : 0
  ];

  if (existing) {
    sh.getRange(existing._row, 1, 1, CAMP_COLS.length).setValues([row]);
  } else {
    sh.getRange(sh.getLastRow() + 1, 1, 1, CAMP_COLS.length).setValues([row]);
  }

  var branchTotal = 0, campCount = 0;
  camps_().forEach(function (c) {
    if (c.unit === branchName) { branchTotal += c.total; campCount++; }
  });

  return {
    ok: true,
    revised: !!existing,
    branch: branchName,
    camp: camp,
    total: total,
    branchTotal: branchTotal,
    camps: campCount,
    message: existing
      ? 'Figures for "' + camp + '" have been revised.'
      : '"' + camp + '" recorded for ' + branchName + '.'
  };
}

function num_(v) {
  var x = Number(v);
  return (isNaN(x) || x < 0) ? 0 : Math.round(x);
}

function savePhoto_(dataUrl, branchName, camp, date) {
  try {
    var m = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
    if (!m) return { error: 'Photo format not recognised.' };
    var bytes = Utilities.base64Decode(m[2]);
    if (bytes.length > 10 * 1024 * 1024) return { error: 'Photo is too large (max 10 MB).' };
    var name = (branchName + ' - ' + camp).replace(/[^\w\s-]/g, '').trim() + ' - ' + date + '.jpg';
    var file = folder_().createFile(Utilities.newBlob(bytes, m[1], name));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return {
      id: file.getId(),
      url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200'
    };
  } catch (err) {
    return { error: 'Could not save the photo: ' + err };
  }
}

function folder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (ignore) {}
  }
  var it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  var f = it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
  props.setProperty('PHOTO_FOLDER_ID', f.getId());
  return f;
}

/* --------------------------------------------------------------- replies */

function reply_(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[\w$.]+$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
