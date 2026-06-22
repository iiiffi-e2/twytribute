import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://twytribute.com',
  output: 'server',
  adapter: vercel({ webAnalytics: false }),
  image: {
    domains: ['cdn.sanity.io'],
  },
});
