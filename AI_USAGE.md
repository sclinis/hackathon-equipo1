# AI Usage — TermoProp

Este doc no es una lista de prompts. Queremos ver cómo el equipo arquitecturó el uso de IA: qué patrones eligieron, qué infra construyeron alrededor, dónde dejaron de tratar al modelo como un autocomplete y empezaron a tratarlo como un componente del sistema.

---

## Stack de IA

| Capa | Qué usamos | Por qué eso y no otra cosa |
| :---- | :---- | :---- |
| Modelos | Claude Haiku (`claude-haiku-4-5`) en runtime; Claude Sonnet 4.6 para desarrollo | Haiku para el banner de insights: latencia baja y costo mínimo para análisis de portfolio en cada carga. Sonnet para desarrollo: razonamiento más profundo para arquitectura y algoritmos complejos |
| IDE / agentic coding | Claude Code (Cowork) en loop completo durante toda la hackathon | Permitió iterar sobre componentes, algoritmos y datos sin salir del contexto del proyecto. El agente mantenía estado entre cambios y podía leer/editar/buildear de forma autónoma |
| Orquestación / agents | Claude Agent SDK (base de Cowork) — single agent con tools de filesystem y shell | No necesitamos multi-agent: el scope era acotado y un agente con acceso a archivos y bash fue suficiente para todo el ciclo build → test → deploy |
| MCPs usados | File tools (Read/Write/Edit), Bash (build, rsync, Node scripts) | Necesitábamos acceso real al filesystem para generar código, transformar datos JSON, correr builds de Next.js y sincronizar al workspace del usuario |
| Skills custom | Ninguna construida para esta hackathon | El flujo fue lo suficientemente lineal como para no necesitar encapsulamiento en skills |
| RAG / búsqueda | No aplicó | Los datos del portfolio (90 avisos, 110 operaciones cerradas) caben en el context window de una llamada. Sin necesidad de retrieval |
| Evals / testing de IA | Validación manual del output JSON + regex fallback en código | En hackathon de 1 día priorizamos velocidad. El guardrail de extracción por regex cubre el caso más común de fallo |
| Observabilidad | Ninguna formal — console.error en el cliente | Limitación conocida para MVP |

---

## Arquitectura del uso de IA

### IA en el producto (runtime)

**Flujo que dispara la llamada:**
El componente `AIInsightsBanner` hace la llamada a Claude Haiku al montar (hook `useEffect`), y también cuando el usuario presiona "↺ Actualizar". Es una llamada directa desde el browser a `https://api.anthropic.com/v1/messages` usando el header `anthropic-dangerous-direct-browser-access: true`.

**Context que recibe el modelo:**
```
System: rol de analista inmobiliario especializado en mercado argentino (CABA y GBA)
User:   portfolio completo como JSON (90 propiedades) con los campos:
        id, titulo, tipo, op, heat, score, consultas, visitas, favoritos,
        diasPublicado, diasSinActividad, consultasPorSemana, quality, plan
        + definiciones de heat levels y quality score
        + instrucción de qué priorizar (consultas urgentes, hot cerrables esta semana,
          problemas críticos de calidad/precio)
```

**Tools disponibles:** ninguna. Es una llamada single-turn sin tools — el modelo solo genera texto.

**Qué decide el modelo vs qué está hardcodeado:**

| Decisión | Quién la toma |
|---|---|
| Qué 3 propiedades merecen acción inmediata | Claude Haiku |
| Qué tipo de acción recomendar (bajar precio, responder consultas, mejorar fotos) | Claude Haiku |
| El Hot Score numérico de cada aviso | Algoritmo determinístico de comparables (no IA) |
| Clasificación hot/warm/cold | Umbrales fijos (≥70, 35-69, <35) |
| Qué propiedades comparables usar para el benchmark | Algoritmo de cascade matching (no IA) |

**Diagrama del flujo runtime:**

