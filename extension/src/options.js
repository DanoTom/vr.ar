const enabled = document.getElementById('enabled');
const list = document.getElementById('muted');
const empty = document.getElementById('emptyMuted');

async function paint() {
  const saved = await chrome.storage.local.get({ enabled: true, mutedSites: [] });
  enabled.checked = saved.enabled;
  list.textContent = '';
  const sites = saved.mutedSites || [];
  empty.hidden = sites.length > 0;
  for (const site of sites) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = site;
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.textContent = 'Volver a mostrar';
    undo.addEventListener('click', async () => {
      const current = await chrome.storage.local.get({ mutedSites: [] });
      await chrome.storage.local.set({ mutedSites: current.mutedSites.filter((s) => s !== site) });
      paint();
    });
    item.append(name, undo);
    list.appendChild(item);
  }
}

enabled.addEventListener('change', () => chrome.storage.local.set({ enabled: enabled.checked }));
paint();
