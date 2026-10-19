// Blog yazılarının kuralları. Yeni yazı = src/content/blog/ içine yeni bir .md dosyası.
// Dosyanın adı adres olur: emsin-faydalari.md → /blog/emsin-faydalari
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    baslik: z.string().max(70),           // sayfada ve Google'da görünen başlık
    aciklama: z.string().max(160),        // Google'daki açıklama ve listedeki kısa metin
    tarih: z.coerce.date(),               // 2026-10-19 gibi
    kapak: z.string(),                    // public/ altındaki görsel, ör. /img/blog/konya-mevlana.webp
    kapakAlt: z.string(),                 // görselde ne olduğunu anlatan cümle
    kapakKaynak: z.string().optional(),   // arşiv görseli ise kaynak ve lisans satırı
    taslak: z.boolean().default(false),   // true ise yayında görünmez (bilgisayarda görünür)
  }),
});

export const collections = { blog };
