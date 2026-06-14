/**
 * Carer Timesheets — receiver for the HTML tool.
 * Appends each saved period as rows into a "History" sheet.
 *
 * SETUP (one-time, ~3 minutes):
 * 1. Open your Google Sheet.
 * 2. Menu: Extensions > Apps Script.
 * 3. Delete any sample code, paste THIS whole file, click Save (disk icon).
 * 4. Click Deploy > New deployment.
 *      - Click the gear next to "Select type" > Web app
 *      - Description: timesheet receiver
 *      - Execute as: Me (your account)
 *      - Who has access: Anyone        <-- REQUIRED. Not "Anyone with Google account".
 *    Click Deploy, then Authorize access and allow.
 * 5. Copy the "Web app URL" — it must END IN /exec  (NOT /dev).
 * 6. Paste that URL into the HTML tool's "Apps Script Web App URL" box,
 *    then click "Test connection".
 *
 * IMPORTANT: every time you EDIT this script you must Deploy > Manage deployments
 * > edit (pencil) > Version: New version > Deploy. Otherwise the old code keeps running.
 *
 * If "Save" shows confirmation but nothing appears in the sheet, the usual cause is:
 *   - access was not set to "Anyone", or
 *   - you used the /dev URL instead of /exec, or
 *   - the script was edited but not re-deployed as a new version.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName("History");
    if (!sh) {
      sh = ss.insertSheet("History");
      sh.appendRow([
        "Saved at", "Period", "Carer", "Day",
        "Date in", "Time in", "Date out", "Time out",
        "Total hours", "Hourly rate (RM)", "Double rate", "Salary (RM)", "Annotation",
        "Raw rows", "Period total hours", "Period total salary (RM)"
      ]);
      sh.getRange(1, 1, 1, 16).setFontWeight("bold").setBackground("#d9d9d9");
      sh.setFrozenRows(1);
    }
    var now = new Date();
    var rows = data.rows || [];
    rows.forEach(function (r) {
      sh.appendRow([
        now, r.period, r.carer, r.day,
        r.dateIn, r.timeIn, r.dateOut, r.timeOut,
        r.totalHours, r.hourlyRate, r.doubleRate || "", r.salary, r.note || "",
        r.rawRow || "", r.periodTotalHours || "", r.periodTotalSalary || ""
      ]);
    });
    // Green text for any double-rate rows just written
    if (rows.length) {
      var startRow = sh.getLastRow() - rows.length + 1;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].doubleRate === "YES") {
          sh.getRange(startRow + i, 1, 1, 16).setFontColor("#1e7e34").setFontWeight("bold");
        }
      }
    }
    return json({ ok: true, added: rows.length, sheet: "History" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("Carer Timesheets receiver is live.");
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
