# Manual de operaciones — vr.ar

> **Para quién es esto.** Para Daniel, y para cualquier asistente (humano o IA) que trabaje
> en el sitio en el futuro. Acá está todo lo que hay que saber para operar vr.ar sin romper
> nada: cómo está armado, cómo se publica una guía, qué convenciones seguimos y por qué,
> qué contenido caduca y cuándo, y qué hacer cuando algo falla.
> Última actualización: julio 2026.

---

## 1. Qué es el sitio y cuál es la estrategia

**vr.ar** tiene dos patas:

1. **El VR Finder** (la home): un quiz de 7 preguntas que recomienda un visor de realidad
   virtual. Es el producto original y **funciona bien — no tocarlo sin un plan verificado**
   (ver `docs/FINDER-AJUSTE.md`).
2. **Las guías** (`/guias/` en español, `/guides/` en inglés): contenido honesto y en
   lenguaje simple que atrae tráfico de búsqueda y alimenta el quiz.

**Valores que no se negocian** (definidos por Daniel):
- Honestidad antes que hype. Si un producto tiene problemas, se dicen. Si la evidencia es
  mixta (ej. las pulseras Sea-Band), se dice que es mixta.
- Lenguaje llano, no técnico. El lector es alguien que quiere comprar su primer visor, no
  un entusiasta.
- Español rioplatense con voseo ("tenés", "querés") en `/guias/`. Es identidad, no error.
- Construir bien antes que rápido. Calidad sobre volumen.
- Nada de atajos SEO turbios: no se compran links, no se hace keyword stuffing, no se
  publica contenido de relleno. (Ya rechazamos una oferta de "links DR60-80 por $50" —
  eso es spam de links y Google lo penaliza.)

**Monetización actual:** AdSense (un solo bloque manual dentro del artículo; home y quiz
sin publicidad, por decisión estratégica) + links de afiliados Amazon/Awin presentados con
transparencia.

---

## 2. Arquitectura técnica

- **Sitio estático** (HTML/CSS/JS puro, sin framework ni build step obligatorio).
- **Hosting:** Cloudflare Pages, con deploy automático desde GitHub (`DanoTom/vr.ar`,
  rama `main`). Cada push a `main` publica solo, en ~1–2 minutos.
- **Dominio:** `vr.ar` con "clean URLs" de Cloudflare: sirve las páginas sin `.html` y
  redirige (308) `pagina.html` → `pagina`.

### Convención de URLs (importante, ya nos costó un problema de indexación)

- Todas las señales **absolutas** van **sin `.html`**: `<link rel="canonical">`, los tres
  `hreflang`, `og:url`, `mainEntityOfPage` y los items del breadcrumb en JSON-LD, y el
  `sitemap.xml`.
- Los links **internos relativos** entre páginas **sí llevan `.html`** (ej.
  `href="quest-3-vs-quest-3s.html"`). Cloudflare los redirige y funciona bien.
- Si esto se mezcla, Google Search Console empieza a reportar "Página alternativa con
  etiqueta canónica adecuada" y "Página con redirección". Ya lo arreglamos una vez; no
  volver atrás.

### Estructura de archivos

```
index.html            ← home + quiz (EN)
es/index.html         ← home en español — NO SE EDITA A MANO (ver §5)
guides/*.html         ← guías en inglés  (14 páginas + index)
guias/*.html          ← guías en español (14 páginas + index)
assets/js/app.js      ← toda la lógica del quiz + datos de visores (bloque AUTOGEN)
assets/css/           ← styles.css (global) y guides.css (guías)
assets/img/           ← héroes de guías (~1536×1024 jpg <200KB) y og-images
data/                 ← JSON por visor; build.py regenera el bloque AUTOGEN de app.js
tools/gen-es-home.js  ← genera es/index.html desde index.html
sitemap.xml, ads.txt, 404.html, favicon.*  ← en la raíz
docs/                 ← estos documentos
```

- **Idiomas en pares:** cada guía EN tiene su gemela ES, con `hreflang` recíproco
  (`en` → EN, `es` → ES, `x-default` → EN). Si se publica una sin la otra, o sin la
  reciprocidad exacta, el hreflang deja de valer.
- **`build.py --check`** verifica que el bloque AUTOGEN de `app.js` esté sincronizado con
  `data/`. Correrlo antes de tocar datos de visores.

---

## 3. Checklist para publicar una guía nueva

El flujo probado: Daniel escribe el borrador (`.md`) y consigue la imagen (GPT), el
asistente lo convierte al template y verifica. Paso a paso:

