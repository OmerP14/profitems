import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain alınınca .env dosyasına SITE_URL=https://alanadi.com yazılır;
// canonical linkler ve sitemap.xml o zaman otomatik açılır.
const site = process.env.SITE_URL;

export default defineConfig({
  site,
  integrations: site ? [sitemap()] : [],
  devToolbar: { enabled: false },
  // the 3D engine is one lazy chunk (~590 KB, loaded only near the EMS story)
  vite: { build: { chunkSizeWarningLimit: 700 } },
});
