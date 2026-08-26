/*
 * gen-catalog.mjs — publica el catálogo de compatibilidad como recurso público.
 *
 * Toma como única fuente de verdad `extension/src/data.js` (el mismo catálogo que
 * usa la extensión) y genera tres cosas:
 *
 *   data/vr-games.json          el catálogo legible por máquina
 *   compatibilidad.html         la versión navegable, en español
 *   vr-game-compatibility.html  la versión navegable, en inglés
 *
 * Por qué existe: el catálogo es el activo más valioso del proyecto y hasta ahora
 * vivía escondido dentro de una extensión. Publicado, le da a los asistentes de IA
 * algo concreto que citar, a otros sitios algo que enlazar, y a nosotros la base de
 * las próximas herramientas.
 *
 * Correr después de cada cambio del catálogo:  node tools/gen-catalog.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = process.env.CATALOG_DATE || new Date().toISOString().slice(0, 10);

// ── Cargar el catálogo de la extensión ──────────────────────────────────────
const sandbox = { console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'extension/src/data.js'), 'utf8'), sandbox);

const HEADSETS = sandbox.VRAR_HEADSETS.filter((h) => h.id !== 'other');
const CATALOG = sandbox.VRAR_CATALOG;
const PLATFORMS = ['quest', 'steam', 'psvr2', 'pico'];
// Los nombres de las tiendas son marcas y no se traducen, salvo la palabra
// "tienda" de PICO. data.js los guarda en español porque es una UI en español.
const PLATFORM_LABEL = {
  es: { ...sandbox.VRAR_PLATFORM_LABEL },
  en: { ...sandbox.VRAR_PLATFORM_LABEL, pico: 'PICO Store' }
};

// ── JSON público ────────────────────────────────────────────────────────────
const games = CATALOG.map((g) => {
  const on = (g.on || []).slice().sort();
  const off = (g.off || []).slice().sort();
  return {
    slug: g.slug,
    title: g.title,
    ...(g.aliases ? { aliases: g.aliases } : {}),
    ...(g.steam ? { steam_app_ids: g.steam } : {}),
    available_on: on,
    not_available_on: off,
    // Lo que no verificamos se declara explícitamente: es la diferencia entre
    // "no está" y "no sabemos", y es lo que hace confiable al resto del dato.
    unverified_on: PLATFORMS.filter((p) => !on.includes(p) && !off.includes(p))
  };
}).sort((a, b) => a.title.localeCompare(b.title, 'en'));

const cells = games.length * PLATFORMS.length;
const verified = games.reduce((n, g) => n + g.available_on.length + g.not_available_on.length, 0);

const json = {
  name: 'vr.ar — VR game compatibility catalogue',
  description:
    'Which platforms each VR game is actually available on, verified one by one. ' +
    'Platforms not verified for a game are listed explicitly under unverified_on ' +
    'rather than being assumed unavailable.',
  homepage: 'https://vr.ar/vr-game-compatibility',
  homepage_es: 'https://vr.ar/compatibilidad',
  version: TODAY,
  updated: TODAY,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  attribution: 'vr.ar — https://vr.ar',
  publisher: { name: 'vr.ar', url: 'https://vr.ar', email: 'westartmind@gmail.com' },
  method:
    'Each game was checked store by store against the official listings. A platform ' +
    'appears in available_on or not_available_on only when it was verified; ' +
    'everything else stays in unverified_on.',
  platforms: Object.fromEntries(PLATFORMS.map((p) => [p, PLATFORM_LABEL.en[p]])),
  headsets: HEADSETS.map((h) => ({
    id: h.id, name: h.name, native_platforms: h.native, supports_pc_vr: h.pcvr
  })),
  coverage: {
    games: games.length,
    platform_checks: cells,
    verified: verified,
    verified_share: Math.round((verified / cells) * 1000) / 10
  },
  games
};

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/vr-games.json'), JSON.stringify(json, null, 2) + '\n');

// ── Páginas navegables ──────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const T = {
  es: {
    lang: 'es', slug: 'compatibilidad', other: 'vr-game-compatibility',
    title: 'Catálogo de compatibilidad de juegos de VR — vr.ar',
    desc: `Qué juegos de realidad virtual funcionan en cada plataforma: ${games.length} títulos verificados uno por uno. Datos abiertos, y decimos cuándo no tenemos el dato.`,
    h1: 'Catálogo de compatibilidad de juegos de VR',
    lead: `Qué juegos de realidad virtual están disponibles en cada plataforma, verificados uno por uno contra las fichas oficiales de cada tienda. Son ${games.length} juegos y ${cells} combinaciones juego × plataforma.`,
    honest: 'Lo que no verificamos figura como <strong>sin verificar</strong>, no como “no está”. Esa distinción es el motivo por el que se puede confiar en el resto del dato: afirmar que un juego no existe en una plataforma cuando en realidad no lo miramos es el error que vuelve inútil una tabla como esta.',
    yourHeadset: 'Tu visor', all: 'Ver solo las plataformas',
    search: 'Buscar un juego…', game: 'Juego', worksLabel: '¿Funciona?',
    legendTitle: 'Cómo leer la tabla',
    legend: [['yes', 'Está disponible en esa plataforma (verificado)'],
             ['no', 'No está disponible (verificado)'],
             ['unk', 'Todavía no lo verificamos']],
    verdicts: { yes: 'Sí', pc: 'Con PC', no: 'No', unknown: 'Sin datos' },
    useTitle: 'Usar estos datos',
    use: `El catálogo completo está publicado como archivo abierto en <a href="/data/vr-games.json">/data/vr-games.json</a>, bajo licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>: se puede usar, citar y redistribuir mencionando a vr.ar. Si encontrás un dato equivocado, escribinos a <a href="mailto:westartmind@gmail.com">westartmind@gmail.com</a> y lo corregimos.`,
    ctaTitle: '¿Lo querés mientras navegás?',
    ctaText: 'Nuestra extensión de Chrome usa este mismo catálogo y te avisa sobre las páginas que mencionan un juego.',
    ctaBtn: 'Ver la extensión →', ctaHref: 'extension.html',
    quiz: 'Hacer el test de VR Finder →',
    nav: [['index.html', 'Inicio'], ['guias/', 'Guías'], ['extension.html', 'Extensión']],
    updated: `Actualizado el ${TODAY}`, results: ['juego', 'juegos'], noResults: 'Ningún juego coincide con esa búsqueda.'
  },
  en: {
    lang: 'en', slug: 'vr-game-compatibility', other: 'compatibilidad',
    title: 'VR game compatibility catalogue — vr.ar',
    desc: `Which VR games run on which platform: ${games.length} titles verified one by one. Open data, and we say when we don't know.`,
    h1: 'VR game compatibility catalogue',
    lead: `Which VR games are available on which platform, verified one by one against each store's official listing. ${games.length} games and ${cells} game × platform checks.`,
    honest: 'Anything we have not verified is marked <strong>unverified</strong>, not “unavailable”. That distinction is why the rest of the data can be trusted: claiming a game does not exist on a platform we never actually checked is the mistake that makes a table like this useless.',
    yourHeadset: 'Your headset', all: 'Show platforms only',
    search: 'Search for a game…', game: 'Game', worksLabel: 'Works?',
    legendTitle: 'How to read the table',
    legend: [['yes', 'Available on that platform (verified)'],
             ['no', 'Not available (verified)'],
             ['unk', 'Not verified yet']],
    verdicts: { yes: 'Yes', pc: 'With a PC', no: 'No', unknown: 'No data' },
    useTitle: 'Using this data',
    use: `The full catalogue is published as an open file at <a href="/data/vr-games.json">/data/vr-games.json</a>, under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> licence: use it, cite it and redistribute it with attribution to vr.ar. If you spot a wrong entry, write to <a href="mailto:westartmind@gmail.com">westartmind@gmail.com</a> and we'll fix it.`,
    ctaTitle: 'Want this while you browse?',
    ctaText: 'Our Chrome extension uses this same catalogue and tells you on the pages that mention a game.',
    ctaBtn: 'See the extension →', ctaHref: 'chrome-extension.html',
    quiz: 'Take the VR Finder quiz →',
    nav: [['index.html', 'Home'], ['guides/', 'Guides'], ['chrome-extension.html', 'Extension']],
    updated: `Updated ${TODAY}`, results: ['game', 'games'], noResults: 'No game matches that search.'
  }
};

function cell(game, platform) {
  if (game.available_on.includes(platform)) return '<td class="c yes" title="yes">✓</td>';
  if (game.not_available_on.includes(platform)) return '<td class="c no" title="no">✕</td>';
  return '<td class="c unk" title="unverified">–</td>';
}

function page(t) {
  const rows = games.map((g) => `<tr data-title="${esc(g.title.toLowerCase())}" data-slug="${esc(g.slug)}">
        <th scope="row">${esc(g.title)}</th>
        <td class="c verdict"></td>
        ${PLATFORMS.map((p) => cell(g, p)).join('\n        ')}
      </tr>`).join('\n      ');

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="https://vr.ar/${t.slug}">
<link rel="alternate" hreflang="es" href="https://vr.ar/${t.lang === 'es' ? t.slug : t.other}">
<link rel="alternate" hreflang="en" href="https://vr.ar/${t.lang === 'en' ? t.slug : t.other}">
<link rel="alternate" hreflang="x-default" href="https://vr.ar/${t.lang === 'en' ? t.slug : t.other}">

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.h1)} — vr.ar">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="https://vr.ar/${t.slug}">

<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/exo2-400-latin.woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="stylesheet" href="assets/css/catalog.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": ${JSON.stringify(t.h1 + ' — vr.ar')},
  "description": ${JSON.stringify(t.desc)},
  "url": "https://vr.ar/${t.slug}",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "inLanguage": "${t.lang}",
  "dateModified": "${TODAY}",
  "creator": { "@type": "Organization", "name": "vr.ar", "url": "https://vr.ar/" },
  "distribution": [{
    "@type": "DataDownload",
    "encodingFormat": "application/json",
    "contentUrl": "https://vr.ar/data/vr-games.json"
  }]
}
</script>
</head>
<body>

<div class="bg-grid"></div>
<div class="bg-orb bg-orb-1"></div>

<div id="app">
  <nav class="topbar">
    <a class="topbar-logo" href="index.html" style="text-decoration:none">VR<span>.</span>AR</a>
    <div class="topbar-right">
      ${t.nav.map(([href, label]) => `<a class="topbar-link" href="${href}">${esc(label.toUpperCase())}</a>`).join('\n      ')}
    </div>
  </nav>

  <div class="cat-wrap">
    <h1>${esc(t.h1)}</h1>
    <p class="cat-lead">${esc(t.lead)}</p>
    <p class="cat-honest">${t.honest}</p>

    <div class="cat-controls">
      <label class="cat-field">
        <span>${esc(t.yourHeadset)}</span>
        <select id="headset">
          <option value="">${esc(t.all)}</option>
          ${HEADSETS.map((h) => `<option value="${esc(h.id)}">${esc(h.name)}</option>`).join('\n          ')}
        </select>
      </label>
      <label class="cat-field cat-field-grow">
        <span class="sr-only">${esc(t.search)}</span>
        <input type="search" id="q" placeholder="${esc(t.search)}" autocomplete="off">
      </label>
      <span class="cat-count" id="count"></span>
    </div>

    <div class="cat-table-wrap">
      <table class="cat-table" id="table">
        <thead>
          <tr>
            <th scope="col">${esc(t.game)}</th>
            <th scope="col" class="col-verdict" id="verdictHead">${esc(t.worksLabel)}</th>
            ${PLATFORMS.map((p) => `<th scope="col">${esc(PLATFORM_LABEL[t.lang][p])}</th>`).join('\n            ')}
          </tr>
        </thead>
        <tbody>
      ${rows}
        </tbody>
      </table>
      <p class="cat-empty" id="empty" hidden>${esc(t.noResults)}</p>
    </div>

    <div class="cat-legend">
      <div class="cat-legend-title">${esc(t.legendTitle)}</div>
      <ul>
        ${t.legend.map(([k, text]) => `<li><span class="c ${k}">${k === 'yes' ? '✓' : k === 'no' ? '✕' : '–'}</span> ${esc(text)}</li>`).join('\n        ')}
      </ul>
    </div>

    <section class="cat-section">
      <h2>${esc(t.useTitle)}</h2>
      <p>${t.use}</p>
      <p class="cat-updated">${esc(t.updated)}</p>
    </section>

    <div class="cat-cta">
      <div class="cat-cta-title">${esc(t.ctaTitle)}</div>
      <p>${esc(t.ctaText)}</p>
      <div class="cat-cta-actions">
        <a class="cat-btn" href="${t.ctaHref}">${esc(t.ctaBtn)}</a>
        <a class="cat-btn-ghost" href="index.html">${esc(t.quiz)}</a>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    ${t.nav.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('\n    <span class="site-footer-sep">·</span>\n    ')}
    <span class="site-footer-sep">·</span>
    <a href="privacy.html">${t.lang === 'es' ? 'Política de privacidad' : 'Privacy Policy'}</a>
  </footer>
</div>

<script>
/* La derivación visor → veredicto es la misma que usa la extensión en
   extension/src/data.js (función resolve). Si cambia allá, cambia acá. */