```
Browser load
     │
     ▼
buildPrompt(properties[90])
     │  serializa portfolio como JSON
     ▼
POST api.anthropic.com/v1/messages
     │  model: claude-haiku-4-5
     │  max_tokens: 700
     │  temperature: default (no se fijó — ver decisiones)
     ▼
response.content[0].text
     │
     ├─ match(/\{[\s\S]*\}/)  ← extracción defensiva de JSON
     │
     ▼
JSON.parse → insights[3]
     │  { prioridad, emoji, accion, detalle, impacto, propiedadId }
     ▼
Render InsightRow × 3 con animación fadeIn
```

### IA en el proceso de desarrollo

Todo el desarrollo ocurrió dentro de una sesión de Claude Code (Cowork). El flujo fue:

1. **Humano define el qué** — "quiero un dashboard de temperatura de cartera con estos campos", "el popup quedó muy ancho, revertilo", "levantá los datos del JSON real"
2. **Agente ejecuta el cómo** — lee los archivos existentes, decide qué cambiar, edita, buildea con `npm run build`, verifica que compile, sincroniza al workspace con `rsync`
3. **Humano revisa el resultado** — abre el `index.html`, reporta lo que no le gustó
4. **Loop hasta satisfacción**

El agente mantenía el estado del proyecto completo en contexto (estructura de archivos, componentes, algoritmos) y podía razonar sobre efectos secundarios antes de editar. Por ejemplo, cuando se reemplazaron las fotos de Unsplash por las del CDN de ZonaProp, el agente detectó que `photos.js` era el punto de acoplamiento y propuso mover la foto al objeto de la propiedad directamente, eliminando la indirección.

**División del trabajo:**

| Tarea | Humano | Agente |
|---|---|---|
| Decisiones de producto (qué mostrar, cómo priorizar) | ✅ | |
| Arquitectura del algoritmo de scoring | 🤝 debate | 🤝 implementación |
| Código de componentes React/Styled Components | | ✅ |
| Transformación de datos JSON (90 listings → schema app) | | ✅ |
| Generación del dataset de operaciones cerradas (110 registros) | | ✅ |
| Diseño del prompt para Claude Haiku | 🤝 criterios | 🤝 redacción |
| QA visual / feedback de UX | ✅ | |
| Build, rsync, deploy estático | | ✅ |

---

## Patrones avanzados que usamos

- [x] **Structured outputs** — El prompt de `AIInsightsBanner` termina con instrucción explícita: *"Respondé ÚNICAMENTE con este JSON (sin texto adicional, sin markdown, sin bloques de código)"* más el schema exacto hardcodeado. Como fallback, el código usa `text.match(/\{[\s\S]*\}/)` para extraer el JSON aunque el modelo lo envuelva en texto.

- [x] **Context engineering** — El context window del banner de IA está diseñado en capas: (1) rol del modelo, (2) datos del portfolio como JSON estructurado, (3) definiciones explícitas de los campos (qué es `heat`, qué es `quality`, qué es `diasSinActividad`), (4) instrucción de tarea con criterios de priorización, (5) schema de output. Cada capa reduce la ambigüedad de la siguiente.

- [x] **Human-in-the-loop** — Todo el ciclo de desarrollo tuvo al humano revisando cada cambio antes del siguiente. El agente nunca hizo push a producción ni modificó datos críticos sin confirmación explícita. La API key fue gestionada exclusivamente por el humano (el agente nunca la vio ni la escribió).

- [x] **Routing entre modelos** — Sonnet 4.6 para razonamiento en desarrollo (arquitectura, algoritmos, transformación de datos complejos); Haiku para el componente runtime de la app (análisis repetitivo de portfolio, latencia visible para el usuario). La elección fue consciente: Haiku puede analizar un portfolio de 90 propiedades con criterios bien definidos en el prompt, y lo hace en ~2 segundos vs los ~6-8 de Sonnet.

- [x] **Determinismo / temperature control** — El algoritmo de Hot Score es 100% determinístico (comparables → benchmark → score numérico). La IA solo entra en la capa de *recomendación narrativa*, donde cierta variación en el output es aceptable y hasta deseable. No se usó `temperature: 0` para el banner porque la variabilidad entre cargas da sensación de análisis "vivo".

