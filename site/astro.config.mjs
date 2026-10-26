import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cspSatirIci from './csp-satir-ici.mjs';

// Sitenin adresi: canonical linkler, sitemap.xml ve paylaşım görselleri bundan üretilir.
// Geçici olarak başka bir adres denemek için .env dosyasına SITE_URL=https://... yazılabilir.
const site = process.env.SITE_URL || 'https://profitems.com';

export default defineConfig({
  site,
  // one address per page, without a trailing slash (/hizmetler), the same in links, canonical tags and the sitemap
  trailingSlash: 'never',
  // styles are small, so they ship inside each page: no extra request holds up the first paint
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [...(site ? [sitemap({ filter: p => !p.includes('/404') })] : []), cspSatirIci()],
  devToolbar: { enabled: false },
  // blog posts have no code blocks; Shiki's inline styles would clash with the CSP anyway
  markdown: { syntaxHighlight: false },
  // Content Security Policy: every page lists the exact scripts and styles it may run (by hash); anything injected is refused.
  // The 3D figure needs WebAssembly and blob images (mesh decoder, textures); the contact map is the only outside frame.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "media-src 'self'",
        "font-src 'self'",
        "connect-src 'self' blob: data:",
        "worker-src 'self' blob:",
        'frame-src https://www.google.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      // small style="" attributes (photo focal points, bar widths) are allowed; <style> blocks stay hash-checked
      // (each kind listed separately: a style-src-elem/-attr line replaces style-src for its scope, browsers do not fall back)
      styleDirective: { resources: [{ resource: "'self'", kind: 'element' }, { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
  // the 3D engine is one lazy chunk (~590 KB, loaded only near the EMS story)
  vite: {
    build: { chunkSizeWarningLimit: 700 },
    // pre-bundle the libraries up front, so the dev server never re-optimises them mid-session
    // (that is what causes "504 Outdated Optimize Dep" in the browser)
    optimizeDeps: { include: ['motion', 'three', 'three/addons/loaders/GLTFLoader.js', 'three/addons/libs/meshopt_decoder.module.js'] },
  },
});
