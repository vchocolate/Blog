import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vchocolate.github.io',
  base: '/Blog',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'rose-pine-dawn', dark: 'rose-pine' },
      wrap: false,
    },
  },
});
