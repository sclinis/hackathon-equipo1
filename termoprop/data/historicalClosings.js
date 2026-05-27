/**
 * Operaciones cerradas históricas — cargadas desde historical_closings.json.
 * El JSON es la fuente de verdad; este módulo lo adapta al formato
 * que espera el algoritmo de comparables en utils/scoring.js.
 */
import rawData from './historical_closings.json';

const historicalClosings = rawData.operaciones.map(o => ({
  id:                 o.id,
  tipo:               o.tipo,
  op:                 o.op,
  barrio:             o.barrio,
  superficie:         o.superficie,
  precioM2:           o.precioM2Publicado,
  diasHastaCierre:    o.diasHastaCierre,
  consultasAlCierre:  o.consultasAlCierre,
  visitasAlCierre:    o.visitasAlCierre,
  consultasPorSemana: o.consultasPorSemana,
  // campos extra disponibles para análisis / visualizaciones futuras
  precioCierre:       o.precioCierre,
  precioPublicado:    o.precioPublicado,
  descuentoPct:       o.descuentoPct,
  fechaCierre:        o.fechaCierre,
  fechaPublicacion:   o.fechaPublicacion,
}));

export default historicalClosings;
