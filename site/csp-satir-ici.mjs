// Astro's CSP hashes the scripts it bundles, but not scripts written straight into a page (is:inline).
// After every build this walks the finished pages, hashes each inline script exactly as served
// and adds the hash to that page's script-src, so the policy stays strict without hand-kept lists.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sayfalar = async dir => (await readdir(dir, { recursive: true })).filter(f => f.endsWith('.html')).map(f => join(dir, f));
const calisir = attrs => !/\bsrc\s*=/.test(attrs) && !/type\s*=\s*["']?(application\/(ld\+)?json|importmap)/.test(attrs);

export default function cspSatirIci() {
  return {
    name: 'csp-satir-ici',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let eklenen = 0;
        for (const dosya of await sayfalar(fileURLToPath(dir))) {
          let html = await readFile(dosya, 'utf8');
          const meta = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/);
          if (!meta) continue;
          const hashler = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
            .filter(([, attrs, govde]) => calisir(attrs) && govde.length)
            .map(([, , govde]) => `'sha256-${createHash('sha256').update(govde).digest('base64')}'`)
            .filter(h => !meta[1].includes(h));
          if (!hashler.length) continue;
          const yeni = meta[1].replace(/script-src ([^;]*)/, (_, liste) => `script-src ${liste} ${[...new Set(hashler)].join(' ')}`);
          html = html.replace(meta[0], `<meta http-equiv="content-security-policy" content="${yeni}"`);
          await writeFile(dosya, html);
          eklenen += hashler.length;
        }
        logger.info(`satır içi ${eklenen} kodun parmak izi CSP'ye eklendi`);
      },
    },
  };
}
