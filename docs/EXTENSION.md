# Extensión de Chrome — "VR.AR ¿Funciona en mi visor?"

> El código vive en `extension/` de este mismo repositorio. Este documento tiene
> todo lo que hace falta para publicarla y actualizarla en la Chrome Web Store,
> para no volver a redactarlo cada vez.
> Última actualización: agosto de 2026.

## Publicada

- **En la tienda:** https://chromewebstore.google.com/detail/kkochebcipappcffahiekngadijacfge
- **ID:** `kkochebcipappcffahiekngadijacfge`
- **Primera versión pública:** 2.1.1, aprobada el 19 de agosto de 2026 (enviada el
  día anterior: la revisión tardó menos de 24 horas).
- **Página en el sitio:** https://vr.ar/extension

### Cómo llega la gente a esa página

Desde la home (`index.html` y su versión generada `es/index.html`): un banner de
lanzamiento debajo del botón del test, más un enlace permanente en el pie. También
desde `guias/index.html` y desde la guía de mejores juegos. Si se cambia el banner,
hay que volver a correr `node tools/gen-es-home.js` para que la home en español
quede igual.

## Qué es

Una extensión que, mientras el usuario navega, detecta juegos de realidad virtual
y le dice si funcionan en **su** visor. En Steam y PlayStation Store funciona desde que
se instala; en cualquier otra página (blogs, notas, reseñas) el usuario la habilita
con un botón.

Estratégicamente es la primera **herramienta** del proyecto, no contenido. Sirve
para tres cosas: darle a la marca una presencia fuera del sitio, generar un motivo
real para que medios y comunidades hablen de nosotros, y traer visitas al sitio
desde el enlace de cada tarjeta.

---

## Datos de la ficha (copiar y pegar)

**Nombre** (máx. 75)
```
VR.AR — ¿Funciona en mi visor?
```

**Descripción breve** (máx. 132)
```
Indica si un juego de VR funciona en tu visor: en Steam, PlayStation y cualquier blog o nota. Gratis y sin cuenta.
```

**Categoría:** Herramientas
**Idioma principal:** Español (Latinoamérica)
**Política de privacidad:** https://vr.ar/extension-privacidad

**Descripción detallada**
```
¿Ese juego de VR funciona en tu visor?

Estás leyendo una nota sobre un juego de realidad virtual, o mirando su página en
Steam, y aparece la duda de siempre: ¿esto funciona en el visor que tengo?

VR.AR te contesta sin que tengas que buscar nada. Se elige el visor una sola vez y,
cuando una página menciona un juego del catálogo, aparece una tarjeta pequeña abajo
a la derecha con la respuesta.

CÓMO FUNCIONA

• En Steam y PlayStation Store funciona apenas se instala.
• En cualquier otra página —blogs, notas, reseñas, foros— funciona si se activa el
  acceso desde el botón de la extensión. La decisión es del usuario.
• Si no detecta ningún juego, no aparece nada. No molesta.

QUÉ TE DICE

• Si funciona nativo en tu visor, y en qué tienda está.
• Si funciona pero requiere una PC (PC VR), incluida la vía del adaptador de PS VR2.
• Si no funciona, y en qué plataformas sí está.
• Si todavía no verificamos ese juego con tu modelo, lo dice en vez de inventar una
  respuesta.

VISORES SOPORTADOS

Meta Quest 3, Quest 3S y Quest 2, PlayStation VR2, PICO 4 y PICO 4 Ultra,
Valve Index y HTC Vive.

HONESTIDAD

El catálogo tiene 91 juegos, verificados plataforma por plataforma. No están todos
los que existen, y por eso importa lo siguiente: cuando no tenemos el dato, la
extensión lo dice en vez de inventar una respuesta. La coincidencia de títulos
también es estricta, así que "War Thunder Mobile" no se confunde con "War Thunder".

PRIVACIDAD

Todo ocurre en tu navegador. No hay cuentas, ni analítica, ni historial, ni envío de
datos a ningún servidor. Solo se guarda, en tu propio equipo, el visor elegido.

Hecha por VR.AR (https://vr.ar), un sitio independiente y gratuito sobre realidad
virtual en español.
```

---

## Justificaciones que pide Google

**Propósito único (single purpose)**
```
Mostrar información de compatibilidad entre juegos de realidad virtual y el visor
que el usuario tiene, sobre las páginas que mencionan esos juegos.
```

**Permiso `storage`**
```
Guardar la preferencia del usuario: qué visor eligió, si quiere ver la tarjeta
automáticamente, y en qué sitios pidió no verla. No se guarda ningún otro dato.
```

**Permiso `scripting`**
```
Registrar el script de contenido en los sitios para los que el propio usuario
concedió permiso desde el botón de la extensión. Sin esa concesión, no se registra
en ningún sitio adicional.
```

