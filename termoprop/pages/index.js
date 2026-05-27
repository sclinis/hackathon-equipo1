import Head from 'next/head';
import { useState, useMemo } from 'react';
import styled from 'styled-components';
import AppLayout from '../components/Layout/AppLayout';
import HeatCards from '../components/TermoProp/HeatCards';
import FiltersBar from '../components/TermoProp/FiltersBar';
import PropertyTable from '../components/TermoProp/PropertyTable';
import PropertyModal from '../components/TermoProp/PropertyModal';
import AIInsightsBanner from '../components/TermoProp/AIInsightsBanner';
import properties from '../data/properties';

const H1 = styled.h1`
  font-size: 22px; font-weight: 700; color: #222;
  display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
`;
const BetaBadge = styled.span`
  background: #FFF0E8; color: #E8400C;
  font-size: 13px; padding: 3px 10px; border-radius: 20px; font-weight: 600;
`;
const Sub = styled.div`
  color: #888; font-size: 13px; margin-bottom: 20px;
  display: flex; align-items: center; gap: 6px;
`;
const TokkoTag = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  background: #F3EEFF; color: #7340C4;
  border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;
`;

export default function TermoPropPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [heatFilter, setHeatFilter] = useState('all');
  const [opFilter,   setOpFilter]   = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const filtered = useMemo(() => properties.filter(p => {
    if (heatFilter !== 'all' && p.heat !== heatFilter) return false;
    if (opFilter   && p.op   !== opFilter)   return false;
    if (tipoFilter && p.tipo !== tipoFilter) return false;
    return true;
  }), [heatFilter, opFilter, tipoFilter]);

  return (
    <>
      <Head>
        <title>TermoProp – ZonaProp Estadísticas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppLayout>
        <div>
          <H1>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A00" strokeWidth="2.2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
            TermoProp
            <BetaBadge>BETA</BetaBadge>
          </H1>
          <Sub>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            La información se actualiza cada 24 hs · Datos cruzados con
            <TokkoTag>⚡ Tokko Broker</TokkoTag>
          </Sub>
        </div>

        <AIInsightsBanner properties={properties} />

        <HeatCards properties={properties} onSelectProperty={setSelectedProperty} />

        <FiltersBar
          properties={properties}
          heatFilter={heatFilter}   setHeatFilter={setHeatFilter}
          opFilter={opFilter}       setOpFilter={setOpFilter}
          tipoFilter={tipoFilter}   setTipoFilter={setTipoFilter}
        />

        <PropertyTable properties={filtered} onSelectProperty={setSelectedProperty} />

        {selectedProperty && (
          <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
        )}
      </AppLayout>
    </>
  );
}
