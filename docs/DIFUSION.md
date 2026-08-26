# Difusión y enlaces — a quién contactar y cómo

> **Por qué existe este documento.** El cuello de botella de vr.ar no es técnico ni de
> contenido: es **autoridad**. Bing nos lo marcó explícitamente ("tu sitio carece de
> enlaces entrantes de dominios de calidad") y es lo que nos deja en la página 2-4 de
> Google. Los enlaces no se compran (ver `docs/OPERACIONES.md` §1); se consiguen
> apareciendo en lugares donde la gente del tema ya está.
> Investigado en agosto de 2026. Última actualización: agosto 2026.

## La regla que ordena todo

Hay dos maneras de acercarse y **confundirlas arruina el intento**:

- **A una comunidad se la habita, no se le manda un comunicado.** Foros, subreddits,
  grupos. Ahí se entra participando, respondiendo dudas reales, y mencionando el sitio
  solo cuando aporta. Un posteo promocional en un foro se borra y quema el nombre.
- **A un medio se le ofrece una historia, no un producto.** Nadie cubre "un sitio nuevo".
  Sí se cubre "un argentino que no sabe programar construyó esto con IA" o "en español no
  existía orientación seria para comprar un visor". El sitio es la prueba, no el tema.

---

## Nivel 1 — Comunidades de VR en español (lo más probable que funcione)

### Real o Virtual — realovirtual.com

**El destino más valioso de esta lista.** Es la comunidad de referencia de realidad
virtual y aumentada en español, activa desde 2013: noticias, foro con secciones por
plataforma (PC VR, Quest, PSVR2, Pico), canal de YouTube y Patreon. Es exactamente
nuestro público.

- **Foro:** realovirtual.com/foro — tiene un hilo de "¡Bienvenido! Preséntate aquí".
- **Contacto de la redacción:** realovirtual.com/contacto (formulario).

**Cómo entrar, en este orden y sin apuro:**
1. Presentarse en el hilo de bienvenida como alguien de Argentina que armó un sitio de
   guías en español. Sin link promocional, contando qué es.
2. Durante unas semanas, responder dudas reales en el foro donde sepamos la respuesta
   (mareos, limpieza de lentes, PCVR inalámbrico son nuestros temas fuertes). Ahí sí,
   enlazar la guía cuando responde de verdad la pregunta.
3. Recién después, si corresponde, escribir por el formulario ofreciendo el Finder como
   herramienta para su comunidad.

> El paso 3 sin los pasos 1 y 2 es spam. Con ellos, es un aporte.

### Reddit

Ya funcionó una vez: el posteo de junio trajo comentarios que mejoraron dos guías, y la
búsqueda "vr finder" existe en Google **porque gente nos buscó por el nombre después de
leerlo**. Es la única acción de difusión que demostró resultado medible.

- r/virtualreality y r/OculusQuest — en inglés, ya conocidas.
- Comunidades hispanohablantes de VR: **no pude confirmar cuáles están activas hoy**;
  vale la pena buscar antes de escribir.
- Formato que funcionó: honesto, corto, diciendo que somos los autores.

Desde agosto de 2026 la extensión está en inglés, así que estas comunidades ya son
alcanzables. El posteo está escrito más abajo.

---

## El posteo de la extensión en Reddit

### Antes de publicar, tres cosas

1. **Leer las reglas del subreddit ese día.** No pude verificarlas desde el entorno de
   trabajo (Reddit está bloqueado ahí), y cambian. En un relevamiento de 49 subreddits
   donde suelen postear fundadores, **el 61% prohíbe la autopromoción**. Si el sidebar
   la prohíbe, no hay vuelta: se busca otro subreddit o se espera.
2. **La cuenta necesita historial.** Una cuenta nueva posteando un link propio es el
   caso clásico de borrado automático. La regla informal es 90% participación y 10%
   promoción. Conviene pasar dos o tres semanas respondiendo preguntas de
   compatibilidad —que es literalmente lo que sabemos hacer— antes de postear esto.
3. **No repetir el mismo texto en varios subreddits.** Reddit lo detecta y lo penaliza.
   Si va a más de uno, se reescribe.

### Por qué postear ahora y no esperar a tener más juegos

Con 90 juegos van a decir "falta el mío". Con 200 también: existen miles. Esperar no
elimina esa reacción, solo la posterga. Y hay una razón mejor para no esperar: **el
posteo puede pedir justamente eso**. Preguntar qué falta convierte al que iba a
quejarse en alguien que aporta, y nos deja una lista priorizada por lo que la gente
realmente juega, en vez de que adivinemos nosotros cuáles agregar. Eso vale más que
llegar con el catálogo el doble de grande y sin saber qué le importa a nadie.

### Posteo — r/virtualreality (o r/OculusQuest)

Título (elegir uno):
```
I got tired of googling whether a VR game runs on my headset, so I built a
browser extension that answers it — and published the data behind it
```
```
I built a free extension that tells you if a VR game works on your headset
while you browse Steam — the catalogue is open data, and it says "we don't
know" instead of guessing
```

Cuerpo:
```
I run a small independent VR site, and the question I could never answer quickly
was the simplest one: does this game actually run on the headset I own?

Every game ships on some platforms and not others, storefronts word it
inconsistently, and half the "compatibility lists" out there are wrong in the
worst possible way — they say a game is unavailable when nobody ever checked.

So I built a Chrome extension. You pick your headset once, and when a page
mentions a game from the catalogue, a small card shows up at the bottom right
with the answer: runs natively, runs with a PC, doesn't run, or — and this is
the part I care about — we haven't verified that one yet. It says that out loud
instead of guessing. It works on Steam and the PlayStation Store out of the box;
anywhere else only if you turn it on yourself, because I don't think an
extension should demand access to your whole browsing session just to be tried.

No account, no analytics, no data leaves your browser. The only thing stored is
which headset you picked.

The catalogue is 90 games, checked store by store. That is obviously not every
VR game, which brings me to what I actually want from this post:

**Which games should I add first?** Reply with the ones you look up most and
I'll verify those next. I'd rather spend the effort on titles people actually
own than on whatever I happen to think is popular.

Two other things, in case they're useful to someone:

- The whole dataset is public, not locked in the extension: [link to
  vr-game-compatibility] and the raw JSON at [link to vr-games.json], CC BY 4.0.
  Platforms we never verified are listed explicitly as unverified, so an absence
  never means "not available". Take it, use it, correct me.
- If you spot a wrong entry, tell me and I'll fix it. Getting compatibility
  wrong is worse than having no data, because it makes someone buy something
  they can't use.

Extension: [store link]
```

### Respuestas listas para los comentarios previsibles

**"¿Por qué pide permiso para todos los sitios?"**
```
It doesn't, unless you turn it on. It installs with access to Steam and the
PlayStation Store only — that's in the manifest. The "any page" mode is an
optional permission you grant from the extension's own button, and you can
revoke it there too. That's why the install screen doesn't show the scary
"read all your data" warning.
```

**"¿Cómo sé que no me trackea?"**
```
Fair question, and you shouldn't take my word for it. Nothing is sent anywhere:
the catalogue ships inside the extension and the matching happens locally. The
privacy policy is one page: vr.ar/extension-privacidad. If someone wants to
check the network tab and call me out, please do.
```

**"Falta mi juego" / "el dato X está mal"**
```
Thanks — adding it to the list. If it's wrong I'd rather know: which platform
and which headset? I'll re-check against the store listing and fix it.
```

**"¿Y por qué no lo hace la tienda?"**
```
Honestly, no idea. It's the first thing anyone wants to know and it's the one
thing nobody states plainly.
```

### Después de postear

- Contestar todos los comentarios el mismo día. Ahí se gana o se pierde.
- Anotar los juegos que pidan: esa lista es la próxima tanda del catálogo, y es
  el motivo por el que este posteo vale más que uno que solo anuncia.
- Si un dato resulta estar mal, corregirlo ese día y decirlo en el hilo. Es la
  mejor publicidad posible para una herramienta cuyo argumento es la honestidad.

---

## Nivel 2 — Medios de VR en español (pitch corto por formulario)

Verifiqué que existen y publican sobre VR. **No verifiqué su nivel de actividad actual ni
si aceptan colaboraciones**, y en ninguno encontré un mail de prensa público: hay que usar
sus formularios de contacto.

| Medio | Qué es | Cómo contactar |
|---|---|---|
| **VrPatch** (vrpatch.es) | Sitio español dedicado a noticias de VR y lanzamientos para Quest | Formulario en el sitio |
| **Geeknetic** (geeknetic.es) | Medio de hardware con sección propia de VR: reviews, guías, noticias | Formulario / redacción |
| **Topes de Gama** (topesdegama.com) | Medio de tecnología con sección de realidad virtual | Formulario |

Para estos, el ángulo fuerte no es la IA sino **el vacío en español**: un recomendador de
visores hecho nativamente en castellano, gratis y sin registro.

---

## Nivel 3 — Medios de tecnología (ángulo IA, baja probabilidad)

Acá la historia es "qué puede construir hoy alguien sin saber programar". Son medios
grandes: la probabilidad es baja, pero el intento cuesta un mail.

| Medio | Nota |
|---|---|
| **Xataka** | `prensa@xataka.com` (verificado). **Existe Xataka Argentina** (xataka.com.ar) con su propia redacción — mejor destino que la edición de España para un proyecto argentino; revisar xataka.com.ar/contacto |
| **Hipertextual** | `prensa@hipertextual.com` — enviado el 20/07/2026, sin respuesta. No insistir |
| **Inteligencia Argentina** (inteligenciaargentina.ar) | Medio argentino centrado en IA e innovación: es el que mejor encaja con nuestro ángulo |
| **Portal TIC** (portaltic.com.ar) | Medio argentino de tecnología |
| **iProfesional**, **La Nación Tecnología** | Grandes y generalistas. Probabilidad baja |

---

## Nivel 4 — Producto, no prensa

- **Product Hunt** — el Finder se presenta como herramienta, no el sitio como blog. Requiere
  preparación (imágenes, tagline) y estar disponible ese día para responder en inglés.
  Planeado para septiembre 2026, martes o miércoles.
- **AlternativeTo** — **rechazado en julio de 2026.** No reintentar: sus reglas excluyen
  explícitamente "review/comparison websites", "guides & tutorials" y "online quizzes".
  Cualquier directorio de *software* nos va a rechazar por lo mismo.

---

## Plantilla base (medios)

Adaptar el primer párrafo según el ángulo que corresponda al medio.

> **Asunto:** [Ángulo concreto, no el nombre del sitio]
>
> Hola:
>
> Les escribo por si les sirve como historia, más que como novedad de producto.
>
> [ÁNGULO A — medios de tecnología/IA] Hace cuatro meses armé **vr.ar**, un sitio gratuito
> para elegir visor de realidad virtual. Lo particular es cómo está hecho: yo no sé
> programar. El test, las 32 páginas, el despliegue, todo lo construí trabajando con IA
> como socio técnico, poniendo yo el criterio editorial.
>
> [ÁNGULO B — medios de VR] Hace cuatro meses armé **vr.ar**, un test de 7 preguntas que
> recomienda un visor de VR según cómo lo vas a usar de verdad, más 16 guías en lenguaje
> llano. Todo escrito nativamente en español, no traducido: es algo que no existía.
>
> Es gratis, sin registro y sin cuentas. Cuando un producto no vale la pena, lo decimos.
> El dominio es literalmente vr.ar, dos letras.
>
> El sitio: https://vr.ar
>
> Si les interesa, les cuento lo que necesiten.
>
> Saludos,
> Daniel Tommasi · danotommasi@gmail.com

**Reglas de envío:** martes a jueves por la mañana · sin adjuntos · un solo link · no
insistir si no contestan (es lo normal, no significa que estuvo mal) · si el repositorio
está público, sumar el link a GitHub cuando el ángulo sea el de la IA.

---

## Expectativa honesta

De diez intentos de este tipo, lo esperable es que respondan uno o dos, y que uno termine
en algo publicado. **Eso ya sería un éxito**: un solo artículo en un medio real vale más
que cincuenta directorios. Lo que no funciona es mandar veinte mails iguales el mismo día.

El orden recomendado: **empezar por el Nivel 1**, que es donde está nuestra gente y donde
el esfuerzo se convierte en algo con más frecuencia. Los niveles 2 y 3 son lotería con
premio grande.