1. **Revisar el borrador con honestidad.** Verificar datos duros (precios, specs, fechas).
   Si algo es dudoso, marcarlo y preguntarle a Daniel antes de publicar.
   *Cuidado recurrente:* los borradores EN de Daniel suelen traer links internos apuntando
   a `/guias/` (español) o a guías que todavía no existen. Corregir EN→EN y sacar los
   links a páginas inexistentes (anotarlos para restaurar cuando la guía exista).
2. **Crear las dos páginas** copiando el template de una guía reciente (ej.
   `guides/vr-vs-ar-vs-mr-explained.html` y su par). El template incluye, en orden:
   - `<title>` ≤ ~65 caracteres; `meta description` de ~150–160.
   - Canonical + 3 hreflang + og (`type=article`, title, description, url, **og:image**).
   - Script de AdSense en el `<head>` (client `ca-pub-9232748982913595`).
   - Favicons (`/favicon.ico` 48x48, `/favicon.svg`, `/apple-touch-icon.png`).
   - JSON-LD `Article` (con `datePublished`, `image`, publisher vr.ar) + `BreadcrumbList`.
   - Topbar con selector `guide-lang` EN/ES apuntando al par correcto.
   - Migas (`guide-crumb`), `h1`, `guide-meta` ("Actualizado en julio de 2026 · X min de
     lectura" / "Updated July 2026 · X min read").
   - `figure.guide-hero` con `width`/`height` reales y `decoding="async"`.
   - Un solo bloque `ad-slot` con el `<ins>` de AdSense (slot `3704317570`) a mitad del
     artículo.
   - Opcional: bloque "Equipo recomendado"/"Recommended gear" con links `.guide-buy`
     (`rel="noopener noreferrer sponsored"`).
   - Bloque `.guide-cta` invitando al quiz.
   - `.guide-disclosure`: versión completa de afiliados si la página tiene links de
     compra; versión corta si no. Páginas de salud (mareos, anteojos) agregan "esto no es
     consejo médico/óptico".
3. **Imagen hero.** Daniel manda webp/png en zip → convertir a JPG con el pipeline de
   Chromium (ver §6), calidad 70–82, objetivo <200KB, ~1536×1024. Guardar en
   `assets/img/`, usarla como hero **y** como `og:image` **y** en el JSON-LD.
4. **Enlazado interno.** Mínimo: 1–2 links a guías relacionadas + 1 link al quiz. Revisar
   qué guías existentes deberían enlazar a la nueva (los hubs siempre; a veces una guía
   hermana).
5. **Actualizar los hubs** `guides/index.html` y `guias/index.html` (tarjeta en la sección
   que corresponda: Conocimiento base / Guías de headsets / Primeros pasos / Juegos).
6. **Actualizar `sitemap.xml`** (las dos URLs, sin `.html`, con hreflang recíproco).
7. **Si la guía debe aparecer en la home o en los resultados del quiz:** tocar
   `HOME_GUIDES`, `RESULT_GUIDES`, `HEADSET_GUIDE` / `HEADSET_GUIDE_2` en `app.js` (ver
   `docs/FINDER-AJUSTE.md` antes de tocar el quiz). Si se cambia contenido visible de
   `index.html`, **regenerar `es/index.html`** (§5).
8. **Verificar localmente** (§6): imagen carga, sin overflow horizontal a 390px, JSON-LD
   parsea, hreflang recíproco, links internos existen, consola sin errores (los de
   AdSense en local se ignoran).
9. **Publicar** (§4) y pedirle a Daniel que confirme en el sitio vivo (desde este entorno
   no se puede acceder a vr.ar — la red lo bloquea).

---

## 4. Flujo de publicación (git)

El asistente trabaja en una rama de sesión y publica a `main` con fast-forward:

```bash
# en la rama de trabajo:
git add -A && git commit -m "Mensaje claro en inglés"
git push -u origin <rama-de-trabajo>
git checkout main            # si falta: git fetch origin main && git checkout -B main origin/main
git merge --ff-only <rama-de-trabajo>
git push origin main
git checkout <rama-de-trabajo>
```

- **Permiso vigente:** Daniel autorizó publicar directo a `main` el trabajo verificado.
- Cloudflare Pages despliega solo al recibir el push a `main`.

### Cómo se publica realmente (desde julio 2026)

El deploy lo hace **GitHub Actions con Wrangler**, no la integración Git de Cloudflare:
`.github/workflows/deploy.yml` se dispara con cada push a `main`, arma una carpeta
`_site` con el sitio (todo el repositorio **menos** `.github/`, `docs/`, `tools/`,
`data/`, `build.py`, `README.md`) y la sube al proyecto de Pages `vr-ar`.

Motivo: las dos cuentas de Cloudflare de Daniel compartían una sola instalación de la
app de GitHub y se pisaban, dejando el sitio sin publicar sin aviso. Con este camino
**los deploys salen aunque esa app esté desconectada**, y el otro proyecto de Daniel
queda intacto.

Requiere dos secretos en GitHub (Settings > Secrets and variables > Actions):
`CLOUDFLARE_API_TOKEN` (permiso "Cloudflare Pages: Edit", sin vencimiento) y
`CLOUDFLARE_ACCOUNT_ID`. Si algún día hay que rotarlos, se reemplazan ahí y listo.

Para ver si un deploy salió: pestaña **Actions** del repositorio → flujo "Deploy".
El log incluye la lista de proyectos de Pages, útil si alguna vez cambia el nombre.

**Regla nueva:** si publicamos algo y no aparece en el sitio, la respuesta está en
**Actions**. Antes los fallos eran silenciosos (el sitio dejaba de actualizarse sin
aviso); ahora fallan con cruz roja y mail de GitHub.

**GitHub Pages está apagado a propósito** (julio 2026). Estuvo activo desde el 17 de
junio publicando una copia del sitio en `danotom.github.io` construida desde la rama de
trabajo — 58 ejecuciones. Nunca llegó a indexarse (los canonical absolutos apuntan
siempre a `https://vr.ar/...`, que es justamente para esto), pero se desactivó por ser
una copia pública innecesaria. **No reactivarlo:** el sitio vive solo en Cloudflare.

**Pendiente de observación:** en Cloudflare se desactivaron los despliegues automáticos,
pero el proyecto de Pages puede seguir teniendo el repositorio conectado. Eso ya no
afecta a vr.ar (publicamos por Wrangler), pero si el *otro* proyecto de Daniel vuelve a
desconectarse, el paso siguiente es desconectar del todo el repositorio desde el proyecto
de Pages de vr.ar, para que su cuenta de Cloudflare salga por completo de la instalación
compartida de la app de GitHub.

### Si el deploy no sale (histórico: pasó dos veces antes de la migración)

Síntoma: se pushea a `main` y el sitio vivo no cambia después de ~10 minutos.

1. Verificar en el dashboard de Cloudflare Pages si dice **"This project is disconnected
   from your Git account"**. Causa raíz conocida: Daniel tiene una segunda cuenta de
   Cloudflare compartiendo la misma app de GitHub, y a veces se pisan.
2. Arreglo: Daniel reconecta el Git en Cloudflare (la segunda vez tuvo que desinstalar y
   reinstalar la app de GitHub). Después, "despertar" el deploy con un commit vacío:
   `git commit --allow-empty -m "Trigger deploy" && git push origin main`.
3. **Plan B si se vuelve crónico:** deploy directo por GitHub Actions con `wrangler pages
   deploy` y un API token de Cloudflare (Pages:Edit). Con eso GitHub deja de depender de
   la integración de la app. No está implementado; implementarlo solo si hace falta.

---

## 5. La home en español se genera, no se edita

`es/index.html` es una **prerenderización** de `index.html` hecha por
`tools/gen-es-home.js`. Cada vez que cambia contenido visible de `index.html` (textos,
tarjetas de guías, CTAs), hay que regenerarla:

```bash
cd tools
NODE_PATH=<scratchpad>/p1/node_modules \
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
node gen-es-home.js
```

(Requiere `playwright-core` instalado — `npm i playwright-core --no-save` en un directorio
de trabajo — y el Chromium preinstalado del entorno.)
Los textos ES del script (título, descripción, etc.) viven dentro de `gen-es-home.js`.
**Nunca editar `es/index.html` a mano:** la próxima regeneración pisa todo.

---

## 6. Herramientas del asistente (entorno remoto)

- **Imágenes webp/png → jpg:** script con Chromium (cargar la imagen como data-URI en una
  página y capturar screenshot jpeg con calidad 70–82). Los scripts (`webp2jpg.mjs`,
  `png2jpg.mjs`) viven en el scratchpad y **se borran cuando el contenedor se reinicia**
  — hay que recrearlos; el patrón es simple y está descrito acá para eso.
- **Verificación local:** `python3 -m http.server 8099` + playwright-core. Import en
  CommonJS: `import pkg from '.../playwright-core/index.js'; const { chromium } = pkg;`.
  Checks estándar: hero cargado (`naturalWidth > 0`), sin scroll horizontal a 390px de
  ancho, JSON-LD `JSON.parse` ok, hreflang recíproco entre el par, todos los `href`
  relativos existen en disco, `pageerror` vacío (ignorando los de adsbygoogle).

  **Cómo medir bien el scroll horizontal** (julio 2026 — esto ya dio un falso positivo):
  **no** comparar `scrollWidth` contra `clientWidth`. La home tiene elementos decorativos
  (`.hero-ring`, `.bg-orb`) que se extienden a propósito más allá del viewport y son
  recortados por el `body{overflow-x:hidden}` del CSS; `scrollWidth` los sigue contando
  igual y reporta un desborde que el usuario nunca ve. La comprobación correcta es
  intentar desplazar y ver si se movió:
  `window.scrollTo(600,0)` y después verificar que `window.scrollX === 0`.

  Y **esperar a que la página cargue del todo antes de medir**: con
  `waitUntil:'domcontentloaded'` el hero todavía puede estar a su tamaño natural
  (1536px) porque el CSS no se aplicó, y el chequeo da desbordes fantasma distintos en
  cada corrida. Usar `waitUntil:'load'` más unos 300 ms de margen.

  Dato del entorno: conviene **abortar todos los pedidos externos** (fuentes de Google,
  AdSense) con `context.route()`; acá la red los bloquea y cada uno cuelga el navegador
  hasta agotar el tiempo. Sin eso, verificar 30 páginas no termina nunca.
- **E2E del quiz:** selectores reales — `#btn-start-cta` para arrancar, `.opt[data-idx="0"]`
  para elegir, `#btn-next` para avanzar (no auto-avanza), `#results` al final.
- **Red del entorno:** `vr.ar` y `*.pages.dev` están **bloqueados** (403). No se puede ver
  el sitio vivo desde acá; se verifica localmente y Daniel confirma en producción.
  WebSearch sí funciona. GitHub se opera vía las herramientas MCP (`mcp__github__*`).
- **Reinicios del contenedor:** borran el scratchpad y a veces la rama `main` local
  (`git fetch origin main && git checkout -B main origin/main` la recupera).

---

## 7. Calendario de frescura (qué caduca y cuándo)

El contenido es mayormente evergreen, pero estas cosas tienen fecha:

| Qué | Dónde | Cuándo actuar |
|---|---|---|
| "principios de 2026" / "early-2026 update" | par de guías de PCVR inalámbrico | Revisar ~enero 2027; reescribir la referencia temporal |
| "Updated June/July 2026" en `guide-meta` | todas las guías | Al hacer cualquier retoque real de una guía, actualizar el mes. Pasada general ~octubre 2026 |
| Título "The Best VR Games (2026)" / "Los mejores juegos de VR (2026)" | par de juegos + hubs + `HOME_GUIDES` | **Enero 2027:** renovar lista y año |
| "Which VR headset to buy in 2026" | hubs `guides/` y `guias/` (title, h1, textos) | Enero 2027 |
| Precios: Quest 3 US$599 · Quest 3S US$349 (suba de abril 2026) · Pimax Crystal Light ~US$699 · Vision Pro ~US$3.500 · Ray-Ban Display US$799 (solo EE.UU.) | cornerstone, hubs, varias guías, `data/` | Verificar en cada pasada; si Meta/Apple cambian precios, buscar todas las menciones (`grep -r '599' guides guias index.html data`) |
| Ray-Ban Display "solo en EE.UU., rollout internacional pausado" | cornerstone (par) | Cuando salga internacionalmente → actualizar y es el gatillo del brief "¿los anteojos inteligentes son AR?" |
| Orion/AR "prototipos, 2027 al menos" | cornerstone (par) | Revisar ante anuncios grandes de Meta/Snap/Google |

**Pasada de frescura programada: octubre 2026** (coincide con el arranque del contenido
navideño — ver `docs/BRIEFS.md`).

---

## 8. Inventario de afiliados

Amazon Associates (`amzn.to`) y Awin (`tidd.ly`, para Pico/Pimax). Los verificados:

| Link | Producto | Dónde se usa |
|---|---|---|
| `amzn.to/4qZTU2k` | Meta Quest 3 | quiz/resultados y guías |
| `amzn.to/3ZOXTna` | Meta Quest 3S | quiz/resultados y guías |
| `amzn.to/3MyNyIZ` | PSVR2 | quiz/resultados y guía PS5 |
| `amzn.to/46TVjjw` | Cable Link USB 3 | varias guías Quest |
| `amzn.to/4wmfYHg` | Correa con batería (head strap) | accesorios, batería |
| `amzn.to/4giTyC6` | Power bank | batería |
| `amzn.to/4eTK3qB` | Router WiFi 6E | PCVR inalámbrico |
| `amzn.to/4g7HtzB` | Cable ethernet | PCVR inalámbrico |
| `amzn.to/4gSZnX2` | Ventilador | mareos |
| `amzn.to/4v9mBf6` | Sea-Band | mareos (presentado como "evidencia mixta") |
| `amzn.to/3QZULE5`, `4eLz16U`, `4tJyk4t` | kit de limpieza (paño, etc.) | limpieza de lentes |
| `tidd.ly/*` | Pico 4 Ultra / Pimax | `app.js` (resultados del quiz) |

El resto de los links (los de una sola aparición) están en `data/headsets/*.json` y
`app.js`. Inventario completo en cualquier momento:

```bash
grep -rhoE 'https://(amzn\.to|tidd\.ly)/[A-Za-z0-9]+' guides/ guias/ assets/js/app.js data/ | sort | uniq -c | sort -rn
```

**Pendientes de Daniel:** links para interfaz facial de silicona y estuche de transporte
(guía de accesorios los menciona sin link de compra).

**Regla:** todo link de afiliado lleva `rel="noopener noreferrer sponsored"` y la página
lleva la disclosure completa. Nunca recomendar algo solo porque tiene link.

---

## 9. AdSense

- Cuenta aprobada. Publisher: `ca-pub-9232748982913595`. `ads.txt` en la raíz:
  `google.com, pub-9232748982913595, DIRECT, f08c47fec0942fa0`.
- **Un solo bloque manual** (slot `3704317570`) a mitad de cada guía. **Auto-ads apagado
  a propósito** — por eso la vista previa "por sitio" de AdSense falla: esa herramienta
  es solo para Auto-ads, no es un error nuestro.
- Home y quiz **sin publicidad** — decisión estratégica, no olvido.
- Pagos: carta con PIN a la dirección al llegar a ~US$10 acumulados; pago real al llegar
  a US$100.

---

## 10. Estado y pendientes al cierre de esta etapa (julio 2026)

- **Publicado:** 14 pares de guías (28 páginas), todas con hero, ads y hreflang; quiz con
  doble CTA de guías en resultados (verificado E2E en ambos idiomas); home con 6 tarjetas
  curadas; 404 propia; favicons; Organization JSON-LD.
- **Pendientes de Daniel (sin apuro):** links de afiliado de interfaz facial y estuche;
  registros SPF/DMARC en el DNS de Cloudflare (`TXT @ "v=spf1 -all"` y
  `TXT _dmarc "v=DMARC1; p=reject"`); evaluar cuenta de GitHub separada para su otro
  proyecto (la causa de las desconexiones de Cloudflare).
- **Hoja de ruta:** evaluación de Search Console a fines de julio 2026; pasada de
  frescura en octubre; contenido estacional oct–dic (ver `docs/BRIEFS.md`); ala AR
  (evergreen "estado del arte", no noticias); visores nuevos entran con la regla
  **"primero la guía, después el quiz"** (candidatos: Valve Steam Frame, Vision Pro,
  Samsung Galaxy XR); ajuste del Finder solo con el plan de `docs/FINDER-AJUSTE.md`.

## 11. Reglas de oro

1. **No romper el Finder.** Cambios al quiz solo con diseño previo y verificación E2E.
2. **Nunca publicar sin verificar localmente.** Y Daniel confirma en producción.
3. **Cada página EN tiene su par ES** con hreflang recíproco, el mismo día.
4. **URLs absolutas sin `.html`; relativas con `.html`.**
5. **`es/index.html` se regenera, no se edita.**
6. **Honestidad editorial:** precios reales, limitaciones dichas, evidencia mixta
   declarada como mixta.
7. **Nada de link-building pago ni atajos SEO.**
8. **Los datos de visores viven en `data/`**; `build.py --check` antes y después.
9. **Commits claros y uno por tema.** El historial es la memoria del proyecto.
10. **Ante la duda, preguntar a Daniel.** Es su sitio y conoce a su público.
