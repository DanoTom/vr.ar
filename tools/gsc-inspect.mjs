/*
 * gsc-inspect.mjs — pregunta a Search Console qué sabe Google de una o más URLs.
 *
 * Sirve para ver si una guía nueva ya fue descubierta, rastreada e indexada, y
 * cuándo se bajó el sitemap por última vez. Usa la misma cuenta de servicio de
 * solo lectura que tools/gsc.mjs (variable GSC_SERVICE_ACCOUNT_JSON). Con ese
 * permiso no se puede pedir indexación ni reenviar el sitemap: eso lo hace Daniel
 * desde Search Console.
 *
 *   node tools/gsc-inspect.mjs https://vr.ar/guias/que-visor-vr-regalar
 *   node tools/gsc-inspect.mjs --sitemaps
 */
import crypto from 'crypto';

const SITE = 'sc-domain:vr.ar';
const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) { console.error('Falta GSC_SERVICE_ACCOUNT_JSON. Ver docs/PILOTO.md §Accesos.'); process.exit(2); }
const key = JSON.parse(raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
  iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
})}`;
const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
const tok = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` }),
})).json();
if (!tok.access_token) { console.error('Token rechazado:', JSON.stringify(tok)); process.exit(1); }
const auth = { authorization: `Bearer ${tok.access_token}` };

const args = process.argv.slice(2);
if (args.includes('--sitemaps')) {
  const r = await (await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`, { headers: auth })).json();
  for (const s of r.sitemap || []) {
    console.log(`${s.path}\n   enviado: ${s.lastSubmitted} · bajado por Google: ${s.lastDownloaded} · errores: ${s.errors} · avisos: ${s.warnings}`);
  }
}
for (const url of args.filter((a) => a.startsWith('http'))) {
  const r = await (await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST', headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  })).json();
  const i = r.inspectionResult?.indexStatusResult;
  console.log(url, '\n  ', i
    ? `${i.verdict} · ${i.coverageState} · rastreada: ${i.lastCrawlTime || 'nunca'} · canónica de Google: ${i.googleCanonical || '-'}`
    : JSON.stringify(r).slice(0, 300));
}
