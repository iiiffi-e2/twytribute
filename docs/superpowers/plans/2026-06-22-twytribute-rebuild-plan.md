# TWY Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Texas, Whiskey & You band site from Claude Design into a performant Astro static site with Sanity CMS for editable content and working email forms.

**Architecture:** Astro generates static HTML at build time, fetching shows/media/bios from Sanity. Vercel hosts the site and runs two serverless API routes for form email via Resend. Sanity Studio provides the admin UI for non-technical editors.

**Tech Stack:** Astro 5, Sanity 3, `@sanity/client`, `@sanity/image-url`, Resend, Vitest, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-22-twytribute-rebuild-design.md`

---

## File Structure

```
twytribute/
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ShowCard.astro
│   │   ├── ShowList.astro
│   │   ├── FeaturedShow.astro
│   │   ├── GalleryGrid.astro
│   │   ├── VideoGrid.astro
│   │   ├── BandMemberCard.astro
│   │   ├── ContactForm.astro
│   │   └── BookingForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── shows.astro
│   │   ├── media.astro
│   │   ├── book.astro
│   │   ├── band.astro
│   │   ├── contact.astro
│   │   └── api/
│   │       ├── contact.ts
│   │       └── book.ts
│   ├── lib/
│   │   ├── sanity.ts
│   │   ├── queries.ts
│   │   ├── shows.ts
│   │   ├── forms.ts
│   │   └── email.ts
│   ├── scripts/
│   │   ├── nav.ts
│   │   ├── show-filter.ts
│   │   └── video-player.ts
│   └── styles/
│       └── global.css
├── studio/
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── show.ts
│   │   ├── galleryItem.ts
│   │   ├── video.ts
│   │   └── bandMember.ts
│   ├── sanity.config.ts
│   ├── package.json
│   └── tsconfig.json
├── public/
│   └── fonts/
├── scripts/
│   └── seed-sanity.mjs
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── .env.example
```

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `.env.example`

- [ ] **Step 1: Initialize Astro with minimal template**

Run from repo root:
```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --yes
```

Expected: Astro scaffolds into current directory (alongside existing `.dc.html` files).

- [ ] **Step 2: Add dependencies**

```bash
npm install @sanity/client @sanity/image-url resend
npm install -D vitest @types/node
```

- [ ] **Step 3: Configure Astro for Vercel serverless**

Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel({ webAnalytics: false }),
  image: {
    domains: ['cdn.sanity.io'],
  },
});
```

Run: `npm install @astrojs/vercel`

- [ ] **Step 4: Create `.env.example`**

```env
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_READ_TOKEN=
RESEND_API_KEY=
CONTACT_EMAIL=sdmbooking@yahoo.com
```

- [ ] **Step 5: Verify dev server starts**

Run: `npm run dev`
Expected: Site serves at `http://localhost:4321`

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ .env.example
git commit -m "chore: scaffold Astro project for TWY rebuild"
```

---

### Task 2: Design tokens and global CSS

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write global CSS with design tokens**

Create `src/styles/global.css`:
```css
:root {
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
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  overflow-x: hidden;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

@keyframes twyMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes twyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.btn-primary {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent-dark));
  padding: 16px 32px;
  border-radius: 2px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 26px rgba(196, 122, 44, 0.4);
}

.btn-secondary {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text);
  background: rgba(244, 233, 216, 0.04);
  border: 1.5px solid rgba(244, 233, 216, 0.4);
  padding: 16px 32px;
  border-radius: 2px;
  text-decoration: none;
}

.section-label {
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.section-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(34px, 5vw, 60px);
  line-height: 0.96;
  text-transform: uppercase;
  color: var(--color-text);
  margin: 0;
}
```

- [ ] **Step 2: Create BaseLayout with font preloads and meta**

Create `src/layouts/BaseLayout.astro`:
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Texas, Whiskey & You — North Texas\'s premier Chris Stapleton tribute experience.' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <link rel="preload" href="/fonts/oswald.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin />
</head>
<body>
  <slot />
</body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 3: Download and add self-hosted fonts to `public/fonts/`**

Download Oswald (600,700), Manrope (400,600,700), Zilla Slab (500,600) as woff2 subsets. Add `@font-face` rules to `global.css`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro public/fonts/
git commit -m "feat: add design tokens and global CSS"
```

