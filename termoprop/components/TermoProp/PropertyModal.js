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

const Body = styled.div`padding: 12px 18px 18px;`;

const Tags = styled.div`display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;`;

const Tag = styled.span`
  padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
  background: ${p => ({ tipo: '#f0f0f0', op: '#E8F5E9', destacado: '#FFF8E8', super: '#F3EEFF', simple: '#f0f0f0' })[p.$v] || '#f0f0f0'};
  color: ${p => ({ tipo: '#555', op: '#2E7D32', destacado: '#C07800', super: '#7340C4', simple: '#666' })[p.$v] || '#555'};
`;

const PriceRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 3px;
`;
const Price = styled.div`font-size: 22px; font-weight: 800; color: #111;`;
const DestaquePill = styled.span`
  font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px;
  background: ${p => ({ super: '#F3EEFF', destacado: '#FFF8E8', simple: '#f0f0f0' })[p.$v] || '#f0f0f0'};
  color: ${p => ({ super: '#7340C4', destacado: '#C07800', simple: '#888' })[p.$v] || '#888'};
`;

const Address = styled.div`font-size: 12px; color: #888; margin-bottom: 16px;`;

/* ── STATS CON COMPARABLES ────────────────────────────────────────────── */
const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px;
  margin-bottom: 12px;
`;

const StatBox = styled.div`
  background: #f8f8f8; border: 1px solid #ededed;
  border-radius: 10px; padding: 9px 8px;
`;

const SBLabel = styled.div`font-size: 11px; color: #888; font-weight: 500; margin-bottom: 2px;`;
const SBValue = styled.div`font-size: 22px; font-weight: 800; color: #111; line-height: 1.1;`;
const SBSub   = styled.div`font-size: 10px; color: #aaa; margin-top: 1px; margin-bottom: 8px;`;
const SBDivider = styled.div`border-top: 1px solid #e8e8e8; margin: 8px 0 6px;`;
const SBCompLabel = styled.div`font-size: 10px; color: #888; line-height: 1.3; margin-bottom: 4px;`;
const SBCompRow = styled.div`display: flex; align-items: center; gap: 5px;`;
const SBCompVal = styled.span`font-size: 14px; font-weight: 700; color: #222;`;
const SBBadge = styled.span`
  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px;
  background: ${p => p.$ok ? '#FFF0E8' : '#E8F5E9'};
  color: ${p => p.$ok ? '#C03000' : '#2E7D32'};
`;

/* ── SECCIÓN TOKKO ────────────────────────────────────────────────────── */
const TokkoSection = styled.div`
  background: #f9f9f9; border: 1px solid #ededed;
  border-radius: 12px; padding: 10px 12px 10px;
  margin-bottom: 12px;
`;

const TokkoLogo = styled.img`
  height: 22px; width: auto; display: block; margin-bottom: 8px;
`;

