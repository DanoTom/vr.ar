#!/usr/bin/env node
// finder-matrix.mjs — simulates the VR Finder quiz scoring offline.
//
// Reads assets/js/app.js, extracts QUESTIONS_EN / EXCLUSION_MAP / OS_SCORE_DELTA,
// and runs a matrix of user profiles through the exact same scoring rules the
// site uses (sum deltas, apply hard exclusions, sort). Prints winner + runner-up
// per profile and flags mismatches against the expected winner.
//
// Usage:  node tools/finder-matrix.mjs
// Exit code 1 if any profile's winner differs from expectation — safe to use as
// an acceptance gate before publishing any change to the quiz deltas.
//
// See docs/FINDER-AJUSTE.md for the profile definitions and the change process.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'assets/js/app.js'), 'utf8');

function extract(name, open, close) {
  const re = new RegExp(`const ${name} = ${open}[\\s\\S]*?\\n${close};`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not extract ${name} from app.js`);
  return m[0];
}

const code = [
  extract('EXCLUSION_MAP', '\\{', '\\}'),
  extract('OS_SCORE_DELTA', '\\[', '\\]'),
  extract('QUESTIONS_EN', '\\[', '\\]'),
  'return { EXCLUSION_MAP, OS_SCORE_DELTA, QUESTIONS_EN };'
].join('\n');
const { EXCLUSION_MAP, OS_SCORE_DELTA, QUESTIONS_EN } = new Function(code)();

const HEADSETS = ['quest3s','quest3','psvr2','pimax','pimaxsuper','pico4ultra','beyond2'];

// answers: one option index per question (same order as the quiz).
// os: option index of the OS question (only when answers[0] === 1, i.e. PCVR).
function simulate({ answers, os = null }) {
  const scores = Object.fromEntries(HEADSETS.map(h => [h, 0]));
  const excluded = new Set();
  answers.forEach((sel, qi) => {
    const s = QUESTIONS_EN[qi].scores[sel];
    for (const k in s) scores[k] += s[k];
    const excl = EXCLUSION_MAP[qi];
    if (excl && excl[sel]) excl[sel].forEach(k => excluded.add(k));
  });
  if (answers[0] === 1 && os !== null) {
    const delta = OS_SCORE_DELTA[os];
    for (const k in delta) { if (k in scores) scores[k] += delta[k]; }
    if (os === 1) excluded.add('psvr2'); // Linux hard-excludes PSVR2 (mirrors app.js)
  }
  const sorted = HEADSETS.filter(k => !excluded.has(k)).sort((a, b) => scores[b] - scores[a]);
  return { sorted, scores };
}

// ─── Acceptance matrix — profiles and expected winners ─────────────
// Q1 use: 0 standalone · 1 PCVR · 2 PS5 · 3 unsure
// Q2 budget: 0 <$400 · 1 $400–650 · 2 $650–1000 · 3 >$1000
// Q3 usage: 0 casual · 1 AAA · 2 sim/high-end · 3 MR/creative
// Q4 exp: 0 none · 1 beginner · 2 some · 3 advanced
// Q5 clarity: 0 good-enough · 1 very · 2 top-priority
// Q6 priority: 0 value · 1 convenience · 2 exclusives · 3 performance
// Q7 weight: 0 very-much · 1 somewhat · 2 not-really
// os (PCVR only): 0 Windows · 1 Linux · 2 macOS
const PROFILES = [
  { name: 'Novato con presupuesto ajustado', answers: [0,0,0,0,0,0,1], expect: 'quest3s' },
  { name: 'Primer visor, presupuesto medio, quiere MR', answers: [0,1,3,0,1,1,1], expect: 'quest3' },
  { name: 'Dueño de PS5 gamer', answers: [2,1,1,2,1,2,2], expect: 'psvr2' },
  { name: 'PCVR cuidando el bolsillo (Windows)', answers: [1,1,1,1,1,0,1], os: 0, expect: 'quest3' },
  { name: 'Sim racer PCVR (Windows)', answers: [1,2,2,3,2,3,2], os: 0, expect: 'pimax' },
  { name: 'PCVR fidelidad máxima sin límite', answers: [1,3,2,3,2,3,2], os: 0, expect: 'pimaxsuper' },
  { name: 'PCVR premium ultraliviano', answers: [1,3,1,3,1,3,0], os: 0, expect: 'beyond2' },
  { name: 'PCVR en Linux', answers: [1,2,2,2,2,3,0], os: 1, expect: 'beyond2' },
  { name: 'Indeciso total, primera vez', answers: [3,1,0,0,0,1,1], expectAny: ['quest3s','quest3'] },
  { name: 'Standalone gama media-alta, alternativa a Meta', answers: [0,2,3,2,1,1,1], expect: 'pico4ultra' },
];

let failures = 0;
console.log('VR Finder — matriz de aceptación (lógica actual de app.js)\n');
for (const p of PROFILES) {
  const { sorted, scores } = simulate(p);
  const [win, second] = sorted;
  const accepted = p.expectAny ?? [p.expect];
  const ok = accepted.includes(win);
  if (!ok) failures++;
  console.log(`${ok ? '✅' : '❌'} ${p.name}`);
  console.log(`     ganador: ${win} (${scores[win]} pts) · segundo: ${second} (${scores[second]} pts) · esperado: ${accepted.join(' o ')}`);
}
console.log(`\n${PROFILES.length - failures}/${PROFILES.length} perfiles OK`);
process.exit(failures ? 1 : 0);
