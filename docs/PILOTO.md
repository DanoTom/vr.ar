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
8. **Informarle a Daniel**, corto: los números de la semana, qué se hizo, qué necesita
   de él (si hace falta algo) y qué sigue.

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
| Primer lunes de cada mes | Completar la fila del mes en `docs/METRICAS.md`. Pedirle a Daniel el CSV de usuarios semanales de la extensión. |
| Noviembre 2026 | Revisión de noviembre (criterios en `docs/METRICAS.md`) y contenido de regalos (`docs/BRIEFS.md`). |
| Desde el 1/12/2026 | Recordarle a Daniel que renueve el dominio antes del 13/01/2027. Mientras corre el período de gracia, NIC no permite transferirlo: si hay una venta en curso, es crítico. |
| Enero 2027 | Renovar las guías "(2026)" (OPERACIONES §7). |

## Accesos

| Acceso | Para qué | Estado |
|---|---|---|
| GitHub `DanoTom/vr.ar` | todo el trabajo en el sitio | activo |
| vr.ar desde el entorno | comprobar el sitio vivo | activo desde el 24/10/2026 |
| Search Console por API | `tools/gsc.mjs`, lee la variable `GSC_SERVICE_ACCOUNT_JSON` (el JSON en base64, en una sola línea) | activo desde el 24/10/2026 (propiedad `sc-domain:vr.ar`). Una sesión ve la variable solo si arrancó después de que se cargó. |
| Chrome Web Store | usuarios de la extensión | no tiene API de estadísticas: Daniel exporta el CSV una vez por mes |

La clave de Search Console es de una cuenta de servicio con permiso **Restringido**
(solo lectura). Vive en la configuración del entorno, nunca en el repositorio ni en el
chat.

## Bitácora

Lo más nuevo arriba. Una entrada por semana.

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
