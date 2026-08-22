// ─── DATA ─────────────────────────────────────────────────────────
// hardExclusions[questionIndex][optionIndex] → array of headset keys to permanently exclude
const EXCLUSION_MAP = {
  0: [
    ['psvr2','pimax','pimaxsuper','beyond2'],    // standalone → exclude all non-standalone
    ['psvr2'],                                    // PCVR → exclude PS5-only
    ['pimax','pimaxsuper','pico4ultra','beyond2'],// PS5 → exclude PCVR-only
    []                                            // unsure → no exclusions
  ]
};

// ─── OS QUESTION (shown only for PCVR users) ──────────────────────
const OS_QUESTION_EN = {
  text: "What operating system does your PC run?",
  opts: ["Windows 10 / 11", "Linux", "macOS"]
};
const OS_QUESTION_ES = {
  text: "¿Qué sistema operativo usa tu PC?",
  opts: ["Windows 10 / 11", "Linux", "macOS"]
};

// Score deltas applied when OS is selected (PCVR context only)
// Windows = no change. Linux = PSVR2 heavily penalized (no support), others slight (partial/ALVR).
// macOS = all PCVR headsets penalized (none work natively).
const OS_SCORE_DELTA = [
  {quest3s:0,  quest3:0,  psvr2:0,   pimax:0,   pimaxsuper:0,  pico4ultra:0,  beyond2:0},   // Windows
  {quest3s:-1, quest3:-1, psvr2:-8,  pimax:-2,  pimaxsuper:-2, pico4ultra:-2, beyond2:2},   // Linux — beyond2 gets bonus (native SteamVR)
  {quest3s:-8, quest3:-8, psvr2:-10, pimax:-10, pimaxsuper:-10,pico4ultra:-8, beyond2:-10}  // macOS
];

// Compatibility status per headset per OS (for result badge)
// Based on: Windows ✅ all | Linux: PSVR2 ❌, others ⚠️ partial | macOS: all ❌
const OS_COMPAT_MAP = {
  quest3s:    { linux: 'partial', macos: 'none' },
  quest3:     { linux: 'partial', macos: 'none' },
  psvr2:      { linux: 'none',    macos: 'none' },
  pimax:      { linux: 'partial', macos: 'none' },
  pimaxsuper: { linux: 'partial', macos: 'none' },
  pico4ultra: { linux: 'partial', macos: 'none' },
  beyond2:    { linux: 'ok',      macos: 'none' }
};

const QUESTIONS_EN = [
  {
    text: "How do you want to use your VR headset?",
    opts: [
      "Standalone — no PC or console needed",
      "Connected to my gaming PC (PCVR)",
      "With my PlayStation 5",
      "I'm not sure yet"
    ],
    scores: [
      {quest3s:4,  quest3:3,  psvr2:-10, pimax:-10, pimaxsuper:-10, pico4ultra:3,  beyond2:-10},
      {quest3s:0,  quest3:1,  psvr2:-10, pimax:5,   pimaxsuper:5,   pico4ultra:2,  beyond2:5},
      {quest3s:-2, quest3:-1, psvr2:6,   pimax:-10, pimaxsuper:-10, pico4ultra:-10,beyond2:-10},
      {quest3s:1,  quest3:2,  psvr2:0,   pimax:0,   pimaxsuper:0,   pico4ultra:2,  beyond2:-1}
    ]
  },
  {
    text: "What's your budget for the headset?",
    opts: [
      "Under $400 — e.g. Quest 3S (~$350)",
      "$400–$650 — e.g. PSVR2 (~$400), Quest 3 (~$600)",
      "$650–$1000 — e.g. Pimax Crystal Light (~$700+), Pico 4 Ultra (~$708)",
      "Over $1000 — e.g. Pimax Crystal Super (~$2,000)"
    ],
    scores: [
      {quest3s:4,  quest3:-1, psvr2:-2, pimax:-5, pimaxsuper:-8, pico4ultra:-5, beyond2:-8},
      {quest3s:1,  quest3:3,  psvr2:2,  pimax:-2, pimaxsuper:-5, pico4ultra:-2, beyond2:-5},
      {quest3s:-1, quest3:0,  psvr2:0,  pimax:5,  pimaxsuper:-6, pico4ultra:5,  beyond2:-6},
      {quest3s:-3, quest3:-1, psvr2:-1, pimax:0,  pimaxsuper:6,  pico4ultra:-3, beyond2:4}
    ]
  },
  {
    text: "What will you mainly use the headset for?",
    opts: [
      "Casual gaming and entertainment",
      "AAA gaming and deep immersion",
      "Sim racing, shooters or high-end PCVR",
      "Mixed reality and creative apps"
    ],
    scores: [
      {quest3s:3,  quest3:2, psvr2:1, pimax:-2, pimaxsuper:-3, pico4ultra:2,  beyond2:-3},
      {quest3s:0,  quest3:2, psvr2:3, pimax:2,  pimaxsuper:2,  pico4ultra:2,  beyond2:2},
      {quest3s:-2, quest3:0, psvr2:1, pimax:5,  pimaxsuper:6,  pico4ultra:1,  beyond2:5},
      {quest3s:1,  quest3:3, psvr2:0, pimax:0,  pimaxsuper:-1, pico4ultra:3,  beyond2:0}
    ]
  },
  {
    text: "How much VR experience do you have?",
    opts: [
      "None — this would be my first time",
      "I've tried it a bit, but I'm a beginner",
      "I have some experience",
      "I use VR regularly — I'm advanced"
    ],
    scores: [
      {quest3s:4,  quest3:1, psvr2:-1, pimax:-3, pimaxsuper:-5, pico4ultra:1,  beyond2:-5},
      {quest3s:2,  quest3:2, psvr2:1,  pimax:-1, pimaxsuper:-3, pico4ultra:2,  beyond2:-2},
      {quest3s:0,  quest3:2, psvr2:2,  pimax:1,  pimaxsuper:1,  pico4ultra:2,  beyond2:2},
      {quest3s:-1, quest3:1, psvr2:2,  pimax:3,  pimaxsuper:5,  pico4ultra:1,  beyond2:4}
    ]
  },
  {
    text: "How important is image quality and visual clarity to you?",
    opts: [
      "Good enough — I prioritize simplicity and value",
      "Very important — I want a sharp, clear image",
      "My top priority — I won't compromise on it"
    ],
    scores: [
      {quest3s:3,  quest3:2, psvr2:0, pimax:-3, pimaxsuper:-5, pico4ultra:1,  beyond2:-4},
      {quest3s:0,  quest3:2, psvr2:2, pimax:3,  pimaxsuper:2,  pico4ultra:3,  beyond2:3},
      {quest3s:-2, quest3:0, psvr2:1, pimax:5,  pimaxsuper:7,  pico4ultra:1,  beyond2:6}
    ]
  },
  {
    text: "What matters most in your final decision?",
    opts: [
      "Best value for money",
      "Maximum convenience — easy setup, no extra hardware",
      "Gaming exclusives and deep immersion",
      "Raw performance and visual fidelity"
    ],
    scores: [
      {quest3s:3,  quest3:4, psvr2:0,  pimax:-1, pimaxsuper:-4, pico4ultra:0,  beyond2:-4},
      {quest3s:3,  quest3:3, psvr2:-1, pimax:-3, pimaxsuper:-6, pico4ultra:2,  beyond2:-6},
      {quest3s:0,  quest3:1, psvr2:4,  pimax:1,  pimaxsuper:1,  pico4ultra:0,  beyond2:2},
      {quest3s:-1, quest3:0, psvr2:1,  pimax:4,  pimaxsuper:7,  pico4ultra:1,  beyond2:6}
    ]
  },
  {
    text: "How much does headset weight and physical comfort matter to you?",
    opts: [
      "Very much — I want the lightest setup possible",
      "Somewhat — lighter is better, but it's not a dealbreaker",
      "Not really — I prioritize features over weight"
    ],
    scores: [
      {quest3s:2,  quest3:2,  psvr2:-1, pimax:0, pimaxsuper:-5, pico4ultra:-1, beyond2:7},
      {quest3s:1,  quest3:1,  psvr2:0,  pimax:0, pimaxsuper:-3, pico4ultra:0,  beyond2:4},
      {quest3s:0,  quest3:0,  psvr2:0,  pimax:0, pimaxsuper:0,  pico4ultra:0,  beyond2:0}
    ]
  }
];

