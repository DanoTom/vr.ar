// Orquestación: detectar, decidir si vale la pena mostrar algo, y dibujarlo.
//
// Reglas de convivencia (lo más importante de este archivo):
//   · Si no detectamos nada, no aparece nada. Nunca molestamos de gusto.
//   · Un cierre vale para esa página; "No mostrar acá" se recuerda por sitio.
//   · No corremos en vr.ar ni dentro de iframes.

(() => {
  if (window.top !== window) return;
  if (/(^|\.)vr\.ar$/i.test(location.hostname)) return;

  const STORE = {
    'store.steampowered.com': 'Steam',
    'store.playstation.com': 'PlayStation Store',
    'playstation.com': 'PlayStation'
  };

  let panel = null;
  let lastUrl = location.href;
  let closedForUrl = null;
  let settings = { selectedHeadset: 'quest-3', enabled: true, mutedSites: [] };
  let scanning = false;
  let timer = null;

  const siteKey = () => location.hostname.replace(/^www\./, '');
  const storeLabel = () => STORE[siteKey()] || null;

  function teardown() {
    panel?.destroy();
    panel = null;
  }

  async function save(patch) {
    settings = { ...settings, ...patch };
    await chrome.storage.local.set(patch);
  }

  // Lista de coincidencias, la mejor primero.
  function detect() {
    const detector = globalThis.VRAR_detect;
    if (!detector) return [];
    if (storeLabel()) {
      const byId = detector.bySteamAppId(detector.steamAppId());
      if (byId) return [byId];
      const byTitle = detector.byExactTitle(detector.pageTitleText());
      if (byTitle) return [byTitle];
      // Si el producto no está en el catálogo no inventamos nada; seguimos
      // igual al escaneo por si la página menciona otros juegos conocidos.
    }
    return detector.detectOnPage();
  }

  function show(hits) {
    teardown();
    panel = new globalThis.VRAR_UI.Panel({
      hits,
      headsetId: settings.selectedHeadset,
      siteLabel: storeLabel(),
      onHeadsetChange: (id) => save({ selectedHeadset: id }),
      onClose: () => { closedForUrl = location.href; teardown(); },
      onMute: async () => {
        const muted = [...new Set([...(settings.mutedSites || []), siteKey()])];
        await save({ mutedSites: muted });
        teardown();
      }
    });
    panel.mount();
  }

  function run() {
    if (scanning || panel) return;
    if (!settings.enabled) return teardown();
    if ((settings.mutedSites || []).includes(siteKey())) return teardown();
    if (closedForUrl === location.href) return;
    scanning = true;
    try {
      const hits = detect();
      if (hits.length) show(hits);
    } finally {
      scanning = false;
    }
  }

  function schedule(delay = 600) {
    clearTimeout(timer);
    timer = setTimeout(run, delay);
  }

  function onUrlChange() {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    closedForUrl = null;
    teardown();
    schedule(500);
  }

  (async () => {
    settings = await chrome.storage.local.get({
      selectedHeadset: 'quest-3',
      enabled: true,
      mutedSites: []
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      for (const [key, change] of Object.entries(changes)) settings[key] = change.newValue;
      teardown();
      schedule(200);
    });

    // Tiendas y blogs cargan contenido después de la carga inicial: observamos,
    // pero con freno, para no reescanear en cada mutación del DOM.
    new MutationObserver(() => { if (!panel) schedule(); })
      .observe(document.documentElement, { childList: true, subtree: true });
    setInterval(onUrlChange, 800);

    schedule(400);
  })();
})();
