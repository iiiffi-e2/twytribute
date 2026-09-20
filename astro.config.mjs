import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://twytribute.com',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel({ webAnalytics: false }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: true,
      assetsInlineLimit: 4096,
      modulePreload: { polyfill: false },
      reportCompressedSize: true,
    },
  },

  image: {
    domains: ['cdn.sanity.io'],
  },

  integrations: [sitemap()],
});