const QUESTIONS_ES = [
  {
    text: "¿Cómo querés usar tu headset de VR?",
    opts: [
      "Standalone — sin PC ni consola",
      "Conectado a mi PC gamer (PCVR)",
      "Con mi PlayStation 5",
      "Todavía no estoy seguro"
    ],
    scores: QUESTIONS_EN[0].scores
  },
  {
    text: "¿Cuál es tu presupuesto para el headset?",
    opts: [
      "Menos de $400 — ej: Quest 3S (~$350)",
      "$400–$650 — ej: PSVR2 (~$400), Quest 3 (~$600)",
      "$650–$1000 — ej: Pimax Crystal Light (~$700+), Pico 4 Ultra (~$708)",
      "Más de $1000 — ej: Pimax Crystal Super (~$2.000)"
    ],
    scores: QUESTIONS_EN[1].scores
  },
  {
    text: "¿Para qué vas a usar el headset principalmente?",
    opts: [
      "Gaming casual y entretenimiento",
      "Gaming AAA e inmersión total",
      "Sim racing, shooters o PCVR de alto rendimiento",
      "Realidad mixta y apps creativas"
    ],
    scores: QUESTIONS_EN[2].scores
  },
  {
    text: "¿Cuánta experiencia tenés en realidad virtual?",
    opts: [
      "Ninguna, es mi primera vez",
      "Probé un poco, pero soy principiante",
      "Ya tengo algo de experiencia",
      "Uso VR frecuentemente, soy avanzado"
    ],
    scores: QUESTIONS_EN[3].scores
  },
  {
    text: "¿Qué tan importante es la calidad de imagen para vos?",
    opts: [
      "Suficiente — priorizo la simplicidad y el precio",
      "Muy importante — quiero una imagen nítida y clara",
      "Mi prioridad absoluta — no negocio en ese aspecto"
    ],
    scores: QUESTIONS_EN[4].scores
  },
  {
    text: "¿Qué priorizás más en tu decisión final?",
    opts: [
      "La mejor relación calidad/precio",
      "La mayor comodidad — fácil de configurar, sin hardware extra",
      "Exclusivos de gaming e inmersión profunda",
      "Rendimiento y fidelidad visual máximos"
    ],
    scores: QUESTIONS_EN[5].scores
  },
  {
    text: "¿Qué tan importante es el peso y la comodidad física del headset para vos?",
    opts: [
      "Muy importante — quiero el setup más liviano posible",
      "Algo importante — prefiero liviano, pero no es determinante",
      "No mucho — priorizo funciones por encima del peso"
    ],
    scores: QUESTIONS_EN[6].scores
  }
];

// ─── AUTOGEN:HEADSETS — generated from data/headsets/*.json by build.py · do not edit by hand ───
const HEADSETS = {
  quest3s: {
    name: "Meta Quest 3S",
    nickname_en: '"The Smart Entry"', nickname_es: '"La entrada inteligente"',
    price: "USD $349.99 (128GB) / $449.99 (256GB)",
    desc_en: "The Quest 3S shares the same Snapdragon XR2 Gen 2 chip and full app library as the Quest 3, at a significantly lower price. It's the perfect gateway to modern VR: fully standalone with color passthrough — no PC or console needed.",
    desc_es: "El Quest 3S comparte el mismo procesador Snapdragon XR2 Gen 2 y la biblioteca completa del Quest 3, a un precio significativamente menor. Es la puerta de entrada perfecta al VR moderno: standalone con passthrough color, sin PC ni consola.",
    link: "https://www.meta.com/quest/quest-3s/",
    linkNote_en: "Official Meta Store price",
    linkNote_es: "Precio oficial de Meta",
    btnLabel_en: "View on Meta Store →",
    btnLabel_es: "Ver en Meta Store →",
    img: "https://m.media-amazon.com/images/I/61-SGpdmgRL._SL1500_.jpg"
  },
  quest3: {
    name: "Meta Quest 3",
    nickname_en: '"The Best for Most People"', nickname_es: '"El mejor para la mayoría"',
    price: "USD $599.99 (512GB)",
    desc_en: "The Quest 3 is the most well-rounded standalone headset: sharp pancake lenses, quality color passthrough, and the best VR app ecosystem. No PC or console required — the top pick by specialized media in 2024–2025.",
    desc_es: "El Quest 3 es el headset standalone más equilibrado: lentes pancake de alta nitidez, passthrough color de calidad y el mejor ecosistema de apps VR. Sin PC ni consola — el más recomendado por medios especializados en 2024–2025.",
    link: "https://www.meta.com/quest/quest-3/",
    linkNote_en: "Official Meta Store price",
    linkNote_es: "Precio oficial de Meta",
    btnLabel_en: "View on Meta Store →",
    btnLabel_es: "Ver en Meta Store →",
    img: "https://m.media-amazon.com/images/I/61nkctF66PL._SL1500_.jpg"
  },
  psvr2: {
    name: "PlayStation VR2",
    nickname_en: '"The PS5 Gamer"', nickname_es: '"El gamer de PS5"',
    price: "USD $399.99",
    desc_en: "The PSVR2 takes VR gaming to the next level for PS5 owners: native eye tracking, haptic feedback in the headset, and adaptive triggers for unmatched immersion. Note: requires PS5 — not standalone, not PC-compatible.",
    desc_es: "El PSVR2 lleva el gaming VR a otro nivel para dueños de PS5: eye tracking nativo, feedback háptico y gatillos adaptativos para una inmersión sin igual. Requiere PS5 — no es standalone ni compatible con PC.",
    link: "https://www.playstation.com/en-us/ps-vr2/",
    linkNote_en: "Official PlayStation site",
    linkNote_es: "Sitio oficial de PlayStation",
    btnLabel_en: "View on PlayStation →",
    btnLabel_es: "Ver en PlayStation →",
    img: "https://m.media-amazon.com/images/I/517CoPDzOpL._AC_SL1500_.jpg"
  },
  pimax: {
    name: "Pimax Crystal Light",
    nickname_en: '"The PCVR Clarity King"', nickname_es: '"El rey de la claridad PCVR"',
    price: "USD $699 / $899 (Local Dimming)",
    desc_en: "The community's top pick for PCVR value in 2025–2026: best visual clarity per dollar on the market, with a massive 115° FOV and glass aspheric lenses with a large sweet spot. Requires a gaming PC with at least an RTX 3070 and a USB-C cable connection. Highly recommended for sim racing and high-fidelity shooters.",
    desc_es: "La opción más recomendada por la comunidad PCVR en 2025–2026: mejor claridad visual por dólar del mercado, con FOV de 115° y lentes asféricas de cristal con un gran sweet spot. Requiere PC gamer con al menos RTX 3070 y conexión por cable USB-C. Especialmente recomendado para sim racing y shooters de alto rendimiento.",
    link: "https://tidd.ly/3OBHHDk",
    linkNote_en: "Best price via XR Shop (authorized reseller)",
    linkNote_es: "Mejor precio en XR Shop (revendedor autorizado)",
    btnLabel_en: "View on XR Shop →",
    btnLabel_es: "Ver en XR Shop →",
    img: "https://m.media-amazon.com/images/I/61fe6hWTbvL._AC_SL1500_.jpg"
  },
  pimaxsuper: {
    name: "Pimax Crystal Super",
    nickname_en: '"The Uncompromising"', nickname_es: '"El sin concesiones"',
    price: "USD ~$2,000",
    desc_en: "The most advanced consumer PCVR headset available: 3,840×3,840 px per eye, ultrawide FOV, and integrated eye tracking. Built for users who refuse to compromise on visual fidelity. Requires a gaming PC with an RTX 4070 or better. Especially recommended for sim racing, flight simulators, and demanding PCVR experiences.",
    desc_es: "El headset PCVR consumer más avanzado del mercado: 3.840×3.840 px por ojo, FOV ultrawide y eye tracking integrado. Para usuarios exigentes que no hacen concesiones en calidad visual. Requiere PC gamer con RTX 4070 o superior. Especialmente recomendado para sim racing, simuladores de vuelo y experiencias PCVR exigentes.",
    link: "https://tidd.ly/4bcuiuc",
    linkNote_en: "Best price via XR Shop (authorized reseller)",
    linkNote_es: "Mejor precio en XR Shop (revendedor autorizado)",
    btnLabel_en: "View on XR Shop →",
    btnLabel_es: "Ver en XR Shop →",
    img: "https://m.media-amazon.com/images/I/51xwSaEuz0L._AC_SL1500_.jpg"
  },
  pico4ultra: {
    name: "Pico 4 Ultra",
    nickname_en: '"The Quest Alternative"', nickname_es: '"La alternativa al Quest"',
    price: "USD ~$708",
    desc_en: "A powerful standalone headset with native eye tracking, Snapdragon XR2 Gen 2, and 2160×2160 per eye resolution with pancake lenses. Supports wireless PCVR streaming via Wi-Fi. The most compelling Quest 3 alternative for users in regions where Meta isn't dominant, or anyone who wants eye tracking at this price point.",
    desc_es: "Un headset standalone potente con eye tracking nativo, Snapdragon XR2 Gen 2 y resolución de 2160×2160 por ojo con lentes pancake. Compatible con PCVR streaming inalámbrico vía Wi-Fi. La alternativa más sólida al Quest 3 para usuarios en regiones donde Meta no domina, o quienes buscan eye tracking a este precio.",
    link: "https://tidd.ly/4tXObfS",
    linkNote_en: "Best price via XR Shop (authorized reseller)",
    linkNote_es: "Mejor precio en XR Shop (revendedor autorizado)",
    btnLabel_en: "View on XR Shop →",
    btnLabel_es: "Ver en XR Shop →",
    img: "https://xrshop.store/cdn/shop/files/PICO4UltraKVGForceNVIDIA.jpg?v=1764682594&width=1680"
  },
  beyond2: {
    name: "Bigscreen Beyond 2",
    nickname_en: '"The Featherweight"', nickname_es: '"La pluma"',
    price: "USD from $1,019",
    desc_en: "The lightest premium PCVR headset ever made at just 107g — nearly 5× lighter than the Quest 3. Micro-OLED displays deliver 2560×2560 per eye with zero screen door effect. Next-gen pancake lenses with 116° FOV and edge-to-edge clarity. Requires SteamVR base stations, PC with RTX 3070+, and a 3D face scan for the custom-fit cushion. Tethered only.",
    desc_es: "El headset PCVR premium más liviano del mercado con solo 107g — casi 5× más liviano que el Quest 3. Pantallas Micro-OLED con 2560×2560 por ojo sin efecto mosquitera. Lentes pancake de nueva generación con 116° FOV y claridad borde a borde. Requiere base stations de SteamVR, PC con RTX 3070+ y escaneo facial 3D para el cushion. Solo tethered.",
    link: "https://store.bigscreenvr.com/products/bigscreen-beyond-2",
    linkNote_en: "Available direct from Bigscreen",
    linkNote_es: "Disponible directo de Bigscreen",
    btnLabel_en: "Visit Bigscreen Store →",
    btnLabel_es: "Ver en tienda Bigscreen →",
    img: "https://store.bigscreenvr.com//cdn//shop//files//Clear_with_Strap.webp?v=1743475007"
  }
};
// ─── /AUTOGEN:HEADSETS ───