**Permisos de host (opcionales, `http://*/*` y `https://*/*`)**
```
Detectar menciones de juegos de VR en páginas que no son tiendas —blogs, notas,
reseñas, foros— para poder mostrar la compatibilidad ahí. Son opcionales: la
extensión se instala sin ellos y solo se piden si el usuario pulsa "Activar en todos
los sitios". El contenido de la página se analiza localmente y nunca se
transmite.
```

**Declaración de uso de datos:** no marcar ninguna categoría. La extensión no
recolecta ni transmite datos de usuario. Sí corresponde tildar las tres
declaraciones de cumplimiento (no vender datos, no usarlos para fines ajenos al
propósito único, no usarlos para evaluar solvencia).

---

## Capturas

Mínimo una, hasta cinco, de 1280×800. Las que preparamos muestran, en este orden:

1. La tarjeta abierta sobre una nota de blog (el caso que mejor explica la idea).
2. La píldora pequeña sin abrir, para que se vea que no invade.
3. La tarjeta sobre una ficha de Steam.
4. El popup con el selector de visor y el botón de activación.

Además hay dos imágenes promocionales, ambas **opcionales**:

- `promo-440x280.png` — mosaico pequeño, se ve en las listas de la tienda.
- `marquesina-1400x560.png` — solo se usa si Google decide destacar la extensión
  en la portada. No hace falta para publicar.

Las medidas se validan exactas: si el archivo mide el doble (pasa al capturar en
pantalla retina), la tienda lo rechaza.

---

## Si el botón "Enviar a revisión" está deshabilitado

Casi nunca es por las imágenes promocionales, que son opcionales. Por orden de
frecuencia:

1. **Pestaña "Prácticas de privacidad" incompleta.** Es la causa número uno. Hay
   que completar el propósito único, **una justificación por cada permiso**
   (`storage`, `scripting` y los de host), y tildar las declaraciones de uso de
   datos. Los textos están más arriba en este documento.
2. **Correo del editor sin verificar**, en la pestaña Cuenta.
3. **Falta elegir visibilidad y países** en Distribución.
4. **Falta alguna captura**: se necesita al menos una de 1280×800.
5. El ícono de 128×128, que en nuestro caso ya viene en el manifest.

El panel marca en rojo las pestañas incompletas, pero a veces hay que entrar a
cada una para ver qué campo falta.

---

## Antes de cada publicación

1. Subir la versión en `extension/manifest.json`.
2. Anotar el cambio en `extension/README.md`.
3. Verificar: cargar descomprimida en `chrome://extensions`, revisar que no haya
   errores, y probar una tienda y un blog.
4. Si cambió la cantidad de juegos, **actualizar el número en la descripción
   detallada** (dice "El catálogo tiene 91 juegos").
5. Empaquetar en zip **el contenido** de `extension/`, no la carpeta que lo contiene.
6. Subir al panel de desarrollador y completar **todas las pestañas**: Ficha de
   Store, Prácticas de privacidad y Distribución. El botón de enviar solo se
   habilita cuando las tres están completas y guardadas, y el panel no siempre
   deja claro cuál falta. Guardar el borrador antes de cambiar de pestaña.
7. Enviar a revisión. Suele tardar de un día a dos semanas.

## Qué esperar después de enviar

- **Si aprueban:** llega un mail y la extensión aparece en la tienda en unas horas.
  Ahí recién tiene sentido anunciarla (página en vr.ar, Product Hunt, comunidades).
- **Si rechazan:** el mail dice el motivo con un código de política. Casi siempre
  se arregla con un texto, no con código. Los motivos habituales para una
  extensión como esta serían una justificación de permisos poco clara o una
  descripción que prometa más de lo que hace. Se corrige y se reenvía; la segunda
  revisión suele ser más rápida.
- **Las actualizaciones posteriores** se revisan bastante más rápido que el primer
  envío, que es la razón por la que convino publicar temprano en vez de esperar a
  tener el catálogo perfecto.

## Criterio de idioma

La extensión usa **español neutro**, sin voseo ni giros rioplatenses. Es una
decisión deliberada y distinta a la del sitio: en vr.ar el voseo es identidad
editorial, pero la extensión es una herramienta que aparece sobre páginas ajenas,
en un momento de duda práctica, y la usa cualquier hispanohablante. Al escribir
textos nuevos, evitar las formas conjugadas de segunda persona ("necesitás",
"activá", "elegí"); el posesivo "tu" sí es universal y se puede usar.

## Cosas aprendidas

- Los permisos amplios pedidos al instalar espantan usuarios. Por eso el acceso a
  toda la web es opcional y se pide con un gesto del usuario.
- La interfaz va dentro de un Shadow DOM. Sin eso, el CSS de cada blog rompe la
  tarjeta y nuestros estilos ensucian la página ajena.
- Un dato de compatibilidad equivocado es peor que no tener el dato: la extensión
  distingue explícitamente "no funciona" de "no lo verificamos".
