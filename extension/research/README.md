# Investigación de plataformas

Cada archivo es el resultado de verificar, juego por juego, en qué plataformas de
VR está disponible. Se guardan acá para que una futura actualización sepa **qué se
verificó y cuándo**, en vez de tener que rehacer todo.

Formato por juego:

```json
{ "title": "Beat Saber", "on": ["quest","steam","psvr2"], "off": ["pico"],
  "nota": "en qué se basó la verificación" }
```

- `on`: verificado que **está** disponible ahí.
- `off`: verificado que **no** está.
- Lo que no figura en ninguna de las dos queda **desconocido**, y la extensión
  responde "sin datos" en vez de inventar.

Para aplicarlos al catálogo:

```bash
node tools/apply-game-research.mjs extension/research
```

El script informa cobertura y avisa si algún juego declara una plataforma en `on`
y `off` a la vez.

**Verificado en agosto de 2026.** Conviene revisarlo una vez al año: los juegos
suman plataformas con el tiempo (varios llegaron a PSVR2 o PICO años después de
su lanzamiento original).
