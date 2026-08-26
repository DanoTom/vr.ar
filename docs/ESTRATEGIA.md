# Estrategia de vr.ar frente a la web de agentes

> Escrito en agosto de 2026, a partir de datos publicados, no de intuición.
> Se revisa cuando aparezcan datos nuevos o cuando los números propios
> contradigan lo que dice acá.

## Por qué existe este documento

vr.ar se construyó sobre un modelo que está cambiando: publicar buen contenido,
recibir visitas de Google, y monetizar esas visitas con publicidad y afiliados.
Los tres eslabones se debilitaron a la vez, y no por errores nuestros. Este
documento junta la evidencia y fija el rumbo, para no volver a discutirlo de cero
cada vez que aparece una noticia alarmante.

---

## Lo que dicen los datos

**1. La caída del tráfico de búsqueda es real y golpea más fuerte a los sitios
chicos.** Los datos de Chartbeat publicados por Axios en marzo de 2026 muestran
que el tráfico de Google cayó **60% para los sitios chicos**, 47% para los
medianos y 22% para los grandes. El tráfico global de Google hacia editores cayó
un tercio durante 2025. No es una impresión: es la tendencia medida, y la
asimetría por tamaño es lo más importante para nosotros.

**2. Los asistentes de IA no reemplazan ese tráfico en volumen.** Las visitas
provenientes de ChatGPT y similares crecieron mucho en términos relativos, pero
siguen siendo **menos del 1% de las visitas** que reciben los editores. Quien
espere que la IA le devuelva el tráfico que le sacó la búsqueda, va a esperar
sentado.

**3. Pero las visitas que sí llegan desde IA valen más.** Un análisis de 94
sitios de comercio durante 2025 midió una conversión de 1,81% para el tráfico de
ChatGPT contra 1,39% del orgánico no-marca: **31% mejor**. Para marzo de 2026
otras mediciones dan 42% mejor. La explicación es sensata: el asistente ya
filtró, y quien hace clic viene decidido. Hay cifras mucho más altas dando
vueltas (4× o 5×), casi siempre publicadas por empresas que venden servicios de
"visibilidad en IA": conviene desconfiar de esas y quedarse con el orden de
magnitud, que igual es favorable.

**4. Cobrarle a los crawlers no es un ingreso para un sitio de nuestro tamaño.**
El pay-per-crawl de Cloudflare, mirado de cerca, rinde entre 20 y 200 dólares
mensuales para sitios chicos con volumen de rastreo real; los 50.000 a 200.000
dólares que se citan corresponden a sitios enormes. Para vr.ar hoy sería
literalmente centavos. Peor: bloquear crawlers nos quitaría lo único que sí
tenemos para ganar, que es ser citados.

**5. Sí existe, en cambio, un estándar barato para dejar la puerta abierta a
cobrar en el futuro.** RSL (Really Simple Licensing), lanzado en septiembre de
2025 y convertido en estándar 1.0 en diciembre, permite declarar condiciones de
licencia y compensación en el propio `robots.txt`. Lo adoptaron Reddit, Yahoo,
Medium, The Guardian, AP y otros. No paga nada hoy, pero cuesta cinco líneas.

**6. Una extensión chica tampoco genera dinero: genera usuarios.** Los números
del ecosistema son duros y conviene tenerlos a la vista: **cerca del 70% de las
extensiones monetizadas no gana prácticamente nada**. Con 1.000 usuarios y una
conversión realista (0,5% a 2%), un plan pago daría entre 25 y 150 dólares
mensuales. Recién alrededor de **10.000 usuarios activos** el modelo freemium
empieza a dar entre 2.000 y 10.000 mensuales. Ese es el orden de magnitud que hay
que tener en la cabeza antes de fantasear con ingresos.

**7. Los agentes necesitan datos estructurados, no prosa.** Los asistentes de
compra no leen páginas de categoría: consultan datos estructurados y catálogos
legibles por máquina. Según el índice de comercio con IA de McKinsey citado en
2026, el 34% de los compradores en línea de Estados Unidos ya usó un agente para
decidir una compra, contra 9% en 2024.

### Sobre la nota de Parag Agrawal

