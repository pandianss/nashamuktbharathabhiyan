# Setup — NMBA National Pledge Tracker

Two pieces: a **Google Sheet + Apps Script** (stores the data) and a **GitHub Pages site**
(the form and dashboard everyone opens). Budget about 20 minutes. No cost, no server bill.

---

## Part 1 — The Google Sheet (backend)

**1. Create the sheet.** Go to <https://sheets.new> and name it
`NMBA Pledge Tracker — Dindigul 2026`. Use the Google account that should own the data —
ideally the Regional Office account, not a personal one.

**2. Add the script.** In that sheet: **Extensions → Apps Script**. Delete whatever is in
`Code.gs`, paste the entire contents of [`apps-script/Code.gs`](apps-script/Code.gs), and
click the save icon.

**3. Create the sheets.** Return to the spreadsheet tab and reload the page. A new **NMBA**
menu appears next to Help. Click **NMBA → Set up sheets**. Approve the permission prompt —
Google will warn that the app is unverified because you wrote it yourself; choose
**Advanced → Go to (project name)** → **Allow**. Two tabs appear: `Branches` and `Camps`.

**4. Load the branch master.** Click **NMBA → Load Dindigul branch master (57 branches)**.
All 57 branches are inserted with their codes and the default PIN `3933`.

Then fill in the remaining columns for each branch — these are blank because only the
Regional Office knows them:

| Code | PIN | Name | Type | Block | Organiser | Designation | Contact | Email | Target |
|---|---|---|---|---|---|---|---|---|---|
| 2288 | 3933 | Natham | Branch | Natham | *(fill in)* | *(fill in)* | *(fill in)* | | *(fill in)* |

- **Organiser / Designation / Contact** pre-fill the submission form for that branch, so the
  officer doesn't retype them for every camp. Worth filling in before the 18th.
- **Type** groups the dashboard's category breakdown. Change it freely
  (Branch, School, College / ITI, Hospital / PHC, Panchayat / Village, NGO / SHG, …).
- **Target** drives the achievement percentage. Leave 0 if you aren't setting targets.
- **Block** is optional; it shows on the dashboard and next to the branch name in the dropdown.

If you would rather paste the list in yourself, [`branches.csv`](branches.csv) holds the same
57 rows in the exact column order.

**About codes and PINs.** The officer picks the branch from a dropdown that shows the code
alongside the name (`2288 — Natham`) and then enters only the **PIN**. The code is not typed
in — the site sends it automatically from the master, so there is nothing to mistype and no
redundant question on a phone screen.

All branches currently share the PIN `3933`. That is convenient to circulate, but it means
the PIN is effectively public — anyone with the link could submit for any branch. Acceptable
for pledge counts on a one-day exercise; not something to rely on if the figures matter. To
lock a branch properly, type a different PIN into that branch's PIN cell — it takes effect
immediately, no redeployment. Clearing the cell lets that branch submit with no PIN at all.

> The PIN is never sent to the browser. The site is only told *whether* a branch has one, so
> it knows to show the PIN box.

**The photo stamp.** Every photograph is branded on the phone before upload: a bottom strip
carrying `IOB Dindigul - Nasha Mukt Bharat Abhiyaan 2026`, the branch name and code, and the
latitude/longitude with the date; the NMBA mascot sits in the top-right corner. The officer
sees the finished, stamped image in the preview — that is exactly the file that is submitted.

For the real mascot, download it from the IEC folder and save it as **`assets/mascot.png`**
(a square PNG with transparency works best). Until that file exists the corner shows an
`NMBA 14446 — SAY NO TO DRUGS` badge instead, so nothing breaks if you skip this.

Tell officers to press **Capture Location before the photo** — the coordinates are drawn onto
the image. If they capture the location afterwards, the stamp redraws itself automatically, so
either order works, but the prompt on the button says to do it first.

**5. Deploy as a web app.** Back in Apps Script: **Deploy → New deployment** →
gear icon → **Web app**. Set:

