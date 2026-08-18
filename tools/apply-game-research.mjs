// Aplica los resultados de la investigación de plataformas al catálogo de la
// extensión (extension/src/data.js).
//
// Entrada: archivos JSON en un directorio, cada uno un array de
//   { title, on: [...], off: [...], nota }
// donde "on" son las plataformas donde se verificó que el juego ESTÁ y "off"
// aquellas donde se verificó que NO está. Lo que no figura queda desconocido.
//
// Uso:  node tools/apply-game-research.mjs <directorio-con-json>
//
// El script no inventa nada: si un título del catálogo no aparece en la
// investigación, queda como estaba y se informa al final.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('Falta el directorio con los JSON de investigación.');
  process.exit(1);
}

const DATA = 'extension/src/data.js';
const PLATFORMS = ['quest', 'steam', 'psvr2', 'pico'];

function normalize(text) {
  return (text || '')
    .replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// ── Cargar la investigación ────────────────────────────────────────────────
const research = new Map();
let files = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const rows = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  files++;
  for (const row of rows) {
    const on = (row.on || []).filter((p) => PLATFORMS.includes(p));
    const off = (row.off || []).filter((p) => PLATFORMS.includes(p));
    const conflict = on.filter((p) => off.includes(p));
    if (conflict.length) {
      console.error(`  ⚠ "${row.title}" declara ${conflict.join(', ')} en on y off a la vez; se descarta ese dato`);
    }
    research.set(normalize(row.title), {
      on: on.filter((p) => !conflict.includes(p)),
      off: off.filter((p) => !conflict.includes(p)),
      nota: row.nota || ''
    });
  }
}
console.log(`Investigación cargada: ${files} archivos, ${research.size} juegos`);

// ── Cargar el catálogo actual ──────────────────────────────────────────────
const src = readFileSync(DATA, 'utf8');
const start = src.indexOf('const CATALOG = ');
const end = src.indexOf('\n// ── Derivación');
const catalog = JSON.parse(src.slice(start + 'const CATALOG = '.length, src.lastIndexOf(';', end)));

// ── Aplicar ────────────────────────────────────────────────────────────────
let updated = 0;
const missing = [];
for (const game of catalog) {
  const found = research.get(normalize(game.title))
    || (game.aliases || []).map((a) => research.get(normalize(a))).find(Boolean);
  if (!found) { missing.push(game.title); continue; }
  game.on = found.on;
  game.off = found.off;
  updated++;
}

writeFileSync(DATA, src.slice(0, start) + 'const CATALOG = ' + JSON.stringify(catalog, null, 2) + ';\n' + src.slice(end));

// ── Informe ────────────────────────────────────────────────────────────────
console.log(`Actualizados: ${updated} de ${catalog.length} juegos`);
if (missing.length) {
  console.log(`Sin dato de investigación (${missing.length}), quedan como estaban:`);
  missing.forEach((t) => console.log('   ·', t));
}

const totals = { on: 0, off: 0, unknown: 0 };
for (const game of catalog) {
  for (const platform of PLATFORMS) {
    if ((game.on || []).includes(platform)) totals.on++;
    else if ((game.off || []).includes(platform)) totals.off++;
    else totals.unknown++;
  }
}
const known = totals.on + totals.off;
console.log(`Cobertura: ${known}/${catalog.length * PLATFORMS.length} datos verificados (${Math.round(known / (catalog.length * PLATFORMS.length) * 100)}%)`);
