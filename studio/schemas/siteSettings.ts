import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'public', title: 'Public email' },
    { name: 'contact', title: 'Contact form' },
    { name: 'booking', title: 'Booking form' },
  ],
  fields: [
    defineField({
      name: 'publicEmail',
      title: 'Public email',
      type: 'string',
      fieldset: 'public',
      description: 'Shown on the website (footer, contact card, booking fallback).',
      initialValue: 'sdmbooking@yahoo.com',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact recipient',
      type: 'string',
      fieldset: 'contact',
      description: 'Inbox that receives Contact form submissions.',
      initialValue: 'sdmbooking@yahoo.com',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'contactSubject',
      title: 'Contact subject',
      type: 'string',
      fieldset: 'contact',
      description: "Use {{name}} to include the sender's name.",
      initialValue: 'TWY Website Contact: {{name}}',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Booking recipient',
      type: 'string',
      fieldset: 'booking',
      description: 'Inbox that receives Booking form submissions.',
      initialValue: 'sdmbooking@yahoo.com',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'bookingSubject',
      title: 'Booking subject',
      type: 'string',
      fieldset: 'booking',
      description: "Use {{name}} to include the sender's name.",
      initialValue: 'TWY Booking Inquiry: {{name}}',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
