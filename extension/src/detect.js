// Detección de juegos de VR en la página.
//
// Dos caminos:
//   1. Tiendas (Steam / PlayStation): identificador o título del producto.
//      Es el dato más confiable, sobre todo el App ID de Steam.
//   2. Cualquier otra página: se busca el nombre de los juegos del catálogo
//      dentro del texto. Acá el riesgo es afirmar de más, así que la
//      coincidencia exige palabras completas y frases de largo razonable.
//
// Nunca se hace coincidencia por subcadena suelta: "War Thunder Mobile" no es
// "War Thunder", y una página que dice "VR" no es Pavlov VR.

(() => {
  const MIN_PHRASE = 5;        // frases más cortas dan falsos positivos
  const MAX_SCAN = 240000;     // tope de texto a escanear, por rendimiento
  const MAX_RESULTS = 6;

  function normalize(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  let index = null;
  function getIndex() {
    if (index) return index;
    index = (globalThis.VRAR_CATALOG || []).map((game) => {
      const phrases = [game.title, ...(game.aliases || [])]
        .map(normalize)
        .filter((phrase) => phrase.length >= MIN_PHRASE);
      // Las más largas primero: son las más específicas.
      phrases.sort((a, b) => b.length - a.length);
      return { game, phrases: [...new Set(phrases)] };
    }).filter((entry) => entry.phrases.length);
    return index;
  }

  // Coincidencia por palabras completas sobre texto ya normalizado y con
  // espacios en los bordes, para que indexOf respete los límites de palabra.
  function findPhrase(paddedText, phrase) {
    return paddedText.indexOf(' ' + phrase + ' ');
  }

  function scanText(rawText, confidence) {
    if (!rawText) return [];
    const padded = ' ' + normalize(rawText.slice(0, MAX_SCAN)) + ' ';
    const hits = [];
    for (const { game, phrases } of getIndex()) {
      for (const phrase of phrases) {
        const at = findPhrase(padded, phrase);
        if (at >= 0) {
          hits.push({ game, confidence, at, matched: phrase });
          break;
        }
      }
    }
    return hits;
  }

  // ── Tiendas ──────────────────────────────────────────────────────────────
  function steamAppId() {
    return location.pathname.match(/^\/app\/(\d+)/i)?.[1] || null;
  }

  function bySteamAppId(appId) {
    if (!appId) return null;
    const game = (globalThis.VRAR_CATALOG || []).find((entry) => (entry.steam || []).includes(String(appId)));
    return game ? { game, confidence: 'exact' } : null;
  }

  // Título exacto, o el título del catálogo seguido de hasta dos palabras
  // extra (ediciones, sufijos de tienda). Más que eso, no afirmamos.
  function byExactTitle(rawTitle) {
    const tokens = normalize(rawTitle).split(' ').filter(Boolean);
    if (!tokens.length) return null;
    const joined = tokens.join(' ');
    let partial = null;
    for (const { game, phrases } of getIndex()) {
      for (const phrase of phrases) {
        if (phrase === joined) return { game, confidence: 'exact' };
        const size = phrase.split(' ').length;
        const extra = tokens.length - size;
        if (size >= 2 && extra > 0 && extra <= 2 && tokens.slice(0, size).join(' ') === phrase) {
          partial = partial || { game, confidence: 'approx' };
        }
      }
    }
    return partial;
  }

  // ── Página cualquiera ────────────────────────────────────────────────────
  function headingText() {
    const parts = [document.title];
    document.querySelectorAll('h1, h2').forEach((node, i) => {
      if (i < 12) parts.push(node.textContent || '');
    });
    return parts.join(' · ');
  }

  function bodyText() {
    const main = document.querySelector('main, article, [role="main"]') || document.body;
    return main?.innerText || '';
  }

  function detectOnPage() {
    const strong = scanText(headingText(), 'strong');
    const seen = new Set(strong.map((hit) => hit.game.slug));
    const weak = scanText(bodyText(), 'page').filter((hit) => !seen.has(hit.game.slug));
    // Primero lo que aparece en encabezados; dentro de cada grupo, por orden de
    // aparición: en una nota que enumera juegos, el primero que se nombra es el
    // que el lector espera ver, no el que tiene el título más largo.
    const rank = (hit) => (hit.confidence === 'strong' ? 0 : 1);
    return [...strong, ...weak]
      .sort((a, b) => rank(a) - rank(b) || a.at - b.at || b.matched.length - a.matched.length)
      .slice(0, MAX_RESULTS);
  }

  function pageTitleText() {
    const selectors = [
      '.apphub_AppName', '[data-ds-content-name]', '[data-qa*="mfe-game-title"]',
      '[data-qa*="game-title"]', '[data-testid="product-title"]', 'main h1', 'h1'
    ];
    for (const selector of selectors) {
      const text = document.querySelector(selector)?.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length >= 2 && text.length <= 160) return text;
    }
    const og = document.querySelector('meta[property="og:title"]')?.content?.trim();
    if (og) return og.replace(/\s+/g, ' ');
    return document.title.replace(/\s*[|–—-]\s*(Steam|PlayStation|PlayStation®).*$/i, '').trim() || null;
  }

  globalThis.VRAR_detect = {
    normalize,
    steamAppId,
    bySteamAppId,
    byExactTitle,
    detectOnPage,
    pageTitleText
  };
})();
