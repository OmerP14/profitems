<div align="center">

# Profit EMS — Studio Website

**English** · [Türkçe](README.tr.md)

**Production website for Profit EMS, an EMS (electrical muscle stimulation) training studio in Konya, Turkey.**

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Motion](https://img.shields.io/badge/Motion-12-FFF312?logo=framer&logoColor=black)](https://motion.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Portfolio%2FEducational-lightgrey)](#license)

🔗 **[www.profitems.com](https://www.profitems.com)**

</div>

![Home](docs/screenshots/01-home.jpg)

## Overview

A real client project, live in production: the marketing site of a single-location EMS studio. Its job is to explain an unfamiliar training method to local visitors, rank in local search ("Konya EMS") and turn visitors into WhatsApp conversations. Everything is in Turkish.

The site is static (Astro), fast on mobile, and set up so the business can keep doing SEO without touching code: page titles and descriptions live in one file, and a new blog post is a single Markdown file.

## Features

### For visitors
- **"How does EMS work?" in 3D**: a six-step story with a rigged Three.js mannequin. It puts on the suit, electrode pads appear on the muscle groups, it turns around to show the back pads, then squats and flexes. On devices without WebGL it falls back to a hand-drawn SVG figure.
- **Pick your goal**: five training goals (weight loss, slimming, toning, muscle building, back and neck pain). Choosing one highlights the matching pads on a body diagram.
- **On-site assistant**: a chat widget that answers questions about EMS, the five goals, hours, location and appointments. It runs **entirely in the browser**: keyword scoring with Turkish-aware text normalisation over a curated topic list (`src/data/asistan.ts`). Nothing is sent to a server, and anything it does not know is handed off to WhatsApp.
- **Live opening status** on the contact page ("Open now, closes in 5 h 5 min") with a day timeline.
- **Blog** built on Astro content collections, with drafts, update dates and image credits.
- One-tap WhatsApp, call and Instagram on every page; the Google Map loads only after a click.

### Engineering
- **SEO**: per-page title/description from one file (`src/data/seo.ts`), canonical URLs, an auto-generated sitemap with `lastmod` taken from each post's front matter, and JSON-LD for `HealthClub`, `Service`, `FAQPage`, `BlogPosting`, `BreadcrumbList` and `WebSite`.
- **Security**: a strict Content Security Policy built with hashes. Astro hashes its bundled scripts, and a small custom integration (`csp-satir-ici.mjs`) hashes the remaining inline scripts after each build, so no `unsafe-inline` is needed for scripts. HSTS, frame, referrer and permissions headers are set in `vercel.json`.
- **Performance**: the 3D engine is a lazy chunk loaded only when the story section gets close. The mannequin is a Meshopt-compressed GLB (~800 KB). Images use responsive WebP `srcset`s, CSS is inlined, and long-lived cache headers cover hashed assets.
- **Privacy (KVKK)**: self-hosted fonts (no Google Fonts), no analytics or tracking cookies, an assistant that sends nothing, and a map that loads only when asked. KVKK notice and cookie policy pages are included.
- **Motion**: a single orchestrated entrance with spring transitions (Motion), press feedback on every control, and full `prefers-reduced-motion` support.
- **Content flags**: sections waiting on real photos (team, studio) are built and switched off with a flag, so they go live by editing one data file.

## Screenshots

| 3D "How EMS works" | Five goals |
|---|---|
| ![3D EMS story](docs/screenshots/02-ems-3d.jpg) | ![Goals](docs/screenshots/03-goals.jpg) |
| **Services + assistant** | **Blog** |
| ![Services and assistant](docs/screenshots/04-services-assistant.jpg) | ![Blog](docs/screenshots/05-blog.jpg) |

![Contact](docs/screenshots/06-contact.jpg)

<p align="center">
  <img src="docs/screenshots/07-mobile-home.jpg" width="260" alt="Mobile home">
  &nbsp;
  <img src="docs/screenshots/08-mobile-3d.jpg" width="260" alt="Mobile 3D story">
  &nbsp;
  <img src="docs/screenshots/09-mobile-services.jpg" width="260" alt="Mobile services">
</p>

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 7 (static output, content collections) |
| 3D | Three.js, GLTFLoader + Meshopt decoder |
| Animation | Motion (spring transitions), CSS |
| Content | Markdown blog with a Zod schema |
| Hosting | Vercel (auto-deploy from `main`), custom domain |

## Running locally

```bash
git clone https://github.com/OmerP14/profitems.git
cd profitems/site
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in site/dist
```

Requires Node 22.12 or newer. No environment variables are needed. `SITE_URL` (optional, in `site/.env`) overrides the canonical address for test deployments.

## Project structure

```
site/
├── src/
│   ├── pages/          # Home, services, what-is-EMS, blog, contact, KVKK, cookies, 404
│   ├── content/blog/   # Blog posts (one .md file = one post)
│   ├── data/           # Single sources: business info, SEO, services, FAQ, assistant topics
│   ├── components/     # Nav, footer, assistant, body diagram
│   ├── scripts/ems3d.js# 3D mannequin: suit, pads, poses driven by one progress value
│   ├── layouts/        # Shared <head>, JSON-LD, footer
│   └── styles/
├── public/             # Images, hero video, fonts, 3D model, favicons
├── csp-satir-ici.mjs   # Build step: adds inline-script hashes to each page's CSP
├── astro.config.mjs    # Site URL, sitemap, CSP directives
└── vercel.json         # Security and cache headers
```

## Credits

- Temporary stock photos: [Instituto Alpha Fitness on Pexels](https://www.pexels.com/@mralpha/) (Pexels License). They will be replaced with photos of the studio.
- 3D character: "Xbot" from the [three.js examples](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf) (originally from Mixamo), trimmed and compressed. The suit and pads are added in code.
- Archive images: Vesalius muscle figure (Wellcome Collection, CC BY 4.0), Duchenne de Boulogne 1862 (Cleveland Museum of Art, CC0), Mevlana Museum photo (Alexostrov, CC BY-SA 3.0). Each one is credited on the page where it appears.

## License

This repository is shared for **portfolio and educational purposes**. The Profit EMS name, logo, brand assets, certificate and business content belong to Profit EMS and may not be reused without permission. Third-party images remain under their own licenses listed above.
