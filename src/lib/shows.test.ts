import { describe, it, expect } from 'vitest';
import { formatShowDate, buildMapsUrl, buildCalendarUrl, deriveStatus, resolveShowStatus } from './shows';

describe('formatShowDate', () => {
  it('formats date parts for display', () => {
    const result = formatShowDate('2026-08-15T20:00:00-05:00');
    expect(result).toEqual({ day: '15', mon: 'AUG', year: '2026', time: '8:00 PM' });
  });

  it('displays 8 PM Central when Sanity stores that instant as 2 AM UTC (CST)', () => {
    const result = formatShowDate('2026-01-16T02:00:00.000Z');
    expect(result).toEqual({ day: '15', mon: 'JAN', year: '2026', time: '8:00 PM' });
  });

  it('displays 8 PM Central during daylight saving (CDT stores as 1 AM UTC)', () => {
    const result = formatShowDate('2026-08-16T01:00:00.000Z');
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
      date: '2026-08-15T20:00:00-05:00',
    });
    expect(url).toContain('calendar.google.com');
    expect(url).toContain('Texas%2C%20Whiskey');
    expect(url).toContain('dates=20260815/20260815');
  });

  it('uses the Central calendar date when Sanity stores 8 PM CST as 2 AM UTC', () => {
    const url = buildCalendarUrl({
      venue: 'Lava Cantina',
      city: 'The Colony, TX',
      date: '2026-01-16T02:00:00.000Z',
    });
    expect(url).toContain('dates=20260115/20260115');
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

describe('resolveShowStatus', () => {
  it('moves a past date to past even when stored status is still upcoming', () => {
    expect(resolveShowStatus({ date: '2020-01-01T20:00:00', status: 'upcoming' })).toBe('past');
  });

  it('keeps a future date upcoming', () => {
    expect(resolveShowStatus({ date: '2099-01-01T20:00:00', status: 'past' })).toBe('upcoming');
  });
});
