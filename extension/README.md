# VR.AR — ¿Funciona en mi visor?

Extensión de Chrome (Manifest V3). Mientras navegás, detecta juegos de realidad
virtual y te dice si funcionan en **tu** visor.

## Cómo funciona

- **En Steam y PlayStation Store** funciona desde que la instalás, sin permisos extra.
  En Steam identifica el juego por su App ID, que es exacto.
- **En cualquier otra página** (blogs, notas, reseñas, foros) funciona solo si el
  usuario aprieta "Activar en todos los sitios" en el popup. Recién ahí Chrome pide
  el permiso. Así la instalación no muestra la advertencia de "leer todos tus datos",
  que es lo que espanta a la mayoría de la gente.
- Si no detecta nada, no aparece nada.

## Diseño

- La interfaz vive dentro de un **Shadow DOM**: el CSS del sitio anfitrión no puede
  deformarla, y nuestros estilos no ensucian la página ajena.
- Aparece como una píldora chica abajo a la derecha. Se abre con un clic.
- Cerrar la oculta en esa página; "No mostrar acá" la silencia en todo el sitio
  (se administra desde Preferencias).
- Accesible: navegable con teclado, Escape para cerrar, foco visible, respeta
  `prefers-reduced-motion`, y el estado nunca se comunica solo por color.

## Datos

`src/data.js` guarda, por juego, dos listas: `on` son las plataformas donde
**verificamos que está**, y `off` aquellas donde **verificamos que no está**.
Lo que no figura en ninguna de las dos es desconocido.

```js
{ slug: 'beat-saber', title: 'Beat Saber', steam: ['620980'],
  on: ['pico', 'psvr2', 'quest', 'steam'], off: [] }
```

Esa distinción es deliberada y es lo más importante del modelo: sin ella, "no
tengo el dato" se muestra como "no funciona", que es justo el error que vuelve
inútil una herramienta como esta. Hoy el catálogo responde con certeza el 74% de
las combinaciones juego × visor; el 26% restante dice "sin datos" en vez de
inventar.

La compatibilidad con cada visor se **deriva** de ahí, en vez de repetirla nueve
veces por juego. Cada visor declara qué tiendas nativas tiene y si sirve para PC VR:

- El juego está en una tienda nativa del visor → funciona.
- No, pero está en Steam y el visor sirve para PC VR → funciona con una PC.
- Verificamos que no está en ninguna vía que le sirva a ese visor → no funciona,
  y se dice en qué plataformas sí está.
- No verificamos todas esas vías → "sin datos". Nunca se afirma un "no" por
  ausencia de información.

Agregar un juego son tres datos, no veintisiete, y hay muchos menos lugares donde
equivocarse.

## Coincidencia de títulos

Nunca por subcadena suelta. Solo:

- **Exacta**: el título de la página es idéntico al del catálogo.
- **Aproximada**: la página empieza con el título completo del catálogo y agrega
  hasta dos palabras (ediciones, sufijos de tienda). Se muestra avisando que puede
  no corresponder.
- **Mención**: en páginas comunes, el nombre del juego aparece como palabras
  completas dentro del texto. La tarjeta aclara que fue detectado por mención.

Con menos de eso no se afirma nada. "War Thunder Mobile" no es "War Thunder", y una
página que dice "VR" no es "Pavlov VR".

## Privacidad

Todo el procesamiento es local. No hay cuentas, analítica, historial ni envío de
datos a ningún servidor. Se guardan solo el visor elegido, si la tarjeta está
activada y la lista de sitios silenciados.
Política completa: https://vr.ar/extension-privacidad

## Carga local para probar

1. `chrome://extensions` → activar "Modo desarrollador".
2. "Cargar descomprimida" → elegir esta carpeta.

## Idiomas

La interfaz está en **español e inglés**, y Chrome elige sola según el idioma del
navegador: español si el navegador está en español (cualquier variante), inglés en
cualquier otro caso. Los textos viven en `_locales/es/messages.json` y
`_locales/en/messages.json`; en el código no queda ningún texto suelto.

Al agregar un texto nuevo: se define la clave en **los dos** archivos y se usa
`VRAR_t('clave')` desde JS, o `data-i18n="clave"` desde el HTML. Si falta una
traducción, aparece el nombre de la clave — a propósito, para que se note.

La razón de fondo no es cosmética: las comunidades de VR realmente activas
(Reddit, Product Hunt) son de habla inglesa, y una herramienta que solo habla
español no se puede compartir ahí.

## Historial

### v2.2.0
- **Inglés.** La extensión ahora habla los dos idiomas, con el sistema `_locales`
  de Chrome. `default_locale` es `en`: quien tenga el navegador en español ve
  español, y cualquier otro idioma cae en inglés.
- Se corrigió, de paso, que el enlace "Ver más en VR.AR" apuntaba siempre a la
  guía en español; ahora lleva a `/guides/` o a `/guias/` según el idioma.
- "Otro visor" era el único nombre de visor que era texto y no marca: también
  se traduce.

### v2.1.1
- **Español neutro.** Los textos de la interfaz ya no usan voseo ni giros
  rioplatenses: la extensión la usa cualquier hispanohablante, así que "necesitás
  una PC que lo mueva" pasó a "Requiere una PC capaz de mover VR". El sitio
  vr.ar mantiene su voz rioplatense; la herramienta no.
- **Bug corregido:** al desactivar el acceso a todos los sitios, el bloque
  "Activo en toda la web" seguía visible. La causa era de CSS: nuestra regla
  `.granted { display: flex }` le ganaba al `display:none` que el navegador
  aplica con el atributo `hidden`. Se agregó `[hidden] { display: none !important }`.
- "Vigilando esta página" pasó a "Buscando juegos en esta página": la palabra
  anterior sonaba a vigilancia y describía mal lo que hace.
- El popup ahora explica de entrada para qué sirve la extensión. Antes había que
  deducirlo de los controles.

### v2.1.0
- Catálogo verificado plataforma por plataforma para los 91 juegos: **94% de los
  datos confirmados** (antes se inferían), y las respuestas definitivas pasaron
  del 74% al **99%** de las combinaciones juego × visor.
- Se corrigieron datos que estaban mal: Red Matter 2 figuraba como incompatible
  con Quest cuando sí está en la tienda de Meta, y Beat Saber figuraba en PICO
  cuando no está. Aparecieron además 66 "no funciona" verificados, que antes no
  existían.
- Los títulos cortos (GORN, Moss) ya se detectan en fichas de tienda; el largo
  mínimo se aplica solo al escaneo suelto de páginas cualquiera.
- La investigación queda guardada en `research/` con su fuente y su fecha.

### v2.0.0
- Funciona en cualquier página, no solo en tiendas, con permiso opcional.
- Interfaz nueva en Shadow DOM: píldora que se expande, selector de visor,
  otros juegos mencionados en la misma página, silenciar por sitio.
- Modelo de datos por plataforma, distinguiendo verificado-que-sí,
  verificado-que-no y desconocido; catálogo depurado de 100 a 91 juegos al
  fusionar 7 duplicados que además se contradecían entre sí.
- Escaneo de una página de 196.000 caracteres en 22 ms.

### v1.1.1
- Corrección de coincidencias falsas por subcadena.

### v1.1.0
- Catálogo ampliado a 100 títulos.
