import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  fields: [
    defineField({ name: 'venue', title: 'Venue', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'date',
      title: 'Date & Time',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ticketUrl', title: 'Ticket URL', type: 'url' }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Show',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['upcoming', 'past'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'recapUrl', title: 'Recap URL', type: 'url' }),
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'venue', subtitle: 'city', date: 'date' },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : ''}`,
      };
    },
  },
});
