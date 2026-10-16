// robots.txt: domain .env içinde SITE_URL olarak tanımlanınca site haritası satırı kendiliğinden eklenir.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const satirlar = ['User-agent: *', 'Allow: /'];
  if (site) satirlar.push('', `Sitemap: ${new URL('sitemap-index.xml', site).href}`);
  return new Response(satirlar.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
