# VR Finder — vr.ar

Herramienta tipo quiz que recomienda el headset de VR ideal según el perfil, uso
y presupuesto del usuario. Bilingüe (inglés / español), 100% estática (HTML + CSS
+ JavaScript, sin backend ni build step) y monetizada con links de afiliado.

Es una réplica fiel del sitio actualmente publicado en https://vr.ar, reorganizada
en una estructura de archivos limpia para poder mantenerla y hacerla crecer.

## Cómo funciona

1. El usuario responde 7 preguntas (perfil de uso, presupuesto, prioridades, etc.).
2. Si elige "PCVR" en la primera pregunta, se inserta una pregunta extra sobre el
   sistema operativo de su PC (Windows / Linux / macOS).
3. Cada respuesta suma o resta puntos a cada headset y puede excluir headsets
   incompatibles (p. ej. elegir "standalone" descarta los que requieren PC o PS5).
4. Al terminar se muestra la recomendación principal + la segunda opción, con
   accesorios sugeridos, aviso de compatibilidad de SO, botones de compartir y los
   links de afiliado.

Los 7 headsets contemplados hoy: Meta Quest 3, Quest 3S, PlayStation VR2,
Pico 4 Ultra, Pimax Crystal Light, Pimax Crystal Super y Bigscreen Beyond 2.

## Estructura del proyecto

```
.
├── index.html            # Markup + SEO (meta tags, Open Graph, Twitter, JSON-LD)
├── privacy.html           # Política de privacidad (bilingüe) — requerida por AdSense
├── assets/
│   ├── css/styles.css     # Todos los estilos
│   └── js/app.js          # Datos del quiz + lógica
├── ads.txt                # Autorización de inventario para AdSense
├── robots.txt
├── sitemap.xml
└── README.md
```

Dentro de `assets/js/app.js`, los datos están separados de la lógica y agrupados en
constantes fáciles de editar:

- `QUESTIONS_EN` / `QUESTIONS_ES` — preguntas, opciones y puntajes por headset.
- `HEADSETS` — nombre, precio, descripción (EN/ES), link de afiliado e imagen.
- `ACCESSORIES` — accesorios recomendados por headset.
- `EXCLUSION_MAP`, `OS_SCORE_DELTA`, `OS_COMPAT_MAP` — reglas de exclusión y de SO.
- `UI_TEXT` — todos los textos de la interfaz en ambos idiomas.

## Correrlo localmente

Al ser estático, alcanza con abrir `index.html` en el navegador. Para que las rutas
y las fuentes carguen igual que en producción, conviene servirlo por HTTP:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

## Desplegarlo

Cualquier hosting de sitios estáticos sirve (Cloudflare Pages, Netlify, Vercel,
GitHub Pages, o el hosting actual). No hay build: se publica el contenido del repo
tal cual y se apunta el dominio `vr.ar` al hosting.

## Roadmap

Mejoras previstas para más adelante:

- **Más resultados / headsets.** Agregar una entrada en `HEADSETS` (con su `SVG_ICONS`
  y, opcionalmente, sus `ACCESSORIES`) e incluir su puntaje en cada pregunta de
  `QUESTIONS_EN`. La lógica de ranking ya es genérica y los toma automáticamente.
- **Google Ads (AdSense).** Ver la sección siguiente.
- **Otras funcionalidades.** Comparador lado a lado, filtros, más idiomas, analítica
  propia, etc.

## Notas para tener en cuenta

- **`og-image.jpg`.** Las meta tags de Open Graph/Twitter apuntan a
  `https://vr.ar/og-image.jpg` (1200×630). Hay que subir esa imagen a la raíz para
  que las vistas previas al compartir se vean bien.
- **Links de afiliado.** Apuntan a las cuentas actuales (Amazon `amzn.to`, XR Shop
  `tidd.ly`, Bigscreen). Si cambian las cuentas, se actualizan en `HEADSETS` y
  `ACCESSORIES` dentro de `app.js`.
- **Beacon de Cloudflare.** El HTML original traía un script de analítica inyectado
  por Cloudflare; se quitó por estar atado al deploy anterior. Si querés analítica,
  conviene sumar una nueva (Cloudflare Web Analytics, Plausible, GA4, etc.).

## Google AdSense

Publisher ID: `ca-pub-9232748982913595`.

Ya integrado en el repo:

- El **script loader de AdSense** y la meta `google-adsense-account` están en el
  `<head>` de `index.html`. Esto habilita la verificación del sitio y los **Auto
  Ads** (Google coloca los anuncios automáticamente si los activás en el panel).
- El archivo **`ads.txt`** en la raíz autoriza a Google a vender el inventario.
- **Política de privacidad** (`privacy.html`, bilingüe) con la información sobre
  cookies de AdSense, opt-out y disclosure de afiliados, enlazada desde el footer.
- Se quitó el badge **"vr.ar is for sale"** del hero.

Falta (depende de vos / del panel de AdSense):

1. **Aprobación del sitio.** AdSense favorece sitios con contenido; por eso sumamos
   el FAQ visible. Conviene reforzarlo con guías (ver la sección de artículos abajo)
   antes de pedir la revisión.
2. **Banner de consentimiento de cookies** (CMP certificado por Google) para tráfico
   de la UE/EEE/Reino Unido. Se puede activar el CMP propio de Google desde el panel
   de AdSense (Privacy & messaging → GDPR), sin tocar código.
3. **Auto Ads vs. manual.** Para empezar, activá Auto Ads en el panel (ya funciona
   con lo que está). Para colocar anuncios a mano en lugares concretos (recomendado
   para no romper la experiencia de "herramienta rápida"), creá unidades de anuncio
   en el panel y pasame los `data-ad-slot`; los dejo cableados en la página de
   resultados y debajo del FAQ.
4. **Email de contacto.** La política usa `contact@vr.ar` como marcador. Configurá
   ese alias o reemplazalo por el correo que prefieras en `privacy.html`.

> Nota: AdSense no muestra anuncios (ni genera ingresos) hasta que el sitio esté
> aprobado.
