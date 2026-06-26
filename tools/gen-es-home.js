/*
 * gen-es-home.js — regenerate es/index.html (the Spanish homepage) from index.html.
 *
 * The homepage is fully bilingual at runtime (app.js localizes it when setLang('es')
 * runs). This tool produces a SECOND, indexable URL for the Spanish version so Google
 * can rank it: it loads index.html in a headless browser, switches it to Spanish,
 * bakes the rendered Spanish HTML into es/index.html, and rewrites the head
 * (title/description/canonical/hreflang) plus a <base href="/"> so the page works
 * from the /es/ subfolder. The English index.html is never modified by this tool
 * (its only Spanish-related change — the hreflang tags — is committed by hand).
 *
 * IMPORTANT: re-run this whenever index.html's visible content changes, so the two
 * stay in sync. es/index.html is generated output and should not be hand-edited.
 *
 * Requirements: Node + playwright-core + a Chromium build.
 *   npm i playwright-core      (Chromium is provided by the environment)
 *   node tools/gen-es-home.js
 * Set CHROMIUM_PATH to override the Chromium executable if auto-detection fails.
 */
const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const ES = {
  title:  'VR Finder — Encontrá tu visor de realidad virtual ideal | vr.ar',
  desc:   'Respondé 7 preguntas rápidas y obtené una recomendación personalizada de visor de VR. Comparamos Meta Quest 3, Quest 3S, PlayStation VR2, Pico 4 Ultra, Pimax Crystal Light y Super — Edición 2026.',
  ogTitle:'VR Finder — ¿Qué visor de VR es ideal para vos?',
  ogDesc: 'Hacé nuestro test de 7 preguntas y encontrá tu visor de VR ideal. Meta Quest 3, Quest 3S, PSVR2, Pico 4 Ultra, Pimax Crystal Light y Super — Edición 2026.',
  twDesc: 'Test de 7 preguntas. Recomendación personalizada de visor VR. Meta Quest 3, Quest 3S, PSVR2, Pico 4 Ultra, Pimax Crystal Light y Super — Edición 2026.',
  ogImage: 'https://vr.ar/og-image-es.jpg',
  url: 'https://vr.ar/es/', home: 'https://vr.ar/',
};

const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.xml':'application/xml', '.ico':'image/x-icon' };

function serve(root) {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const fp = path.join(root, p);
      if (!fp.startsWith(root) || !fs.existsSync(fp)) { res.statusCode = 404; return res.end('not found'); }
      res.setHeader('Content-Type', MIME[path.extname(fp)] || 'application/octet-stream');
      fs.createReadStream(fp).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  const srv = await serve(ROOT);
  const port = srv.address().port;
  const b = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof setLang === 'function', { timeout: 8000 });
  await page.evaluate(() => setLang('es'));
  await page.waitForTimeout(400);

  await page.evaluate((ES) => {
    const head = document.head;
    if (!head.querySelector('base')) {
      const base = document.createElement('base'); base.setAttribute('href', '/');
      const anchor = head.querySelector('meta[charset]') || head.firstElementChild;
      anchor ? anchor.insertAdjacentElement('afterend', base) : head.insertBefore(base, head.firstChild);
    }
    document.title = ES.title;
    const set = (sel, attr, val) => { const el = head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', ES.desc);
    set('link[rel="canonical"]', 'href', ES.url);
    set('meta[property="og:url"]', 'content', ES.url);
    set('meta[property="og:title"]', 'content', ES.ogTitle);
    set('meta[property="og:description"]', 'content', ES.ogDesc);
    set('meta[property="og:locale"]', 'content', 'es_ES');
    set('meta[name="twitter:url"]', 'content', ES.url);
    set('meta[name="twitter:title"]', 'content', ES.ogTitle);
    set('meta[name="twitter:description"]', 'content', ES.twDesc);
    set('meta[property="og:image"]', 'content', ES.ogImage);
    set('meta[name="twitter:image"]', 'content', ES.ogImage);
    // hreflang: ensure exactly the reciprocal set (index.html already ships these, so clear first)
    head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => l.remove());
    [['en', ES.home], ['es', ES.url], ['x-default', ES.home]].forEach(([l, h]) => {
      const lk = document.createElement('link'); lk.setAttribute('rel', 'alternate'); lk.setAttribute('hreflang', l); lk.setAttribute('href', h); head.appendChild(lk);
    });
    document.querySelectorAll('script').forEach(s => {
      if (s.textContent && s.textContent.indexOf('navigator.language') > -1) s.textContent = "try{ setLang('es'); }catch(e){}";
    });
  }, ES);

  const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML + '\n');
  await b.close(); srv.close();

  fs.mkdirSync(path.join(ROOT, 'es'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'es', 'index.html'), html);
  console.log('wrote es/index.html (' + html.length + ' bytes)');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
