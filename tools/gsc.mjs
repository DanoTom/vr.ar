/*
 * gsc.mjs — lee Search Console por API y arma el resumen de la rutina semanal.
 *
 * Usa una cuenta de servicio de Google con permiso "Restringido" (solo lectura)
 * sobre la propiedad de vr.ar. La clave se lee de la variable de entorno
 * GSC_SERVICE_ACCOUNT_JSON: el contenido del archivo .json tal cual, o en base64.
 * Nunca se guarda en el repositorio.
 *
 * Qué imprime: totales de la ventana actual contra la anterior, las páginas y
 * consultas principales, y las "oportunidades": páginas con impresiones reales
 * en posiciones 8–30, que son donde una mejora mueve más clics.
 *
 *   node tools/gsc.mjs                 ventana de 28 días
 *   node tools/gsc.mjs 7               ventana de 7 días
 *   node tools/gsc.mjs 28 --out dir    además guarda los datos crudos en dir/
 *   node tools/gsc.mjs 28 --page /guides/quest-3-vs-quest-3s
 *                                      solo esa página: sus números y las
 *                                      consultas que la traen (para decidir qué
 *                                      mejorar en ella)
 *
 * Search Console publica los datos con ~3 días de demora; la ventana termina ahí.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/webmasters/v3';
const LAG_DAYS = 3;

const args = process.argv.slice(2);
const FLAGS = ['--out', '--page'];
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const OUT = flag('--out');
const PAGE = flag('--page');
// El número de días es el primer argumento numérico que no sea el valor de un flag.
const flagValueIdx = new Set(FLAGS.map((f) => args.indexOf(f)).filter((i) => i >= 0).map((i) => i + 1));
const DAYS = Number(args.find((a, i) => /^\d+$/.test(a) && !flagValueIdx.has(i)) || 28);

// ── Credenciales ────────────────────────────────────────────────────────────
function loadKey() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('Falta GSC_SERVICE_ACCOUNT_JSON. Ver docs/PILOTO.md §Accesos.');
    process.exit(2);
  }
  const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const key = JSON.parse(text);
  if (!key.client_email || !key.private_key) throw new Error('La clave no tiene client_email/private_key.');
  return key;
}

async function getToken(key) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600,
  })}`;
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${sig}`,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Token rechazado (${res.status}): ${JSON.stringify(body)}`);
  return body.access_token;
}

async function api(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// ── Consultas ───────────────────────────────────────────────────────────────
const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

function windows(days) {
  const end = daysAgo(LAG_DAYS);
  const start = daysAgo(LAG_DAYS + days - 1);
  const prevEnd = daysAgo(LAG_DAYS + days);
  const prevStart = daysAgo(LAG_DAYS + 2 * days - 1);
  return { cur: [iso(start), iso(end)], prev: [iso(prevStart), iso(prevEnd)] };
}

async function pickSite(token) {
  const { siteEntry = [] } = await api(token, 'GET', `${API}/sites`);
  const ours = siteEntry.filter((s) => s.siteUrl.includes('vr.ar'));
  const site = ours.find((s) => s.siteUrl.startsWith('sc-domain:')) || ours[0];
  if (!site) throw new Error(`La cuenta de servicio no ve ninguna propiedad de vr.ar. Ve: ${siteEntry.map((s) => s.siteUrl).join(', ') || 'nada'}`);
  return site.siteUrl;
}

function query(token, site, [startDate, endDate], dimensions, rowLimit = 250, pageUrl = null) {
  const body = { startDate, endDate, dimensions, rowLimit, dataState: 'final' };
  if (pageUrl) {
    body.dimensionFilterGroups = [{ filters: [{ dimension: 'page', operator: 'equals', expression: pageUrl }] }];
  }
  return api(token, 'POST', `${API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, body)
    .then((r) => r.rows || []);
}

// ── Resumen ─────────────────────────────────────────────────────────────────
const sum = (rows) => {
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  const impressions = rows.reduce((a, r) => a + r.impressions, 0);
  const pos = impressions ? rows.reduce((a, r) => a + r.position * r.impressions, 0) / impressions : 0;
  return { clicks, impressions, pos };
};
// La API ordena por clics; con casi todo en 0 clics, el resto sale alfabético y
// esconde lo que más se muestra. Las tablas van por impresiones.
const byImpressions = (rows) => [...rows].sort((a, b) => b.impressions - a.impressions);
const pct = (a, b) => (b ? `${a >= b ? '+' : ''}${Math.round(((a - b) / b) * 100)}%` : 'n/d');
const short = (url) => url.replace(/^https:\/\/(www\.)?vr\.ar/, '') || '/';

function table(rows, key, limit) {
  const lines = rows.slice(0, limit).map((r) =>
    `| ${key(r)} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`);
  return ['| | Clics | Impr. | CTR | Pos. |', '|---|---|---|---|---|', ...lines].join('\n');
}

const key = loadKey();
const token = await getToken(key);
const site = await pickSite(token);
const w = windows(DAYS);

if (PAGE) {
  const url = PAGE.startsWith('http') ? PAGE : `https://vr.ar${PAGE}`;
  const [dCur, dPrev, q] = await Promise.all([
    query(token, site, w.cur, ['date'], 250, url),
    query(token, site, w.prev, ['date'], 250, url),
    query(token, site, w.cur, ['query'], 250, url),
  ]);
  const c = sum(dCur);
  const p = sum(dPrev);
  console.log(`# ${short(url)} — ${w.cur[0]} a ${w.cur[1]} (${DAYS} días)\n`);
  console.log(`Clics ${c.clicks} (antes ${p.clicks}) · Impresiones ${c.impressions} (antes ${p.impressions})`
    + ` · Posición ${c.pos.toFixed(1)} (antes ${p.pos.toFixed(1)})\n`);
  console.log(q.length ? table(byImpressions(q), (r) => r.keys[0], 50) : 'Sin consultas en esta ventana.');
  process.exit(0);
}

const [byDateCur, byDatePrev, pages, queries, pagesPrev] = await Promise.all([
  query(token, site, w.cur, ['date']),
  query(token, site, w.prev, ['date']),
  query(token, site, w.cur, ['page']),
  query(token, site, w.cur, ['query']),
  query(token, site, w.prev, ['page']),
]);

const cur = sum(byDateCur);
const prev = sum(byDatePrev);
const prevByPage = Object.fromEntries(pagesPrev.map((r) => [r.keys[0], r]));
const opportunities = pages
  .filter((r) => r.position >= 8 && r.position <= 30 && r.impressions >= 30)
  .sort((a, b) => b.impressions - a.impressions);

console.log(`# Search Console — ${site}`);
console.log(`Ventana: ${w.cur[0]} a ${w.cur[1]} (${DAYS} días) contra ${w.prev[0]} a ${w.prev[1]}\n`);
console.log('| | Actual | Anterior | Cambio |\n|---|---|---|---|');
console.log(`| Clics | ${cur.clicks} | ${prev.clicks} | ${pct(cur.clicks, prev.clicks)} |`);
console.log(`| Impresiones | ${cur.impressions} | ${prev.impressions} | ${pct(cur.impressions, prev.impressions)} |`);
console.log(`| Posición media | ${cur.pos.toFixed(1)} | ${prev.pos.toFixed(1)} | |\n`);

console.log('## Páginas\n');
console.log(table(byImpressions(pages), (r) => short(r.keys[0]), 20), '\n');

console.log('## Oportunidades (posición 8–30, 30+ impresiones)\n');
if (!opportunities.length) console.log('Ninguna en esta ventana.\n');
for (const r of opportunities.slice(0, 10)) {
  const p = prevByPage[r.keys[0]];
  const trend = p ? ` (antes: pos. ${p.position.toFixed(1)}, ${p.impressions} impr.)` : ' (nueva en la ventana)';
  console.log(`- ${short(r.keys[0])}: ${r.impressions} impr., ${r.clicks} clics, pos. ${r.position.toFixed(1)}${trend}`);
}

console.log('\n## Consultas\n');
console.log(table(byImpressions(queries), (r) => r.keys[0], 30));

if (OUT) {
  fs.mkdirSync(OUT, { recursive: true });
  const stamp = w.cur[1];
  fs.writeFileSync(path.join(OUT, `gsc-${stamp}-${DAYS}d.json`),
    JSON.stringify({ site, windows: w, byDateCur, byDatePrev, pages, queries, pagesPrev }, null, 2));
  console.log(`\nDatos crudos en ${path.join(OUT, `gsc-${stamp}-${DAYS}d.json`)}`);
}
