# Texas, Whiskey & You — Website Rebuild Design

**Date:** 2026-06-22  
**Status:** Approved  
**Approach:** Astro static site + Sanity CMS + Vercel deployment

---

## Problem

The current site was built with Claude Design (`.dc.html` + `support.js` runtime). It works as a design prototype but is not production-ready:

- Loads React 18, ReactDOM, and Babel Standalone from CDN on every page
- Transpiles component scripts in the browser at runtime
- Fetches Nav/Footer components separately on each page load
- Duplicates Google Fonts on every page
- Uses inline styles with no build step or image optimization
- URLs are `Home.dc.html` instead of clean routes
- No SEO metadata, sitemap, or structured data
- Shows, media, and band data are hardcoded in JavaScript
- Contact and Book forms only show a fake success state — nothing is sent
- `assets/` folder is referenced but not tracked in the repo

## Goals

1. **Performance:** Lighthouse 90+, FCP < 1.2s, total page weight < 300 KB, client JS < 30 KB
2. **Content management:** Non-technical band staff can manage shows, gallery, videos, and band bios via Sanity Studio
3. **Working forms:** Contact and Book forms send email to `sdmbooking@yahoo.com`
4. **Visual fidelity:** Match current design with minor UX polish (clean URLs, better mobile, SEO)
5. **Maintainability:** Standard Astro codebase, no proprietary Claude Design runtime

## Non-Goals (v1)

- Instagram feed API integration (link to profile; static promo images acceptable)
- E-commerce or ticket sales
- Public user accounts
- Blog/news section
- Storing form submissions in a database (email only)
- Running Node.js on Dreamhost shared hosting

---

## Architecture

```
Content Editors → Sanity Studio → Sanity Content API
                                        ↓ (build-time fetch + webhook rebuild)
Visitors → Vercel CDN → Astro Static Site
Visitors → Vercel API Routes → Resend → sdmbooking@yahoo.com
```

| Component | Responsibility |
|---|---|
| **Sanity Studio** | Admin UI for shows, gallery, videos, band members |
| **Astro site** | Pre-rendered public website with clean URLs and SEO |
| **Vercel API routes** | `POST /api/contact` and `POST /api/book` — validate, rate-limit, send email |
| **Resend** | Transactional email delivery |
| **Vercel** | Hosting, CDN, serverless functions, auto-deploy from GitHub |

**Build flow:** Editor publishes in Sanity → webhook triggers Vercel rebuild → fresh static HTML in ~1–2 minutes.

**Domain:** Point `twytribute.com` DNS to Vercel. Dreamhost can remain for domain registration and email forwarding.

**Static in code (not CMS):** Home page marketing copy, nav structure, footer, page layouts, styling, Book/Contact page structure.

---

## Content Model (Sanity)

### `show`

| Field | Type | Required | Notes |
|---|---|---|---|
| `venue` | string | yes | e.g. "Lava Cantina" |
| `city` | string | yes | e.g. "The Colony, TX" |
| `date` | datetime | yes | Full date + time; site derives display formatting |
| `ticketUrl` | url | no | "Buy Tickets" hidden if empty |
| `isFeatured` | boolean | no | One show featured as "Next Up" hero |
| `status` | enum | yes | `upcoming` / `past` — auto-derived from date, manually overridable |
| `recapUrl` | url | no | Past shows link to media recaps |

### `galleryItem`

| Field | Type | Required | Notes |
|---|---|---|---|
| `image` | image | yes | Sanity CDN handles resize/optimization |
| `alt` | string | yes | Accessibility |
| `category` | enum | yes | `live` / `crowd` / `bts` / `venues` / `promo` |
| `label` | string | yes | Display tag, e.g. "Live Shows" |
| `sortOrder` | number | yes | Manual ordering |

### `video`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | e.g. "Live at Lexus Box Garden" |
| `tag` | string | yes | e.g. "Full Set" |
| `poster` | image | yes | Thumbnail |
| `youtubeId` | string | no | YouTube embed ID; omit for poster-only entries |
| `sortOrder` | number | yes | Lowest = featured on home page |

### `bandMember`

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | |
| `role` | string | yes | e.g. "Lead Vocals & Guitar" |
| `bio` | text | yes | Short paragraph |
| `funFact` | string | no | Hover reveal on Band page |
| `photo` | image | yes | |
| `photoPosition` | string | no | CSS object-position, e.g. "center 20%" |
| `sortOrder` | number | yes | Display order |

---

## Frontend (Astro)

### Routes

| Route | Content source |
|---|---|
| `/` | Static layout + upcoming shows + featured video from Sanity |
| `/shows` | Featured show + upcoming/past list from Sanity |
| `/media` | Videos + filterable gallery from Sanity |
| `/book` | Static layout + booking form |
| `/band` | Band member cards from Sanity |
| `/contact` | Static layout + contact form |

