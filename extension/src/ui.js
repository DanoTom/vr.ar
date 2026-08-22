// Interfaz de VR.AR dentro de un Shadow DOM.
//
// Por qué Shadow DOM: la extensión aparece sobre sitios que no controlamos.
// Sin aislamiento, el CSS del blog de turno puede deformar la tarjeta y, peor,
// nuestros estilos pueden ensuciar la página del otro. Adentro del shadow no
// entra ni sale nada.
//
// Forma: primero una píldora chica abajo a la derecha que no tapa contenido.
// Si al visitante le interesa, la abre y ve la ficha completa.

(() => {
  const HOST_ID = 'vrar-shadow-host';
  const t = (key, subs) => globalThis.VRAR_t(key, subs);

  const CSS = `
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; }

.wrap {
  position: fixed;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 2147483000;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #e8f0ff;
  direction: ltr;
}

.pill, .card {
  background: linear-gradient(180deg, rgba(12,19,38,.98), rgba(7,11,22,.98));
  border: 1px solid rgba(0,212,255,.22);
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.35);
  backdrop-filter: blur(8px);
}

/* ── Píldora ─────────────────────────────────────────── */
.pill {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  max-width: min(330px, calc(100vw - 32px));
  cursor: pointer;
  text-align: left;
  border-width: 1px; border-style: solid;
  animation: rise .28s cubic-bezier(.2,.8,.3,1) both;
}
.pill:hover { border-color: rgba(0,212,255,.45); }
.pill:focus-visible, .card :focus-visible { outline: 2px solid #00d4ff; outline-offset: 2px; }

.dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.dot.yes { background: #3ddc97; box-shadow: 0 0 10px rgba(61,220,151,.7); }
.dot.pc  { background: #ffb800; box-shadow: 0 0 10px rgba(255,184,0,.6); }
.dot.no  { background: #ff6b81; box-shadow: 0 0 10px rgba(255,107,129,.6); }
.dot.unknown { background: #7d8ba3; }

.pill-body { min-width: 0; flex: 1; }
.pill-game {
  font-size: 13px; font-weight: 600; line-height: 1.25;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pill-verdict { font-size: 11.5px; line-height: 1.35; color: rgba(200,215,255,.66); }
.pill-verdict b { color: #e8f0ff; font-weight: 600; }

.brandmark {
  font-size: 10px; font-weight: 700; letter-spacing: .1em;
  color: #00d4ff; flex: none; opacity: .85;
}

/* ── Ficha ───────────────────────────────────────────── */
.card {
  width: min(340px, calc(100vw - 32px));
  padding: 14px;
  animation: rise .3s cubic-bezier(.2,.8,.3,1) both;
}
.head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.logo { font-size: 12px; font-weight: 700; letter-spacing: .08em; }
.logo span { color: #00d4ff; }
.src {
  margin-left: auto; font-size: 10px; letter-spacing: .06em;
  text-transform: uppercase; color: rgba(200,215,255,.5);
}
.x {
  appearance: none; background: none; border: 0; cursor: pointer;
  color: rgba(200,215,255,.6); font-size: 18px; line-height: 1;
  padding: 2px 4px; border-radius: 6px;
}
.x:hover { color: #e8f0ff; background: rgba(255,255,255,.07); }

.game { font-size: 15px; font-weight: 700; line-height: 1.3; margin-bottom: 12px; }

.label {
  font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(200,215,255,.5); margin-bottom: 5px;
}
select {
  appearance: none; width: 100%; padding: 8px 30px 8px 10px;
  font: inherit; font-size: 13px; color: #e8f0ff;
  background: rgba(0,0,0,.35) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 4.5L6 8.5l4-4' fill='none' stroke='%2300d4ff' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 10px center/12px;
  border: 1px solid rgba(0,212,255,.22); border-radius: 9px; cursor: pointer;
}
select:hover { border-color: rgba(0,212,255,.4); }
option { background: #0c1326; color: #e8f0ff; }

.verdict {
  display: flex; gap: 10px; align-items: flex-start;
  margin: 12px 0 0; padding: 11px; border-radius: 11px;
  border: 1px solid transparent;
}
.verdict.yes { background: rgba(61,220,151,.10); border-color: rgba(61,220,151,.28); }
.verdict.pc  { background: rgba(255,184,0,.10);  border-color: rgba(255,184,0,.28); }
.verdict.no  { background: rgba(255,107,129,.09); border-color: rgba(255,107,129,.26); }
.verdict.unknown { background: rgba(125,139,163,.10); border-color: rgba(125,139,163,.26); }
.verdict svg { width: 17px; height: 17px; flex: none; margin-top: 1px; fill: none; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
.verdict.yes svg { stroke: #3ddc97; }
.verdict.pc svg  { stroke: #ffb800; }
.verdict.no svg  { stroke: #ff6b81; }
.verdict.unknown svg { stroke: #7d8ba3; }
.verdict strong { display: block; font-size: 13.5px; line-height: 1.3; }
.verdict span { display: block; font-size: 12px; line-height: 1.45; color: rgba(200,215,255,.72); margin-top: 3px; }

.where { font-size: 11.5px; line-height: 1.5; color: rgba(200,215,255,.6); margin-top: 10px; }
.where b { color: rgba(232,240,255,.9); font-weight: 600; }

.caveat {
  font-size: 11.5px; line-height: 1.5; margin-top: 10px; padding: 9px 10px;
  border-radius: 9px; background: rgba(255,184,0,.08);
  border: 1px solid rgba(255,184,0,.22); color: rgba(255,222,150,.92);
}

.others { margin-top: 12px; }
.others-label { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: rgba(200,215,255,.5); margin-bottom: 6px; }
.other {
  appearance: none; display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 7px 9px; margin-bottom: 4px; cursor: pointer; text-align: left;
  font: inherit; font-size: 12px; color: rgba(232,240,255,.85);
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
  border-radius: 8px;
}
.other:hover { background: rgba(0,212,255,.08); border-color: rgba(0,212,255,.28); }
.other span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.foot { display: flex; align-items: center; gap: 10px; margin-top: 13px; padding-top: 11px; border-top: 1px solid rgba(255,255,255,.07); }
a.link { font-size: 12px; color: #00d4ff; text-decoration: none; font-weight: 600; }
a.link:hover { text-decoration: underline; }
.mute {
  margin-left: auto; appearance: none; background: none; border: 0; cursor: pointer;
  font: inherit; font-size: 11px; color: rgba(200,215,255,.45); padding: 2px;
}
.mute:hover { color: rgba(200,215,255,.8); text-decoration: underline; }

@keyframes rise { from { opacity: 0; transform: translateY(10px) scale(.97); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .pill, .card { animation: none; } }
`;

  const ICON = {
    yes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    pc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M8 20h8M12 16.5V20"/></svg>',
    no: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    unknown: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.2h.01"/></svg>'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  class Panel {
    constructor(options) {
      this.opts = options;             // { hits, headsetId, siteLabel, onHeadsetChange, onMute, onClose }
      this.activeIndex = 0;
      this.expanded = false;
      this.host = document.createElement('div');
      this.host.id = HOST_ID;
      this.root = this.host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = CSS;
      this.root.appendChild(style);
      this.wrap = document.createElement('div');
      this.wrap.className = 'wrap';
      this.root.appendChild(this.wrap);
      this.onKey = (event) => { if (event.key === 'Escape' && this.expanded) this.collapse(); };
      document.addEventListener('keydown', this.onKey, true);
      this.render();
    }

    get hit() { return this.opts.hits[this.activeIndex]; }

    verdict() {
      const result = globalThis.VRAR_resolve?.(this.hit?.game, this.opts.headsetId);
      return result || { status: 'unknown', label: t('verdictUnknown'), detail: '' };
    }

    mount() {
      (document.body || document.documentElement).appendChild(this.host);
    }

    destroy() {
      document.removeEventListener('keydown', this.onKey, true);
      this.host.remove();
    }

    render() {
      this.wrap.textContent = '';
      this.wrap.appendChild(this.expanded ? this.buildCard() : this.buildPill());
    }

    expand() { this.expanded = true; this.render(); this.wrap.querySelector('select')?.focus(); }
    collapse() { this.expanded = false; this.render(); this.wrap.querySelector('.pill')?.focus(); }

    buildPill() {
      const result = this.verdict();
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pill';
      pill.setAttribute('aria-label', t('pillAria', [this.hit.game.title, result.label]));
      pill.innerHTML = `
        <span class="dot ${result.status}"></span>
        <span class="pill-body">
          <span class="pill-game">${esc(this.hit.game.title)}</span>
          <span class="pill-verdict"><b>${esc(result.label)}</b></span>
        </span>
        <span class="brandmark">VR.AR</span>`;
      pill.addEventListener('click', () => this.expand());
      return pill;
    }

    buildCard() {
      const result = this.verdict();
      const game = this.hit.game;
      const platforms = globalThis.VRAR_platformsOf?.(game) || [];
      const headsets = globalThis.VRAR_HEADSETS || [];
      const others = this.opts.hits.filter((_, i) => i !== this.activeIndex);
      const approx = this.hit.confidence === 'approx';
      const mentioned = this.hit.confidence === 'page' || this.hit.confidence === 'strong';

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-label', t('cardTitle'));
      card.innerHTML = `
        <div class="head">
          <span class="logo">VR<span>.AR</span></span>
          <span class="src">${esc(this.opts.siteLabel || t('mentionedHere'))}</span>
          <button class="x" type="button" aria-label="${esc(t('close'))}">×</button>
        </div>
        <div class="game">${esc(game.title)}</div>
        <div class="label">${esc(t('yourHeadset'))}</div>
        <select aria-label="${esc(t('selectHeadset'))}">
          ${headsets.map((h) => `<option value="${esc(h.id)}"${h.id === this.opts.headsetId ? ' selected' : ''}>${esc(globalThis.VRAR_headsetName?.(h) || h.name)}</option>`).join('')}
        </select>
        <div class="verdict ${result.status}">
          ${ICON[result.status] || ICON.unknown}
          <div><strong>${esc(result.label)}</strong>${result.detail ? `<span>${esc(result.detail)}</span>` : ''}</div>
        </div>
        ${platforms.length ? `<div class="where">${esc(t('availableOn'))}<b>${esc(platforms.join(' · '))}</b></div>` : ''}
        ${approx ? `<div class="caveat">${esc(t('approxCaveat'))}</div>` : ''}
        ${mentioned && !approx ? `<div class="where">${esc(t('detectedBecause'))}</div>` : ''}
        ${others.length ? `<div class="others"><div class="others-label">${esc(t('alsoOnPage'))}</div>${
          others.map((hit) => {
            const r = globalThis.VRAR_resolve?.(hit.game, this.opts.headsetId) || { status: 'unknown' };
            const index = this.opts.hits.indexOf(hit);
            return `<button class="other" type="button" data-index="${index}"><span class="dot ${r.status}"></span><span>${esc(hit.game.title)}</span></button>`;
          }).join('')}</div>` : ''}
        <div class="foot">
          <a class="link" href="${esc(t('moreLinkUrl'))}" target="_blank" rel="noopener noreferrer">${esc(t('moreLink'))}</a>
          <button class="mute" type="button">${esc(t('muteBtn'))}</button>
        </div>`;

      card.querySelector('.x').addEventListener('click', () => this.opts.onClose?.());
      card.querySelector('.mute').addEventListener('click', () => this.opts.onMute?.());
      card.querySelector('select').addEventListener('change', (event) => {
        this.opts.headsetId = event.target.value;
        this.opts.onHeadsetChange?.(event.target.value);
        this.render();
        this.wrap.querySelector('select')?.focus();
      });
      card.querySelectorAll('.other').forEach((button) => {
        button.addEventListener('click', () => {
          this.activeIndex = Number(button.dataset.index);
          this.render();
        });
      });
      return card;
    }
  }

  globalThis.VRAR_UI = { Panel, HOST_ID };
})();
