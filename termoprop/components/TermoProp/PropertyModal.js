import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import historicalClosings from '../../data/historicalClosings';
import { findComparables, getBenchmarks } from '../../utils/scoring';

const fadeIn  = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: ${fadeIn} .18s ease;
`;

const Modal = styled.div`
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,.22);
  overflow: hidden;
  animation: ${slideUp} .2s ease;
  max-height: 92vh; overflow-y: auto;
`;

const Hero = styled.div`
  position: relative; height: 180px; overflow: hidden;
`;

const HeroImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`;

const HeroOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%);
`;

const HeroBadge = styled.span`
  position: absolute; top: 14px; left: 14px;
  padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
  background: ${p => ({ hot: '#FFF0E8', warm: '#FFF8E0', cold: '#E8F3FF' })[p.$heat]};
  color: ${p => ({ hot: '#C03000', warm: '#A05800', cold: '#0D5EA8' })[p.$heat]};
`;

const HeroScore = styled.div`
  position: absolute; top: 14px; right: 14px;
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
  background: ${p => ({ hot: 'rgba(192,48,0,.9)', warm: 'rgba(160,88,0,.9)', cold: 'rgba(13,94,168,.9)' })[p.$heat]};
  color: #fff;
`;

const ScoreNum = styled.div`font-size: 16px; font-weight: 900; line-height: 1;`;
const ScoreLbl = styled.span`font-size: 9px; font-weight: 600; opacity: .8;`;

const HeroTitle = styled.div`
  position: absolute; bottom: 14px; left: 14px; right: 14px;
  color: #fff; font-size: 15px; font-weight: 700; line-height: 1.3;
`;

const CloseBtn = styled.button`
  position: absolute; top: 10px; right: 10px;
  background: rgba(0,0,0,.35); border: none; border-radius: 50%;
  width: 30px; height: 30px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; font-weight: 700; z-index: 2;
  transition: background .15s;
  &:hover { background: rgba(0,0,0,.6); }
`;

const Body = styled.div`padding: 14px 20px 20px;`;

const Tags = styled.div`display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;`;

const Tag = styled.span`
  padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
  background: ${p => ({ tipo: '#f0f0f0', op: '#E8F5E9', destacado: '#FFF8E8', super: '#F3EEFF', simple: '#f0f0f0' })[p.$v] || '#f0f0f0'};
  color: ${p => ({ tipo: '#555', op: '#2E7D32', destacado: '#C07800', super: '#7340C4', simple: '#666' })[p.$v] || '#555'};
`;

const PriceRow = styled.div`display: flex; align-items: baseline; gap: 10px; margin-bottom: 2px;`;
const Price = styled.div`font-size: 20px; font-weight: 800; color: #222;`;
const Address = styled.div`font-size: 12px; color: #888; margin-bottom: 12px;`;

const Stats = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  background: #fafafa; border-radius: 10px; padding: 11px 10px; margin-bottom: 10px;
  border: 1px solid #f0f0f0;
`;

const Stat = styled.div`text-align: center;`;
const SV = styled.div`font-size: 18px; font-weight: 800; color: #222;`;
const SL = styled.div`font-size: 10px; color: #aaa; margin-top: 1px; text-transform: uppercase; letter-spacing: .4px;`;
const ST = styled.div`font-size: 10px; color: #7340C4; font-weight: 600;`;
const STG = styled.div`font-size: 10px; color: #999; font-weight: 500;`;

const FooterMeta = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  font-size: 11px; color: #888; margin-bottom: 14px;
`;

/* ── ACCIONES ─────────────────────────────────────────────────────────── */
const Section = styled.div`
  border-top: 1px solid #f0f0f0;
  padding-top: 13px;
  margin-top: 2px;
`;

const SectionTitle = styled.div`
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: #bbb; margin-bottom: 8px;
`;

const ActionsGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
`;

const ActionBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 9px 11px; border-radius: 10px;
  border: 1px solid #eee; background: #fff; cursor: pointer;
  text-align: left; transition: border-color .15s, background .15s;
  &:hover { border-color: #FF5A00; background: #FFF8F5; }
`;

const ActionIcon = styled.div`
  width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
  background: ${p => p.$bg};
`;

const ActionLabel = styled.div`font-size: 11px; font-weight: 600; color: #222;`;
const ActionSub   = styled.div`font-size: 10px; color: #aaa; margin-top: 1px;`;

/* ── COMPARABLES ──────────────────────────────────────────────────────── */
const ComparableCard = styled.div`
  background: #F8F8F8; border: 1px solid #EBEBEB;
  border-radius: 10px; padding: 11px 14px; margin-top: 13px;
  display: flex; align-items: flex-start; gap: 10px;
`;
const ComparableIcon = styled.div`font-size: 16px; margin-top: 1px; flex-shrink: 0;`;
const ComparableBody = styled.div`flex: 1; min-width: 0;`;
const ComparableTitle = styled.div`font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px;`;
const ComparableStats = styled.div`display: flex; gap: 14px; margin-bottom: 5px;`;
const CStat = styled.div`text-align: center;`;
const CVal = styled.div`font-size: 16px; font-weight: 800; color: #222; line-height: 1;`;
const CLbl = styled.div`font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: .3px; margin-top: 1px;`;
const ComparableNote = styled.div`font-size: 11px; color: ${p => p.$ahead ? '#2E7D32' : '#A05800'}; font-weight: 600;`;

/* ── CONSEJOS ─────────────────────────────────────────────────────────── */
const TipsSection = styled(Section)`margin-top: 13px;`;

const TipsList = styled.div`display: flex; flex-direction: column; gap: 6px;`;

const TipRow = styled.div`
  display: flex; align-items: baseline; gap: 6px;
  background: ${p => p.$bg || '#F0F7FF'}; border: 1px solid ${p => p.$border || '#C8E0F8'};
  border-radius: 8px; padding: 9px 12px;
`;

const TipDot = styled.div`
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
  background: ${p => p.$color || '#4A90D9'};
`;

const TipContent = styled.div`flex: 1; min-width: 0;`;

const TipText = styled.div`
  font-size: 12px; line-height: 1.45; color: ${p => p.$color || '#1A4A7A'};
  strong { font-weight: 700; color: ${p => p.$strong || '#0D3A66'}; }
`;

const TipAction = styled.span`
  font-size: 11px; font-weight: 700; color: ${p => p.$color || '#1E6AAF'};
  cursor: pointer; margin-left: 4px;
  &:hover { text-decoration: underline; }
`;

/* ── HELPERS ──────────────────────────────────────────────────────────── */
const heatLabel = { hot: '🔥 Muy caliente', warm: '🌡️ Templado', cold: '❄️ Frío' };

// Paleta por heat para los consejos
const tipTheme = {
  hot:  { bg: '#FFF8F5', border: '#FFD4B8', dot: '#E85A00', text: '#7A2E00', strong: '#5A1E00', action: '#C03000' },
  warm: { bg: '#FFFBEE', border: '#FFE8A0', dot: '#C08000', text: '#6B4800', strong: '#4A3000', action: '#A06000' },
  cold: { bg: '#F0F7FF', border: '#C8E0F8', dot: '#4A90D9', text: '#1A4A7A', strong: '#0D3A66', action: '#1E6AAF' },
};

// planType priority: simple < destacado < super
const planRank = { simple: 0, destacado: 1, super: 2 };
const lowDestaque = p => (planRank[p.planType] ?? 0) < 2; // simple o destacado = no Super Destacado

function getComparableInsight(p) {
  const pool = findComparables(p, historicalClosings);
  const b    = getBenchmarks(pool);
  const roundedDias = Math.round(b.dias);
  const roundedConsultas = Math.round(b.consultas);
  const roundedVisitas   = Math.round(b.visitas);

  const pace = p.consultas / Math.max(1, p.diasPublicado);
  const benchmarkPace = b.consultas / Math.max(1, b.dias);
  const ahead = pace >= benchmarkPace * 0.9;

  return {
    dias: roundedDias,
    consultas: roundedConsultas,
    visitas: roundedVisitas,
    count: pool.length,
    ahead,
  };
}

function getTips(p) {
  const heat = p.heat;
  const unread = Math.max(0, Math.floor(p.consultas * 0.2));

  if (heat === 'hot') {
    const tips = [];
    if (unread > 0) tips.push({
      text: <>Tenés <strong>{unread} consultas sin responder</strong>. Responder en menos de 1h duplica las chances de cierre.</>,
      action: 'Ir a consultas →',
    });
    if (p.visitasTokko > 0) tips.push({
      text: <><strong>{p.visitasTokko} visitas agendadas</strong> en Tokko. Confirmalas con 24hs de anticipación para evitar cancelaciones.</>,
      action: 'Ver agenda →',
    });
    tips.push({
      text: <>El aviso está en su <strong>mejor momento de exposición</strong>. Considerá subir el precio de referencia si recibís varias ofertas.</>,
      action: 'Revisar precio →',
    });
    return tips.slice(0, 2);
  }

  if (heat === 'warm') {
    const tips = [];

    // 1. Calidad baja → tip de calidad
    if (p.quality < 70) tips.push({
      text: <>Tu aviso tiene un <strong>score de calidad de {p.quality}/100</strong>. Completar descripción, fotos y superficie puede aumentar un 40% las consultas.</>,
      action: 'Revisar calidad →',
    });

    // 2. Sin destaque premium → tip de destaque
    if (lowDestaque(p)) tips.push({
      text: p.favoritos >= 10
        ? <><strong>{p.favoritos} personas</strong> lo tienen como favorito. Un destaque Premium podría convertirlos en consultas esta semana.</>
        : <>Mejorá el destaque para aparecer <strong>primero en las búsquedas</strong> y sumar más contactos antes de que baje la actividad.</>,
      action: 'Ver planes →',
    });

    // 3. Fallback si no hay suficientes tips
    if (tips.length < 2) tips.push({
      text: <>El aviso tiene <strong>actividad moderada</strong>. Actualizá las fotos o ajustá el precio un <strong>3–5%</strong> para generar más urgencia.</>,
      action: 'Editar aviso →',
    });

    return tips.slice(0, 2);
  }

  // cold
  {
    const tips = [];

    // 1. Calidad baja → tip de calidad (prioridad máxima en frío)
    if (p.quality < 70) tips.push({
      text: <>El aviso tiene un <strong>score de calidad de {p.quality}/100</strong>. Mejorar fotos, descripción y datos completos es el primer paso para reactivarlo.</>,
      action: 'Revisar calidad →',
    });

    // 2. Sin destaque o destaque bajo → tip de destaque
    if (lowDestaque(p)) tips.push({
      text: planRank[p.planType] === 0
        ? <>El aviso no tiene destaque. <strong>Activar un Destacado</strong> puede multiplicar por 3 las visitas en los primeros días.</>
        : <>Tu destaque actual tiene poca tracción. Subir a <strong>Dest. Premium</strong> lo reposiciona al tope de las búsquedas.</>,
      action: 'Ver planes →',
    });

    // 3. Fallback precio/comparables
    if (tips.length < 2) tips.push({
      text: <>Revisá si el precio está alineado con <strong>propiedades similares de la zona</strong>. Una diferencia del 5% puede ser determinante.</>,
      action: 'Ver comparables →',
    });

    return tips.slice(0, 2);
  }
}

export default function PropertyModal({ property, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!property) return null;
  const p = property;
  const tips = getTips(p);
  const theme = tipTheme[p.heat];
  const insight = getComparableInsight(p);

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <Hero>
          <HeroImg src={p.primaryPhoto} alt={p.title} />
          <HeroOverlay />
          <HeroBadge $heat={p.heat}>{heatLabel[p.heat]}</HeroBadge>
          <HeroScore $heat={p.heat}>
            <ScoreNum>{p.score}</ScoreNum>
            <ScoreLbl>score</ScoreLbl>
          </HeroScore>
          <HeroTitle>{p.title}</HeroTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Hero>

        <Body>
          {/* Cabecera: tags + precio + dirección */}
          <Tags>
            <Tag $v="tipo">{p.tipo}</Tag>
            <Tag $v="op">{p.op}</Tag>
            <Tag $v={p.planType}>{p.plan}</Tag>
          </Tags>
          <PriceRow>
            <Price>{p.price}</Price>
          </PriceRow>
          <Address>📍 {p.address}</Address>

          <Stats>
            <Stat><SV>{p.consultas}</SV><SL>Consultas</SL><STG>{p.periodos}</STG></Stat>
            <Stat><SV>{p.visitasTokko}</SV><SL>Visitas</SL><ST>⚡ Tokko</ST></Stat>
            <Stat><SV>{p.favoritos}</SV><SL>Favoritos</SL></Stat>
          </Stats>

          {/* Comparables históricos */}
          <ComparableCard>
            <ComparableIcon>📊</ComparableIcon>
            <ComparableBody>
              <ComparableTitle>{insight.count} operaciones cerradas similares</ComparableTitle>
              <ComparableStats>
                <CStat><CVal>{insight.dias}d</CVal><CLbl>días al cierre</CLbl></CStat>
                <CStat><CVal>{insight.consultas}</CVal><CLbl>consultas</CLbl></CStat>
                <CStat><CVal>{insight.visitas}</CVal><CLbl>visitas</CLbl></CStat>
              </ComparableStats>
              <ComparableNote $ahead={insight.ahead}>
                {insight.ahead
                  ? `✓ Vas por delante del ritmo típico`
                  : `↗ Por debajo del ritmo — acelerá la respuesta`}
              </ComparableNote>
            </ComparableBody>
          </ComparableCard>

          {/* Acciones rápidas */}
          <Section>
            <SectionTitle>Acciones rápidas</SectionTitle>
            <ActionsGrid>
              <ActionBtn>
                <ActionIcon $bg="#F0EAFF">📅</ActionIcon>
                <div>
                  <ActionLabel>Gestioná visitas</ActionLabel>
                  <ActionSub>{p.visitasTokko} en Tokko</ActionSub>
                </div>
              </ActionBtn>
              <ActionBtn>
                <ActionIcon $bg="#FFF0E8">✉️</ActionIcon>
                <div>
                  <ActionLabel>Gestioná consultas</ActionLabel>
                  <ActionSub>{p.consultas} recibidas</ActionSub>
                </div>
              </ActionBtn>
              <ActionBtn>
                <ActionIcon $bg="#E8F3FF">🔔</ActionIcon>
                <div>
                  <ActionLabel>Agendar seguimiento</ActionLabel>
                  <ActionSub>Recordatorio de llamado</ActionSub>
                </div>
              </ActionBtn>
              <ActionBtn>
                <ActionIcon $bg="#FFFBEA">⭐</ActionIcon>
                <div>
                  <ActionLabel>Mejorar destaque</ActionLabel>
                  <ActionSub>Más visibilidad ahora</ActionSub>
                </div>
              </ActionBtn>
            </ActionsGrid>
          </Section>

          {/* Consejos TermoProp */}
          <TipsSection>
            <SectionTitle>Consejos TermoProp</SectionTitle>
            <TipsList>
              {tips.map((t, i) => (
                <TipRow key={i} $bg={theme.bg} $border={theme.border}>
                  <TipDot $color={theme.dot} />
                  <TipContent>
                    <TipText $color={theme.text} $strong={theme.strong}>
                      {t.text}
                      <TipAction $color={theme.action}>{t.action}</TipAction>
                    </TipText>
                  </TipContent>
                </TipRow>
              ))}
            </TipsList>
          </TipsSection>
        </Body>
      </Modal>
    </Overlay>
  );
}
