# Directorio de estudios XR — el plan

> Escrito el 24 de octubre de 2026, cuando Daniel eligió este camino de ingresos sobre
> los afiliados. Igual que en `docs/METRICAS.md`, los criterios de cada fase quedan
> fijados **antes** de tener los números, para no leerlos a conveniencia después.

## La idea

Un directorio en español de los estudios que hacen realidad virtual y aumentada **para
empresas**, en Latinoamérica y España. Va ordenado por país y por uso (eventos,
capacitación, inmobiliarias, educación, salud, industria), con cada ficha verificada a
mano.

Quien lo usa es la persona que, dentro de una empresa, tiene que contratar una
experiencia de VR o AR y no sabe a quién llamar: alguien de marketing, de recursos
humanos, una desarrolladora inmobiliaria. Y cada vez más, el asistente de IA al que esa
persona le pregunta.

## Por qué puede funcionar

Lo que se encontró al investigarlo, el 24/10/2026:

- **No existe un directorio bueno en español.** Clutch tiene listas cortas, de unas diez
  empresas por país, y buena parte son fábricas de software generales que mencionan VR
  de pasada. ensun.io es un listado armado automáticamente. Si se busca "empresas de
  realidad aumentada en Colombia" o "estudios de realidad virtual en Argentina", lo que
  aparece son notas sueltas, no listas.
- **La oferta existe, pero está dispersa.** Solo en España, la asociación INMERSIVA XR
  dice tener más de 100 socios, entre ellos más de 30 empresas. En México, Colombia,
  Argentina y Chile hay estudios activos que aparecen en notas de prensa, en Clutch o en
  sus propias webs, sin nadie que los reúna.
- **Las agencias ya pagan por conseguir clientes.** Sortlist, el marketplace de agencias
  que más fuerte está en España, cobra por oportunidad. Hay agencias que se quejan de
  pagar unos US$ 500 por una reunión que no sirvió: el modelo existe, aunque se use mal.
- **Encaja con la web de agentes.** Si alguien le pide a una IA "un estudio de realidad
  aumentada en Bogotá para un evento", la IA necesita una lista ordenada y confiable de
  dónde sacarlo. Es el mismo razonamiento del catálogo de compatibilidad, aplicado a
  empresas.
- **Cada estudio tiene el perfil de un comprador del dominio.** Ver "Relación con la
  venta", más abajo.

## Por qué puede no funcionar

- **No sabemos cuánta gente busca esto en español.** Es la incógnita principal, y no hay
  forma de despejarla sin publicar: Search Console solo mide páginas que existen. La
  fase 1 está para eso.
- **El problema del huevo y la gallina.** Sin estudios no hay visitas, y sin visitas a los
  estudios no les interesa figurar. Por eso las primeras fichas las armamos y
  verificamos nosotros, sin pedirle nada a nadie.
- **En inglés no hay lugar.** Clutch y GoodFirms dominan ese espacio. Competimos solo en
  español.
- **Hay que mantenerlo.** Los estudios cierran, cambian de nombre o de rubro. Cada ficha
  se revisa al menos dos veces por año, y la fecha de la última revisión se ve.
- **No todos pueden pagar.** Hay estudios chicos que cobran poco y en moneda local (una
  empresa de Córdoba lleva VR a eventos desde $80.000 por dos horas). El negocio, si lo
  hay, está en los que hacen proyectos a medida.

## Cómo es una ficha

- Nombre, país, ciudad y web.
- Qué hace (VR, AR, realidad mixta, 360°, captura volumétrica, eventos, desarrollo a
  medida) y para qué sectores.
- Uno a tres proyectos públicos que se puedan comprobar, con enlace.
- Fecha de la última verificación y de dónde sale cada dato.
- Solo información que la empresa publica. Nada de datos personales.

**Para entrar:** web activa y al menos un proyecto XR público en los últimos 24 meses.
Una fábrica de software que menciona "realidad virtual" en su lista de servicios, sin
nada que mostrar, no entra. Ese filtro es lo que nos diferencia de Clutch.