const SVG_ICONS = {
  quest3s:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs1"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs1)" fill="none" stroke="#00d4ff" stroke-width="2"><rect x="30" y="56" width="140" height="48" rx="24" fill="rgba(0,212,255,0.08)" stroke-width="1.5"/><ellipse cx="68" cy="80" rx="22" ry="22" fill="rgba(0,212,255,0.15)"/><ellipse cx="132" cy="80" rx="22" ry="22" fill="rgba(0,212,255,0.15)"/><line x1="90" y1="80" x2="110" y2="80" stroke-width="3"/><circle cx="68" cy="80" r="10" fill="rgba(0,212,255,0.3)"/><circle cx="132" cy="80" r="10" fill="rgba(0,212,255,0.3)"/></g></svg>`,
  quest3:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs2)" fill="none" stroke="#7b6fff" stroke-width="2"><rect x="25" y="52" width="150" height="56" rx="28" fill="rgba(123,111,255,0.08)"/><ellipse cx="66" cy="80" rx="24" ry="24" fill="rgba(123,111,255,0.15)"/><ellipse cx="134" cy="80" rx="24" ry="24" fill="rgba(123,111,255,0.15)"/><line x1="90" y1="80" x2="110" y2="80" stroke="#7b6fff" stroke-width="3"/><circle cx="66" cy="80" r="11" fill="rgba(123,111,255,0.3)"/><circle cx="134" cy="80" r="11" fill="rgba(123,111,255,0.3)"/></g></svg>`,
  psvr2:`<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs3"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs3)" fill="none" stroke="#0070f3" stroke-width="2"><path d="M40 95Q40 55 100 50Q160 55 160 95Q160 135 100 140Q40 135 40 95Z" fill="rgba(0,112,243,0.08)"/><ellipse cx="70" cy="92" rx="20" ry="20" fill="rgba(0,112,243,0.15)"/><ellipse cx="130" cy="92" rx="20" ry="20" fill="rgba(0,112,243,0.15)"/><circle cx="70" cy="92" r="9" fill="rgba(0,112,243,0.3)"/><circle cx="130" cy="92" r="9" fill="rgba(0,112,243,0.3)"/><path d="M100 50L100 25" stroke-width="2"/><circle cx="100" cy="20" r="6" fill="rgba(0,112,243,0.3)"/></g></svg>`,
  pimax:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs4"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs4)" fill="none" stroke="#e040fb" stroke-width="2"><rect x="15" y="54" width="170" height="52" rx="10" fill="rgba(224,64,251,0.08)"/><rect x="28" y="62" width="62" height="36" rx="8" fill="rgba(224,64,251,0.12)"/><rect x="110" y="62" width="62" height="36" rx="8" fill="rgba(224,64,251,0.12)"/><circle cx="59" cy="80" r="13" fill="rgba(224,64,251,0.25)"/><circle cx="141" cy="80" r="13" fill="rgba(224,64,251,0.25)"/><line x1="92" y1="80" x2="108" y2="80" stroke-width="3"/><line x1="15" y1="64" x2="2" y2="58" stroke-width="2"/><line x1="185" y1="64" x2="198" y2="58" stroke-width="2"/><rect x="80" y="48" width="40" height="7" rx="3" fill="rgba(224,64,251,0.2)"/></g></svg>`,
  pimaxsuper:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs5"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs5)" fill="none" stroke="#ff9800" stroke-width="2"><rect x="10" y="52" width="180" height="56" rx="10" fill="rgba(255,152,0,0.08)"/><rect x="22" y="60" width="68" height="40" rx="9" fill="rgba(255,152,0,0.12)"/><rect x="110" y="60" width="68" height="40" rx="9" fill="rgba(255,152,0,0.12)"/><circle cx="56" cy="80" r="15" fill="rgba(255,152,0,0.2)"/><circle cx="144" cy="80" r="15" fill="rgba(255,152,0,0.2)"/><circle cx="56" cy="80" r="8" fill="rgba(255,152,0,0.35)"/><circle cx="144" cy="80" r="8" fill="rgba(255,152,0,0.35)"/><line x1="90" y1="80" x2="110" y2="80" stroke-width="3"/><line x1="10" y1="62" x2="-2" y2="55" stroke-width="2"/><line x1="190" y1="62" x2="202" y2="55" stroke-width="2"/><rect x="76" y="44" width="48" height="9" rx="4" fill="rgba(255,152,0,0.22)"/><path d="M56 65 L56 95" stroke="rgba(255,152,0,0.4)" stroke-width="1"/><path d="M144 65 L144 95" stroke="rgba(255,152,0,0.4)" stroke-width="1"/></g></svg>`,
  pico4ultra:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs6"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs6)" fill="none" stroke="#22d3a5" stroke-width="2"><rect x="28" y="54" width="144" height="52" rx="26" fill="rgba(34,211,165,0.08)" stroke-width="1.5"/><ellipse cx="70" cy="80" rx="23" ry="23" fill="rgba(34,211,165,0.15)"/><ellipse cx="130" cy="80" rx="23" ry="23" fill="rgba(34,211,165,0.15)"/><line x1="93" y1="80" x2="107" y2="80" stroke-width="3"/><circle cx="70" cy="80" r="10" fill="rgba(34,211,165,0.28)"/><circle cx="130" cy="80" r="10" fill="rgba(34,211,165,0.28)"/><circle cx="70" cy="80" r="4" fill="rgba(34,211,165,0.5)"/><circle cx="130" cy="80" r="4" fill="rgba(34,211,165,0.5)"/><rect x="82" y="106" width="36" height="12" rx="6" fill="rgba(34,211,165,0.18)" stroke-width="1.2"/></g></svg>`,
  beyond2:`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="gs7"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#gs7)" fill="none" stroke="#f0f0ff" stroke-width="1.8"><ellipse cx="100" cy="80" rx="55" ry="34" fill="rgba(240,240,255,0.06)"/><ellipse cx="69" cy="80" rx="22" ry="22" fill="rgba(240,240,255,0.12)"/><ellipse cx="131" cy="80" rx="22" ry="22" fill="rgba(240,240,255,0.12)"/><circle cx="69" cy="80" r="10" fill="rgba(240,240,255,0.22)"/><circle cx="131" cy="80" r="10" fill="rgba(240,240,255,0.22)"/><circle cx="69" cy="80" r="4" fill="rgba(240,240,255,0.5)"/><circle cx="131" cy="80" r="4" fill="rgba(240,240,255,0.5)"/><line x1="91" y1="80" x2="109" y2="80" stroke-width="2.5"/><line x1="100" y1="46" x2="100" y2="38" stroke-width="1.5"/><path d="M92 38 Q100 34 108 38" stroke-width="1.5" fill="none"/></g></svg>`
};