---

### Task 3: Show utility functions (with tests)

**Files:**
- Create: `src/lib/shows.ts`, `src/lib/shows.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Write failing tests**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node' },
});
```

Create `src/lib/shows.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatShowDate, buildMapsUrl, buildCalendarUrl, deriveStatus } from './shows';

describe('formatShowDate', () => {
  it('formats date parts for display', () => {
    const result = formatShowDate('2026-08-15T20:00:00');
    expect(result).toEqual({ day: '15', mon: 'AUG', year: '2026', time: '8:00 PM' });
  });
});

describe('buildMapsUrl', () => {
  it('encodes venue and city', () => {
    expect(buildMapsUrl('Lava Cantina', 'The Colony, TX'))
      .toBe('https://www.google.com/maps/search/?api=1&query=Lava%20Cantina%20The%20Colony%2C%20TX');
  });
});

describe('buildCalendarUrl', () => {
  it('builds Google Calendar link', () => {
    const url = buildCalendarUrl({
      venue: 'Lava Cantina',
      city: 'The Colony, TX',
      date: '2026-08-15T20:00:00',
    });
    expect(url).toContain('calendar.google.com');
    expect(url).toContain('Texas%2C%20Whiskey');
  });
});

describe('deriveStatus', () => {
  it('returns upcoming for future dates', () => {
    expect(deriveStatus('2099-01-01T20:00:00')).toBe('upcoming');
  });
  it('returns past for past dates', () => {
    expect(deriveStatus('2020-01-01T20:00:00')).toBe('past');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/shows.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement show utilities**

Create `src/lib/shows.ts`:
```typescript
export interface ShowInput {
  venue: string;
  city: string;
  date: string;
}

export function formatShowDate(isoDate: string) {
  const d = new Date(isoDate);
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const time = minutes === 0 ? `${h12}:00 ${ampm}` : `${h12}:${String(minutes).padStart(2,'0')} ${ampm}`;
  return {
    day: String(d.getDate()),
    mon: months[d.getMonth()],
    year: String(d.getFullYear()),
    time,
  };
}

export function buildMapsUrl(venue: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${city}`)}`;
}

