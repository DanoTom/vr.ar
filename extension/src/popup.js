const ALL_SITES = { origins: ['http://*/*', 'https://*/*'] };

const el = (id) => document.getElementById(id);
const t = (key, subs) => globalThis.VRAR_t(key, subs);

async function paintPermission() {
  const granted = await chrome.permissions.contains(ALL_SITES);
  el('grant').hidden = granted;
  el('granted').hidden = !granted;
}

async function paintCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const host = (() => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } })();
  const isStore = /^(store\.steampowered\.com|store\.playstation\.com|playstation\.com)$/i.test(host);
  el('siteBadge').textContent = isStore ? host.split('.')[0].toUpperCase() : (host || '—');
  el('siteBadge').classList.toggle('on', isStore);

  const headset = VRAR_HEADSETS.find((h) => h.id === el('headset').value) || VRAR_HEADSETS[0];
  el('headsetType').textContent = headset.pcvr
    ? (headset.native.length ? t('typeStandalonePc') : t('typePcOnly'))
    : t('typeManual');

  // El popup no puede leer la página sin permisos; damos una guía honesta.
  const granted = await chrome.permissions.contains(ALL_SITES);
  el('dot').className = 'dot';
  if (isStore) {
    el('verdict').textContent = t('storeSupported');
    el('detail').textContent = t('storeSupportedInfo');
  } else if (granted) {
    el('verdict').textContent = t('scanningPage');
    el('detail').textContent = t('scanningPageInfo');
  } else {
    el('verdict').textContent = t('notAvailable');
    el('detail').textContent = t('notAvailableInfo');
  }
}

async function init() {
  globalThis.VRAR_applyI18n();
  const select = el('headset');
  for (const headset of VRAR_HEADSETS) {
    const option = document.createElement('option');
    option.value = headset.id;
    option.textContent = globalThis.VRAR_headsetName?.(headset) || headset.name;
    select.appendChild(option);
  }
  el('catalogCount').textContent = t('catalogCount', [String(VRAR_CATALOG.length)]);

  const saved = await chrome.storage.local.get({ selectedHeadset: 'quest-3', enabled: true });
  select.value = saved.selectedHeadset;
  el('enabled').checked = saved.enabled;

  select.addEventListener('change', async () => {
    await chrome.storage.local.set({ selectedHeadset: select.value });
    paintCurrentPage();
  });
  el('enabled').addEventListener('change', () => {
    chrome.storage.local.set({ enabled: el('enabled').checked });
  });

  el('grantBtn').addEventListener('click', async () => {
    // Debe salir de un gesto del usuario, por eso vive en el popup.
    const ok = await chrome.permissions.request(ALL_SITES);
    if (ok) { await paintPermission(); await paintCurrentPage(); }
  });
  el('revokeBtn').addEventListener('click', async () => {
    await chrome.permissions.remove(ALL_SITES);
    await paintPermission();
    await paintCurrentPage();
  });

  await paintPermission();
  await paintCurrentPage();
}

init();
