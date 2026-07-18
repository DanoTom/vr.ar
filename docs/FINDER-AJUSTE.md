# El VR Finder: cómo funciona y cómo ajustarlo sin romperlo

> **Para quién es esto.** Para cualquiera que quiera tocar el quiz (cambiar puntajes,
> agregar una pregunta o un visor nuevo). El Finder es el corazón del sitio y funciona
> bien; la regla número uno es que **ningún cambio se publica sin pasar la matriz de
> aceptación y el E2E**. Este documento explica la mecánica, deja la herramienta de
> verificación lista, y registra lo que ya se ajustó y lo que quedó en el backlog.
> Última actualización: julio 2026.

---

## 1. Cómo funciona el quiz (assets/js/app.js)

- **7 preguntas** (`QUESTIONS_EN`; `QUESTIONS_ES` reutiliza los mismos `scores`, así que
  un ajuste de puntajes vale para ambos idiomas automáticamente):
  1. Uso (standalone / PCVR / PS5 / no sé)
  2. Presupuesto (<$400 / $400–650 / $650–1000 / >$1000)
  3. Para qué (casual / AAA / sim–high-end / MR y apps creativas)
  4. Experiencia (ninguna / principiante / algo / avanzado)
  5. Claridad de imagen (suficiente / muy importante / prioridad máxima)
  6. Qué pesa más en la decisión (precio-calidad / comodidad / exclusivos / rendimiento)
  7. Peso y confort físico (mucho / algo / no tanto)
- **7 visores** compiten: `quest3s, quest3, psvr2, pimax` (Crystal Light), `pimaxsuper`
  (Crystal Super), `pico4ultra, beyond2` (Bigscreen Beyond 2).
- Cada opción de cada pregunta **suma o resta puntos** a cada visor (los objetos dentro
  de `scores`). Al final se ordena por puntaje y ganan los dos primeros.
- **Exclusiones duras** (`EXCLUSION_MAP`): la pregunta 1 elimina de raíz lo incompatible
  (elegiste standalone → afuera PSVR2 y los PCVR-only; elegiste PS5 → solo quedan PSVR2 y
  los Quest; etc.). Un visor excluido no puede ganar por más puntos que junte.
- **Pregunta extra de sistema operativo:** si en la pregunta 1 elegís PCVR, se inyecta
  una octava pregunta (Windows / Linux / macOS) que aplica `OS_SCORE_DELTA` — Linux
  además excluye PSVR2 y bonifica Beyond 2 (SteamVR nativo); macOS penaliza todo.
- Los resultados muestran hasta **dos CTAs de guías**: `RESULT_GUIDES` +
  `HEADSET_GUIDE` (guía principal según el visor ganador) y `HEADSET_GUIDE_2`
  (segunda guía; hoy solo Quest 3/3S → accesorios).
- Los datos de los visores (nombre, precio, links) viven en `data/headsets/*.json` y se
  inyectan en el bloque AUTOGEN de `app.js` con `build.py`. **`build.py --check` siempre**
  después de tocar datos.

## 2. La herramienta: matriz de aceptación offline

`tools/finder-matrix.mjs` simula el quiz **con la lógica real** (lee `app.js`, extrae
`QUESTIONS_EN`, `EXCLUSION_MAP` y `OS_SCORE_DELTA`, y aplica exactamente las mismas
reglas de suma, exclusión y orden). Corre 10 perfiles de usuario con ganador esperado:

```bash
node tools/finder-matrix.mjs   # exit 0 = todos los perfiles OK
```

Los perfiles cubren: novato ajustado, primer visor de gama media, dueño de PS5, PCVR
cuidando el bolsillo, sim racer, fidelidad-máxima sin límite de plata, premium
ultraliviano, PCVR en Linux, indeciso total y "alternativa a Meta" (Pico 4 Ultra).

