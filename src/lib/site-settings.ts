export const FALLBACK_PUBLIC_EMAIL = 'sdmbooking@yahoo.com';
export const DEFAULT_CONTACT_SUBJECT = 'TWY Website Contact: {{name}}';
export const DEFAULT_BOOKING_SUBJECT = 'TWY Booking Inquiry: {{name}}';

export interface SiteSettings {
  publicEmail: string;
  contactEmail: string;
  contactSubject: string;
  bookingEmail: string;
  bookingSubject: string;
}

export type PartialSiteSettings = {
  [K in keyof SiteSettings]?: string | null;
};

export function applySubjectTemplate(subject: string, name: string): string {
  return subject.replaceAll('{{name}}', name);
}

export function defaultSiteSettings(inbox = FALLBACK_PUBLIC_EMAIL): SiteSettings {
  return {
    publicEmail: FALLBACK_PUBLIC_EMAIL,
    contactEmail: inbox,
    contactSubject: DEFAULT_CONTACT_SUBJECT,
    bookingEmail: inbox,
    bookingSubject: DEFAULT_BOOKING_SUBJECT,
  };
}

function pick(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function mergeSiteSettings(
  raw?: PartialSiteSettings | null,
  inbox = FALLBACK_PUBLIC_EMAIL,
): SiteSettings {
  const defaults = defaultSiteSettings(inbox);
  if (!raw) return defaults;
  return {
    publicEmail: pick(raw.publicEmail, defaults.publicEmail),
    contactEmail: pick(raw.contactEmail, defaults.contactEmail),
    contactSubject: pick(raw.contactSubject, defaults.contactSubject),
    bookingEmail: pick(raw.bookingEmail, defaults.bookingEmail),
    bookingSubject: pick(raw.bookingSubject, defaults.bookingSubject),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const inbox = import.meta.env.CONTACT_EMAIL?.trim() || FALLBACK_PUBLIC_EMAIL;
  try {
    const [{ sanityClient }, { SITE_SETTINGS_QUERY }] = await Promise.all([
      import('./sanity'),
      import('./queries'),
    ]);
    const raw = await sanityClient.fetch<PartialSiteSettings | null>(SITE_SETTINGS_QUERY);
    return mergeSiteSettings(raw, inbox);
  } catch {
    return defaultSiteSettings(inbox);
  }
}