const ACCESSORIES = {
  quest3: {
    audio: [
      { name: 'Soundcore VR P10', link: 'https://www.amazon.com/s?k=Soundcore+VR+P10',
        desc_en: 'Official co-branded wireless earbuds for Quest — ultra-low latency, totally cable-free.',
        desc_es: 'Auriculares inalámbricos co-branded oficiales para Quest, ultra baja latencia, sin cables.' },
      { name: 'AMVR Earbuds (Quest 3)', link: 'https://www.amazon.com/s?k=AMVR+earbuds+Quest+3',
        desc_en: 'Designed for Quest 3\'s port — the cleanest and most affordable wired solution.',
        desc_es: 'Diseñados para el puerto del Quest 3, la solución con cable más limpia y económica.' }
    ],
    gear: [
      { name: 'BoboVR S3 Pro', link: 'https://www.amazon.com/s?k=BoboVR+S3+Pro',
        desc_en: 'Reddit\'s #1 pick: improved head strap that counterbalances weight and doubles battery life.',
        desc_es: 'El accesorio #1 en Reddit: correa que contrabalancea el peso y duplica la batería.' },
      { name: 'BoboVR G3 Controller Grips', link: 'https://www.amazon.com/s?k=BoboVR+G3+controller+grips',
        desc_en: 'Essential for physical games, shooters and fitness — better grip, controller protection.',
        desc_es: 'Imprescindible para juegos físicos, shooters y fitness, mejora el agarre y protege los controllers.' }
    ]
  },
  quest3s: {
    audio: [
      { name: 'AMVR Earbuds (Quest 3/3S)', link: 'https://www.amazon.com/s?k=AMVR+earbuds+Quest+3',
        desc_en: 'Same port as Quest 3 — clean, affordable wired solution designed for this headset.',
        desc_es: 'Mismo puerto que Quest 3, solución con cable limpia y económica para este headset.' },
      { name: 'Koss Porta Pro', link: 'https://www.amazon.com/s?k=Koss+Porta+Pro',
        desc_en: 'Ultra-light open-back with excellent sound for the price — iconic in the VR community.',
        desc_es: 'Ultralivianos y open-back, sonido excelente para el precio, muy populares en la comunidad VR.' }
    ],
    gear: [
      { name: 'BoboVR S3 Pro', link: 'https://www.amazon.com/s?k=BoboVR+S3+Pro',
        desc_en: 'Native battery lasts ~2h — this strap extends it considerably and improves balance.',
        desc_es: 'La batería nativa dura ~2hs; este strap la extiende considerablemente y mejora el balance.' },
      { name: 'AMVR Facial Interface', link: 'https://www.amazon.com/s?k=AMVR+silicone+facial+interface+Quest+3',
        desc_en: 'The default foam can irritate skin — this version is more comfortable and blocks light better.',
        desc_es: 'La interfaz facial por defecto puede irritar la piel; más cómoda y bloquea mejor la luz.' }
    ]
  },
  psvr2: {
    audio: [
      { name: 'Sony Pulse Explore', link: 'https://www.amazon.com/s?k=Sony+Pulse+Explore',
        desc_en: 'Native PS5 integration, system EQ, simultaneous phone connection, zero perceptible latency.',
        desc_es: 'Integración nativa con PS5, ecualizador del sistema, conexión simultánea con el teléfono, sin latencia.' },
      { name: 'SteelSeries Arctis Nova 1P', link: 'https://www.amazon.com/s?k=SteelSeries+Arctis+Nova+1P',
        desc_en: '3.5mm jack directly into PSVR2, lightweight with retractable mic — helps stabilize the headset.',
        desc_es: 'Conexión directa por jack 3.5mm al PSVR2, liviano con micrófono retráctil, ayuda a estabilizar el headset.' }
    ],
    gear: [
      { name: 'Globular Cluster CMP2', link: 'https://www.amazon.com/s?k=Globular+Cluster+CMP2+PSVR2',
        desc_en: 'Reddit\'s top comfort mod for PSVR2 — redistributes weight and improves balance considerably.',
        desc_es: 'El mod de comodidad más recomendado para PSVR2 en Reddit, redistribuye el peso y mejora el balance.' },
      { name: 'Collective Minds Charging Stand', link: 'https://www.amazon.com/s?k=Collective+Minds+PSVR2+charging+stand',
        desc_en: 'Charges the headset and both controllers simultaneously — also works as a display stand.',
        desc_es: 'Carga el headset y ambos controllers simultáneamente, también funciona como display stand.' }
    ]
  },
  pimax: {
    note_en: 'Requires a gaming PC with at least an NVIDIA RTX 3070. Not standalone — USB-C cable connection to your PC required.',
    note_es: 'Requiere PC gamer con al menos NVIDIA RTX 3070. No es standalone — necesita conexión por cable USB-C a tu PC.',
    audio: [
      { name: 'Pimax DMAS', link: 'https://www.amazon.com/s?k=Pimax+DMAS',
        desc_en: 'Official Pimax spatial audio speakers — premium open-ear solution designed specifically for Pimax headsets.',
        desc_es: 'Parlantes de audio espacial oficiales de Pimax — solución open-ear premium diseñada específicamente para headsets Pimax.' },
      { name: 'Moondrop Chu', link: 'https://www.amazon.com/s?k=Moondrop+Chu',
        desc_en: 'High-quality IEMs with cable, excellent for long PCVR sessions — great value for audiophile-level sound.',
        desc_es: 'IEMs con cable de excelente calidad, ideales para sesiones largas de PCVR — relación precio/calidad imbatible.' }
    ],
    gear: [
      { name: 'Sony Pulse Explore', link: 'https://www.amazon.com/s?k=Sony+Pulse+Explore',
        desc_en: 'Premium wireless earbuds with low-latency audio — also compatible via 3.5mm jack for PC-connected use.',
        desc_es: 'Auriculares inalámbricos premium con audio de baja latencia — compatibles vía jack 3.5mm para uso con PC.' },
      { name: 'Long USB-C Cable (3m)', link: 'https://www.amazon.com/s?k=USB+3+Link+cable+3m+Quest',
        desc_en: 'A quality 3m USB-C cable is essential for comfortable PCVR movement — don\'t skip this.',
        desc_es: 'Un cable USB-C de calidad de 3m es esencial para moverse cómodamente en PCVR — no lo omitas.' }
    ]
  },
  pimaxsuper: {
    note_en: 'Requires an NVIDIA RTX 4070 or better to run at full resolution. Not standalone — USB-C cable to PC required. Accessories are available on the official Pimax website.',
    note_es: 'Requiere NVIDIA RTX 4070 o superior para correr a resolución completa. No es standalone — conexión USB-C a PC requerida. Los accesorios están disponibles en el sitio oficial de Pimax.',
    audio: [
      { name: 'Pimax DMAS', link: 'https://www.amazon.com/s?k=Pimax+DMAS',
        desc_en: 'Official Pimax spatial audio speakers — the premium open-ear solution designed specifically for Pimax headsets.',
        desc_es: 'Parlantes de audio espacial oficiales de Pimax — la solución open-ear premium diseñada específicamente para headsets Pimax.' }
    ],
    gear: [
      { name: 'All accessories at pimax.com', link: 'https://www.pimax.com',
        desc_en: 'For this headset, Pimax\'s official store has the best selection of compatible accessories and parts.',
        desc_es: 'Para este headset, la tienda oficial de Pimax tiene la mejor selección de accesorios y repuestos compatibles.',
        linkLabel_en: 'Visit pimax.com →',
        linkLabel_es: 'Ir a pimax.com →' }
    ]
  },
  pico4ultra: {
    audio: [
      { name: 'BOBOVR P4 B100 Battery System', link: 'https://www.amazon.com/s?k=BOBOVR+P4+B100+battery+Pico+4',
        desc_en: 'High-capacity battery strap engineered for extended playtime and seamless convenience — the top comfort upgrade for Pico 4 Ultra.',
        desc_es: 'Correa con batería de alta capacidad para mayor tiempo de juego y comodidad — el upgrade más recomendado para el Pico 4 Ultra.' }
    ],
    gear: [
      { name: 'MagTube VR Gunstock', link: 'https://tidd.ly/3ZYHHzH',
        desc_en: 'Designed to simulate a real rifle and align your controllers — brings stability, precision and total immersion to VR shooters.',
        desc_es: 'Diseñado para simular un rifle real y alinear tus controllers — aporta estabilidad, precisión e inmersión total en shooters VR.',
        linkLabel_en: 'View on XR Shop →',
        linkLabel_es: 'Ver en XR Shop →' }
    ]
  },
  beyond2: {
    note_en: 'Requires SteamVR base stations (min. 1, ideally 2), SteamVR-compatible controllers (e.g. Valve Index), and a PC with RTX 3070 or better. Not standalone — tethered via fiber-optic USB-C cable.',
    note_es: 'Requiere base stations de SteamVR (mín. 1, idealmente 2), controllers compatibles (ej. Valve Index), y PC con RTX 3070 o superior. No es standalone — conexión por cable USB-C de fibra óptica.',
    audio: [
      { name: 'Bigscreen Beyond Audio Strap', link: 'https://store.bigscreenvr.com/products/audio-strap',
        desc_en: 'Cups the top and back of your head so Beyond 2 floats on your face — drastically improves comfort and adds built-in spatial audio.',
        desc_es: 'Se apoya en la parte superior y trasera de la cabeza para que el Beyond 2 flote sobre tu cara — mejora drásticamente la comodidad y añade audio espacial integrado.',
        linkLabel_en: 'Visit Bigscreen Store →',
        linkLabel_es: 'Ver en tienda Bigscreen →' }
    ],
    gear: [
      { name: 'Prescription Lens Inserts', link: 'https://store.bigscreenvr.com/products/prescription-lens-inserts-for-beyond',
        desc_en: 'Magnetic prescription lens inserts designed for Beyond 2 — eliminate the need for contacts in VR and prevent eye strain during long sessions.',
        desc_es: 'Insertos magnéticos de lentes graduados para el Beyond 2 — eliminan la necesidad de lentes de contacto en VR y previenen la fatiga visual en sesiones largas.',
        linkLabel_en: 'Visit Bigscreen Store →',
        linkLabel_es: 'Ver en tienda Bigscreen →' }
    ]
  }
};

