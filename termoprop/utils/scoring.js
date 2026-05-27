/**
 * TermoProp Scoring — algoritmo basado en comparables históricos.
 *
 * Para cada aviso activo:
 *  1. Busca operaciones cerradas similares (mismo tipo + op + precio/m² ±30%)
 *  2. Calcula benchmarks promedio de esos comparables
 *  3. Puntúa el aviso en 4 dimensiones contra esos benchmarks
 *  4. Aplica un factor tiempo si el aviso lleva demasiado tiempo publicado
 */

// ─── helpers ─────────────────────────────────────────────────────────────────

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

// ─── comparables ─────────────────────────────────────────────────────────────

/**
 * Devuelve el pool de comparables para un aviso dado.
 * Criterio en cascada (de más a menos estricto):
 *   1. mismo tipo + op + precio/m² ±30%
 *   2. mismo tipo + op  (cualquier precio)
 *   3. mismo op          (cualquier tipo y precio)
 */
export function findComparables(listing, historical, priceTolerance = 0.30) {
  const byTipoOpPrecio = historical.filter(h =>
    h.tipo === listing.tipo &&
    h.op   === listing.op   &&
    Math.abs(h.precioM2 - listing.precioM2) / Math.max(1, listing.precioM2) <= priceTolerance
  );
  if (byTipoOpPrecio.length >= 3) return byTipoOpPrecio;

  const byTipoOp = historical.filter(h =>
    h.tipo === listing.tipo && h.op === listing.op
  );
  if (byTipoOp.length >= 3) return byTipoOp;

  return historical.filter(h => h.op === listing.op);
}

/**
 * Benchmarks promedio calculados a partir de un pool de comparables.
 */
export function getBenchmarks(pool) {
  return {
    consultas:           avg(pool.map(h => h.consultasAlCierre)),
    visitas:             avg(pool.map(h => h.visitasAlCierre)),
    dias:                avg(pool.map(h => h.diasHastaCierre)),
    consultasPorSemana:  avg(pool.map(h => h.consultasPorSemana)),
    count:               pool.length,
  };
}

// ─── score principal ──────────────────────────────────────────────────────────

/**
 * Calcula el Hot Score (2–100) de un aviso activo.
 *
 * @param {Object} listing    — aviso activo (ver campos en properties.js)
 * @param {Array}  historical — array de operaciones cerradas
 * @returns {number} score entre 2 y 100
 */
export function calcScore(listing, historical) {
  const pool = findComparables(listing, historical);
  const b    = getBenchmarks(pool);

  // ── 1. Ritmo de contacto (30%)
  //    consultas/día del aviso vs consultas/día promedio al cierre
  const listingPace   = listing.consultas / Math.max(1, listing.diasPublicado);
  const benchmarkPace = b.consultas / Math.max(1, b.dias);
  const ritmoScore    = clamp(listingPace / Math.max(0.01, benchmarkPace), 0, 1.5);

  // ── 2. Volumen acumulado de consultas (25%)
  const volumenScore = clamp(listing.consultas / Math.max(1, b.consultas), 0, 1.4);

  // ── 3. Progreso de visitas (25%)
  const visitasScore = clamp(listing.visitasTokko / Math.max(0.5, b.visitas), 0, 1.4);

  // ── 4. Frecuencia semanal (20%)
  const frecuenciaScore = clamp(
    listing.consultasPorSemana / Math.max(0.1, b.consultasPorSemana), 0, 1.5
  );

  // ── Factor tiempo
  //    Sin penalidad hasta 1.3× el promedio de días al cierre.
  //    Decae gradualmente hasta 0.35 si lleva 4× el tiempo típico.
  const daysRatio  = listing.diasPublicado / Math.max(1, b.dias);
  const timeFactor = daysRatio <= 1.3
    ? 1.0
    : clamp(1 - (daysRatio - 1.3) * 0.35, 0.35, 1.0);

  // ── Score final ponderado
  const raw =
    (ritmoScore       * 0.30 +
     volumenScore     * 0.25 +
     visitasScore     * 0.25 +
     frecuenciaScore  * 0.20) * timeFactor * 100;

  return clamp(Math.round(raw), 2, 100);
}

// ─── nivel de calor ───────────────────────────────────────────────────────────

export function heatLevel(score) {
  if (score >= 70) return 'hot';
  if (score >= 35) return 'warm';
  return 'cold';
}

export const heatLabel = {
  hot:  '🔥 Muy caliente',
  warm: '🌡️ Templado',
  cold: '❄️ Frío',
};

export const heatEmoji = { hot: '🔥', warm: '🌡️', cold: '❄️' };
