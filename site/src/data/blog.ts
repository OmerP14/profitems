// Blog yazılarını tarih sırasıyla getirir; taslaklar yayında gizlenir.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Yazi = CollectionEntry<'blog'>;

export async function yazilar(): Promise<Yazi[]> {
  const hepsi = await getCollection('blog', y => !(import.meta.env.PROD && y.data.taslak));
  return hepsi.sort((a, b) => b.data.tarih.getTime() - a.data.tarih.getTime());
}

export const okumaSuresi = (y: Yazi) => Math.max(1, Math.ceil((y.body ?? '').split(/\s+/).length / 180));

export const tarihYaz = (d: Date) =>
  new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }).format(d);