const TokkoActions = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
`;

const TokkoCard = styled.button`
  background: #fff; border: 1px solid #e8e8e8; border-radius: 9px;
  padding: 8px 6px; cursor: pointer; text-align: center;
  transition: border-color .15s, background .15s;
  &:hover { border-color: #CC4422; background: #FFF5F3; }
`;

const TokkoCardIcon = styled.div`font-size: 16px; margin-bottom: 3px;`;
const TokkoCardLabel = styled.div`font-size: 10px; font-weight: 700; color: #222; line-height: 1.3;`;
const TokkoCardSub   = styled.div`font-size: 9px; color: #aaa; margin-top: 1px;`;

/* ── CONSEJOS FLAT ────────────────────────────────────────────────────── */
const ConsejosSectionTitle = styled.div`
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .6px; color: #bbb; margin-bottom: 8px;
`;

const TipsList = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const TipRow = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: ${p => p.$bg || '#EFF8FF'};
  border: 1px solid ${p => p.$border || '#B8D9F8'};
  border-radius: 10px; padding: 12px 14px;
`;

const TipIcon = styled.div`
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  background: ${p => p.$bg};
`;

const TipContent = styled.div`flex: 1; min-width: 0;`;

const TipTitle = styled.div`
  font-size: 12px; font-weight: 700; color: ${p => p.$color || '#174E80'};
  margin-bottom: 3px;
`;

const TipText = styled.div`
  font-size: 12px; line-height: 1.45; color: ${p => p.$color || '#174E80'};
  strong { font-weight: 700; }
`;

const TipAction = styled.span`
  display: inline-block; margin-top: 5px;
  font-size: 11px; font-weight: 700; color: ${p => p.$color || '#1060B0'};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

/* ── HELPERS ──────────────────────────────────────────────────────────── */
const heatLabel = { hot: '🔥 Muy caliente', warm: '🌡️ Templado', cold: '❄️ Frío' };

const tipTheme = {
  hot:  { bg: '#EFF8FF', border: '#B8D9F8', dot: '#2878C8', dotBg: '#D0E8F8', text: '#174E80', strong: '#0D3660', action: '#1060B0' },
  warm: { bg: '#EFF8FF', border: '#B8D9F8', dot: '#2878C8', dotBg: '#D0E8F8', text: '#174E80', strong: '#0D3660', action: '#1060B0' },
  cold: { bg: '#EFF8FF', border: '#B8D9F8', dot: '#2878C8', dotBg: '#D0E8F8', text: '#174E80', strong: '#0D3660', action: '#1060B0' },
};

const planRank = { simple: 0, destacado: 1, super: 2 };
const lowDestaque = p => (planRank[p.planType] ?? 0) < 2;

const planLabel = { simple: 'Simple', destacado: 'Destacado', super: 'Premium' };

function getComparableInsight(p) {
  const pool = findComparables(p, historicalClosings);
  const b    = getBenchmarks(pool);
  const pace = p.consultas / Math.max(1, p.diasPublicado);
  const benchmarkPace = b.consultas / Math.max(1, b.dias);
  const ahead = pace >= benchmarkPace * 0.9;
  return {
    dias: Math.round(b.dias),
    consultas: Math.round(b.consultas),
    visitas: Math.round(b.visitas),
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
      icon: '💬',
      title: `${unread} consultas sin responder`,
      text: <>Responder en menos de 1h duplica las chances de cierre.</>,
      action: 'Ir a consultas →',
    });
    if (p.visitasTokko > 0) tips.push({
      icon: '📅',
      title: `${p.visitasTokko} visitas agendadas en Tokko`,
      text: <>Confirmalas con 24hs de anticipación para evitar cancelaciones.</>,
      action: 'Ver agenda →',
    });
    tips.push({
      icon: '📈',
      title: 'Aviso en su pico de exposición',
      text: <>Considerá subir el precio de referencia si recibís varias ofertas.</>,
      action: 'Revisar precio →',
    });
    return tips.slice(0, 2);
  }

  if (heat === 'warm') {
    const tips = [];
    if (p.quality < 70) tips.push({
      icon: '📋',
      title: `Score de calidad bajo (${p.quality}/100)`,
      text: <>Completar descripción, fotos y superficie puede aumentar un 40% las consultas.</>,
      action: 'Revisar calidad →',
    });
    if (lowDestaque(p)) tips.push({
      icon: '⭐',
      title: p.favoritos >= 10 ? `${p.favoritos} personas lo tienen como favorito` : 'Destaque por debajo del promedio',
      text: p.favoritos >= 10
        ? <>Un destaque Premium podría convertirlos en consultas esta semana.</>
        : <>Mejorá el destaque para aparecer primero en las búsquedas.</>,
      action: 'Ver planes →',
    });
    if (tips.length < 2) tips.push({
      icon: '🖼️',
      title: 'Actividad moderada',
      text: <>Actualizá las fotos o ajustá el precio un 3–5% para generar más urgencia.</>,
      action: 'Editar aviso →',
    });
    return tips.slice(0, 2);
  }

  // cold
  const tips = [];
  if (p.quality < 70) tips.push({
    icon: '📋',
    title: `Score de calidad bajo (${p.quality}/100)`,
    text: <>Mejorar fotos, descripción y datos completos es el primer paso para reactivarlo.</>,
    action: 'Revisar calidad →',
  });
  if (lowDestaque(p)) tips.push({
    icon: '⭐',
    title: planRank[p.planType] === 0 ? 'Sin destaque activo' : 'Destaque con poca tracción',
    text: planRank[p.planType] === 0
      ? <>Activar un Destacado puede multiplicar por 3 las visitas en los primeros días.</>
      : <>Subir a Dest. Premium lo reposiciona al tope de las búsquedas.</>,
    action: 'Ver planes →',
  });
  if (tips.length < 2) tips.push({
    icon: '💲',
    title: 'Revisá el precio vs. similares',
    text: <>Una diferencia del 5% respecto a propiedades similares puede ser determinante.</>,
    action: 'Ver comparables →',
  });
  return tips.slice(0, 2);
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
  const unread = Math.max(0, Math.floor(p.consultas * 0.2));

  const consultasOk  = p.consultas  >= insight.consultas;
  const visitasOk    = p.visitasTokko >= insight.visitas;
  const diasOk       = p.diasPublicado <= insight.dias * 1.1;

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
          {/* Tags + precio */}
          <Tags>
            <Tag $v="tipo">{p.tipo}</Tag>
            <Tag $v="op">{p.op}</Tag>
          </Tags>
          <PriceRow>
            <Price>{p.price}</Price>
            <DestaquePill $v={p.planType}>
              {p.planType !== 'simple' && 'Destaque '}
              {planLabel[p.planType] || p.plan}
            </DestaquePill>
          </PriceRow>
          <Address>📍 {p.address}</Address>

          {/* Stats con comparables */}
          <StatsGrid>
            <StatBox>
              <SBLabel>Consultas</SBLabel>
              <SBValue>{p.consultas}</SBValue>
              <SBSub>{p.periodos}</SBSub>
              <SBDivider />
              <SBCompLabel>Similares {p.op === 'Alquiler' ? 'alquiladas' : 'vendidas'} necesitaron</SBCompLabel>
              <SBCompRow>
                <SBCompVal>{insight.consultas}</SBCompVal>
                <SBBadge $ok={consultasOk}>{consultasOk ? 'Excedido' : 'Normal'}</SBBadge>
              </SBCompRow>
            </StatBox>

            <StatBox>
              <SBLabel>Visitas</SBLabel>
              <SBValue>{p.visitasTokko}</SBValue>
              <SBSub>&nbsp;</SBSub>
              <SBDivider />
              <SBCompLabel>Similares {p.op === 'Alquiler' ? 'alquiladas' : 'vendidas'} necesitaron</SBCompLabel>
              <SBCompRow>
                <SBCompVal>{insight.visitas}</SBCompVal>
                <SBBadge $ok={visitasOk}>{visitasOk ? 'Excedido' : 'Normal'}</SBBadge>
              </SBCompRow>
            </StatBox>

            <StatBox>
              <SBLabel>Días publicado</SBLabel>
              <SBValue>{p.diasPublicado}d</SBValue>
              <SBSub>&nbsp;</SBSub>
              <SBDivider />
              <SBCompLabel>Similares {p.op === 'Alquiler' ? 'alquiladas' : 'vendidas'} tardaron</SBCompLabel>
              <SBCompRow>
                <SBCompVal>{insight.dias}d</SBCompVal>
                <SBBadge $ok={diasOk}>{diasOk ? 'Normal' : 'Excedido'}</SBBadge>
              </SBCompRow>
            </StatBox>
          </StatsGrid>

          {/* Tokko Broker section */}
          <TokkoSection>
            <TokkoLogo src="/tokko-broker-logo.png" alt="Tokko Broker" />
            <TokkoActions>
              <TokkoCard>
                <TokkoCardIcon>📅</TokkoCardIcon>
                <TokkoCardLabel>Gestionar visitas</TokkoCardLabel>
                <TokkoCardSub>{p.visitasTokko} agendadas</TokkoCardSub>
              </TokkoCard>
              <TokkoCard>
                <TokkoCardIcon>💬</TokkoCardIcon>
                <TokkoCardLabel>Responder consultas</TokkoCardLabel>
                <TokkoCardSub>{unread} sin responder</TokkoCardSub>
              </TokkoCard>
              <TokkoCard>
                <TokkoCardIcon>⭐</TokkoCardIcon>
                <TokkoCardLabel>Mejorar destaque</TokkoCardLabel>
                <TokkoCardSub>Más visibilidad</TokkoCardSub>
              </TokkoCard>
            </TokkoActions>
          </TokkoSection>

          {/* Consejos TermoProp */}
          <ConsejosSectionTitle>Consejos TermoProp</ConsejosSectionTitle>
          <TipsList>
            {tips.map((t, i) => (
              <TipRow key={i} $bg={theme.bg} $border={theme.border}>
                <TipIcon $bg={theme.dotBg}>{t.icon}</TipIcon>
                <TipContent>
                  <TipTitle $color={theme.text}>{t.title}</TipTitle>
                  <TipText $color={theme.text}>
                    {t.text}
                  </TipText>
                  <TipAction $color={theme.action}>{t.action}</TipAction>
                </TipContent>
              </TipRow>
            ))}
          </TipsList>
        </Body>
      </Modal>
    </Overlay>
  );
}
