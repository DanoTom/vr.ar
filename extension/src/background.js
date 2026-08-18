// Registro dinámico del script de contenido.
//
// La extensión se instala sin pedir acceso a "todos los sitios": en Chrome ese
// cartel espanta a la mitad de la gente. Steam y PlayStation vienen declarados
// en el manifest; el resto de la web se habilita solo si el usuario aprieta el
// botón del popup, y ahí Chrome le pide permiso en el momento.

const SCRIPT_ID = 'vrar-everywhere';
const FILES = ['src/data.js', 'src/detect.js', 'src/ui.js', 'src/content.js'];

async function syncEverywhereScript() {
  const granted = await chrome.permissions.contains({ origins: ['http://*/*', 'https://*/*'] });
  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] }).catch(() => []);
  const isRegistered = registered.some((script) => script.id === SCRIPT_ID);

  if (granted && !isRegistered) {
    await chrome.scripting.registerContentScripts([{
      id: SCRIPT_ID,
      matches: ['http://*/*', 'https://*/*'],
      excludeMatches: ['*://vr.ar/*', '*://*.vr.ar/*'],
      js: FILES,
      runAt: 'document_idle',
      persistAcrossSessions: true
    }]);
  } else if (!granted && isRegistered) {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(['selectedHeadset', 'enabled', 'mutedSites']);
  await chrome.storage.local.set({
    selectedHeadset: current.selectedHeadset || 'quest-3',
    enabled: current.enabled !== false,
    mutedSites: current.mutedSites || []
  });
  await syncEverywhereScript();
});

chrome.runtime.onStartup.addListener(syncEverywhereScript);
chrome.permissions.onAdded.addListener(syncEverywhereScript);
chrome.permissions.onRemoved.addListener(syncEverywhereScript);
