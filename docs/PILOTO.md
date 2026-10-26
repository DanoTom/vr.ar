# Piloto — cómo se opera vr.ar semana a semana

> En octubre de 2026 Daniel delegó la operación del sitio en un asistente de IA
> (Claude). Daniel decide lo estratégico; el asistente ejecuta, mide e informa. Este
> documento es el mandato: qué se hace cada semana, con qué límites y dónde queda
> registrado. Cualquier sesión que trabaje en el sitio lo lee primero, junto con
> `docs/ESTILO.md` y `docs/OPERACIONES.md`.

## Decisiones vigentes de Daniel

- **Publicar directo a `main`** el trabajo verificado (OPERACIONES §4), con el estilo de
  `docs/ESTILO.md`.
- **Cautela antes que velocidad.** El proyecto no es central y hay tiempo. Vale más un
  cambio bueno por semana que cinco apurados.
- **El dominio se vende solo por US$ 20.000 o más.** Está a nombre de Daniel y vence el
  **13/01/2027**.
- **Sin publicidad**, desde agosto de 2026.

## La rutina de cada lunes

1. **Ponerse al día.** Leer la bitácora de abajo y `docs/METRICAS.md`.
2. **Mirar los números.** `node tools/gsc.mjs 28 --out <scratchpad>/gsc` y
   `node tools/gsc.mjs 7`. Si falta la clave, decirlo en el informe y trabajar con el
   último export que haya pasado Daniel.
3. **Revisar el sitio vivo.** La home, el sitemap y cinco guías al azar responden 200;
   las URLs `.html` redirigen; el último deploy en Actions salió verde.
4. **Elegir una o dos acciones**, en este orden:
   1. Algo roto: técnico, enlaces, datos incorrectos.
   2. Páginas en posición 8–30 con impresiones reales. Mirar qué consultas las traen y
      mejorar la página para esa intención: título, descripción, la primera respuesta,
      lo que le falte. Es donde más clics hay por menos trabajo.
   3. Frescura: precios, fechas, productos nuevos (OPERACIONES §7).
   4. Enlaces internos hacia las páginas que están subiendo.
   5. Contenido nuevo, solo con evidencia de demanda (consultas reales en Search
      Console, o un hueco comprobable) y algo propio que aportar. Máximo dos pares nuevos
      por mes.

   Aparte de eso, mientras el directorio esté en fase 0 o 1, cada rutina suma fichas
   verificadas según `docs/DIRECTORIO.md`.
5. **Hacerlo bien.** Estilo según `docs/ESTILO.md`, verificación local según
   OPERACIONES §6, y el par EN/ES el mismo día.
6. **Publicar** a `main` y comprobarlo en el sitio vivo.
7. **Anotar en la bitácora** qué se cambió, por qué, qué se espera que pase y cuándo
   mirarlo.
8. **Informarle a Daniel, en español** (rioplatense, con voseo, como todo lo que se le
   escribe), corto: los números de la semana, qué se hizo, qué necesita de él (si hace
   falta algo) y qué sigue.

**No se toca la misma página dos veces en menos de cuatro semanas**, salvo para corregir
un error. Google tarda en reaccionar, y si todo cambia todo el tiempo no hay forma de
saber qué funcionó.

## Lo que necesita el OK de Daniel

- Cambiar la lógica del Finder (con el plan de `docs/FINDER-AJUSTE.md`).
- Sumar cualquier forma de monetización: afiliados nuevos, publicidad, patrocinios.
- Mandarle mensajes a terceros. El asistente deja borradores; los envía Daniel.
- Gastar plata o contratar servicios.
- Tocar DNS, Cloudflare, NIC Argentina o cualquier cuenta a nombre de Daniel.
- Todo lo que tenga que ver con la venta del dominio, más allá de investigar y preparar
  material.

## Fechas que vigila la rutina

