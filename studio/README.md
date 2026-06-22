# Texas, Whiskey & You — Sanity Studio

Content management for the TWY band site. Manages shows, gallery, videos, and band member bios.

## Setup

This studio was scaffolded manually with a placeholder project ID. Before using it with a live Sanity project:

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage), or run `npx sanity init` from this directory.
2. Replace `YOUR_PROJECT_ID` in both `sanity.config.ts` and `sanity.cli.ts` with your real Sanity project ID.
3. Confirm the dataset name (`production` by default) matches your Sanity project.

## Scripts

```bash
npm install
npm run dev      # Local studio at http://localhost:3333
npm run build    # Production build to dist/
npm run deploy   # Deploy to Sanity hosted studio (requires login)
```

## Content types

| Schema | Description |
|---|---|
| `show` | Upcoming and past gigs |
| `galleryItem` | Photo gallery with category filters |
| `video` | YouTube videos and poster-only entries |
| `bandMember` | Band bios and photos |

## Environment variables

Do not commit `.env` files containing Sanity tokens. Use `SANITY_STUDIO_*` prefixed variables for local overrides if needed.
