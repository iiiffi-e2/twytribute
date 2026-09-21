export interface ShowInput {
  venue: string;
  city: string;
  date: string;
}

const SHOW_TIME_ZONE = 'America/Chicago';
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function centralParts(isoDate: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOW_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(isoDate));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    dayPeriod: get('dayPeriod').toUpperCase(),
  };
}

export function formatShowDate(isoDate: string) {
  const parts = centralParts(isoDate);
  return {
    day: String(Number(parts.day)),
    mon: MONTHS[Number(parts.month) - 1],
    year: parts.year,
    time: `${parts.hour}:${parts.minute} ${parts.dayPeriod}`,
  };
}

export function buildMapsUrl(venue: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${city}`)}`;
}

export function buildCalendarUrl(show: ShowInput) {
  const parts = centralParts(show.date);
  const ymd = `${parts.year}${parts.month}${parts.day}`;
  const text = encodeURIComponent(`Texas, Whiskey & You @ ${show.venue}`);
  const loc = encodeURIComponent(`${show.venue}, ${show.city}`);
  const details = encodeURIComponent('Live tribute to Chris Stapleton');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${ymd}/${ymd}&location=${loc}&details=${details}`;
}

export function deriveStatus(isoDate: string): 'upcoming' | 'past' {
  return new Date(isoDate) >= new Date() ? 'upcoming' : 'past';
}

/** Date is the source of truth. Stored CMS/mock status is ignored so shows move automatically. */
export function resolveShowStatus(show: { date: string; status?: 'upcoming' | 'past' }): 'upcoming' | 'past' {
  return deriveStatus(show.date);
}
