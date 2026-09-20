import { FALLBACK_PUBLIC_EMAIL } from './site-settings';

export const SITE_ORIGIN = 'https://twytribute.com';
export const SITE_NAME = 'Texas, Whiskey & You';
export const SITE_DESCRIPTION =
  "Texas, Whiskey & You — North Texas's premier Chris Stapleton tribute band. Authentic soul, grit, and live concert energy for festivals, venues, and private events.";
export const DEFAULT_OG_IMAGE = '/assets/twy-social-share.png';
export const SITE_LOGO = '/assets/logo-twy.png';
export const MUSIC_GROUP_ID = `${SITE_ORIGIN}/#musicgroup`;

export interface BandMemberInput {
  name: string;
  role: string;
}

export interface ShowEventInput {
  venue: string;
  city: string;
  date: string;
  ticketUrl?: string;
}

export interface VideoInput {
  title: string;
  youtubeId: string;
  posterUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(path, SITE_ORIGIN).toString();
}

function regionFromCity(city: string): string | undefined {
  const match = city.match(/\b([A-Z]{2})\b/);
  return match?.[1];
}

export function buildMusicGroupSchema(
  members: BandMemberInput[] = [],
  email = FALLBACK_PUBLIC_EMAIL,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': MUSIC_GROUP_ID,
    name: SITE_NAME,
    alternateName: 'TWY',
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    genre: ['Country', 'Tribute'],
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    logo: absoluteUrl(SITE_LOGO),
    foundingLocation: {
      '@type': 'Place',
      name: 'North Texas',
    },
    areaServed: {
      '@type': 'Place',
      name: 'North Texas',
    },
    sameAs: ['https://www.instagram.com/texaswhiskeyandyou'],
    email,
    ...(members.length > 0
      ? {
          member: members.map((member) => ({
            '@type': 'Person',
            name: member.name,
            jobTitle: member.role,
          })),
        }
      : {}),
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': MUSIC_GROUP_ID,
    },
  };
}

export function buildMusicEventSchema(show: ShowEventInput) {
  const region = regionFromCity(show.city);

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `${SITE_NAME} at ${show.venue}`,
    startDate: show.date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: show.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: show.city,
        ...(region ? { addressRegion: region } : {}),
        addressCountry: 'US',
      },
    },
    performer: {
      '@id': MUSIC_GROUP_ID,
    },
    organizer: {
      '@id': MUSIC_GROUP_ID,
    },
    ...(show.ticketUrl
      ? {
          offers: {
            '@type': 'Offer',
            url: show.ticketUrl,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function buildVideoObjectSchema(video: VideoInput) {
  const poster = video.posterUrl || '/assets/twy-live1.jpg';

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `${video.title} — live performance by ${SITE_NAME}, a Chris Stapleton tribute band from North Texas.`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    thumbnailUrl: absoluteUrl(poster),
    publisher: {
      '@id': MUSIC_GROUP_ID,
    },
  };
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export const BOOKING_FAQS: FaqItem[] = [
  {
    question: 'What kind of events does Texas, Whiskey & You play?',
    answer:
      'Festivals, music venues, dance halls, wineries, corporate events, weddings, and private parties across North Texas.',
  },
  {
    question: 'Where is Texas, Whiskey & You based?',
    answer:
      'The band is based in North Texas and regularly plays Dallas, Fort Worth, Denton, Frisco, Plano, and surrounding cities.',
  },
  {
    question: 'How do I book the band?',
    answer:
      'Submit the booking inquiry form with your date, location, and event type. We confirm set length, sound needs, and send a simple agreement.',
  },
  {
    question: 'Do you provide sound equipment?',
    answer:
      'Yes. We can bring a full PA and in-ear monitoring, or plug into the house system at festivals and venues.',
  },
];