- [x] **Tool use / function calling** — Durante el desarrollo, el agente usó tools de filesystem (Read/Write/Edit) y shell (Bash) para operar sobre el proyecto real: leer componentes antes de editarlos, correr `npm run build` para verificar compilación, ejecutar scripts Node para transformar los 90 listings del JSON real, sincronizar con rsync al workspace del usuario.

---

## Decisiones de arquitectura

**Decisión 1: IA solo para insights narrativos, scoring 100% determinístico**

El primer instinto fue usar Claude para calcular el Hot Score de cada propiedad en runtime. Se descartó.

- **Alternativas descartadas:** llamar a Claude por cada propiedad al cargar (90 llamadas), o hacer una llamada con todos los avisos y pedir scores numéricos
- **Por qué no:** latencia inaceptable (90 llamadas en paralelo), costo por cada carga de página, no-determinismo (el mismo aviso puede tener scores distintos en cargas distintas), y fundamentalmente: el modelo no agrega valor real calculando un número que un algoritmo de comparables hace mejor y más explicable
- **Trade-off asumido:** el insight de texto del banner puede variar entre cargas (feature, no bug), pero el score siempre es el mismo para los mismos datos

**Decisión 2: Export estático — sin servidor**

La app se buildea como HTML/CSS/JS puro (`next export`), sin Node.js en runtime.

- **Alternativas descartadas:** deploy en Vercel/Netlify con SSR, server local con Express
- **Por qué:** para una hackathon de 1 día, el criterio fue "que funcione en cualquier máquina abriendo un archivo". El jurado puede abrir `out/index.html` sin instalar nada. También elimina la superficie de fallo de un servidor
- **Trade-off asumido:** la API key de Anthropic queda expuesta en el cliente. Es una limitación conocida y documentada; en producción pasaría por un proxy backend

**Decisión 3: Llamada a la API de Anthropic directamente desde el browser**

Usando el header `anthropic-dangerous-direct-browser-access: true` en lugar de un backend intermediario.

- **Alternativas descartadas:** API route de Next.js como proxy, serverless function
- **Por qué:** consistente con la decisión de export estático. No hay servidor, no puede haber proxy. El header está documentado por Anthropic para exactamente este caso de uso (prototipos/demos)
- **Trade-off asumido:** la key queda en el bundle. Aceptable para MVP de hackathon, inaceptable para producción

**Decisión 4: Dataset de comparables sintético generado por IA, no hardcodeado**

Las 110 operaciones cerradas en `historical_closings.json` fueron generadas por un script Node.js escrito por el agente, con distribuciones realistas por barrio, tipo, precio/m² y métricas de actividad.

- **Alternativas descartadas:** hardcodear 38 registros manualmente (versión anterior), usar datos reales de cierre (no disponibles en hackathon)
- **Por qué:** el dataset sintético permite cubrir todos los segmentos necesarios para que el algoritmo de comparables funcione con los 90 avisos reales. 110 registros con distribución correcta es mejor que 38 cubriendo solo algunos tipos
- **Trade-off asumido:** los datos no son reales. En producción se reemplazarían por operaciones efectivamente cerradas de la base de Tokko

---

## Context engineering

El prompt del banner de IA está diseñado para minimizar alucinaciones y maximizar actionabilidad:

**System prompt (estable):** define el rol como analista inmobiliario especializado en mercado argentino (CABA/GBA). Es estable porque no cambia entre llamadas.

**User message (dinámico):** se construye con `buildPrompt(properties)`:
1. Número de propiedades en cartera (ancla el scope)
2. Portfolio como JSON compacto (solo los campos relevantes para el análisis, no todos)
3. Definiciones explícitas de `heat`, `quality`, `diasSinActividad` — porque el modelo no puede asumir que conoce nuestras convenciones internas
4. Tarea con criterios de priorización ordenados por importancia
5. Schema de output exacto con un ejemplo relleno — esto redujo drásticamente los fallos de formato

**Truco no obvio descubierto en la hackathon:** incluir el schema de output con valores de ejemplo (no solo tipos) hizo que el modelo respetara los límites de caracteres (`max 75 chars` para `accion`) mucho más consistentemente que solo describirlos en texto.