Su diagnóstico coincide con los datos de arriba, y por eso vale leerlo. Pero hay
que separar dos cosas: la parte descriptiva (la publicidad por atención se cae si
quien navega es un agente) está bien sostenida; la parte prescriptiva (una "web
paralela" para agentes, con reparto por valores de Shapley) **es el producto que
su empresa vende**. Su plazo de "12 a 24 meses" es tanto un argumento comercial
como un pronóstico. Tomamos el diagnóstico; no tomamos la urgencia.

---

## Qué significa para vr.ar

El activo del proyecto dejó de ser el tráfico. Hoy tenemos tres activos, en orden
de durabilidad:

1. **El catálogo de compatibilidad verificado.** 90 juegos, plataforma por
   plataforma, con fuente y fecha en `extension/research/`. Es un dato que casi
   nadie tiene ordenado, que las tiendas no publican con claridad, y que un
   modelo de lenguaje no puede inventar de forma confiable. Es lo más valioso que
   construimos, y todavía está escondido adentro de una extensión.

2. **Los usuarios de la extensión.** Una audiencia que no depende de que Google
   nos mande a nadie. Es la única forma de tráfico que hoy podemos hacer crecer
   por mérito propio.

3. **Las guías.** Ya no valen por las visitas que traen, sino por dos cosas: dan
   la credibilidad que hace creíble a la herramienta, y son la superficie por la
   que un asistente puede citarnos. Y como el tráfico de IA convierte mejor, ser
   citado sigue valiendo la pena aunque el volumen sea chico.

## Decisiones

**Tomadas:**

- El eje del proyecto pasa de contenido a herramientas. El sitio es la casa y la
  prueba de credibilidad; las herramientas son el producto.
- La métrica principal deja de ser impresiones y pasa a ser **usuarios activos de
  la extensión**. Meta realista de los próximos meses: 1.000 usuarios. Recién con
  10.000 tiene sentido hablar de dinero.
- No se bloquea a los crawlers de IA. Queremos ser citados.
- No se insiste con publicidad. Ver "pendiente" más abajo.

**Aprobadas por Daniel y ya aplicadas (23 de agosto de 2026):**

- **El catálogo se publicó como recurso público**: `/data/vr-games.json` bajo
  licencia CC BY 4.0, más las páginas navegables `/compatibilidad` (es) y
  `/vr-game-compatibility` (en). Se generan con `tools/gen-catalog.mjs` desde
  `extension/src/data.js`, que sigue siendo la única fuente de verdad.
- **RSL adoptado**: `robots.txt` apunta a `/license.xml`, que declara el catálogo
  como abierto con atribución y el contenido editorial como citable con
  atribución. No se bloquea a ningún rastreador.
- **AdSense eliminado** de las 36 páginas que lo tenían. El sitio ya no muestra
  publicidad de ningún tipo, lo que además vuelve cierta la frase "sin
  publicidad" que usamos en la extensión.

Publicar el catálogo tuvo un efecto inmediato que no habíamos previsto: al verlo
en una tabla aparecieron tres errores que dentro de la extensión eran invisibles
—dos juegos duplicados con datos contradictorios y una afirmación falsa sobre
Resident Evil 4—. Exponer los datos es, además de una apuesta de distribución,
un control de calidad.

## Cómo sabremos si nos equivocamos

- Si en tres meses la extensión no pasa de unos pocos cientos de usuarios pese a
  la difusión, el problema no es el idioma ni el catálogo: es que la herramienta
  no le resuelve a nadie un problema lo bastante frecuente. Ahí hay que cambiar de
  herramienta, no insistir con esta.
- Si el tráfico del sitio se estabiliza o crece sin que hagamos nada, la premisa
  de la caída estructural estaba mal aplicada a nuestro nicho, y conviene volver a
  invertir en contenido.
- Si aparece un mecanismo de compensación que sí paga a sitios chicos, se revisa
  el punto 4.

## Fuentes

- Axios, marzo de 2026 — datos de Chartbeat sobre la caída por tamaño de sitio.
- Press Gazette, 2026 — caída global del tráfico de Google a editores en 2025.
- Digiday — modelado de los editores ante menos tráfico de búsqueda.
- Análisis de 94 sitios de comercio (2025) — conversión de ChatGPT vs. orgánico.
- Blog de Cloudflare y análisis independientes sobre pay-per-crawl.
- rslstandard.org — estándar RSL y lista de adherentes.
- Estadísticas públicas de monetización de extensiones de Chrome, 2026.
- Podcast Training Data — entrevista a Parag Agrawal, agosto de 2026.
