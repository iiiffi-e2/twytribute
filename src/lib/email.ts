import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendContactEmail(data: { name: string; email: string; message: string }) {
  return resend.emails.send({
    from: 'TWY Website <noreply@twytribute.com>',
    to: import.meta.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `TWY Website Contact: ${data.name}`,
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

  return resend.emails.send({
    from: 'TWY Website <noreply@twytribute.com>',
    to: import.meta.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `TWY Booking Inquiry: ${data.name}`,
    html: fields || '<p>No details provided.</p>',
  });
}
