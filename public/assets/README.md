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

Production images are copied from the repo-root `assets/` folder (same filenames). The site serves them from `/assets/…`.

To refresh after updating `assets/`:

```powershell
Copy-Item assets/* public/assets/ -Force
```

Optional: re-run `node scripts/seed-sanity.mjs` to upload gallery/media images to Sanity.

## Placeholder fallback

If originals are missing, regenerate labeled placeholders:

```powershell
powershell -File scripts/generate-placeholder-assets.ps1
```