export function buildCalendarUrl(show: ShowInput) {
  const d = new Date(show.date);
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const text = encodeURIComponent(`Texas, Whiskey & You @ ${show.venue}`);
  const loc = encodeURIComponent(`${show.venue}, ${show.city}`);
  const details = encodeURIComponent('Live tribute to Chris Stapleton');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${ymd}/${ymd}&location=${loc}&details=${details}`;
}

export function deriveStatus(isoDate: string): 'upcoming' | 'past' {
  return new Date(isoDate) >= new Date() ? 'upcoming' : 'past';
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/shows.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Add test script to package.json**

```json
"scripts": {
  "test": "vitest run"
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/shows.ts src/lib/shows.test.ts vitest.config.ts package.json
git commit -m "feat: add show utility functions with tests"
```

---

### Task 4: Sanity Studio setup

**Files:**
- Create: `studio/` directory with schemas and config

- [ ] **Step 1: Initialize Sanity studio**

```bash
npm create sanity@latest -- --project twytribute --dataset production --template clean --typescript --output-path studio
```

Follow prompts; use existing project or create new.

- [ ] **Step 2: Create show schema**

Create `studio/schemas/show.ts`:
```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  fields: [
    defineField({ name: 'venue', title: 'Venue', type: 'string', validation: r => r.required() }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date & Time', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'ticketUrl', title: 'Ticket URL', type: 'url' }),
    defineField({ name: 'isFeatured', title: 'Featured Show', type: 'boolean', initialValue: false }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['upcoming', 'past'] },
      validation: r => r.required(),
    }),
    defineField({ name: 'recapUrl', title: 'Recap URL', type: 'url' }),
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'venue', subtitle: 'city', date: 'date' },
    prepare({ title, subtitle, date }) {
      return { title, subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : ''}` };
    },
  },
});
```

- [ ] **Step 3: Create galleryItem, video, bandMember schemas**

Follow same pattern per design spec fields in `studio/schemas/galleryItem.ts`, `video.ts`, `bandMember.ts`.

- [ ] **Step 4: Register schemas in `studio/schemas/index.ts`**

```typescript
import show from './show';
import galleryItem from './galleryItem';
import video from './video';
import bandMember from './bandMember';

export const schemaTypes = [show, galleryItem, video, bandMember];
```

- [ ] **Step 5: Verify studio runs**

Run: `cd studio && npm run dev`
Expected: Sanity Studio at `http://localhost:3333`

- [ ] **Step 6: Commit**

```bash
git add studio/
git commit -m "feat: add Sanity Studio with content schemas"
```

---

### Task 5: Sanity client and queries

**Files:**
- Create: `src/lib/sanity.ts`, `src/lib/queries.ts`

- [ ] **Step 1: Create Sanity client**

Create `src/lib/sanity.ts`:
```typescript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_READ_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
```

- [ ] **Step 2: Create GROQ queries**

Create `src/lib/queries.ts`:
```typescript
export const SHOWS_QUERY = `*[_type == "show"] | order(date desc) {
  _id, venue, city, date, ticketUrl, isFeatured, status, recapUrl
}`;

export const FEATURED_SHOW_QUERY = `*[_type == "show" && isFeatured == true][0] {
  _id, venue, city, date, ticketUrl, isFeatured, status, recapUrl
}`;

export const GALLERY_QUERY = `*[_type == "galleryItem"] | order(sortOrder asc) {
  _id, alt, category, label, sortOrder, "imageUrl": image.asset->url
}`;

export const VIDEOS_QUERY = `*[_type == "video"] | order(sortOrder asc) {
  _id, title, tag, youtubeId, sortOrder, "posterUrl": poster.asset->url
}`;

export const BAND_MEMBERS_QUERY = `*[_type == "bandMember"] | order(sortOrder asc) {
  _id, name, role, bio, funFact, photoPosition, sortOrder, "photoUrl": photo.asset->url
}`;
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/sanity.ts src/lib/queries.ts
git commit -m "feat: add Sanity client and GROQ queries"
```

---

### Task 6: Seed Sanity with current data

**Files:**
- Create: `scripts/seed-sanity.mjs`

- [ ] **Step 1: Write seed script with hardcoded data from Shows.dc.html, Media.dc.html, Band.dc.html**

Extract current shows, gallery items, videos, and band members from existing `.dc.html` files and insert via Sanity client with write token.

- [ ] **Step 2: Run seed**

```bash
SANITY_WRITE_TOKEN=xxx node scripts/seed-sanity.mjs
```

Expected: Documents created in Sanity Studio

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-sanity.mjs
git commit -m "feat: add Sanity seed script with current site data"
```

---

### Task 7: Nav and Footer components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`, `src/scripts/nav.ts`

- [ ] **Step 1: Port Nav from Nav.dc.html to Nav.astro**

Extract nav HTML structure, replace `{{ current }}` logic with Astro props:
```astro
---
interface Props { current?: string; }
const { current = '' } = Astro.props;
const links = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Shows', href: '/shows', key: 'shows' },
  { label: 'Media', href: '/media', key: 'media' },
  { label: 'Book', href: '/book', key: 'book' },
  { label: 'The Band', href: '/band', key: 'band' },
  { label: 'Contact', href: '/contact', key: 'contact' },
];
---
```

- [ ] **Step 2: Port Footer from Footer.dc.html**

Update all links from `*.dc.html` to clean routes.

- [ ] **Step 3: Extract nav scroll/mobile JS to `src/scripts/nav.ts`**

Port scroll progress and mobile menu toggle from Nav.dc.html script section.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/scripts/nav.ts
git commit -m "feat: add Nav and Footer components"
```

---

### Task 8: Show components

**Files:**
- Create: `src/components/ShowCard.astro`, `ShowList.astro`, `FeaturedShow.astro`, `src/scripts/show-filter.ts`

- [ ] **Step 1: Create ShowCard.astro**

Accept props: `day`, `mon`, `year`, `venue`, `city`, `time`, `label`, `href`, `maps`, `cal`, `isUpcoming`.

Port markup from Shows.dc.html `sc-for` template.

- [ ] **Step 2: Create FeaturedShow.astro**

Port featured show section from Shows.dc.html lines 41–70.

- [ ] **Step 3: Create ShowList with upcoming/past toggle**

Use `<ShowList client:load>` or vanilla JS in `show-filter.ts` to toggle visibility of upcoming vs past rows.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShowCard.astro src/components/ShowList.astro src/components/FeaturedShow.astro src/scripts/show-filter.ts
git commit -m "feat: add show display components"
```

---

### Task 9: Shows page

**Files:**
- Create: `src/pages/shows.astro`

- [ ] **Step 1: Build shows page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import FeaturedShow from '../components/FeaturedShow.astro';
import ShowList from '../components/ShowList.astro';
import { sanityClient } from '../lib/sanity';
import { SHOWS_QUERY, FEATURED_SHOW_QUERY } from '../lib/queries';
import { formatShowDate, buildMapsUrl, buildCalendarUrl, deriveStatus } from '../lib/shows';

const rawShows = await sanityClient.fetch(SHOWS_QUERY);
const featured = await sanityClient.fetch(FEATURED_SHOW_QUERY);

const shows = rawShows.map((s: any) => {
  const status = s.status || deriveStatus(s.date);
  const formatted = formatShowDate(s.date);
  const isUpcoming = status === 'upcoming';
  return {
    ...s,
    ...formatted,
    status,
    maps: buildMapsUrl(s.venue, s.city),
    cal: buildCalendarUrl(s),
    label: isUpcoming ? 'Tickets' : 'Recap',
    href: isUpcoming ? (s.ticketUrl || '#') : (s.recapUrl || '/media'),
  };
});

const upcoming = shows.filter((s: any) => s.status === 'upcoming');
const past = shows.filter((s: any) => s.status === 'past');
---
```

Wire FeaturedShow + ShowList with page header section from Shows.dc.html.

- [ ] **Step 2: Visual check against Shows.dc.html**

Run: `npm run dev` → visit `/shows`

- [ ] **Step 3: Commit**

```bash
git add src/pages/shows.astro
git commit -m "feat: add shows page with Sanity data"
```

---

### Task 10: Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Port Home.dc.html sections**

Sections to port: Hero, Ticker, Upcoming Shows (from Sanity), Featured Video, The Experience, Gallery preview, CTA.

- [ ] **Step 2: Wire upcoming shows from Sanity (limit 5)**

- [ ] **Step 3: Wire featured video (lowest sortOrder with youtubeId)**

- [ ] **Step 4: Visual parity check**

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page"
```

---

### Task 11: Media page + gallery/video components

**Files:**
- Create: `src/pages/media.astro`, `src/components/GalleryGrid.astro`, `VideoGrid.astro`, `src/scripts/video-player.ts`

- [ ] **Step 1: Port GalleryGrid with category filter**

Port filter buttons and grid from Media.dc.html; use vanilla JS for filter toggle.

- [ ] **Step 2: Port VideoGrid with click-to-play YouTube embed**

Lazy-load iframe only on click (port from Home.dc.html video section).

- [ ] **Step 3: Build media.astro fetching gallery + videos from Sanity**

- [ ] **Step 4: Commit**

```bash
git add src/pages/media.astro src/components/GalleryGrid.astro src/components/VideoGrid.astro src/scripts/video-player.ts
git commit -m "feat: add media page with gallery and videos"
```

---

### Task 12: Band page

**Files:**
- Create: `src/pages/band.astro`, `src/components/BandMemberCard.astro`

- [ ] **Step 1: Port BandMemberCard from Band.dc.html member grid**

Include hover funFact reveal via CSS.

- [ ] **Step 2: Build band.astro with Sanity band members query**

- [ ] **Step 3: Commit**

```bash
git add src/pages/band.astro src/components/BandMemberCard.astro
git commit -m "feat: add band page with member bios from Sanity"
```

---

### Task 13: Form validation helpers (with tests)

**Files:**
- Create: `src/lib/forms.ts`, `src/lib/forms.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest';
import { validateContactForm, validateBookingForm } from './forms';

describe('validateContactForm', () => {
  it('accepts valid input', () => {
    const result = validateContactForm({ name: 'Jane', email: 'j@x.com', message: 'Hi', website: '' });
    expect(result.ok).toBe(true);
  });
  it('rejects honeypot', () => {
    const result = validateContactForm({ name: 'Jane', email: 'j@x.com', message: 'Hi', website: 'spam' });
    expect(result.ok).toBe(false);
  });
  it('rejects invalid email', () => {
    const result = validateContactForm({ name: 'Jane', email: 'bad', message: 'Hi', website: '' });
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Implement validation**

```typescript
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: { name: string; email: string; message: string; website: string }) {
  if (data.website) return { ok: false as const, error: 'Invalid submission' };
  if (!data.name.trim() || !data.message.trim()) return { ok: false as const, error: 'Required fields missing' };
  if (!EMAIL_RE.test(data.email)) return { ok: false as const, error: 'Invalid email' };
  return { ok: true as const };
}

export function validateBookingForm(data: {
  name: string; email: string; phone: string; date: string; location: string; message: string; website: string;
}) {
  if (data.website) return { ok: false as const, error: 'Invalid submission' };
  if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) return { ok: false as const, error: 'Required fields missing' };
  if (!EMAIL_RE.test(data.email)) return { ok: false as const, error: 'Invalid email' };
  return { ok: true as const };
}
```

- [ ] **Step 3: Run tests — expect PASS**

Run: `npm test`

- [ ] **Step 4: Commit**

```bash
git add src/lib/forms.ts src/lib/forms.test.ts
git commit -m "feat: add form validation helpers with tests"
```

---

### Task 14: Email sending + API routes

**Files:**
- Create: `src/lib/email.ts`, `src/pages/api/contact.ts`, `src/pages/api/book.ts`

- [ ] **Step 1: Create email helper**

```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendContactEmail(data: { name: string; email: string; message: string }) {
  return resend.emails.send({
    from: 'TWY Website <noreply@twytribute.com>',
    to: import.meta.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `TWY Website Contact: ${data.name}`,
    html: `<p><strong>From:</strong> ${data.name} (${data.email})</p><p>${data.message}</p>`,
  });
}
```

(Similar for booking email with all fields.)

- [ ] **Step 2: Create API routes**

`src/pages/api/contact.ts`:
```typescript
import type { APIRoute } from 'astro';
import { validateContactForm } from '../../lib/forms';
import { sendContactEmail } from '../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const validation = validateContactForm(data);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
  }
  try {
    await sendContactEmail(data);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/email.ts src/pages/api/
git commit -m "feat: add form API routes with Resend email"
```

---

### Task 15: Contact and Book pages with working forms

**Files:**
- Create: `src/pages/contact.astro`, `src/pages/book.astro`, `src/components/ContactForm.astro`, `BookingForm.astro`

- [ ] **Step 1: Port ContactForm with client-side fetch to `/api/contact`**

Include honeypot field `website` (hidden via CSS). Show success/error states matching current design.

- [ ] **Step 2: Port BookingForm with fetch to `/api/book`**

Port all fields from Book.dc.html: name, org, phone, email, date, location, audience size, message.

- [ ] **Step 3: Build contact.astro and book.astro pages**

- [ ] **Step 4: Test forms locally with Resend API key**

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro src/pages/book.astro src/components/ContactForm.astro src/components/BookingForm.astro
git commit -m "feat: add contact and book pages with working forms"
```

---

### Task 16: Image assets and optimization

**Files:**
- Create: `public/assets/` (or migrate to Sanity for CMS-managed images)

- [ ] **Step 1: Collect image assets referenced in .dc.html files**

Images needed: `live-crowd.jpg`, `twy-live1.jpg`, `bw-barn-band.jpg`, `bw-duo.jpg`, `vocal-green.jpg`, `band-barn-group.jpg`, `longhorn-sign.jpg`, `bw-guitar-case.jpg`, `bw-pedals.jpg`, `band-wall.jpg`, `band-tree1.jpg`, `band-tree2.jpg`, `logo-twy.png`, `twyicon.png`

- [ ] **Step 2: Add to repo and convert hero images to WebP**

Use Astro `<Image>` for local assets; Sanity CDN for CMS images.

- [ ] **Step 3: Commit**

```bash
git add public/assets/
git commit -m "feat: add optimized image assets"
```

---

### Task 17: SEO, sitemap, and redirects

**Files:**
- Create: `src/pages/sitemap.xml.ts`, `public/robots.txt`, `vercel.json`

- [ ] **Step 1: Add sitemap**

```bash
npx astro add sitemap
```

- [ ] **Step 2: Add redirects from old .dc.html URLs**

Create `vercel.json`:
```json
{
  "redirects": [
    { "source": "/Home.dc.html", "destination": "/", "permanent": true },
    { "source": "/Shows.dc.html", "destination": "/shows", "permanent": true },
    { "source": "/Media.dc.html", "destination": "/media", "permanent": true },
    { "source": "/Book.dc.html", "destination": "/book", "permanent": true },
    { "source": "/Band.dc.html", "destination": "/band", "permanent": true },
    { "source": "/Contact.dc.html", "destination": "/contact", "permanent": true }
  ]
}
```

- [ ] **Step 3: Add JSON-LD MusicGroup schema to BaseLayout**

- [ ] **Step 4: Commit**

```bash
git add src/pages/sitemap.xml.ts public/robots.txt vercel.json
git commit -m "feat: add SEO, sitemap, and legacy URL redirects"
```

---

### Task 18: Vercel deployment and Sanity webhook

- [ ] **Step 1: Connect GitHub repo to Vercel**

- [ ] **Step 2: Set environment variables in Vercel dashboard**

`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`, `RESEND_API_KEY`, `CONTACT_EMAIL`

- [ ] **Step 3: Configure Sanity webhook**

In Sanity project settings → API → Webhooks → add Vercel deploy hook URL, trigger on create/update/delete.

- [ ] **Step 4: Configure custom domain `twytribute.com` in Vercel**

- [ ] **Step 5: Verify production deploy**

---

### Task 19: Performance audit and cleanup

- [ ] **Step 1: Run Lighthouse on `/` and `/shows`**

Target: Performance 90+, FCP < 1.2s

- [ ] **Step 2: Remove legacy Claude Design files**

```bash
git rm support.js Home.dc.html Shows.dc.html Media.dc.html Book.dc.html Band.dc.html Contact.dc.html Nav.dc.html Footer.dc.html
```

- [ ] **Step 3: Update README.md with setup/deploy instructions**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove Claude Design files and update README"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|---|---|
| Astro static site | Task 1 |
| Design tokens / visual fidelity | Task 2 |
| Show utilities | Task 3 |
| Sanity schemas (show, gallery, video, band) | Task 4 |
| Sanity client + queries | Task 5 |
| Seed current data | Task 6 |
| Nav + Footer | Task 7 |
| Shows page + admin data | Tasks 8–9 |
| Home page | Task 10 |
| Media page | Task 11 |
| Band page | Task 12 |
| Form validation | Task 13 |
| Email via Resend | Task 14 |
| Contact + Book pages | Task 15 |
| Image optimization | Task 16 |
| SEO + redirects | Task 17 |
| Vercel deploy + webhook | Task 18 |
| Performance audit + cleanup | Task 19 |
