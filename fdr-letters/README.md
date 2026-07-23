# FDR Letter Generator

Standalone internal tool for generating Release, SIF (Settlement Offer), and
Balance letters as pixel-matched PDFs, gated behind a shared password.

## What's in here

- **Release Letter** — Letter of Release (paid in full / settlement paid)
- **SIF Letter** — Settlement Offer, with an optional payment-terms builder
  (quick equal-installment mode, or fully manual rows for uneven splits like
  "$10,000 today + $9,000 next month")
- **Balance Letter** — authorized-agent confirmation letter

All three match your existing letterhead exactly (logo extracted directly
from your PDFs), including the "Without Prejudice" header, bilingual footer,
and province permit/license line.

## Security model

This app is gated by a single shared password, checked server-side by a
Netlify function (`netlify/functions/auth.js`). The password is **never**
shipped in the JS bundle — it lives only in a Netlify environment variable,
so it can't be extracted by viewing page source or the compiled bundle.

On success, the function issues a signed, time-limited session token
(HMAC-SHA256, valid ~10 hours) stored in the browser's `sessionStorage`
(cleared when the tab closes). Every reload re-validates the token
server-side.

**Note on the tradeoff you chose:** a single shared password is simpler to
manage but means you can't tell which manager generated which letter, and if
it leaks, everyone needs a new one. If you ever want per-manager accounts and
an audit trail (who generated what, when), that's a moderate follow-up change
— just say the word.

### Setup (one-time)

1. In Netlify: **Site configuration → Environment variables**, add:
   - `APP_PASSWORD` — the shared password managers will use
   - `SESSION_SECRET` — any long random string (used to sign session tokens,
     not shown to users). Generate one with:
     `openssl rand -hex 32`
2. Deploy. That's it — no Supabase or database needed for this app.

## Payment terms on the SIF letter

The "Payment terms" section on the SIF form supports two modes:

- **Quick builder**: enter a down payment + how many remaining installments
  and the frequency (weekly/biweekly/monthly). It auto-calculates even
  splits and puts any rounding remainder on the last payment.
- **Custom/manual**: add any number of rows with any amount and due date —
  use this for uneven splits like $10,000 today and $9,000 by a specific
  date, or irregular multi-payment plans.

Whatever schedule is built gets turned into a plain-English sentence and
inserted into the letter body automatically (e.g. *"Payment will be made as
follows: $10,000.00 due today (July 23, 2026), and $9,000.00 due August 31,
2026, to settle this account in full."*). You can leave this section empty
for a straightforward lump-sum settlement.

## Download / Open in Mail

After generating a letter you get two options:

- **Download PDF** — saves the file directly.
- **Open in Mail (attach PDF)** — on most phones and some desktop browsers
  this uses the native share sheet, which lets you pick Mail/Outlook and
  attaches the PDF for real. Browsers don't allow a webpage to silently
  attach a file to your email client, so where the share sheet isn't
  available, it downloads the PDF and opens a pre-filled email draft — you'll
  just need to drag the downloaded file in. If you'd rather this send
  straight from the app itself (no manual attach step, ever), that needs a
  backend email service (e.g. Postmark/SendGrid) added — happy to wire that
  up if you want it.

## Deploying (same flow as your other FDR tools)

```bash
git init
git add .
git commit -m "FDR letter generator"
git remote add origin <your-new-github-repo-url>
git push -u origin main
```

Then in Netlify: **Add new site → Import from GitHub**, pick the repo. Build
command and publish directory are already set in `netlify.toml`
(`npm run build` → `dist`). Add the two environment variables above before
or right after the first deploy.

## Local development

```bash
npm install
npm run dev
```

Note: the password-gate function needs the Netlify dev server to run
alongside Vite for local testing:

```bash
npm install -g netlify-cli
netlify dev
```

## Extending later

- **Province license numbers**: `src/data/provinces.js` only has confirmed
  numbers for ON, BC, and AB (from your sample letters). Add the rest as you
  confirm them — anything missing just leaves the line blank so nothing
  prints incorrectly.
- **Per-manager accounts / audit log**: swap the shared-password function for
  Supabase Auth (same pattern as your other tools) if you want individual
  logins and a record of who generated each letter.
- **True one-click email send**: add a Netlify function using an email API
  (Postmark, SendGrid, Resend) to send the letter as a real attachment
  without relying on the manager's own mail client.
