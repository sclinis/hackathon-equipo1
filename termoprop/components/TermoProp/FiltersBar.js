import styled from 'styled-components';

const Bar = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 12px 20px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const TagGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const Tag = styled.button`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all .15s;
  background: ${p => p.$active ? '#FF5A00' : p.$bg || '#f0f0f0'};
  color: ${p => p.$active ? '#fff' : p.$color || '#555'};
  border-color: ${p => p.$active ? '#FF5A00' : p.$borderColor || 'transparent'};
  &:hover { filter: brightness(.95); }
`;

const Sep = styled.div`
  height: 24px;
  width: 1px;
  background: #eee;
`;

const Select = styled.select`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  color: #333;
  background: #fafafa;
  cursor: pointer;
  &:focus { outline: 2px solid #FF5A00; border-color: #FF5A00; }
`;

const heatOptions = [
  { key: 'all',  label: 'Todos',           bg: '#f0f0f0',  color: '#555',    border: 'transparent' },
  { key: 'hot',  label: '🔥 Muy caliente', bg: '#FFF0E8',  color: '#E8400C', border: '#f9c3a8' },
  { key: 'warm', label: '🌡️ Templado',    bg: '#FFFBEA',  color: '#D4820A', border: '#f9e8a0' },
  { key: 'cold', label: '❄️ Frío',        bg: '#EAF4FF',  color: '#2B7EC0', border: '#a8d0f0' },
];

export default function FiltersBar({ properties, heatFilter, setHeatFilter, opFilter, setOpFilter, tipoFilter, setTipoFilter }) {
  const counts = { all: properties.length };
  ['hot','warm','cold'].forEach(h => { counts[h] = properties.filter(p => p.heat === h).length; });

  return (
    <Bar>
      <FilterLabel>Ver:</FilterLabel>
      <TagGroup>
        {heatOptions.map(o => (
          <Tag
            key={o.key}
            $active={heatFilter === o.key}
            $bg={o.bg} $color={o.color} $borderColor={o.border}
            onClick={() => setHeatFilter(o.key)}
          >
            {o.label} ({counts[o.key]})
          </Tag>
        ))}
      </TagGroup>
      <Sep />
      <FilterLabel>Operación:</FilterLabel>
      <Select value={opFilter} onChange={e => setOpFilter(e.target.value)}>
        <option value="">Todas</option>
        <option>Venta</option>
        <option>Alquiler</option>
      </Select>
      <FilterLabel>Tipo:</FilterLabel>
      <Select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}>
        <option value="">Todos</option>
        <option>Departamento</option>
        <option>Casa</option>
        <option>Local</option>
        <option>Oficina</option>
      </Select>
    </Bar>
  );
}