| Cuándo | Qué |
|---|---|
| Primer lunes de cada mes | Completar la fila del mes en `docs/METRICAS.md`. Los usuarios de la extensión se leen de la ficha pública de la tienda; no hace falta pedirle el CSV a Daniel. |
| Noviembre 2026 | Revisión de noviembre (criterios en `docs/METRICAS.md`) y contenido de regalos (`docs/BRIEFS.md`). |
| Desde el 1/12/2026 | Recordarle a Daniel que renueve el dominio antes del 13/01/2027. Mientras corre el período de gracia, NIC no permite transferirlo: si hay una venta en curso, es crítico. |
| Enero 2027 | Renovar las guías "(2026)" (OPERACIONES §7). |

## Accesos

| Acceso | Para qué | Estado |
|---|---|---|
| GitHub `DanoTom/vr.ar` | todo el trabajo en el sitio | activo |
| vr.ar desde el entorno | comprobar el sitio vivo | activo desde el 24/10/2026 |
| Search Console por API | `tools/gsc.mjs`, lee la variable `GSC_SERVICE_ACCOUNT_JSON` (el JSON en base64, en una sola línea) | activo desde el 24/10/2026 (propiedad `sc-domain:vr.ar`). Una sesión ve la variable solo si arrancó después de que se cargó. |
| Chrome Web Store, ficha pública | usuarios de la extensión y versión publicada | activo desde el 26/10/2026. El número de "usuarios" de la ficha coincide con los usuarios semanales del panel (19 en los dos al 24/10). El panel, con el detalle por país e idioma, sigue siendo de Daniel. |

La clave de Search Console es de una cuenta de servicio con permiso **Restringido**
(solo lectura). Vive en la configuración del entorno, nunca en el repositorio ni en el
chat.

## Bitácora

Lo más nuevo arriba. Una entrada por semana.

### 2026-10-26 (más tarde) — respuesta de Daniel

- **El informe va en español a partir de ahora.** El de esta primera rutina salió en
  inglés, sin querer. Quedó en el paso 8 de la rutina y en el texto de la tarea
  programada.
- La 2.2.1 de la extensión **sigue en revisión**: la ficha pública muestra la 2.2.0.
- Daniel habilitó `chromewebstore.google.com`. La ficha marca 19 usuarios, lo mismo que
  su CSV para el 24/10, así que la rutina lee ese número sola y ya no necesita el CSV.
  Según el CSV, los usuarios semanales fueron 10 el 26/9, 14 el 2/10, 16 el 11/10 y 19
  el 24/10.

### 2026-10-26 — primera rutina

- **Números** (28 días al 23/10): 28 clics, 2.432 impresiones, posición 12,0, contra 3,
  874 y 28,6 del período anterior. Última semana (17 a 23/10): 9 clics y 740
  impresiones; contra la semana previa, 27% más impresiones con casi los mismos clics.
- **Sitio vivo:** la home, el sitemap, el catálogo JSON y las guías principales
  responden 200, y las `.html` redirigen.
- **Arreglado en `tools/gsc.mjs`:** `node tools/gsc.mjs 7` devolvía 28 días, porque sin
  `--out` se descartaba el primer argumento. Se agregó `--page`, que muestra las
  consultas de una sola página.
- **Acción de la semana: la guía de limpieza de lentes, EN + ES.**
  - Por qué: es la página con más impresiones (564 en 28 días, posición 10,8), pero sus
    consultas principales ("clean quest 3 lenses", "how to clean meta quest 3 lenses")
    estaban en posición 15 a 20, con 0 clics.
  - **Dato incorrecto corregido.** La guía decía que Meta permite humedecer el paño con
    agua. Las páginas de Meta sobre las lentes de las Quest 3 (configuración, centro de
    seguridad, empañamiento) dicen solo en seco; el agua aparece únicamente en un
    artículo general de limpieza. También decía que el sol quema las pantallas "en
    segundos", cuando Meta dice "menos de un minuto".
  - Se sacaron dos cosas que no se pudieron verificar: echarle el aliento a la lente, y
    sacar la interfaz facial con los botones de ajuste.
  - Estructura nueva: la respuesta en la primera línea, pasos numerados, qué no usar,
    qué hacer con una mancha que no sale, el sol, la interfaz facial y las rayas. Cada
    dato de Meta enlaza a su página. El título en inglés ahora dice "Meta Quest 3",
    como lo busca la gente; el título en español no cambió.
  - meta.com no abre desde el entorno, porque la red lo bloquea. Lo citado sale de los
    extractos de búsqueda de esas páginas, que coinciden entre sí.
  - `guides.css` ahora da estilo a las listas numeradas; ninguna guía las usaba.
  - **Medir el 23/11**, no antes: `node tools/gsc.mjs 28 --page
    /guides/how-to-clean-quest-3-lenses`. Mirar la posición de las consultas de
    limpieza y si aparecen clics.
