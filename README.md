<p align="center">
  <img src="./termoprop-logo.svg" alt="TermoProp Logo" width="100"/>
</p>

# TermoProp

<p align="center">
  <strong>El copiloto comercial del agente inmobiliario.</strong><br/>
  Dashboard de temperatura de cartera que cruza datos de ZonaProp con el CRM Tokko Broker para decirte, de un vistazo, qué propiedades están a punto de cerrarse y cuáles necesitan intervención urgente.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/AI-Claude%20Haiku-FF5A00" alt="Claude Haiku"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"/>
</p>

---

## 📋 Tabla de contenidos

1. [Equipo](#-equipo)
2. [El problema](#-el-problema)
3. [La solución](#-la-solución)
4. [Por qué la IA no es decorativa](#-por-qué-la-ia-no-es-decorativa)
5. [Stack tecnológico](#-stack-tecnológico)
6. [Arquitectura](#-arquitectura)
7. [Cómo correrlo](#-cómo-correrlo)
8. [Limitaciones conocidas](#-limitaciones-conocidas)
9. [Próximos pasos](#-próximos-pasos)
10. [Aplicabilidad en QuintoAndar / ZonaProp / Tokko](#-aplicabilidad-en-quintoandar--zonaprop--tokko)
11. [Demo](#-demo)
12. [AI Usage](#-ai-usage)

---

## 👥 Equipo

| Nombre | Rol |
|---|---|
| **Socrates Antonio Clinis Jimenez** | Senior Engineering Manager |
| **Iara Cristina Help** | Software Engineer |
| **Julieta Roizen** | Product Designer |
| **Sofia Alejandra Lax** | Product Support Analyst |

🔗 [Repositorio en GitHub](https://github.com/sclinis/hackathon-equipo1)

---

## 🚨 El problema

**Falta de trazabilidad, visibilidad unificada y diagnóstico predictivo en el pipeline de conversión inmobiliaria.**

**Sistemas afectados:** Portales de Clasificados (ZonaProp) y CRM Tokko Broker.

**¿A quién le pasa?** A los clientes inmobiliarios —corredores, martilleros y agencias— que publican en ZonaProp y/o utilizan Tokko Broker.

**¿Qué les pasa?** Tras publicar un aviso, el cliente experimenta un "bache" de información y siente que opera a ciegas. No existe un indicador predictivo que le permita entender de un vistazo qué propiedades están verdaderamente cerca de concretarse y cuáles están estancadas en el fondo del funnel.

**¿Cómo se resuelve hoy y por qué no alcanza?** En ZonaProp y Tokko existe un panel con estadísticas básicas de exposición, visualizaciones y consultas. Sin embargo, esta información vive separada de la gestión operativa real del CRM (visitas presenciales) y se muestra aviso por aviso. Para cruzarlas, el usuario debe entrar manualmente uno por uno, perdiendo la visión macro de su cartera. No existe un ranking centralizado ni una ponderación inteligente que priorice dónde el equipo comercial debe enfocar sus esfuerzos diarios.

### Evidencia y validación

Este problema fue identificado como uno de los *pains* más recurrentes entre usuarios detractores durante el YTD 2026, y aparece como subtexto principal detrás de los reclamos por bajo retorno de inversión.

> 💬 **Argentina:** *"Me da la impresión que tengo muy poca visibilidad de mis avisos."*

> 💬 **Perú:** *"Sigo apostando aunque los resultados no son satisfactorios."*

> 💬 **Ecuador:** *"Cero retroalimentación, o muy poca retroalimentación."*

> 💬 **Panamá:** *"No vamos a renovar el servicio... no cumplieron con lo contratado."*

**Alcance:** Transversal a toda la operación de Latinoamérica.

---

## 💡 La solución

**TermoProp** es un panel de análisis dinámico integrado que fusiona el comportamiento de los portales de clasificados (ZonaProp) con el ciclo operativo del CRM (Tokko Broker). A través de una interfaz interactiva y un motor de scoring dinámico, centraliza toda la cartera de una inmobiliaria en un panel unificado de control de temperatura comercial.

### El Hot Score

El corazón del sistema es el **Hot Score**: un indicador inteligente que clasifica automáticamente cada aviso en tres estados críticos de conversión:

| Estado | Criterio | Acción |
|---|---|---|
| 🔥 **Muy Caliente** (score ≥ 70) | Alta probabilidad de cierre inminente | Atención inmediata |
| 🌡️ **Templado** (score 35–69) | Interés intermedio, requiere reactivación | Acelerar respuesta |
| ❄️ **Frío** (score < 35) | Aviso estancado | Reestrategia urgente |

### ¿Qué hace el producto exactamente?

- **Centralización y ranking automático:** ordena toda la oferta en base a un índice compuesto por volumen de consultas, aceleración del interés (periodicidad y ritmo de consultas recientes) y eventos físicos de Tokko (visitas presenciales).
- **Comparables históricos:** cada aviso se compara contra operaciones realmente cerradas con características similares (tipo, operación, precio/m²), mostrando si va adelante o atrás del ritmo típico de cierre.
- **Resumen ejecutivo con IA:** al abrir el dashboard, Claude Haiku analiza toda la cartera y genera las 3 acciones de mayor impacto inmediato que el agente debería tomar ese día.

### ¿Qué lo diferencia de lo que ya existe?

La magia radica en la **democratización del embudo cruzado**: logramos que los datos que históricamente vivían en silos técnicos inconexos (tráfico web vs. agenda del corredor) conversen en una sola métrica de negocio ultra-visible. Una pequeña variación en la frecuencia de consultas recientes (ritmo) es capaz de predecir una visita y/o reserva.

---

## 🤖 Por qué la IA no es decorativa

Si se quitara la capa de Inteligencia Artificial, el sistema se reduciría a una simple planilla de cálculos o a un promedio matemático estático. **La IA es la que transforma datos crudos e inconexos en estrategias comerciales personalizadas.**

**1. Análisis de ritmo y anomalías temporales**
En lugar de solo sumar consultas históricas, el modelo analiza la aceleración del interés. Una propiedad con 10 consultas en las últimas 24 horas es clasificada como más caliente que una con 50 consultas distribuidas a lo largo de 3 meses. Implementar esto sin IA requeriría reglas lógicas infinitas y difíciles de mantener.

**2. Copiloto de recomendación generativa (LLM)**
En el banner superior del dashboard, Claude Haiku analiza el portafolio completo y genera sugerencias accionables como:
> *"El aviso tiene visitas web pero la conversión a consulta es baja. Revisar la calidad de la foto de portada o ajustar el precio un 3% en base a la zona."*

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16, React 18, Styled Components |
| **Lógica de scoring** | JavaScript (algoritmo de comparables, ponderación 4 variables) |
| **AI / Modelos** | Claude Haiku (`claude-haiku-4-5`) vía Anthropic API |
| **Dataset** | `listings.json` (90 avisos reales ZonaProp) + `historical_closings.json` (110 operaciones cerradas) |
| **Infra / Deploy** | Export estático (`next export`) — abre directo como `index.html`, sin servidor |

---

## 📐 Arquitectura

El sistema opera mediante tres capas bien definidas:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FUENTES DE DATOS                         │
│   listings.json (90 avisos)   historical_closings.json (110 op) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CAPA DE SCORING Y PREDICCIÓN (Motor Core)          │
│                                                                 │
│  findComparables()  →  getBenchmarks()  →  calcScore()          │
│  (tipo + op + precio/m²)   (mediana pool)   (4 variables × w)   │
│                                                                 │
│  Peso: ritmo consultas 30% · volumen 25% · visitas 25% · freq 20%│
│  × factor de decaimiento temporal                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
           ┌─────────────┴──────────────┐
           ▼                            ▼
┌──────────────────┐          ┌─────────────────────┐
│  HOT SCORE       │          │  ANTHROPIC API       │
│  heat: 🔥/🌡️/❄️ │          │  Claude Haiku        │
│  Rank por cartera│          │  → 3 acciones del día│
└──────────────────┘          └─────────────────────┘
           │                            │
           └─────────────┬──────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN (Next.js / React)             │
│                                                                 │
│  HeatCards  ·  PropertyTable  ·  PropertyModal  ·  AIBanner    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Cómo correrlo

### Requisitos previos

- Node.js v18.0 o superior
- npm instalado
- Una API key de Anthropic ([obtenerla acá](https://console.anthropic.com))

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-organizacion/termoprop.git
cd termoprop

# Instalar dependencias
npm install
```

### Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=tu_api_key_de_anthropic_aqui
```

### Desarrollo local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build y versión estática

```bash
npm run build
```

El output queda en `out/`. Abrir `out/index.html` directamente en el navegador — no requiere servidor.

---

## ⚠️ Limitaciones conocidas

- **Prototipo de hackathon (1 día):** no está preparado para carga productiva.
- **Datos en memoria:** los avisos se cargan desde archivos JSON estáticos; se reinician al recargar. En producción se reemplazarían por webhooks reales de ZonaProp y Tokko.
- **Normalización ARS/USD:** el scoring no convierte automáticamente entre monedas para el cálculo de comparables cross-currency. Las propiedades en USD y ARS se comparan dentro de su propio segmento.
- **API key en cliente:** la key de Anthropic vive en el frontend (header `anthropic-dangerous-direct-browser-access`). En producción debería pasar por un backend proxy.

---

## 🎯 Próximos pasos

1. **Conexión con webhooks reales:** sustituir los JSON estáticos por conexiones a las APIs de producción de Tokko y ZonaProp.
2. **Alertas por WhatsApp/Slack:** notificar al agente cuando un aviso pase a estado Frío o entre una oferta que requiera respuesta en menos de 24 horas.
3. **Fórmula auto-ajustable:** hacer que el modelo aprenda de las transacciones efectivamente cerradas para auto-configurar los pesos del algoritmo sin intervención manual.
4. **Normalización cross-currency:** calcular conversión ARS/USD en tiempo real para comparables entre segmentos de precio mixtos.

---

## 🚀 Aplicabilidad en QuintoAndar / ZonaProp / Tokko

**¿Dónde encaja?**
- Como extensión nativa dentro del **Panel de Control del Cliente en ZonaProp Pro**.
- Embebido en la sección de difusión de **Tokko Broker** dentro del portal ZonaProp.
- Como card en el **dashboard de Tokko**: al iniciar el día, el agente ve qué propiedades están Muy Calientes y a qué clientes llamar primero.

**¿Qué problema operativo resuelve?**
- **Reducción de churn:** ataca directamente la insatisfacción y bajas de contrato al eliminar la sensación de "cero retroalimentación".
- **Productividad comercial:** actúa como copiloto del agente, priorizando los avisos de mayor probabilidad de cierre.

**Equipo natural para continuarlo:** Integraciones de Producto (Cross-Portal Experience) o la tribu de B2B Core & CRM Capabilities.

---

## 🎬 Demo

> 📹 El video demo se encuentra en la carpeta raíz del Google Drive del proyecto.

*(Agregar capturas de pantalla del dashboard aquí)*

```
screenshots/
  dashboard-overview.png    ← vista general con HeatCards
  property-modal.png        ← modal detallado con Hot Score y comparables
  ai-banner.png             ← banner de acciones inmediatas generado por IA
```

---

## 🤖 AI Usage

Para ver el desglose de prompts utilizados y la documentación sobre cómo implementamos los modelos de lenguaje durante el desarrollo, ver [`AI_USAGE.md`](./AI_USAGE.md).