**Cómo usarla:** antes de cualquier cambio al quiz, correrla (debe dar 10/10). Hacer el
cambio. Correrla de nuevo (debe seguir dando 10/10 — y si el cambio busca corregir un
resultado, primero agregar el perfil que lo demuestra). Después el E2E en navegador (§4).

## 3. Registro de ajustes

### Julio 2026 — corregido: presupuesto $650–1000 recomendaba un visor de $2.000

- **Hallazgo (medido con la matriz):** el perfil sim racer que declaraba presupuesto
  US$650–1000 recibía como ganador el Pimax Crystal Super (~US$2.000) por 28 a 27 sobre
  el Crystal Light. La penalización de presupuesto de los visores caros en esa franja era
  demasiado blanda (−2).
- **Ajuste aplicado:** en la pregunta 2, opción "$650–$1000", `pimaxsuper` y `beyond2`
  pasaron de −2 a **−6**. Un solo lugar en el código (los `scores` compartidos), vale
  para EN y ES.
- **Verificación:** matriz 10/10 (antes 9/10) y E2E en navegador — el flujo PCVR EN ahora
  termina en "Pimax Crystal Light" y el flujo ES standalone sigue dando Quest 3S con sus
  dos CTAs. Ningún otro perfil cambió de ganador.

### Verificado sin cambio (julio 2026)

- **Pico 4 Ultra es alcanzable:** el perfil "standalone gama media-alta, quiere MR,
  alternativa a Meta" lo da ganador (18 pts vs 14 del Quest 3). No estaba invisible.
- **La pregunta de peso/confort existe y funciona** (Q7): el perfil "premium
  ultraliviano" da Beyond 2 con margen. No hace falta otra pregunta de confort.
- **El perfil "indeciso total"** da Quest 3S con Quest 3 segundo (16–14). Ambos son
  respuestas editorialmente válidas; la matriz acepta cualquiera de los dos.

## 4. Proceso obligatorio para cualquier cambio al quiz

1. **Definir el resultado esperado primero.** Si el cambio corrige algo, agregar a
   `tools/finder-matrix.mjs` un perfil que hoy falle y demuestre el problema.
2. **`node tools/finder-matrix.mjs`** antes y después: el después debe dar todos OK.
3. **`python3 build.py --check`** si se tocaron datos de visores.
4. **E2E en navegador** (servidor local + playwright-core, patrón en
   `docs/OPERACIONES.md` §6): al menos un flujo EN y uno ES completos hasta `#results`,
   verificando nombre del resultado, CTAs de guías y consola sin errores.
5. Publicar con el flujo git de siempre y pedir a Daniel una pasada manual en el sitio
   vivo (el entorno del asistente no puede ver vr.ar en producción).

## 5. Backlog de diseño (para una sesión dedicada, sin apuro)

- **Visores nuevos** (Valve Steam Frame, Vision Pro, Galaxy XR cuando sean comprables):
  regla "primero la guía, después el quiz". Para sumar uno al Finder: agregar su JSON en
  `data/headsets/`, correr `build.py`, darle una columna de puntaje en **todas** las
  opciones de **todas** las preguntas (y en `OS_SCORE_DELTA`/`OS_COMPAT_MAP` si es PCVR),
  revisar `EXCLUSION_MAP`, sumar 2–3 perfiles nuevos a la matriz donde ese visor deba
  ganar y donde NO deba ganar, y recién entonces publicar.
- **Franja de presupuesto y precios reales:** los textos de la pregunta 2 nombran precios
  (Quest 3S ~$350, PSVR2 ~$400, etc.). Cuando cambien los precios (pasada de frescura de
  octubre), revisar que las franjas y los ejemplos sigan siendo verdad — y que los
  puntajes de presupuesto sigan reflejando en qué franja cae cada visor.
- **Posible refinamiento futuro:** hoy el "runner-up" se muestra con puntaje; si algún
  día los dos primeros quedan muy pegados (diferencia ≤2), se podría mostrar un texto
  tipo "es un empate técnico, mirá las dos guías". Idea, no compromiso.
