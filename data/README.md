# data/ — Fuente única de la verdad

Esta carpeta es **el único lugar donde vive cada dato** de los headsets. El
script `build.py` (en la raíz) lee estos archivos y regenera los bloques
marcados con `AUTOGEN` en el código del sitio. El sitio sigue siendo 100%
estático (HTML/CSS/JS) servido por Cloudflare Pages — no hay backend ni base
de datos.

## Cómo cambiar un precio (o cualquier dato)

1. Editá el archivo del headset en `data/headsets/<id>.json`.
2. Corré `python3 build.py`.
3. Commiteá. Cloudflare Pages publica solo.

Antes, cambiar un precio exigía editarlo a mano en varios lugares de `app.js`
e `index.html`, en dos idiomas. Ahora se edita **una vez**.

## Estructura

```
data/
  headsets/<id>.json   ← una entidad por headset (la fuente única)
  site.json            ← orden de aparición de los headsets (decisión editorial)
```

### Campos de un headset

| Campo                  | Para qué sirve                                              |
|------------------------|------------------------------------------------------------|
| `id`                   | clave interna (= nombre del archivo)                       |
| `product_id`           | slug usado en el dato estructurado (`#product-<product_id>`) |
| `name`, `brand`        | nombre y marca                                             |
| `nickname.{en,es}`     | apodo mostrado en el Finder                                |
| `price.label`          | precio que ve el usuario (texto libre)                     |
| `price.amount`/`currency` | precio numérico para Google (dato estructurado)         |
| `desc.{en,es}`         | descripción larga del Finder                              |
| `schema_description`   | descripción corta para el dato estructurado               |
| `commerce.url`         | link de afiliado                                          |
| `commerce.link_note` / `btn_label` | textos opcionales del botón (solo algunos headsets) |
| `image`                | foto del producto                                         |

> Los datos neutrales de idioma (precio, links, imagen) se guardan **una sola
> vez**. Solo las descripciones y apodos tienen versión `en` y `es`, lado a
> lado, para que nunca se desincronicen entre idiomas.

## build.py

```
python3 build.py          # regenera los bloques AUTOGEN en su lugar
python3 build.py --check   # valida sin escribir; falla si algo quedó desactualizado
```

`build.py` valida antes de escribir: que cada headset tenga imagen, precio
numérico, ambos idiomas, y que el orden en `site.json` coincida con los
archivos existentes. Si algo falla, no escribe nada (el sitio nunca se rompe
por un error del generador).

**Estado actual (Fase 1):** `build.py` genera el objeto `HEADSETS` de
`assets/js/app.js`. La lógica del Finder (preguntas, puntajes, render) no se
toca: solo recibe estos datos. Fases siguientes agregarán la generación del
dato estructurado (JSON-LD), el FAQ, el sitemap y los `hreflang`.
