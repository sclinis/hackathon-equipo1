import { useState } from 'react';
import styled from 'styled-components';

import { heatLabel } from '../../utils/scoring';

const Wrap = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
`;

const TableHeader = styled.div`
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #222;
`;

const CountInfo = styled.span`
  font-size: 13px;
  color: #888;
  strong { color: #333; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 10px 10px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$sorted ? '#FF5A00' : '#888'};
  text-transform: uppercase;
  letter-spacing: .5px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  overflow: hidden;
  cursor: ${p => p.$sortable ? 'pointer' : 'default'};
  user-select: none;
  width: ${p => p.$w || 'auto'};
  &:hover { color: ${p => p.$sortable ? '#FF5A00' : '#888'}; }
`;

const SortIcon = styled.span`
  margin-left: 4px;
  opacity: ${p => p.$active ? 1 : 0.4};
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background .12s;
  &:hover { background: #fff8f5; }
  &:last-child { border-bottom: none; }
`;

const Td = styled.td`
  padding: 11px 10px;
  vertical-align: middle;
  overflow: hidden;
`;

const PropCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Thumb = styled.img`
  width: 88px;
  height: 66px;
  border-radius: 7px;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity .15s;
  &:hover { opacity: .85; }
`;

const ThumbFallback = styled.div`
  width: 88px;
  height: 66px;
  border-radius: 7px;
  background: #f0f0f0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const PropInfo = styled.div`
  min-width: 0;
`;

const PropTitle = styled.div`
  font-weight: 600;
  color: #222;
  font-size: 12px;
  margin-bottom: 1px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { color: #FF5A00; text-decoration: underline; }
`;

const PropAddress = styled.div`
  color: #999;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PropPrice = styled.div`
  color: #444;
  font-size: 11px;
  font-weight: 600;
  margin-top: 1px;
`;

const TipoPlan = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Badge = styled.span`
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
  background: ${p => ({ tipo: '#f0f0f0', destacado: '#FFF8E8', super: '#F3EEFF', simple: '#f0f0f0' })[p.$v] || '#f0f0f0'};
  color: ${p => ({ tipo: '#555', destacado: '#C07800', super: '#7340C4', simple: '#666' })[p.$v] || '#555'};
`;

const ActCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
`;

const AV = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: #222;
`;

const AL = styled.span`
  color: #bbb;
`;

const TokkoLbl = styled.span`
  color: #7340C4;
  font-size: 10px;
  font-weight: 600;
`;

const LastAct = styled.div`
  font-size: 11px;
`;

const When = styled.div`
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`;

const Favs = styled.div`
  color: #aaa;
  font-size: 10px;
  margin-top: 2px;
`;

const ScoreWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ScoreChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 900;
  flex-shrink: 0;
  background: ${{ hot: '#FFF0E8', warm: '#FFFBEA', cold: '#EAF4FF' }};
  background: ${p => ({ hot: '#FFF0E8', warm: '#FFFBEA', cold: '#EAF4FF' })[p.$heat]};
  color: ${p => ({ hot: '#E8400C', warm: '#D4820A', cold: '#2B7EC0' })[p.$heat]};
`;

const BarWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 7px;
  border-radius: 4px;
  background: #eee;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${p => p.$pct}%;
  background: ${p => ({
    hot:  'linear-gradient(90deg,#FF5A00,#FF8C00)',
    warm: 'linear-gradient(90deg,#F4A800,#FFD000)',
    cold: 'linear-gradient(90deg,#4DA6F5,#A0CFFF)',
  })[p.$heat]};
`;

const HeatLbl = styled.div`
  font-size: 9px;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: .4px;
`;

const cols = [
  { key: null,       label: 'Propiedad',       w: '220px', sortable: false },
  { key: null,       label: 'Destaque',          w: '110px', sortable: false },
  { key: 'consultas',label: 'Actividad',        w: '110px', sortable: true  },
  { key: null,       label: 'Último contacto',  w: '110px', sortable: false },
  { key: 'score',    label: 'Hot Score',        w: '130px', sortable: true  },
];

export default function PropertyTable({ properties, onSelectProperty }) {
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...properties].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  const heatLabels = { hot: 'Muy caliente', warm: 'Templado', cold: 'Frío' };

  return (
    <Wrap>
      <TableHeader>
        <TableTitle>Propiedades activas</TableTitle>
        <CountInfo>Mostrando <strong>{sorted.length}</strong> aviso{sorted.length !== 1 ? 's' : ''}</CountInfo>
      </TableHeader>
      <Table>
        <thead>
          <tr>
            {cols.map(c => (
              <Th key={c.label} $w={c.w} $sortable={c.sortable} $sorted={sortKey === c.key} onClick={() => handleSort(c.key)}>
                {c.label}
                {c.sortable && (
                  <SortIcon $active={sortKey === c.key}>
                    {sortKey === c.key ? (sortDir === 'desc' ? '↓' : '↑') : '⇅'}
                  </SortIcon>
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <Tr key={p.id}>
              <Td>
                <PropCell>
                  <Thumb
                    src={p.primaryPhoto}
                    alt={p.title}
                    onClick={() => onSelectProperty(p)}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <PropInfo>
                    <PropTitle onClick={() => onSelectProperty(p)}>{p.title}</PropTitle>
                    <PropAddress>{p.address}</PropAddress>
                    <PropPrice>{p.op} · {p.price}</PropPrice>
                  </PropInfo>
                </PropCell>
              </Td>
              <Td>
                <TipoPlan>
                  <Badge $v={p.planType}>{p.plan}</Badge>
                </TipoPlan>
              </Td>
              <Td>
                <ActCell>
                  <ActRow><AV>{p.consultas}</AV><AL>consultas</AL><AL style={{ color: '#bbb', marginLeft: 4 }}>{p.periodos}</AL></ActRow>
                  <ActRow><AV>{p.visitasTokko}</AV><AL>visitas Tokko</AL></ActRow>
                </ActCell>
              </Td>
              <Td>
                <LastAct>
                  <When>{p.ultimaAct}</When>
                  <Favs>{p.favoritos} ❤️ favoritos</Favs>
                </LastAct>
              </Td>
              <Td>
                <ScoreWrap>
                  <ScoreChip $heat={p.heat}>{p.score}</ScoreChip>
                  <BarWrap>
                    <BarTrack><BarFill $pct={p.score} $heat={p.heat} /></BarTrack>
                    <HeatLbl>{heatLabels[p.heat]}</HeatLbl>
                  </BarWrap>
                </ScoreWrap>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Wrap>
  );
}
