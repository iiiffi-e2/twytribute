export interface ShowInput {
  venue: string;
  city: string;
  date: string;
}

export function formatShowDate(isoDate: string) {
  const d = new Date(isoDate);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const time = minutes === 0 ? `${h12}:00 ${ampm}` : `${h12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  return {
    day: String(d.getDate()),
    mon: months[d.getMonth()],
    year: String(d.getFullYear()),
    time,
  };
}

export function buildMapsUrl(venue: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${city}`)}`;
}

export function buildCalendarUrl(show: ShowInput) {
  const d = new Date(show.date);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const text = encodeURIComponent(`Texas, Whiskey & You @ ${show.venue}`);
  const loc = encodeURIComponent(`${show.venue}, ${show.city}`);
  const details = encodeURIComponent('Live tribute to Chris Stapleton');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${ymd}/${ymd}&location=${loc}&details=${details}`;
}

export function deriveStatus(isoDate: string): 'upcoming' | 'past' {
  return new Date(isoDate) >= new Date() ? 'upcoming' : 'past';
}
