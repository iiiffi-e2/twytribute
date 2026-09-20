import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://twytribute.com',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel({ webAnalytics: false }),

  image: {
    domains: ['cdn.sanity.io'],
  },

  integrations: [sitemap()],
});