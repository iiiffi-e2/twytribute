import { Resend } from 'resend';
import { applySubjectTemplate, getSiteSettings } from './site-settings';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendContactEmail(data: { name: string; email: string; message: string }) {
  const settings = await getSiteSettings();
  return resend.emails.send({
    from: 'TWY Website <noreply@twytribute.com>',
    to: settings.contactEmail,
    replyTo: data.email,
    subject: applySubjectTemplate(settings.contactSubject, data.name),
    html: `<p><strong>From:</strong> ${data.name} (${data.email})</p><p>${data.message}</p>`,
  });
}

export async function sendBookingEmail(data: {
  name: string;
  email: string;
  phone: string;
  org?: string;
  date?: string;
  location?: string;
  audienceSize?: string;
  message?: string;
}) {
  const fields = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Organization', data.org],
    ['Event Date', data.date],
    ['Location', data.location],
    ['Audience Size', data.audienceSize],
    ['Message', data.message],
  ]
    .filter(([, value]) => value?.trim())
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
    .join('');

  const settings = await getSiteSettings();
  return resend.emails.send({
    from: 'TWY Website <noreply@twytribute.com>',
    to: settings.bookingEmail,
    replyTo: data.email,
    subject: applySubjectTemplate(settings.bookingSubject, data.name),
    html: fields || '<p>No details provided.</p>',
  });
}