### Shared components

- `Nav.astro` — fixed nav, scroll progress, mobile menu
- `Footer.astro`
- `ShowCard.astro`, `ShowList.astro`, `FeaturedShow.astro`
- `GalleryGrid.astro`, `VideoGrid.astro`, `VideoPlayer.astro`
- `BandMemberCard.astro`
- `ContactForm.astro`, `BookingForm.astro`
- `BaseLayout.astro` — meta tags, fonts, global CSS

### Styling

Extract design tokens as CSS custom properties:

```css
--color-bg: #0D0D0D;
--color-bg-elevated: #161616;
--color-bg-hover: #1F1F1F;
--color-text: #F4E9D8;
--color-text-muted: #A8A8A8;
--color-text-dim: #6f6f6f;
--color-accent: #C47A2C;
--color-accent-light: #D38B36;
--color-accent-dark: #A45A20;
--font-display: 'Oswald', sans-serif;
--font-body: 'Manrope', sans-serif;
--font-serif: 'Zilla Slab', serif;
```

Self-hosted woff2 fonts (no Google Fonts CDN). Single shared CSS file, minified at build.

### Minor UX polish

- Clean URLs (`/shows` not `Shows.dc.html`)
- Responsive images via Astro `<Image>` + Sanity CDN
- Open Graph + JSON-LD structured data
- Lazy-loaded YouTube embed (click to play)
- Client JS only for: show filter toggle, video modal, mobile nav, form submission

---

## Forms & Email

| Route | Fields | Email subject |
|---|---|---|
| `POST /api/contact` | name, email, message | `TWY Website Contact: {name}` |
| `POST /api/book` | name, org, phone, email, date, location, audienceSize, message | `TWY Booking Inquiry: {name} — {date}` |

**Flow:** Client validation → POST to API route → server validation + honeypot check + rate limit → Resend sends HTML email to `sdmbooking@yahoo.com` → UI shows success/error.

**Spam protection:** Honeypot field + IP-based rate limiting (10 requests/hour/IP). No CAPTCHA in v1.

**No database storage** — submissions are not retained on the server.

---

## Performance Targets

| Metric | Current (est.) | Target |
|---|---|---|
| Lighthouse Performance | 40–60 | 90+ |
| First Contentful Paint | 2–4s | < 1.2s |
| Total page weight | 800 KB+ | < 300 KB |
| Client JS | 150 KB+ | < 30 KB |

**Optimizations:** Static HTML, self-hosted fonts, Astro image pipeline (WebP/AVIF), single CSS bundle, lazy YouTube, no runtime React/Babel.

---

## Deployment

- **GitHub** → push to `main` triggers Vercel deploy
- **Sanity webhook** → Vercel rebuild on content publish
- **Environment variables (Vercel):**
  - `SANITY_PROJECT_ID`
  - `SANITY_DATASET` (default: `production`)
  - `SANITY_READ_TOKEN` (read-only for build)
  - `RESEND_API_KEY`
  - `CONTACT_EMAIL` (`sdmbooking@yahoo.com`)

**Sanity Studio:** Deployed at `studio.twytribute.com` or embedded route (optional v1: use Sanity's hosted studio URL).

---

## Migration

1. Scaffold Astro project alongside existing files
2. Port design tokens and shared components
3. Port each page with visual parity check
4. Set up Sanity schemas and seed current hardcoded data
5. Wire Sanity queries into pages
6. Build form API routes + Resend
7. Optimize and commit image assets
8. DNS cutover to Vercel
9. Remove `.dc.html` files and `support.js`

---

## Project Structure

```
twytribute/
├── src/
│   ├── components/       # Astro components
│   ├── layouts/          # BaseLayout.astro
│   ├── pages/            # Route pages + api/
│   ├── lib/              # Sanity client, show helpers, email
│   └── styles/           # global.css, tokens
├── studio/               # Sanity Studio project
│   ├── schemas/
│   └── sanity.config.ts
├── public/
│   ├── fonts/
│   └── favicon.ico
├── astro.config.mjs
├── package.json
└── docs/superpowers/
```

---

## Error Handling

- **Sanity fetch failure at build:** Build fails loudly; no stale deploy
- **Form validation failure:** Return 400 with field-level errors
- **Resend failure:** Return 500, log error, show user-friendly retry message
- **Rate limit exceeded:** Return 429 with "Please try again later"
- **Missing env vars:** Fail at startup with clear error message

---

## Testing Strategy

- **Unit tests:** Show date formatting, calendar URL generation, form validation helpers (Vitest)
- **Manual:** Visual parity check per page against current site
- **Manual:** Form submission end-to-end (contact + book)
- **Manual:** Lighthouse audit on home and shows pages post-deploy
- **CMS:** Seed script populates Sanity with current hardcoded data for verification