- **Extensión:** la tienda de Chrome no abre desde el entorno, así que no se pudo ver si
  la 2.2.1 ya está publicada. Se le pregunta a Daniel.
- **Próxima rutina (2/11, primer lunes del mes):** completar la fila de octubre en
  METRICAS (los usuarios de la extensión, de la ficha pública) y arrancar la fase 0 del
  directorio. Candidata SEO:
  Quest 3 vs 3S en inglés (posición 17,9, 249 impresiones, 0 clics).

### 2026-10-24 (más tarde) — catálogo abierto y directorio

- **Arreglado:** `/data/vr-games.json` daba 404 desde agosto. El deploy borraba toda la
  carpeta `data/` y con ella el archivo público, que está enlazado desde `robots.txt`,
  `license.xml`, `llms.txt` y las dos páginas del catálogo. Ahora se publica, y el deploy
  falla si vuelve a faltar. Comprobado en vivo: responde 200, con 90 juegos y licencia
  CC BY 4.0.
- **Decidido por Daniel:** el camino de ingresos es el directorio de estudios XR, no los
  afiliados. El plan, con criterios por fase, está en `docs/DIRECTORIO.md`. La fase 0
  (40 fichas) arranca en noviembre, dentro de las rutinas.
- **Extensión 2.2.1 subida a la tienda por Daniel** (24/10). Trae las tres correcciones
  del catálogo. En la próxima rutina se confirma que la tienda ya muestre la 2.2.1.
- **Search Console conectado.** La variable se carga en base64 (una sola línea), porque
  el campo no acepta el JSON en varias líneas. Se verificó desde una sesión nueva: lee
  `sc-domain:vr.ar` sin errores, y los números coinciden con el export (29 clics y
  2.317 impresiones del 24/9 al 21/10). Con datos reales, las tablas del script pasaron
  a ordenarse por impresiones: por clics, casi todo empataba en 0 y quedaba alfabético.
- Lo que muestra la primera lectura por API: la guía de limpieza de lentes en inglés ya
  está en posición 10,6, con 558 impresiones y 4 clics. Quest 3 vs 3S (EN) está en
  18,1 con 248 impresiones y 0 clics. VR con anteojos (EN) está en 8,5 con 126
  impresiones y 0 clics: ahí el problema es el título o la descripción, no la posición.

### 2026-10-24 — arranque

- Daniel retomó el proyecto después del salto del 22/9 en Search Console (ver
  `docs/METRICAS.md`) y delegó la operación.
- Se armaron este documento, `docs/ESTILO.md` y `tools/gsc.mjs`. Ese último se probó
  contra Google con una clave falsa, y Google rechazó la cuenta como era de esperar:
  la firma, el formato y la red funcionan. Falta la clave real.
- El manual se corrigió: todavía mandaba a agregar AdSense en las guías nuevas.
- Comprobado en el sitio vivo: las URLs `.html` redirigen (308) a la versión limpia. Las
  impresiones que Search Console todavía muestra en `.html` se van a consolidar solas;
  no hay que tocar nada.
- La tienda de Chrome sigue en la 2.2.0. La 2.2.1 del repositorio solo trae las tres
  correcciones del catálogo de agosto (Resident Evil 4, Blade & Sorcery, Arizona
  Sunshine 2). Daniel tiene el zip para subirla.
- Primera rutina: lunes 26/10. Candidatas, por impresiones sin clics: el par Quest 3 vs
  3S (~1.200 impresiones en 3 meses, posición ~26, 0 clics), limpieza de lentes (~1.670,
  posición 16, 5 clics) y batería (~380, posición 18, 0 clics).