function renderAccessories(headsetKey) {
  const wrap = document.getElementById('accessories-wrap');
  const acc = ACCESSORIES[headsetKey];
  if (!acc) { wrap.innerHTML = ''; return; }
  const t = tx();
  const totalItems = acc.audio.length + acc.gear.length;

  const itemHTML = (item) => `
    <div class="acc-item">
      <div class="acc-item-name">${item.name}</div>
      <div class="acc-item-desc">${currentLang === 'en' ? item.desc_en : item.desc_es}</div>
      <a class="acc-item-link" href="${item.link}" target="_blank" rel="noopener noreferrer${/tidd\.ly/.test(item.link) ? ' sponsored' : ''}">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${(currentLang === 'en' ? item.linkLabel_en : item.linkLabel_es) || t.amazonBtn}
      </a>
    </div>`;

  const noteHTML = acc.note_en ? `
    <div class="acc-note">
      <span class="acc-note-icon">⚠️</span>
      <span>${currentLang === 'en' ? acc.note_en : acc.note_es}</span>
    </div>` : '';

  wrap.innerHTML = `
    <div class="acc-section" id="acc-section">
      <div class="acc-toggle" onclick="toggleAcc()">
        <div class="acc-toggle-left">
          <span class="acc-toggle-icon">🎒</span>
          <div>
            <span class="acc-toggle-title">${t.accTitle}</span>
            <span class="acc-toggle-sub">${t.accSub}</span>
          </div>
        </div>
        <div class="acc-toggle-right">
          <span class="acc-count">${totalItems} ${t.accCount}</span>
          <svg class="acc-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="acc-body">
        <div class="acc-inner">
          ${noteHTML}
          <div class="acc-col">
            <div class="acc-col-head">🎧 ${t.accAudio}</div>
            <div class="acc-items">${acc.audio.map(itemHTML).join('')}</div>
          </div>
          <div class="acc-col">
            <div class="acc-col-head">🔧 ${t.accGear}</div>
            <div class="acc-items">${acc.gear.map(itemHTML).join('')}</div>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleAcc() {
  const s = document.getElementById('acc-section');
  if (s) s.classList.toggle('open');
}


let currentLang = 'en';

const UI_TEXT = {
  en: {
    eyebrow: 'Compatibility Test',
    h1l1: 'Find Your', h1l2: 'Perfect VR',
    sub: '7 quick questions. We\'ll match you with the VR headset that fits your profile, use case, and budget — no fluff, just the right pick.',
    chips: ['🎮 Gaming', '💼 Professional', '🏠 Standalone', '🔬 Mixed Reality', '💰 All Budgets'],
    startBtn: 'Start the Quiz →',
    note: 'Takes about 60 seconds',
    questionLabel: (n, t) => `QUESTION ${n} / ${t}`,
    questionNum: (n) => `QUESTION ${String(n).padStart(2,'0')}`,
    continueBtn: 'Continue →',
    seeResultBtn: 'See Results →',
    completed: 'COMPLETED',
    badge: '✦ Your Match Is...',
    rankLabel: '✦ Primary Recommendation',
    secondLabel: '✦ Second Most Compatible',
    amazonBtn: 'Find on Amazon',
    amazonBtnSm: 'Find on Amazon →',
    restartBtn: '↺ Retake the Quiz',
    homeBtn: 'Home',
    shareLabel: 'Share your result',
    copyBtn: 'Copy link',
    footnote: (url) => `Some links are affiliate links — you pay the same, and they help keep <a href="${url}">vr.ar</a> free. Links to Amazon are plain searches and earn us nothing. ❤️`,
    resultSub: (p, s, ps, ss) => `Match score: ${ps} pts  ·  Runner-up: ${s} (${ss} pts)`,
    updatedBadge: '2026 Edition',
    affiliateNotice: '🔗 Affiliate link — you pay the same price.',
    storeNotice: '🔗 Manufacturer\u2019s official store. We earn nothing from this link.',
    footerGuides: 'Guides',
    footerAbout: 'About',
    footerPrivacy: 'Privacy Policy',
    footerDisclosure: 'Some links on vr.ar are affiliate links; we may earn a commission at no extra cost to you.',
    accTitle: 'Recommended Gear',
    accSub: '— audio & essentials for your headset',
    accCount: 'items',
    accAudio: 'Audio',
    accGear: 'Essentials',
    osNotice: {
      windowsTitle: 'Full Windows Compatibility',
      windowsText: 'This headset is fully supported on Windows 10/11.',
      linuxOkTitle: 'Full Linux Support',
      linuxOkText: 'Great news — this headset has native Linux support via SteamVR. No extra setup required.',
      linuxPartialTitle: 'Partial Linux Support',
      linuxPartialText: 'This headset works on Linux via community tools (ALVR / SteamVR). Setup requires extra steps — not plug-and-play.',
      linuxNoneTitle: 'No Linux Support',
      linuxNoneText: 'PSVR2 PC mode does not support Linux. The runner-up in your results may be a better fit.',
      macosTitle: 'No macOS Support',
      macosText: 'No VR headset in our selection supports macOS natively. To use PCVR, you would need to run Windows (Boot Camp or a separate PC).'
    }
  },
  es: {
    eyebrow: 'Test de Compatibilidad',
    h1l1: 'Encontrá tu', h1l2: 'Headset Ideal',
    sub: '7 preguntas rápidas. Te recomendamos el headset VR más compatible con tu perfil, uso y presupuesto — sin rodeos, directo al grano.',
    chips: ['🎮 Gaming', '💼 Profesional', '🏠 Standalone', '🔬 Realidad Mixta', '💰 Todos los presupuestos'],
    startBtn: 'Comenzar →',
    note: 'Tarda aproximadamente 60 segundos',
    questionLabel: (n, t) => `PREGUNTA ${n} / ${t}`,
    questionNum: (n) => `PREGUNTA ${String(n).padStart(2,'0')}`,
    continueBtn: 'Continuar →',
    seeResultBtn: 'Ver resultado →',
    completed: 'COMPLETADO',
    badge: '✦ Tu Match es...',
    rankLabel: '✦ Recomendación principal',
    secondLabel: '✦ Segunda opción más compatible',
    amazonBtn: 'Buscar en Amazon',
    amazonBtnSm: 'Buscar en Amazon →',
    restartBtn: '↺ Repetir el test',
    homeBtn: 'Inicio',
    shareLabel: 'Compartir resultado',
    copyBtn: 'Copiar link',
    footnote: (url) => `Algunos links son de afiliado — no pagás más, y ayudan a mantener <a href="${url}">vr.ar</a> gratis. Los links a Amazon son búsquedas comunes y no nos dejan nada. ❤️`,
    resultSub: (p, s, ps, ss) => `Score: ${ps} pts  ·  Segunda opción: ${s} (${ss} pts)`,
    updatedBadge: 'Edición 2026',
    affiliateNotice: '🔗 Link de afiliado — pagás el mismo precio.',
    storeNotice: '🔗 Tienda oficial del fabricante. No ganamos nada con este link.',
    footerGuides: 'Guías',
    footerAbout: 'Quiénes somos',
    footerPrivacy: 'Política de privacidad',
    footerDisclosure: 'Algunos links de vr.ar son de afiliado: podemos recibir una comisión sin costo extra para vos.',
    accTitle: 'Accesorios recomendados',
    accSub: '— audio y esenciales para tu headset',
    accCount: 'ítems',
    accAudio: 'Audio',
    accGear: 'Esenciales',
    osNotice: {
      windowsTitle: 'Compatible con Windows',
      windowsText: 'Este headset es totalmente compatible con Windows 10/11.',
      linuxOkTitle: 'Soporte completo en Linux',
      linuxOkText: 'Buenas noticias — este headset tiene soporte nativo en Linux vía SteamVR. No requiere configuración adicional.',
      linuxPartialTitle: 'Soporte parcial en Linux',
      linuxPartialText: 'Este headset funciona en Linux mediante herramientas de la comunidad (ALVR / SteamVR). Requiere configuración adicional — no es plug-and-play.',
      linuxNoneTitle: 'Sin soporte en Linux',
      linuxNoneText: 'El modo PC del PSVR2 no es compatible con Linux. La segunda opción en tus resultados puede ser una mejor alternativa.',
      macosTitle: 'Sin soporte en macOS',
      macosText: 'Ningún headset de nuestra selección es compatible con macOS de forma nativa. Para usar PCVR necesitarías correr Windows (Boot Camp o una PC separada).'
    }
  }
};

function tx() { return UI_TEXT[currentLang]; }

// ─── FAQ CONTENT (mirrors the FAQPage JSON-LD; rendered in the hero) ──
const FAQ_CONTENT = {
  en: {
    heading: 'Frequently Asked Questions',
    items: [
      { q: 'What is the best standalone VR headset in 2026?',
        a: "The Meta Quest 3 is the most well-rounded standalone VR headset in 2026, featuring Snapdragon XR2 Gen 2, pancake lenses with 2064×2208 resolution per eye, and full color mixed reality passthrough. The Meta Quest 3S offers the same chip at a lower price with Fresnel lenses." },
      { q: 'Do I need a PC or PlayStation for the Meta Quest 3?',
        a: "No. The Meta Quest 3 and Quest 3S are fully standalone headsets — they run independently without a PC or console. The PlayStation VR2, however, requires a PS5 to function." },
      { q: 'What is the best PCVR headset for the price in 2026?',
        a: "The Pimax Crystal Light (~$699) is the community's top pick for PCVR value in 2025–2026, offering the best visual clarity per dollar with a 115° FOV — it requires an RTX 3070 or better. For users with no budget limit, the Pimax Crystal Super (~$2,000) offers 3,840×3,840 resolution per eye with ultrawide FOV and integrated eye tracking, but requires an RTX 4070 or better." },
      { q: 'Which VR headset should I buy if I own a PS5?',
        a: "The PlayStation VR2 is the ideal choice for PS5 owners. It features native eye tracking, haptic feedback in the headset, and adaptive triggers — but it requires a PS5 and cannot be used standalone or with a PC." }
    ]
  },
  es: {
    heading: 'Preguntas frecuentes',
    items: [
      { q: '¿Cuál es el mejor headset de VR standalone en 2026?',
        a: "El Meta Quest 3 es el headset standalone más equilibrado de 2026: Snapdragon XR2 Gen 2, lentes pancake con 2064×2208 de resolución por ojo y passthrough a color para realidad mixta. El Meta Quest 3S ofrece el mismo procesador a menor precio, con lentes Fresnel." },
      { q: '¿Necesito una PC o una PlayStation para el Meta Quest 3?',
        a: "No. El Meta Quest 3 y el Quest 3S son headsets totalmente standalone: funcionan de forma independiente, sin PC ni consola. El PlayStation VR2, en cambio, requiere una PS5 para funcionar." },
      { q: '¿Cuál es el mejor headset PCVR por su precio en 2026?',
        a: "El Pimax Crystal Light (~$699) es la opción más recomendada por la comunidad PCVR en 2025–2026: la mejor claridad visual por dólar, con un FOV de 115° — requiere una RTX 3070 o superior. Para quienes no tienen límite de presupuesto, el Pimax Crystal Super (~$2.000) ofrece 3.840×3.840 por ojo, FOV ultrawide y eye tracking integrado, pero requiere una RTX 4070 o superior." },
      { q: '¿Qué headset de VR me conviene si tengo una PS5?',
        a: "El PlayStation VR2 es la opción ideal para quienes tienen una PS5. Tiene eye tracking nativo, feedback háptico en el headset y gatillos adaptativos — pero requiere una PS5 y no se puede usar standalone ni con PC." }
    ]
  }
};

function applyLangToFAQ() {
  const f = FAQ_CONTENT[currentLang];
  if (!f) return;
  const heading = document.getElementById('faq-heading');
  if (heading) heading.textContent = f.heading;
  f.items.forEach((item, i) => {
    const q = document.getElementById('faq-q' + (i + 1));
    const a = document.getElementById('faq-a' + (i + 1));
    if (q) q.textContent = item.q;
    if (a) a.textContent = item.a;
  });
}

// ─── FEATURED GUIDES on the home page (titles + per-language links) ───
const HOME_GUIDES = [
  { en_slug: 'quest-3-vs-quest-3s', es_slug: 'quest-3-vs-quest-3s',
    en: 'Quest 3 vs Quest 3S: which one should you actually buy?',
    es: 'Quest 3 vs Quest 3S: ¿cuál te conviene de verdad?' },
  { en_slug: 'vr-motion-sickness', es_slug: 'mareos-realidad-virtual',
    en: 'VR motion sickness: how to get your VR legs',
    es: 'Mareos en VR: cómo sacarte las piernas virtuales' },
  { en_slug: 'best-quest-3-accessories', es_slug: 'mejores-accesorios-quest-3',
    en: 'The best Quest 3 accessories (actually worth buying)',
    es: 'Los mejores accesorios para Quest 3 (los que valen la pena)' },
  { en_slug: 'quest-3-battery-life', es_slug: 'bateria-quest-3-dura-poco',
    en: 'Why your Quest 3 battery dies so fast',
    es: 'Por qué la batería de las Quest 3 dura tan poco' },
  { en_slug: 'how-to-clean-quest-3-lenses', es_slug: 'como-limpiar-quest-3-lentes',
    en: 'How to clean your Quest 3 lenses without ruining them',
    es: 'Cómo limpiar las lentes de las Quest 3 sin arruinarlas' },
  { en_slug: 'best-vr-games-2026', es_slug: 'mejores-juegos-vr-2026',
    en: '🎮 The Best VR Games (2026)',
    es: '🎮 Los mejores juegos de VR (2026)' }
];

function applyLangToHomeGuides() {
  const dir = currentLang === 'es' ? 'guias/' : 'guides/';
  const title = document.getElementById('home-guides-title');
  if (title) title.textContent = currentLang === 'es' ? 'Guías y juegos' : 'Guides & Games';
  const all = document.getElementById('home-guides-all');
  if (all) { all.textContent = currentLang === 'es' ? 'Ver todas →' : 'View all →'; all.href = dir; }
  HOME_GUIDES.forEach((g, i) => {
    const el = document.getElementById('hg-' + (i + 1));
    if (el) {
      el.textContent = currentLang === 'es' ? g.es : g.en;
      el.href = dir + (currentLang === 'es' ? g.es_slug : g.en_slug) + '.html';
    }
  });
}

// ─── Launch banner for the Chrome extension (home page) ───
function applyLangToExtBanner() {
  const es = currentLang === 'es';
  const badge = document.getElementById('home-ext-badge');
  if (badge) badge.textContent = es ? 'NUEVO' : 'NEW';
  const title = document.getElementById('home-ext-title');
  if (title) title.textContent = es
    ? 'Ya está publicada nuestra extensión de Chrome'
    : 'Our Chrome extension is live';
  const sub = document.getElementById('home-ext-sub');
  if (sub) sub.textContent = es
    ? 'Te dice si un juego de VR funciona en tu visor mientras navegás. Gratis y sin cuenta.'
    : 'It tells you whether a VR game runs on your headset while you browse. Free, no account. Spanish interface for now.';
}

function applyLangToIntro() {
  const t = tx();
  document.getElementById('txt-eyebrow').textContent = t.eyebrow;
  const updEl = document.getElementById('txt-updated');
  if (updEl) updEl.textContent = t.updatedBadge;
  document.getElementById('txt-h1-l1').textContent = t.h1l1;
  document.getElementById('txt-h1-l2').textContent = t.h1l2;
  document.getElementById('txt-sub').textContent = t.sub;
  document.getElementById('btn-start-cta').textContent = t.startBtn;
  document.getElementById('txt-note').textContent = t.note;
  const chipEls = document.getElementById('hero-chips').querySelectorAll('.chip');
  t.chips.forEach((c,i) => { if(chipEls[i]) chipEls[i].textContent = c; });
  const ng = document.getElementById('nav-guides');
  if (ng) { ng.textContent = t.footerGuides; ng.href = currentLang === 'es' ? 'guias/' : 'guides/'; }
  const fg = document.getElementById('footer-guides');
  if (fg) { fg.textContent = t.footerGuides; fg.href = currentLang === 'es' ? 'guias/' : 'guides/'; }
  const fe = document.getElementById('footer-ext');
  if (fe) fe.textContent = currentLang === 'es' ? 'Extensión de Chrome' : 'Chrome extension';
  const fa = document.getElementById('footer-about');
  if (fa) fa.textContent = t.footerAbout;
  const fp = document.getElementById('footer-privacy');
  if (fp) fp.textContent = t.footerPrivacy;
  const fd = document.getElementById('footer-disclosure');
  if (fd) fd.textContent = t.footerDisclosure;
  applyLangToFAQ();
  applyLangToHomeGuides();
  applyLangToExtBanner();
}

function setLang(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  document.body.classList.toggle('lang-es', lang === 'es');
  document.documentElement.lang = lang;
  applyLangToIntro();
  const quizVisible = document.getElementById('quiz').style.display !== 'none';
  if (quizVisible) {
    if (inOSQuestion) renderOSQuestion(true);
    else renderQuestion(true);
  }
  const resultsVisible = document.getElementById('results').classList.contains('visible');
  if (resultsVisible) refreshResultsLang();
}

function toggleLang() { setLang(currentLang === 'en' ? 'es' : 'en'); }

// ─── QUIZ STATE ───────────────────────────────────────────────────
let currentQ = 0;
let scores = {quest3s:0, quest3:0, psvr2:0, pimax:0, pimaxsuper:0, pico4ultra:0, beyond2:0};
let excludedHeadsets = new Set();
let selected = null;
let lastSorted = null;

// OS conditional question state
let isPCVRUser   = false;  // set when Q1 option 1 (PCVR) is chosen
let inOSQuestion = false;  // currently rendering the OS question
let osAnswered   = false;  // OS question has been shown and answered
let selectedOS   = null;   // 0=Windows, 1=Linux, 2=macOS

function getTotalQuestions() {
  return QUESTIONS_EN.length + (isPCVRUser ? 1 : 0);
}

function getDisplayNum() {
  if (inOSQuestion) return 2;
  return currentQ + 1 + (osAnswered ? 1 : 0);
}

function startQuiz() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('quiz').style.display = 'block';
  renderQuestion();
}

function renderQuestion(langSwitch = false) {
  const QS = currentLang === 'en' ? QUESTIONS_EN : QUESTIONS_ES;
  const q = QS[currentQ];
  const letters = ['A','B','C','D'];
  const t = tx();
  const total = getTotalQuestions();
  const displayNum = getDisplayNum();
  document.getElementById('q-num').textContent = t.questionNum(displayNum);
  document.getElementById('q-text').textContent = q.text;
  const opts = document.getElementById('q-options');
  opts.innerHTML = q.opts.map((o,i) => `
    <div class="opt${selected===i?' selected':''}" data-idx="${i}" onclick="selectOpt(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <div class="opt-text">${o}</div>
    </div>`).join('');
  const pct = Math.round(((displayNum - 1) / total) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('prog-label').textContent = t.questionLabel(displayNum, total);
  document.getElementById('prog-pct').textContent = pct + '%';
  const btn = document.getElementById('btn-next');
  btn.textContent = (currentQ === QUESTIONS_EN.length - 1 && !inOSQuestion) ? t.seeResultBtn : t.continueBtn;
  if (!langSwitch) {
    selected = null;
    btn.classList.remove('visible');
  }
}

function selectOpt(idx) {
  selected = idx;
  document.querySelectorAll('.opt').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.opt[data-idx="${idx}"]`).classList.add('selected');
  document.getElementById('btn-next').classList.add('visible');
}

