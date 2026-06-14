# Carer Timesheets — how it works

Three pieces, working together:

1. **The logbook photo** is read into shift rows. Reading handwriting reliably needs AI vision — do this step in Cowork (send the photo, get the rows back). A human always checks before pay.
2. **`timesheet-tool.html`** — where you review/edit the shifts, download the PNG per carer to send them, and save the period to the shared Google Sheet. Runs in any browser; nothing leaves it except the Sheet save.
3. **The Google Sheet** — append-only history shared with family.

## Each pay period

1. **OCR the photo.** In Cowork, send the logbook photo: "read this logbook into shift rows." You get back lines like:
   ```
   Da, 2026-06-04, 20:00, 2026-06-06, 07:00
   Nun, 2026-06-06, 07:00, 2026-06-07, 07:00
   ```
2. **Open `timesheet-tool.html`.** Set the period label and the period **start/end** (e.g. 1 Jun 07:00 → 16 Jun 07:00). Confirm rates (Da RM12, Nun RM9).
3. **Paste the rows** into box 2, click "Load these rows." Edit any cell that looks wrong against the photo. Tick "2×" on negotiated double-rate holiday rows.
4. **Check the banner.** It sums both carers' hours and compares to the full period. Green = the period is fully covered (e.g. 360h). Red = a shift is missing or a time is wrong — fix before paying.
5. **Per carer:** switch the tab, **Download as image (PNG)** to send the carer, and/or **Copy table**.
6. **Save period to Google Sheet** — appends every row to the History tab. The button now reports back how many rows were actually saved (or what went wrong).

Double-rate days: tick the "2×" box on the row. That row turns **green** in the output (and in the sheet), shows a "2×" tag, and pays double. Use the **Annotation** column for any note (e.g. "Hari Raya — double rate", "arrived late"); it appears in the output only when at least one row has a note, and is saved to the sheet.

The "Total hours" line in the output is labelled with the period end (e.g. "Total hours to 16/06/2026 07:00") once you set the period end date.

## How hours are counted

Total hours = (Date out + Time out) − (Date in + Time in) — **every hour the carer is present**, including multi-day shifts. (Note: this differs from the old December sheet, which only counted single day-segments on long shifts. You chose to apply the all-hours-present basis going forward.)

## The sum check

Because exactly one carer is present at all times, the two carers' paid hours must add up to the full period length. 1 Jun 07:00 → 16 Jun 07:00 = 360 hours. The tool enforces this automatically and warns if it's off.

## One-time Google Sheet setup

See `google-apps-script.gs` — paste it into your sheet (Extensions > Apps Script), deploy as a Web App with access "Anyone", copy the **/exec** URL, paste it into the tool's setup box, and click **Test connection**. Family members paste the same URL once into their own copy of the tool. After that, no Cowork is needed for the *save* step — only the OCR step needs Cowork.

### If "Save" confirms but nothing appears in the sheet

This is almost always one of three things:

1. **Access not set to "Anyone."** Re-deploy: Deploy > Manage deployments > edit (pencil) > "Who has access: Anyone" > Deploy.
2. **Wrong URL** — you used the `/dev` URL. Use the one ending in `/exec`.
3. **Script edited but not re-deployed.** After any edit to the script you must Deploy > Manage deployments > New version. The old version keeps running otherwise.

Use the **Test connection** button — it tells you whether the URL is actually reachable, instead of the save step silently appearing to succeed.

## Hosting for family (free)

Upload the single HTML file to GitHub Pages, Netlify Drop, or Cloudflare Pages for a shareable link. It carries no data, so the link is safe to share.

## Honest limitations

- The HTML can't read handwriting itself — that step uses Cowork.
- The Sheet save appends data rows; it does not reproduce the blue/grey cell shading of your screenshots. The **PNG export** is what gives you the formatted picture to send carers; the Sheet is the data record.
