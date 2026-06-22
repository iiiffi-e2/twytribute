import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // output will change to 'server' or 'hybrid' before Task 14 API routes
  output: 'static',
  adapter: vercel({ webAnalytics: false }),
  image: {
    domains: ['cdn.sanity.io'],
  },
});
