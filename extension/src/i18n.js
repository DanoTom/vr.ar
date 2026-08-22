// Traducción de la interfaz.
//
// Los textos viven en _locales/<idioma>/messages.json y Chrome elige el archivo
// según el idioma del navegador: español si el navegador está en español,
// inglés en cualquier otro caso (default_locale del manifest).
//
// Por qué existe este archivo: el manifest traduce solo su propio nombre y
// descripción, y el HTML no entiende __MSG_clave__. Acá resolvemos las dos
// cosas que faltan — una función corta para usar desde JS, y un recorrido de
// los [data-i18n] del HTML.

(() => {
  // Fallback al propio nombre de la clave: si algún día falta una traducción,
  // se ve qué falta en vez de aparecer un hueco vacío.
  const t = (key, subs) => chrome.i18n.getMessage(key, subs) || key;

  function applyToDocument(doc = document) {
    doc.documentElement.lang = chrome.i18n.getUILanguage().split('-')[0];
    for (const node of doc.querySelectorAll('[data-i18n]')) {
      node.textContent = t(node.dataset.i18n);
    }
    for (const node of doc.querySelectorAll('[data-i18n-title]')) {
      node.title = t(node.dataset.i18nTitle);
    }
  }

  globalThis.VRAR_t = t;
  globalThis.VRAR_applyI18n = applyToDocument;
})();