- Description: `NMBA tracker v1`
- **Execute as: Me**
- **Who has access: Anyone**

Click **Deploy**, approve, and copy the **Web app URL**. It ends in `/exec`. Keep it handy.

> "Anyone" means anyone with the URL can read the figures and submit against a valid branch
> code. That is intended — the site is public. It does not give access to your Google account
> or any other file.

---

## Part 2 — The website (GitHub Pages)

**1. Paste the URL into the site.** Open `index.html`, find this line near the bottom:

```javascript
var API_URL = "";
```

Put your `/exec` URL between the quotes:

```javascript
var API_URL = "https://script.google.com/macros/s/AKfy…long…/exec";
```

**2. Create the repository.** On GitHub: **New repository**, name it `nmba-pledge-dindigul`,
**Public**, and create it. Upload `index.html`, `offline.html`, `SETUP.md` and the
`apps-script` folder (drag them onto the upload page, or push with git):

```bash
git init && git add . && git commit -m "NMBA pledge tracker" && git branch -M main && git remote add origin https://github.com/<your-username>/nmba-pledge-dindigul.git && git push -u origin main
```

**3. Turn on Pages.** Repository **Settings → Pages** → Source: **Deploy from a branch** →
Branch `main`, folder `/ (root)` → **Save**. After a minute or two your site is live at:

```
https://<your-username>.github.io/nmba-pledge-dindigul/
```

That is the link you circulate to every branch.

---

## Part 3 — Check it end to end

1. Open the site. The red "not connected" banner should be gone.
2. **Submit Camp** tab: pick a branch — the organiser's name, designation and contact
   should fill in automatically, and the camp name should suggest `Camp 1`.
3. Enter that branch's code and a small test figure, then submit.
4. Open the Google Sheet — the row is in the `Camps` tab.
5. **Dashboard** tab shows the figure; **DoSJE Report** tab shows the Sr. No 1–5 table.
6. Delete the test row from the sheet and press **Refresh** on the dashboard.

---

## Running it on 18th August

**Circulate two things to each branch:** the site link, and that branch's own code.
Send the code separately (WhatsApp or SMS to the organiser), not in a group message listing
every branch's code.

**Each branch, for every camp it conducts:** open the link, select the branch, enter the
code, name the camp, fill the figures, tap **Capture Location**, attach the geo-tagged
photograph, and press **Submit Camp**. For a second camp that day they press
**Save & Add Another Camp** — the branch, code and organiser stay filled in.

**At the Regional Office:** watch the Dashboard. It refreshes itself every minute, and the
status column shows at a glance who has not reported. Before 12:00 PM open **DoSJE Report**,
keep scope on *Consolidated*, and press **Print / PDF** — that is the submission, in the
prescribed format with the geo-tagged photographs attached. **Export CSV** gives the same
data as a spreadsheet if the district wants the working.

---

## Notes and limits

- **Corrections.** Re-submitting the *same camp name on the same date* replaces those
  figures instead of adding a second row, so a correction never double counts. A *different*
  camp name always adds a new camp.
- **Photographs** go to a Drive folder called `NMBA Pledge Photos 2026`, set to
  "anyone with the link can view" so they display on the public dashboard. Do not put
  anything confidential there. They are downscaled to 1200px on the phone before upload,
  so a camp photo costs roughly 200 KB.
- **Deadline load.** Apps Script allows a generous but finite number of requests per day.
  A few hundred camp submissions is comfortable; tens of thousands is not.
- **No internet at a venue?** Use `offline.html` — it works entirely offline in the browser,
  and the officer keys the figures into the live site afterwards.
- **Changing the script later.** After editing `Code.gs` you must **Deploy → Manage
  deployments → edit (pencil) → Version: New version → Deploy**, or the live site keeps
  running the old code. The URL stays the same.
- **Who can edit the data.** Only people you share the Google Sheet with. Branches can add
  camps through the form but can never edit or delete anything.
