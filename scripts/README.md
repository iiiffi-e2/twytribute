# Scripts

## seed-sanity.mjs

Seeds Sanity CMS with content extracted from the legacy `.dc.html` files (`Shows.dc.html`, `Media.dc.html`, `Band.dc.html`). The script is **idempotent**: it uses `createOrReplace` with deterministic document IDs (for example `show-lava-cantina-2026-08-15`), so re-running it updates existing documents instead of creating duplicates.

### What gets seeded

| Content type | Source | Count |
|---|---|---|
| Shows (upcoming + past) | `Shows.dc.html` | 10 |
| Videos | `Media.dc.html` | 4 |
| Gallery items | `Media.dc.html` | 10 |
| Band members | `Band.dc.html` | 4 |

Lava Cantina (Aug 15, 2026) is marked as the featured upcoming show.

### Prerequisites

1. A Sanity project with the schemas from `studio/schemas/` deployed.
2. A write token with create/update permissions.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `SANITY_DATASET` | No | Dataset name (defaults to `production`) |
| `SANITY_WRITE_TOKEN` | Yes* | API token with write access |

\*If `SANITY_WRITE_TOKEN` is not set, the script prints a clear message and exits without error (exit code 0). This allows CI and local dev to run without credentials.

### Usage

```bash
SANITY_PROJECT_ID=your-project-id \
SANITY_DATASET=production \
SANITY_WRITE_TOKEN=your-write-token \
node scripts/seed-sanity.mjs
```

On Windows (PowerShell):

```powershell
$env:SANITY_PROJECT_ID="your-project-id"
$env:SANITY_DATASET="production"
$env:SANITY_WRITE_TOKEN="your-write-token"
node scripts/seed-sanity.mjs
```

### Images

The script uploads local image files when they are available under `public/assets/` or `assets/` (matching paths referenced in the legacy HTML, e.g. `assets/twy-live1.jpg`).

If no asset files are present locally, the script still seeds all text/metadata fields and **skips image uploads**. In that case:

- Add poster images for videos, gallery photos, and band member headshots **manually in Sanity Studio**, or
- Copy the image assets into `public/assets/` and re-run the seed script.

Documents created without images will appear in Studio with validation warnings until images are attached.
