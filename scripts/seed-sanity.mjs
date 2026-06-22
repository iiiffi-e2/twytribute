/**
 * Seed Sanity CMS with content extracted from legacy .dc.html files.
 * Idempotent: uses createOrReplace with deterministic document _id values.
 *
 * Usage: see scripts/README.md
 */

import { createClient } from '@sanity/client';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

/** Load .env from repo root into process.env (does not override existing vars). */
function loadEnvFile() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const MON_MAP = {
  JAN: '01',
  FEB: '02',
  MAR: '03',
  APR: '04',
  MAY: '05',
  JUN: '06',
  JUL: '07',
  AUG: '08',
  SEP: '09',
  OCT: '10',
  NOV: '11',
  DEC: '12',
};

/** @param {string} text */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** @param {string} timeStr e.g. "8:00 PM" */
function parseTime24(timeStr) {
  if (!timeStr?.trim()) return { hours: 12, minutes: 0 };

  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hours: 12, minutes: 0 };

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

/** @param {{ mon: string, day: string, year: string, time?: string }} show */
function showDateTime(show) {
  const month = MON_MAP[show.mon];
  const day = show.day.padStart(2, '0');
  const { hours, minutes } = parseTime24(show.time ?? '');
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${show.year}-${month}-${day}T${hh}:${mm}:00-05:00`;
}

/** @param {string} venue @param {{ mon: string, day: string, year: string }} show */
function showId(venue, show) {
  const month = MON_MAP[show.mon];
  const day = show.day.padStart(2, '0');
  return `show-${slugify(venue)}-${show.year}-${month}-${day}`;
}

/** @param {string} relativePath e.g. "assets/twy-live1.jpg" */
function resolveAssetPath(relativePath) {
  const normalized = relativePath.replace(/^assets\//, '');
  const candidates = [
    join(ROOT, 'public', 'assets', normalized),
    join(ROOT, 'assets', normalized),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

/** @param {import('@sanity/client').SanityClient} client */
async function uploadImageIfAvailable(client, relativePath) {
  const filePath = resolveAssetPath(relativePath);
  if (!filePath) return null;

  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: basename(filePath),
  });

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };
}

// --- Data from Shows.dc.html ---

const UPCOMING_SHOWS = [
  {
    mon: 'AUG',
    day: '15',
    year: '2026',
    venue: 'Lava Cantina',
    city: 'The Colony, TX',
    time: '8:00 PM',
    isFeatured: true,
  },
  {
    mon: 'AUG',
    day: '29',
    year: '2026',
    venue: 'Mavericks Dance Hall',
    city: 'Arlington, TX',
    time: '9:00 PM',
  },
  {
    mon: 'SEP',
    day: '12',
    year: '2026',
    venue: "Hank's Texas Grill",
    city: 'McKinney, TX',
    time: '8:30 PM',
  },
  {
    mon: 'SEP',
    day: '27',
    year: '2026',
    venue: 'Love and War in Texas',
    city: 'Plano, TX',
    time: '7:00 PM',
  },
  {
    mon: 'OCT',
    day: '11',
    year: '2026',
    venue: 'Magnolia Motor Lounge',
    city: 'Fort Worth, TX',
    time: '9:00 PM',
  },
  {
    mon: 'OCT',
    day: '25',
    year: '2026',
    venue: 'The Rustic',
    city: 'Dallas, TX',
    time: '8:00 PM',
  },
];

const PAST_SHOWS = [
  {
    mon: 'JUN',
    day: '21',
    year: '2026',
    venue: 'Barn Baloon',
    city: 'Private Event',
    recapUrl: '/media',
  },
  {
    mon: 'MAY',
    day: '30',
    year: '2026',
    venue: 'Lexus Box Garden',
    city: 'Frisco, TX',
    recapUrl: '/media',
  },
  {
    mon: 'APR',
    day: '18',
    year: '2026',
    venue: 'North Texas Whiskey Fest',
    city: 'Denton, TX',
    recapUrl: '/media',
  },
  {
    mon: 'MAR',
    day: '08',
    year: '2026',
    venue: 'Gas Monkey Bar N Grill',
    city: 'Dallas, TX',
    recapUrl: '/media',
  },
];

// --- Data from Media.dc.html ---

const VIDEOS = [
  {
    poster: 'assets/twy-live1.jpg',
    title: 'Live at Lexus Box Garden',
    tag: 'Full Set',
    youtubeId: '',
    sortOrder: 0,
  },
  {
    poster: 'assets/bw-barn-band.jpg',
    title: 'Tennessee Whiskey',
    tag: 'Performance',
    sortOrder: 1,
  },
  {
    poster: 'assets/vocal-green.jpg',
    title: 'Cold',
    tag: 'Performance',
    sortOrder: 2,
  },
  {
    poster: 'assets/live-crowd.jpg',
    title: 'Crowd Energy Reel',
    tag: 'Highlights',
    sortOrder: 3,
  },
];

const GALLERY_ITEMS = [
  {
    src: 'assets/vocal-green.jpg',
    cat: 'live',
    label: 'Live Shows',
    alt: 'Lead vocals under stage lights',
  },
  {
    src: 'assets/live-crowd.jpg',
    cat: 'crowd',
    label: 'Crowd',
    alt: 'Packed dance floor',
  },
  {
    src: 'assets/bw-guitar-case.jpg',
    cat: 'bts',
    label: 'Behind The Scenes',
    alt: 'Guitar in case backstage',
  },
  {
    src: 'assets/bw-duo.jpg',
    cat: 'live',
    label: 'Live Shows',
    alt: 'Two members performing',
  },
  {
    src: 'assets/band-barn-group.jpg',
    cat: 'bts',
    label: 'Behind The Scenes',
    alt: 'The band together',
  },
  {
    src: 'assets/longhorn-sign.jpg',
    cat: 'venues',
    label: 'Venues',
    alt: 'Stage backdrop signage',
  },
  {
    src: 'assets/bw-pedals.jpg',
    cat: 'bts',
    label: 'Behind The Scenes',
    alt: 'Setting the stage',
  },
  {
    src: 'assets/twy-live1.jpg',
    cat: 'venues',
    label: 'Venues',
    alt: 'Outdoor amphitheater stage',
  },
  {
    src: 'assets/bw-barn-band.jpg',
    cat: 'live',
    label: 'Live Shows',
    alt: 'Full band in the barn',
  },
  {
    src: 'assets/band-tree1.jpg',
    cat: 'crowd',
    label: 'Promo',
    alt: 'Band portrait outdoors',
  },
];

// --- Data from Band.dc.html ---

const BAND_MEMBERS = [
  {
    name: 'Chris Rowland',
    role: 'Lead Vocals / Guitar',
    pos: '10% 18%',
    bio: 'The voice out front — chasing that gravel-and-soul tone that makes you check twice.',
    fact: 'Can go from a whisper to a full-throated holler in the same line — and the room goes quiet for both.',
    photo: 'assets/band-tree2.jpg',
    sortOrder: 0,
  },
  {
    name: 'Christian Sly',
    role: 'Lead Guitar / Vocals',
    pos: '37% 18%',
    bio: 'Tone chaser and lead-line architect, weaving the licks that define the sound.',
    fact: 'Owns more guitar pedals than pairs of boots — and that is saying something in Texas.',
    photo: 'assets/band-tree2.jpg',
    sortOrder: 1,
  },
  {
    name: 'Clay Wise',
    role: 'Bass / Vocals',
    pos: '63% 18%',
    bio: 'The low-end anchor — locks the pocket and keeps the dance floor honest.',
    fact: 'Counts the band in by feel; swears he has never needed a click track in his life.',
    photo: 'assets/band-tree2.jpg',
    sortOrder: 2,
  },
  {
    name: 'Tull Rea',
    role: 'Drums / Vocals',
    pos: '90% 18%',
    bio: 'The engine room. Dynamics, groove, and the build that lifts every chorus.',
    fact: 'Warms up on a practice pad in the truck before every single show, rain or shine.',
    photo: 'assets/band-tree2.jpg',
    sortOrder: 3,
  },
];

/** @param {import('@sanity/client').SanityClient} client */
async function seedShows(client) {
  const tx = client.transaction();

  for (const show of UPCOMING_SHOWS) {
    /** @type {Record<string, unknown>} */
    const doc = {
      _id: showId(show.venue, show),
      _type: 'show',
      venue: show.venue,
      city: show.city,
      date: showDateTime(show),
      status: 'upcoming',
      isFeatured: show.isFeatured ?? false,
    };
    tx.createOrReplace(doc);
  }

  for (const show of PAST_SHOWS) {
    /** @type {Record<string, unknown>} */
    const doc = {
      _id: showId(show.venue, show),
      _type: 'show',
      venue: show.venue,
      city: show.city,
      date: showDateTime(show),
      status: 'past',
      isFeatured: false,
      recapUrl: show.recapUrl,
    };
    tx.createOrReplace(doc);
  }

  await tx.commit();
  console.log(`Seeded ${UPCOMING_SHOWS.length + PAST_SHOWS.length} shows`);
}

/** @param {import('@sanity/client').SanityClient} client */
async function seedVideos(client) {
  let uploaded = 0;

  for (const video of VIDEOS) {
    /** @type {Record<string, unknown>} */
    const doc = {
      _id: `video-${slugify(video.title)}`,
      _type: 'video',
      title: video.title,
      tag: video.tag,
      sortOrder: video.sortOrder,
    };

    if (video.youtubeId) {
      doc.youtubeId = video.youtubeId;
    }

    const poster = await uploadImageIfAvailable(client, video.poster);
    if (poster) {
      doc.poster = poster;
      uploaded += 1;
    }

    await client.createOrReplace(doc);
  }

  console.log(
    `Seeded ${VIDEOS.length} videos (${uploaded} with poster images; add posters in Studio if missing)`,
  );
}

/** @param {import('@sanity/client').SanityClient} client */
async function seedGallery(client) {
  let uploaded = 0;

  for (let i = 0; i < GALLERY_ITEMS.length; i += 1) {
    const item = GALLERY_ITEMS[i];
    const fileSlug = slugify(basename(item.src, '.jpg'));

    /** @type {Record<string, unknown>} */
    const doc = {
      _id: `gallery-${fileSlug}`,
      _type: 'galleryItem',
      alt: item.alt,
      category: item.cat,
      label: item.label,
      sortOrder: i,
    };

    const image = await uploadImageIfAvailable(client, item.src);
    if (image) {
      doc.image = image;
      uploaded += 1;
    }

    await client.createOrReplace(doc);
  }

  console.log(
    `Seeded ${GALLERY_ITEMS.length} gallery items (${uploaded} with images; add images in Studio if missing)`,
  );
}

/** @param {import('@sanity/client').SanityClient} client */
async function seedBandMembers(client) {
  let uploaded = 0;

  for (const member of BAND_MEMBERS) {
    /** @type {Record<string, unknown>} */
    const doc = {
      _id: `member-${slugify(member.name)}`,
      _type: 'bandMember',
      name: member.name,
      role: member.role,
      bio: member.bio,
      funFact: member.fact,
      photoPosition: member.pos,
      sortOrder: member.sortOrder,
    };

    const photo = await uploadImageIfAvailable(client, member.photo);
    if (photo) {
      doc.photo = photo;
      uploaded += 1;
    }

    await client.createOrReplace(doc);
  }

  console.log(
    `Seeded ${BAND_MEMBERS.length} band members (${uploaded} with photos; add photos in Studio if missing)`,
  );
}

async function main() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    console.log(
      'SANITY_WRITE_TOKEN is not set — skipping Sanity seed.\n' +
        'Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_WRITE_TOKEN, then run:\n' +
        '  node scripts/seed-sanity.mjs',
    );
    process.exit(0);
  }

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  if (!projectId) {
    console.error('SANITY_PROJECT_ID is required.');
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  const assetsDir = [join(ROOT, 'public', 'assets'), join(ROOT, 'assets')].find((p) =>
    existsSync(p),
  );
  if (!assetsDir) {
    console.log(
      'No local assets directory found — seeding text fields only.\n' +
        'Upload images manually in Sanity Studio or copy assets to public/assets/ and re-run.',
    );
  }

  console.log(`Seeding Sanity project ${projectId} (${dataset})…`);

  await seedShows(client);
  await seedVideos(client);
  await seedGallery(client);
  await seedBandMembers(client);

  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