Los datos se publican también como archivo legible por máquina, como el catálogo.

## Fases

### Fase 0 — semilla (noviembre 2026)

Las primeras 40 fichas verificadas en los cinco mercados más grandes: México, España,
Colombia, Argentina y Chile. Se publica una página principal y una por país.

- **Solo en español.** Es una excepción a la regla del par EN/ES de
  `docs/OPERACIONES.md`, porque el público es hispanohablante. Brasil queda afuera por
  ahora: es otro idioma y otro mercado.
- Las fichas se suman en las rutinas de los lunes, además de la acción SEO de la
  semana. No cuentan para el máximo de dos pares de guías nuevas por mes.

### Fase 1 — medir sin pedir nada (diciembre 2026 a febrero 2027)

Llegar a unas 100 fichas. Sumar páginas por uso ("realidad virtual para capacitación",
"realidad aumentada para eventos") solo donde haya al menos cinco estudios que las
justifiquen. No se contacta a nadie.

**Criterio, el 1/3/2027**, con las impresiones mensuales de las páginas del directorio
en Search Console:

- **Más de 1.000:** hay demanda. Se pasa a la fase 2.
- **Entre 300 y 1.000:** hay algo. Se sigue ampliando, todavía sin contactar a nadie, y
  se vuelve a mirar en junio.
- **Menos de 300, con 100 fichas publicadas:** la búsqueda no existe en el volumen que
  hace falta. El directorio queda publicado y mantenido, porque igual le sirve al
  dominio y a quien lo encuentre, pero no se invierte más.

### Fase 2 — la relación (marzo a mayo 2027)

Se les escribe a los estudios listados para que revisen su ficha, sin costo. El
asistente redacta los mensajes y Daniel los envía desde una casilla de vr.ar.

**Criterio:** si responde al menos el 15%, hay relación, y se pasa a la fase 3. Si
responde menos, se revisa el mensaje una vez antes de concluir nada.

Antes de esta fase hace falta una casilla en vr.ar. El registro SPF que figura como
pendiente en OPERACIONES (`v=spf1 -all`) impide enviar desde el dominio: hay que
ajustarlo según el servicio que se use.

### Fase 3 — ingresos (desde junio 2027)

Se prueban dos formas, con los estudios que respondieron:

1. **Ficha destacada** por una cuota mensual baja (del orden de US$ 20 a 50).
2. **"Pedí presupuesto":** un formulario que reparte consultas de empresas entre los
   estudios que corresponden. Las primeras consultas, gratis; después, por consulta.

**Meta:** unos cientos de dólares por mes, que es lo que Daniel considera razonable.
Los precios los decide Daniel.

## Relación con la venta del dominio

- **El directorio vale por sí mismo y no es una excusa.** Una ficha nunca se usa como
  gancho para ofrecer el dominio.
- Si un estudio pregunta por el dominio, o si la relación da para hablarlo, se conversa
  aparte y con transparencia.
- Lo que el directorio aporta a la venta es mostrar el dominio funcionando para la
  industria que más lo querría, y una lista de contactos reales del sector.

## Quién hace qué

- **Asistente:** investigación, verificación, fichas, páginas, medición y borradores de
  mensajes.
- **Daniel:** aprobar el paso de cada fase, enviar los mensajes de la fase 2 y fijar los
  precios de la fase 3.

## Fuentes de la investigación inicial

- Clutch, listas de VR por país: Argentina, Colombia, México, Chile y Latinoamérica.
- TechBehemoths, AR/VR en Argentina.
- ensun.io, búsquedas de AR y VR en México.
- INMERSIVA XR, informe de la industria XR en España, 2025.
- Reseñas de Sortlist en G2 y Trustpilot.
- Infonegocios, sobre una empresa de VR para eventos de Córdoba.
- Enter.co e iProfesional, sobre estudios de Colombia y Argentina.
