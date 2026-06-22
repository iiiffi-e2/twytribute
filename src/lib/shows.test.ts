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
