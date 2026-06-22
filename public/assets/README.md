# Image assets

Static images referenced by the Astro site and legacy `.dc.html` prototypes. Paths are served from `/assets/…`.

## Required files

| File | Usage |
|------|--------|
| `live-crowd.jpg` | Hero backgrounds (home, book, shows, contact feed) |
| `twy-live1.jpg` | Video poster, gallery, featured media |
| `bw-barn-band.jpg` | Hero / parallax sections (home, shows, band, media) |
| `bw-duo.jpg` | Band page, gallery, contact feed |
| `vocal-green.jpg` | Gallery, media, home masonry |
| `band-barn-group.jpg` | Band hero, book cards, gallery |
| `longhorn-sign.jpg` | Media featured, gallery, contact feed |
| `bw-guitar-case.jpg` | Gallery, contact feed |
| `bw-pedals.jpg` | Contact hero background |
| `band-wall.jpg` | Book page card |
| `band-tree1.jpg` | Media gallery |
| `band-tree2.jpg` | Band member photos |
| `twyicon.png` | Nav logo icon (42×42 display) |
| `logo-twy.png` | Footer logo (~160px wide) |

## Current status

**All files in this directory are auto-generated placeholders** (dark background, gold label). They were created because no production images were found in the repository or parent `Projects` tree.

Replace each file with the real photo or logo, keeping the same filename so existing references in `src/` and `.dc.html` continue to work.

## Sourcing originals

1. Copy from the live site or design handoff into this folder.
2. Re-run `node scripts/seed-sanity.mjs` after adding files to upload gallery/media images to Sanity (optional CMS path).

## Regenerating placeholders

```powershell
powershell -File scripts/generate-placeholder-assets.ps1
```
