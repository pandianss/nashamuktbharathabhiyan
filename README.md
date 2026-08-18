# NMBA National Pledge Tracker — Dindigul Region

Tracks the **National Pledge Against Drug Abuse** held on **18 August 2026** under
Nasha Mukt Bharat Abhiyaan, across the branches, offices, units and institutions attached
to Dindigul — and produces the consolidated report in the format DoSJE asked for.

## What it does

- **Branches master** — all 57 Dindigul branches preloaded with their codes, plus organiser, designation,
  contact and pledge target. Selecting a branch on the form pre-fills the organiser.
- **Multiple camps per branch** — each camp is recorded separately with its own figures,
  venue, geo-tagged photograph and coordinates; the branch total is their sum.
- **PIN-gated** — pick the branch from the dropdown (code shown alongside the name) and enter
  the PIN; the code is sent automatically, never retyped.
- **Stamped photographs** — the campaign line, branch name, geo coordinates and the NMBA
  mascot are burned into every photo on the phone before upload.
- **Live dashboard** — running totals, per-branch achievement against target, camp counts,
  category breakdown, and who has not yet reported.
- **DoSJE report** — the prescribed Sr. No 1–5 table (pledges / women / youth /
  e-certificates / geo-tagged photographs), consolidated or for a single branch, ready to
  print as PDF. CSV export for the working.
- **Offline fallback** — `offline.html` runs with no internet or server at all.

## Files

| File | Purpose |
|---|---|
| `index.html` | The portal — phone-first submission form, dashboard, report. Deploy to GitHub Pages. |
| `apps-script/Code.gs` | Backend + the 57-branch master. Paste into the tracking Sheet's Apps Script editor. |
| `offline.html` | Standalone browser-only version for venues without connectivity. |
| `SETUP.md` | Step-by-step setup and the run-day procedure. |
| `branches.csv` | The 57-branch master as CSV, if you prefer to paste it in by hand. |
| `assets/logo.svg` | IOB logo shown in the app bar. Must be deployed alongside `index.html`. |
| `assets/mascot.png` | *Optional* — NMBA mascot for the photo stamp. A badge is drawn if absent. |

## Setup

See **[SETUP.md](SETUP.md)** — Google Sheet + Apps Script for the data, GitHub Pages for
the site. About 20 minutes, no cost.

Deploy the whole folder (`index.html`, `assets/`, `offline.html`). Before deploying, paste
your Apps Script Web App URL into `index.html`:

```javascript
var API_URL = "https://script.google.com/macros/s/…/exec";
```

## Reference

- e-Pledge portal — <https://nashamukt.dosje.gov.in/epledge>
- IEC material (logo, mascot, branding) — [Drive folder](https://drive.google.com/drive/folders/1WWEHilCyvo_MDQIGjBJn0H6D4ApPtwp1)
- NMBA helpline — **14446**

## Design

Phone-first: the officers filling this in are standing at a camp with one hand free. Bottom
tab bar, single-column cards, 48px tap targets, 16px inputs (smaller ones make iOS zoom on
focus), camera capture straight from the photo field. On tablet and desktop the bottom bar
becomes a top nav and the tiles spread to four across.

The theme is built on the IOB mark — brand blue `#254aa0` — with sunrise accents: saffron
`#f28c28`, gold `#f7b733` and green `#1a8a3c`. There is no banner image: on a phone it ate the
screen the officer needs for the form.
