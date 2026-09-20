import { describe, it, expect } from 'vitest';
import {
  SITE_ORIGIN,
  SITE_DESCRIPTION,
  buildMusicGroupSchema,
  buildMusicEventSchema,
  buildVideoObjectSchema,
  buildFaqPageSchema,
  absoluteUrl,
} from './seo';

describe('absoluteUrl', () => {
  it('joins a site-relative path to the origin', () => {
    expect(absoluteUrl('/assets/twy-social-share.png')).toBe(`${SITE_ORIGIN}/assets/twy-social-share.png`);
  });
});

describe('buildMusicGroupSchema', () => {
  it('uses a stable entity id and description', () => {
    const schema = buildMusicGroupSchema();
    expect(schema['@id']).toBe(`${SITE_ORIGIN}/#musicgroup`);
    expect(schema.description).toBe(SITE_DESCRIPTION);
    expect(schema.image).toBe(`${SITE_ORIGIN}/assets/twy-social-share.png`);
    expect(schema.logo).toBe(`${SITE_ORIGIN}/assets/logo-twy.png`);
  });

  it('includes members when provided', () => {
    const schema = buildMusicGroupSchema([
      { name: 'Chris Rowland', role: 'Lead Vocals / Guitar' },
    ]);
    expect(schema.member).toEqual([
      {
        '@type': 'Person',
        name: 'Chris Rowland',
        jobTitle: 'Lead Vocals / Guitar',
      },
    ]);
  });

  it('uses a provided public email', () => {
    const schema = buildMusicGroupSchema([], 'hello@twytribute.com');
    expect(schema.email).toBe('hello@twytribute.com');
  });
});

describe('buildMusicEventSchema', () => {
  it('maps a show to a MusicEvent', () => {
    const schema = buildMusicEventSchema({
      venue: 'Lava Cantina',
      city: 'The Colony, TX',
      date: '2026-08-15T20:00:00-05:00',
      ticketUrl: 'https://tickets.example/lava',
    });

    expect(schema['@type']).toBe('MusicEvent');
    expect(schema.name).toBe('Texas, Whiskey & You at Lava Cantina');
    expect(schema.startDate).toBe('2026-08-15T20:00:00-05:00');
    expect(schema.location).toEqual({
      '@type': 'Place',
      name: 'Lava Cantina',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'The Colony, TX',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    });
    expect(schema.performer).toEqual({ '@id': `${SITE_ORIGIN}/#musicgroup` });
    expect(schema.offers).toEqual({
      '@type': 'Offer',
      url: 'https://tickets.example/lava',
      availability: 'https://schema.org/InStock',
    });
  });

  it('omits offers when there is no ticket url', () => {
    const schema = buildMusicEventSchema({
      venue: 'The Rustic',
      city: 'Dallas, TX',
      date: '2026-10-25T20:00:00-05:00',
    });
    expect(schema.offers).toBeUndefined();
  });
});

describe('buildVideoObjectSchema', () => {
  it('builds a VideoObject from a YouTube id', () => {
    const schema = buildVideoObjectSchema({
      title: 'Tennessee Whiskey',
      youtubeId: 'abc123',
      posterUrl: '/assets/twy-live1.jpg',
    });

    expect(schema['@type']).toBe('VideoObject');
    expect(schema.embedUrl).toBe('https://www.youtube.com/embed/abc123');
    expect(schema.thumbnailUrl).toBe(`${SITE_ORIGIN}/assets/twy-live1.jpg`);
  });
});

describe('buildFaqPageSchema', () => {
  it('maps questions to FAQPage accepted answers', () => {
    const schema = buildFaqPageSchema([
      { question: 'Where is the band based?', answer: 'North Texas.' },
    ]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'Where is the band based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'North Texas.',
      },
    });
  });
});