**Manejo de context largo:** los 90 avisos caben cómodamente en el context de Haiku (~3.000 tokens de input). No hubo necesidad de truncar ni resumir. Si el portfolio creciera a 500+ avisos, habría que pre-filtrar a los top N más relevantes antes de enviar.

---

## Failure modes

**¿Qué tipo de input rompe el sistema?**
- Portfolio vacío o con un solo aviso: el algoritmo de comparables hace fallback a benchmarks globales, pero el banner de IA puede generar insights poco relevantes si no tiene variedad suficiente para comparar
- API key inválida o vencida: el banner muestra el mensaje de error, el resto del dashboard funciona normalmente (la IA es un enhancement, no el core)

**Guardrails implementados:**
- Extracción defensiva de JSON con regex: `text.match(/\{[\s\S]*\}/)` — captura el JSON aunque el modelo lo envuelva en explicaciones
- `JSON.parse` dentro de try/catch: si el parse falla, se muestra el mensaje de error en el banner sin romper la app
- El Hot Score tiene `clamp(score, 2, 100)` — nunca devuelve 0 ni >100 aunque las entradas sean atípicas

**Caso de "confianza incorrecta":** en iteraciones tempranas del prompt, el modelo a veces identificaba una propiedad de Puerto Madero (precio/m² alto) como "precio por encima del mercado" cuando en realidad ese segmento tiene precios normalmente más altos. Se corrigió agregando la definición de `precioM2` al contexto y aclarando que la comparación debe hacerse dentro del mismo segmento.

---

## Lo que probamos y descartamos

**Scoring con IA por propiedad:** el primer approach fue pedirle al modelo que evalúe cada aviso individualmente. Se descartó a los 15 minutos: no-determinismo, latencia, costo y — lo más importante — el modelo no tiene acceso al benchmark de comparables históricos que es la pieza clave del score. Un número calculado sin ese contexto es arbitrario.

**Prompt sin schema de output explícito:** el primer prompt pedía "devolvé un JSON con los insights". El modelo devolvía JSONs válidos pero con estructuras variadas (a veces arrays, a veces objetos, a veces con campos extra). Agregar el schema hardcodeado con ejemplo resolvió el problema casi completamente.

**Llamada al montar + polling cada 5 minutos:** se evaluó refrescar el banner automáticamente. Se descartó porque genera costo recurrente y la información del portfolio no cambia en tiempo real en este MVP. El botón manual "↺ Actualizar" es suficiente y más honesto con el usuario.

---

## Métricas (estimadas)

- Código generado por IA y dejado tal cual: ~75%
- Código generado por IA y editado por humano: ~20%
- Código escrito a mano: ~5%
- Tiempo ahorrado total estimado: **~12x** (el MVP habría tomado 3-4 días de desarrollo; se completó en ~4 horas de hackathon)

---

## Aprendizajes

**1. Separar scoring determinístico de narrativa generativa**
La tentación en una hackathon es usar el LLM para todo. El aprendizaje real fue identificar exactamente dónde agrega valor y dónde lo resta. Para métricas numéricas reproducibles (el Hot Score), un algoritmo de comparables es más confiable, más rápido, más barato y más explicable. Para síntesis narrativa accionable sobre patrones del portfolio completo, el LLM es insuperable. Esa línea vale oro en producción.

**2. El context engineering es la diferencia entre un prototipo y un feature**
Agregar definiciones explícitas de los campos, criterios de priorización ordenados y un schema de output con ejemplo transformó un modelo que a veces fallaba en uno que falla raramente. No fue magia — fue trabajo de prompt engineering que tomó varios intentos. La lección: tratar el prompt como código de producción, no como un texto ad-hoc.

**3. El agente de desarrollo vale más como pair programmer que como autocomplete**
El mayor valor de Claude Code en la hackathon no fue generar código rápido — fue mantener coherencia en todo el sistema mientras se iteraba. Cuando se cambió el schema de propiedades para usar datos reales, el agente detectó automáticamente todos los componentes que usaban el schema anterior y los actualizó consistentemente. Eso en un equipo humano hubiera sido una reunión de coordinación.
