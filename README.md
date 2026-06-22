# twytribute

Official website for **Texas, Whiskey & You** — an Astro site with Sanity CMS for editable content, deployed on Vercel.

## Prerequisites

- **Node.js** 22.12 or later
- A [Sanity](https://www.sanity.io/) account and project
- A [Resend](https://resend.com/) account (for contact/booking forms)
- A [Vercel](https://vercel.com/) account (for production hosting)

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `SANITY_DATASET` | No | Dataset name (default: `production`) |
| `SANITY_READ_TOKEN` | Yes | Read-only API token for build-time fetches |
| `RESEND_API_KEY` | Yes* | Resend API key for form emails |
| `CONTACT_EMAIL` | No | Inbox for form submissions (default: `sdmbooking@yahoo.com`) |

\*Required for contact/booking forms to work locally.

### 3. Start the dev server

```bash
npm run dev
```

The site runs at [http://localhost:4321](http://localhost:4321).

### 4. Run tests

```bash
npm test
```

## Sanity Studio setup

The CMS lives in the `studio/` directory.

### Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project, **or** run `npx sanity init` from the `studio/` directory.
2. Replace `YOUR_PROJECT_ID` in both `studio/sanity.config.ts` and `studio/sanity.cli.ts` with your real project ID.
3. Confirm the dataset name (`production` by default) matches your Sanity project.

### Run Studio locally

```bash
cd studio
npm install
npm run dev
```

Studio opens at [http://localhost:3333](http://localhost:3333).

### Deploy Studio (optional)

```bash
cd studio
npm run deploy
```

This publishes a hosted Studio URL at `*.sanity.studio`. You can also point a subdomain like `studio.twytribute.com` at Sanity's hosted studio.

### Seed initial content

After schemas are deployed and you have a write token, seed the CMS with the band's current shows, media, and bios:

```bash
# macOS / Linux
SANITY_PROJECT_ID=your-project-id \
SANITY_DATASET=production \
SANITY_WRITE_TOKEN=your-write-token \
node scripts/seed-sanity.mjs
```

```powershell
# Windows (PowerShell)
$env:SANITY_PROJECT_ID="your-project-id"
$env:SANITY_DATASET="production"
$env:SANITY_WRITE_TOKEN="your-write-token"
node scripts/seed-sanity.mjs
```

See [`scripts/README.md`](scripts/README.md) for details on what gets seeded and how images are handled.

## Production deployment (Vercel)

### 1. Connect the repository

1. Import the GitHub repo in the [Vercel dashboard](https://vercel.com/new).
2. Vercel auto-detects Astro — no custom build settings needed.
3. Build command: `npm run build` · Output: handled by `@astrojs/vercel` adapter.

### 2. Set environment variables

In **Project Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `SANITY_PROJECT_ID` | Your Sanity project ID |
| `SANITY_DATASET` | `production` |
| `SANITY_READ_TOKEN` | Read-only Sanity API token |
| `RESEND_API_KEY` | Your Resend API key |
| `CONTACT_EMAIL` | `sdmbooking@yahoo.com` (or your booking inbox) |

Apply to **Production**, **Preview**, and **Development** environments as needed.

### 3. Deploy

Push to `main` (or your production branch) — Vercel deploys automatically on each push.

### 4. Custom domain and DNS

1. In Vercel: **Project Settings → Domains → Add** `twytribute.com` (and `www.twytribute.com` if desired).
2. At your DNS provider (e.g. Dreamhost), add the records Vercel shows — typically:
   - **A record** for `@` → Vercel's IP, or
   - **CNAME** for `www` → `cname.vercel-dns.com`
3. Wait for DNS propagation and SSL certificate issuance (usually a few minutes).

Dreamhost can remain as the domain registrar; only DNS needs to point to Vercel.

### 5. Sanity webhook for automatic rebuilds

When editors publish content in Sanity, trigger a fresh Vercel build:

1. In Vercel: **Project Settings → Git → Deploy Hooks → Create Hook** (name it e.g. `sanity-publish`, branch `main`). Copy the hook URL.
2. In Sanity: **Project Settings → API → Webhooks → Create webhook**
   - **URL:** paste the Vercel deploy hook URL
   - **Trigger on:** Create, Update, Delete
   - **Filter:** leave empty (all document types) or restrict to `show`, `galleryItem`, `video`, `bandMember`
3. Publish a test document in Studio and confirm a new Vercel deployment starts.

Content changes appear on the live site within ~1–2 minutes of a successful rebuild.

## Resend domain setup

Contact and booking forms send email via Resend from `noreply@twytribute.com`. Before forms work in production:

1. In [Resend → Domains](https://resend.com/domains), add `twytribute.com`.
2. Add the DNS records Resend provides (SPF, DKIM, and optionally DMARC) at your DNS provider.
3. Wait for domain verification to complete.
4. Ensure `RESEND_API_KEY` is set in Vercel.

Until the domain is verified, Resend may reject sends from `@twytribute.com` addresses. Use Resend's sandbox domain for testing during development.

## Legacy URL redirects

Old Claude Design page URLs (`/Home.dc.html`, `/Shows.dc.html`, etc.) redirect to the new routes via `vercel.json`. Bookmarks and search results continue to work after the migration.

## Project structure

```
twytribute/
├── src/              # Astro pages, components, API routes
├── studio/           # Sanity Studio (CMS admin)
├── scripts/          # Seed and utility scripts
├── public/           # Static assets
└── vercel.json       # Legacy URL redirects
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite |
