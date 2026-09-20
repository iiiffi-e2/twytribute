import { describe, it, expect } from 'vitest';
import {
  FALLBACK_PUBLIC_EMAIL,
  DEFAULT_CONTACT_SUBJECT,
  DEFAULT_BOOKING_SUBJECT,
  applySubjectTemplate,
  mergeSiteSettings,
} from './site-settings';

describe('applySubjectTemplate', () => {
  it('replaces {{name}} with the submitter name', () => {
    expect(applySubjectTemplate('TWY Website Contact: {{name}}', 'Jane')).toBe(
      'TWY Website Contact: Jane',
    );
  });

  it('leaves a subject without {{name}} unchanged', () => {
    expect(applySubjectTemplate('New website message', 'Jane')).toBe('New website message');
  });
});

describe('mergeSiteSettings', () => {
  it('returns current defaults when Sanity has no document', () => {
    expect(mergeSiteSettings(null)).toEqual({
      publicEmail: FALLBACK_PUBLIC_EMAIL,
      contactEmail: FALLBACK_PUBLIC_EMAIL,
      contactSubject: DEFAULT_CONTACT_SUBJECT,
      bookingEmail: FALLBACK_PUBLIC_EMAIL,
      bookingSubject: DEFAULT_BOOKING_SUBJECT,
    });
  });

  it('uses CONTACT_EMAIL as the inbox fallback for both forms', () => {
    const settings = mergeSiteSettings(undefined, 'booking@example.com');
    expect(settings.contactEmail).toBe('booking@example.com');
    expect(settings.bookingEmail).toBe('booking@example.com');
    expect(settings.publicEmail).toBe(FALLBACK_PUBLIC_EMAIL);
  });

  it('keeps filled Sanity fields and fills the rest from defaults', () => {
    expect(
      mergeSiteSettings({
        publicEmail: 'hello@twytribute.com',
        contactEmail: '  ',
        contactSubject: 'Contact: {{name}}',
        bookingEmail: null,
      }),
    ).toEqual({
      publicEmail: 'hello@twytribute.com',
      contactEmail: FALLBACK_PUBLIC_EMAIL,
      contactSubject: 'Contact: {{name}}',
      bookingEmail: FALLBACK_PUBLIC_EMAIL,
      bookingSubject: DEFAULT_BOOKING_SUBJECT,
    });
  });
});