function renderOSQuestion(langSwitch = false) {
  const q = currentLang === 'en' ? OS_QUESTION_EN : OS_QUESTION_ES;
  const letters = ['A','B','C'];
  const t = tx();
  const total = getTotalQuestions(); // 8 for PCVR users
  const displayNum = 2;
  document.getElementById('q-num').textContent = t.questionNum(displayNum);
  document.getElementById('q-text').textContent = q.text;
  const opts = document.getElementById('q-options');
  opts.innerHTML = q.opts.map((o,i) => `
    <div class="opt${selectedOS===i?' selected':''}" data-idx="${i}" onclick="selectOpt(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <div class="opt-text">${o}</div>
    </div>`).join('');
  const pct = Math.round(((displayNum - 1) / total) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('prog-label').textContent = t.questionLabel(displayNum, total);
  document.getElementById('prog-pct').textContent = pct + '%';
  const btn = document.getElementById('btn-next');
  btn.textContent = t.continueBtn;
  if (!langSwitch) {
    selected = null;
    btn.classList.remove('visible');
  }
}

function nextQuestion() {
  if (selected === null) return;
  const QS = currentLang === 'en' ? QUESTIONS_EN : QUESTIONS_ES;

  // ── Handle OS question submission ──
  if (inOSQuestion) {
    selectedOS = selected;
    osAnswered = true;
    inOSQuestion = false;
    // Apply OS score delta
    const delta = OS_SCORE_DELTA[selectedOS];
    for (const k in delta) { if (k in scores) scores[k] += delta[k]; }
    // Linux: also hard-exclude PSVR2 if it has no support
    if (selectedOS === 1) excludedHeadsets.add('psvr2');
    // Animate to next regular question (Q2 = currentQ 1)
    const card = document.getElementById('quiz-card');
    card.classList.add('slide-out-left');
    setTimeout(() => {
      card.classList.remove('slide-out-left');
      currentQ = 1; // advance to Q2 (budget)
      renderQuestion();
      card.classList.add('slide-in-right');
      setTimeout(() => card.classList.remove('slide-in-right'), 400);
    }, 340);
    return;
  }

  // ── Handle regular question submission ──
  const s = QS[currentQ].scores[selected];
  for (const k in s) scores[k] += s[k];

  // apply hard exclusions from EXCLUSION_MAP
  const excl = EXCLUSION_MAP[currentQ];
  if (excl && excl[selected]) {
    excl[selected].forEach(key => excludedHeadsets.add(key));
  }

  // After Q1 (index 0): check if PCVR was chosen → inject OS question
  if (currentQ === 0 && selected === 1) {
    isPCVRUser = true;
    const card = document.getElementById('quiz-card');
    card.classList.add('slide-out-left');
    setTimeout(() => {
      card.classList.remove('slide-out-left');
      inOSQuestion = true;
      renderOSQuestion();
      card.classList.add('slide-in-right');
      setTimeout(() => card.classList.remove('slide-in-right'), 400);
    }, 340);
    return;
  }

  if (currentQ < QS.length - 1) {
    const card = document.getElementById('quiz-card');
    card.classList.add('slide-out-left');
    setTimeout(() => {
      card.classList.remove('slide-out-left');
      currentQ++;
      renderQuestion();
      card.classList.add('slide-in-right');
      setTimeout(() => card.classList.remove('slide-in-right'), 400);
    }, 340);
  } else {
    showResults();
  }
}

// ─── Move 1: map each recommended headset to its most relevant guide ───
const RESULT_GUIDES = {
  questvs: { en: ['quest-3-vs-quest-3s', 'Quest 3 vs Quest 3S'],
             es: ['quest-3-vs-quest-3s', 'Quest 3 vs Quest 3S'] },
  ps5:     { en: ['best-vr-for-ps5', 'Best VR for PS5'],
             es: ['mejor-vr-para-ps5', 'Mejor VR para PS5'] },
  pimax:   { en: ['is-the-pimax-crystal-light-worth-it', 'Is the Pimax Crystal Light worth it?'],
             es: ['pimax-crystal-light-vale-la-pena', '¿Vale la pena la Pimax Crystal Light?'] },
  pcvr:    { en: ['what-you-need-for-pcvr', 'What you actually need for PCVR'],
             es: ['que-necesitas-para-pcvr', 'Qué necesitás para PCVR'] },
  accessories: { en: ['best-quest-3-accessories', 'The best Quest 3 accessories'],
                 es: ['mejores-accesorios-quest-3', 'Los mejores accesorios para Quest 3'] }
};
const HEADSET_GUIDE = {
  quest3: 'questvs', quest3s: 'questvs', psvr2: 'ps5',
  pimax: 'pimax', pimaxsuper: 'pcvr', beyond2: 'pcvr', pico4ultra: 'pcvr'
};
// second, complementary guide per result (the accessories guide for Quest owners-to-be)
const HEADSET_GUIDE_2 = {
  quest3: 'accessories', quest3s: 'accessories'
};

function showResults() {
  document.getElementById('quiz').style.display = 'none';

  // filter out hard-excluded headsets, then sort by score
  const eligible = Object.keys(scores).filter(k => !excludedHeadsets.has(k));
  lastSorted = eligible.sort((a,b) => scores[b] - scores[a]);

  const t = tx();
  document.getElementById('progress-bar').style.width = '100%';
  document.getElementById('prog-label').textContent = t.completed;
  document.getElementById('prog-pct').textContent = '100%';
  renderResults();
  const results = document.getElementById('results');
  results.style.display = 'block';
  results.classList.add('visible');
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderResults() {
  const t = tx();
  const primary = HEADSETS[lastSorted[0]];
  const secondary = HEADSETS[lastSorted[1]];

  document.getElementById('res-badge').textContent = t.badge;
  document.getElementById('res-title').textContent = primary.name;
  document.getElementById('res-sub').textContent = t.resultSub(primary.name, secondary.name, scores[lastSorted[0]], scores[lastSorted[1]]);
  document.getElementById('res-rank-label').textContent = t.rankLabel;
  document.getElementById('res-name').textContent = primary.name;
  document.getElementById('res-nickname').textContent = currentLang === 'en' ? primary.nickname_en : primary.nickname_es;
  document.getElementById('res-price').textContent = primary.price;
  document.getElementById('res-desc').textContent = currentLang === 'en' ? primary.desc_en : primary.desc_es;
  document.getElementById('res-link').href = primary.link;
  const primaryBtnLabel = (currentLang === 'en' ? primary.btnLabel_en : primary.btnLabel_es) || t.amazonBtn;
  document.getElementById('res-amazon-btn-text').textContent = primaryBtnLabel;
  const affNotice = document.getElementById('res-affiliate-notice');
  // Solo los links de XR Shop son de afiliado; los de Meta y PlayStation no.
  if (affNotice) affNotice.textContent = /tidd\.ly/.test(primary.link) ? t.affiliateNotice : t.storeNotice;
  // Show "direct from manufacturer" note for Pimax headsets
  const linkNoteEl = document.getElementById('res-link-note');
  const linkNote = currentLang === 'en' ? primary.linkNote_en : primary.linkNote_es;
  if (linkNoteEl) {
    if (linkNote) {
      linkNoteEl.textContent = '🏭 ' + linkNote;
      linkNoteEl.style.display = 'block';
    } else {
      linkNoteEl.style.display = 'none';
    }
  }

  const img = document.getElementById('res-img');
  const fallback = document.getElementById('res-img-fallback');
  img.src = primary.img; img.style.display = 'block';
  fallback.style.display = 'none'; fallback.innerHTML = '';
  img.onerror = function() {
    this.style.display = 'none';
    fallback.style.display = 'block';
    fallback.innerHTML = SVG_ICONS[lastSorted[0]];
  };

  document.getElementById('res2-label').textContent = t.secondLabel;
  document.getElementById('res2-name').textContent = secondary.name;
  document.getElementById('res2-price').textContent = secondary.price;
  const d2 = currentLang === 'en' ? secondary.desc_en : secondary.desc_es;
  document.getElementById('res2-desc').textContent = d2.substring(0,130) + '…';
  document.getElementById('res2-link').href = secondary.link;
  const secondaryBtnLabel = (currentLang === 'en' ? secondary.btnLabel_en : secondary.btnLabel_es) || t.amazonBtnSm;
  document.getElementById('res2-amazon-btn-text').textContent = secondaryBtnLabel;

  const img2 = document.getElementById('res2-img');
  img2.src = secondary.img;
  img2.onerror = function() { this.style.display = 'none'; };

  document.getElementById('btn-restart').textContent = t.restartBtn;
  document.getElementById('btn-home').querySelector('span').textContent = t.homeBtn;
  document.getElementById('txt-share-label').textContent = t.shareLabel;
  document.getElementById('txt-copy-btn').textContent = t.copyBtn;
  document.getElementById('footnote-text').innerHTML = t.footnote('https://vr.ar');
  updateShareLinks(primary.name);

  // Move 1: contextual guide link — give the result a way forward into our guides
  const guideCta = document.getElementById('res-guide-cta');
  if (guideCta) {
    const gdir = currentLang === 'es' ? 'guias/' : 'guides/';
    const gid = HEADSET_GUIDE[lastSorted[0]];
    const gtext = document.getElementById('res-guide-cta-text');
    if (gid) {
      const g = RESULT_GUIDES[gid][currentLang];
      guideCta.href = gdir + g[0] + '.html';
      gtext.textContent = (currentLang === 'es' ? 'Leé nuestra guía: ' : 'Read our guide: ') + g[1] + ' →';
    } else {
      guideCta.href = gdir;
      gtext.textContent = currentLang === 'es' ? 'Mirá todas nuestras guías de VR →' : 'Explore all our VR guides →';
    }
    guideCta.style.display = '';
  }

  // second, complementary guide link (e.g. accessories for Quest results)
  const guideCta2 = document.getElementById('res-guide-cta-2');
  if (guideCta2) {
    const gdir2 = currentLang === 'es' ? 'guias/' : 'guides/';
    const gid2 = HEADSET_GUIDE_2[lastSorted[0]];
    const gtext2 = document.getElementById('res-guide-cta-2-text');
    if (gid2) {
      const g2 = RESULT_GUIDES[gid2][currentLang];
      guideCta2.href = gdir2 + g2[0] + '.html';
      gtext2.textContent = (currentLang === 'es' ? 'Y para equiparlo: ' : 'And to gear it up: ') + g2[1] + ' →';
      guideCta2.style.display = '';
    } else {
      guideCta2.style.display = 'none';
    }
  }

  renderAccessories(lastSorted[0]);
  renderOSCompatNotice(lastSorted[0]);
}

function renderOSCompatNotice(headsetKey) {
  const el = document.getElementById('os-compat-notice');
  const iconEl = document.getElementById('os-compat-icon');
  const textEl = document.getElementById('os-compat-text');

  // Hide notice for non-PCVR users or Windows (no issues to report)
  if (!isPCVRUser || selectedOS === null || selectedOS === 0) {
    el.className = 'os-compat-notice';
    return;
  }

  const t = tx().osNotice;
  const compat = OS_COMPAT_MAP[headsetKey];
  let level, icon, title, body;

  if (selectedOS === 2) {
    // macOS — nothing works
    level = 'error'; icon = '❌'; title = t.macosTitle; body = t.macosText;
  } else if (selectedOS === 1) {
    // Linux
    if (compat && compat.linux === 'none') {
      level = 'error'; icon = '❌'; title = t.linuxNoneTitle; body = t.linuxNoneText;
    } else if (compat && compat.linux === 'ok') {
      level = 'ok'; icon = '✅'; title = t.linuxOkTitle; body = t.linuxOkText;
    } else {
      level = 'warn'; icon = '⚠️'; title = t.linuxPartialTitle; body = t.linuxPartialText;
    }
  }

  iconEl.textContent = icon;
  textEl.innerHTML = `<strong>${title}</strong>${body}`;
  el.className = `os-compat-notice visible ${level}`;
}

function refreshResultsLang() {
  if (!lastSorted) return;
  renderResults();
}

function goHome() {
  currentQ = 0;
  scores = {quest3s:0, quest3:0, psvr2:0, pimax:0, pimaxsuper:0, pico4ultra:0, beyond2:0};
  excludedHeadsets = new Set();
  selected = null;
  lastSorted = null;
  isPCVRUser = false; inOSQuestion = false; osAnswered = false; selectedOS = null;
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('results').classList.remove('visible');
  document.getElementById('progress-bar').style.width = '0%';
  const t = tx();
  document.getElementById('prog-label').textContent = t.questionLabel(1, QUESTIONS_EN.length);
  document.getElementById('prog-pct').textContent = '0%';
  document.getElementById('intro').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

function buildShareText(headsetName) {
  return currentLang === 'en'
    ? `I took the VR Finder quiz on vr.ar and got matched with the ${headsetName}! Find your perfect VR headset 👇`
    : `Hice el quiz VR Finder en vr.ar y me recomendaron el ${headsetName}. ¡Encontrá tu headset ideal 👇`;
}

function updateShareLinks(headsetName) {
  const url = encodeURIComponent(window.location.href.split('?')[0]);
  const text = encodeURIComponent(buildShareText(headsetName));
  document.getElementById('share-x').href  = `https://x.com/intent/tweet?text=${text}&url=${url}`;
  document.getElementById('share-wa').href = `https://wa.me/?text=${text}%20${url}`;
  document.getElementById('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

function copyLink() {
  const url = window.location.href.split('?')[0];
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btn-copy');
    const span = document.getElementById('txt-copy-btn');
    btn.classList.add('copied');
    span.textContent = currentLang === 'en' ? '✓ Copied!' : '✓ ¡Copiado!';
    setTimeout(() => {
      btn.classList.remove('copied');
      span.textContent = currentLang === 'en' ? 'Copy link' : 'Copiar link';
    }, 2200);
  }).catch(() => {
    // fallback for non-https
    const ta = document.createElement('textarea');
    ta.value = url; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const span = document.getElementById('txt-copy-btn');
    span.textContent = currentLang === 'en' ? '✓ Copied!' : '✓ ¡Copiado!';
    setTimeout(() => { span.textContent = currentLang === 'en' ? 'Copy link' : 'Copiar link'; }, 2200);
  });
}

function restartQuiz() {
  currentQ = 0;
  scores = {quest3s:0, quest3:0, psvr2:0, pimax:0, pimaxsuper:0, pico4ultra:0, beyond2:0};
  excludedHeadsets = new Set();
  selected = null;
  lastSorted = null;
  isPCVRUser = false; inOSQuestion = false; osAnswered = false; selectedOS = null;
  document.getElementById('results').style.display = 'none';
  document.getElementById('results').classList.remove('visible');
  const t = tx();
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('prog-label').textContent = t.questionLabel(1, QUESTIONS_EN.length);
  document.getElementById('prog-pct').textContent = '0%';
  document.getElementById('quiz').style.display = 'block';
  renderQuestion();
  window.scrollTo({top:0,behavior:'smooth'});
}
