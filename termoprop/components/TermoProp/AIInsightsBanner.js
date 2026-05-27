import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

/* ── animaciones ──────────────────────────────────────────────────────────── */
const pulse = keyframes`
  0%, 100% { opacity: .4; }
  50%       { opacity: .9; }
`;

const fadeIn = keyframes`from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; }`;

/* ── contenedor principal ─────────────────────────────────────────────────── */
const Banner = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid #f5f5f5;
  background: #fafafa;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AIBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #FF5A00, #FF8C42);
  color: #fff;
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .3px;
`;

const HeaderTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all .15s;
  &:hover { border-color: #FF5A00; color: #FF5A00; background: #fff8f5; }
  &:disabled { opacity: .45; cursor: not-allowed; }
`;

const Body = styled.div`
  padding: 0;
`;

/* ── skeleton de carga ────────────────────────────────────────────────────── */
const SkeletonRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px solid #f8f8f8;
  &:last-child { border-bottom: none; }
`;

const SkeletonDot = styled.div`
  width: 28px; height: 28px; border-radius: 8px;
  background: #f0f0f0; flex-shrink: 0;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const SkeletonLines = styled.div`flex: 1;`;

const SkeletonLine = styled.div`
  height: 10px; border-radius: 5px; background: #f0f0f0; margin-bottom: 6px;
  width: ${p => p.$w || '100%'};
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

/* ── insight card ─────────────────────────────────────────────────────────── */
const InsightRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px solid #f8f8f8;
  animation: ${fadeIn} .3s ease;
  animation-delay: ${p => p.$delay || '0s'};
  animation-fill-mode: both;
  &:last-child { border-bottom: none; }
  transition: background .15s;
  &:hover { background: #fafafa; }
`;

const ImpactDot = styled.div`
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  background: ${p => p.$impacto === 'alto' ? '#FFF0E8' : '#FFFBEA'};
`;

const InsightContent = styled.div`flex: 1; min-width: 0;`;

const InsightAccion = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
  line-height: 1.35;
`;

const InsightDetalle = styled.div`
  font-size: 11.5px;
  color: #888;
  line-height: 1.4;
`;

const ImpactoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  vertical-align: middle;
  background: ${p => p.$impacto === 'alto' ? '#FFF0E8' : '#FFFBEA'};
  color: ${p => p.$impacto === 'alto' ? '#C03000' : '#A06000'};
`;

/* ── error ────────────────────────────────────────────────────────────────── */
const ErrorMsg = styled.div`
  padding: 16px 18px;
  font-size: 12px;
  color: #999;
  text-align: center;
`;

/* ── helpers ──────────────────────────────────────────────────────────────── */
function buildPrompt(properties) {
  const portfolio = properties.map(p => ({
    id:               p.id,
    titulo:           p.title,
    tipo:             p.tipo,
    op:               p.op,
    heat:             p.heat,
    score:            p.score,
    consultas:        p.consultas,
    visitas:          p.visitasTokko,
    favoritos:        p.favoritos,
    diasPublicado:    p.diasPublicado,
    diasSinActividad: p.diasUltAct,
    consultasPorSemana: p.consultasPorSemana,
    quality:          p.quality,
    plan:             p.plan,
  }));

  return `Sos analista inmobiliario especializado en el mercado argentino (CABA y GBA).
Analizá este portfolio de ${properties.length} propiedades activas de una inmobiliaria.

PORTFOLIO (JSON):
${JSON.stringify(portfolio)}

DEFINICIONES:
- heat "hot" (score ≥70): muy cerca de cerrar, requiere atención urgente
- heat "warm" (35-69): actividad moderada, oportunidad de acelerar
- heat "cold" (<35): poca tracción, necesita intervención
- quality: score 0-100 de calidad del aviso (fotos, descripción, datos)
- diasSinActividad: días desde la última consulta o visita

TAREA: Identificá las 3 acciones de MAYOR IMPACTO INMEDIATO que el agente debería tomar HOY.
Priorizá: responder consultas pendientes urgentes, avisos hot que pueden cerrarse esta semana, avisos con problemas críticos de calidad o precio.
Sé específico: mencioná el aviso por nombre cuando aplique.

Respondé ÚNICAMENTE con este JSON (sin texto adicional, sin markdown, sin bloques de código):
{"insights":[{"prioridad":1,"emoji":"🔥","accion":"texto acción max 75 chars","detalle":"explicación del por qué max 110 chars","impacto":"alto","propiedadId":null},{"prioridad":2,"emoji":"⚡","accion":"...","detalle":"...","impacto":"alto","propiedadId":null},{"prioridad":3,"emoji":"📈","accion":"...","detalle":"...","impacto":"medio","propiedadId":null}]}`;
}

async function fetchInsights(properties, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':          apiKey,
      'anthropic-version':  '2023-06-01',
      'content-type':       'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages:   [{ role: 'user', content: buildPrompt(properties) }],
    }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';

  // Extraer JSON aunque venga con texto alrededor
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON en respuesta');
  return JSON.parse(match[0]).insights;
}

/* ── componente ───────────────────────────────────────────────────────────── */
export default function AIInsightsBanner({ properties }) {
  const [insights, setInsights]   = useState(null);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState(null);

  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  const load = useCallback(async () => {
    if (!apiKey) { setError('Configurá NEXT_PUBLIC_ANTHROPIC_API_KEY en .env.local'); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInsights(properties, apiKey);
      setInsights(result);
    } catch (e) {
      setError('No se pudo obtener el análisis. Revisá la API key o la conexión.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [properties, apiKey]);

  useEffect(() => { load(); }, [load]);

  return (
    <Banner>
      <Header>
        <HeaderLeft>
          <AIBadge>✦ IA</AIBadge>
          <HeaderTitle>Acciones inmediatas del portfolio</HeaderTitle>
        </HeaderLeft>
        <RefreshBtn onClick={load} disabled={loading}>
          {loading ? '...' : '↺ Actualizar'}
        </RefreshBtn>
      </Header>

      <Body>
        {loading && [0, 1, 2].map(i => (
          <SkeletonRow key={i}>
            <SkeletonDot />
            <SkeletonLines>
              <SkeletonLine $w="70%" $delay={`${i * .12}s`} />
              <SkeletonLine $w="90%" $delay={`${i * .12 + .08}s`} />
            </SkeletonLines>
          </SkeletonRow>
        ))}

        {!loading && error && <ErrorMsg>{error}</ErrorMsg>}

        {!loading && insights && insights.map((ins, i) => (
          <InsightRow key={ins.prioridad} $delay={`${i * .08}s`}>
            <ImpactDot $impacto={ins.impacto}>{ins.emoji}</ImpactDot>
            <InsightContent>
              <InsightAccion>
                {ins.accion}
                <ImpactoBadge $impacto={ins.impacto}>{ins.impacto}</ImpactoBadge>
              </InsightAccion>
              <InsightDetalle>{ins.detalle}</InsightDetalle>
            </InsightContent>
          </InsightRow>
        ))}
      </Body>
    </Banner>
  );
}