(function () {
  var HEADSETS = ${JSON.stringify(HEADSETS.map((h) => ({ id: h.id, native: h.native, pcvr: h.pcvr })))};
  var GAMES = ${JSON.stringify(Object.fromEntries(games.map((g) => [g.slug, { on: g.available_on, off: g.not_available_on }])))};
  var LABEL = ${JSON.stringify(t.verdicts)};
  var WORD = ${JSON.stringify(t.results)};

  function verdict(slug, headsetId) {
    var h = HEADSETS.filter(function (x) { return x.id === headsetId; })[0];
    var g = GAMES[slug];
    if (!h || !g) return null;
    if ((h.native || []).some(function (p) { return g.on.indexOf(p) > -1; })) return 'yes';
    if (h.pcvr && g.on.indexOf('steam') > -1) return 'pc';
    var needed = (h.native || []).slice();
    if (h.pcvr) needed.push('steam');
    var allChecked = needed.every(function (p) { return g.off.indexOf(p) > -1; });
    return allChecked ? 'no' : 'unknown';
  }

  var table = document.getElementById('table');
  var rows = [].slice.call(table.tBodies[0].rows);
  var select = document.getElementById('headset');
  var input = document.getElementById('q');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');

  function paint() {
    var id = select.value;
    var term = input.value.trim().toLowerCase();
    table.classList.toggle('with-verdict', !!id);
    var shown = 0;
    rows.forEach(function (row) {
      var match = !term || row.dataset.title.indexOf(term) > -1;
      row.hidden = !match;
      if (match) shown++;
      var cell = row.querySelector('.verdict');
      if (!id) { cell.className = 'c verdict'; cell.textContent = ''; return; }
      var v = verdict(row.dataset.slug, id) || 'unknown';
      cell.className = 'c verdict v-' + v;
      cell.textContent = LABEL[v];
    });
    count.textContent = shown + ' ' + (shown === 1 ? WORD[0] : WORD[1]);
    empty.hidden = shown > 0;
  }

  select.addEventListener('change', paint);
  input.addEventListener('input', paint);
  paint();
})();
</script>
</body>
</html>
`;
}

fs.writeFileSync(path.join(ROOT, 'compatibilidad.html'), page(T.es));
fs.writeFileSync(path.join(ROOT, 'vr-game-compatibility.html'), page(T.en));

console.log(`data/vr-games.json          ${games.length} juegos, ${json.coverage.verified_share}% verificado`);
console.log('compatibilidad.html         (es)');
console.log('vr-game-compatibility.html  (en)');
