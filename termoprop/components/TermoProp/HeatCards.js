import styled from 'styled-components';

import { heatLabel } from '../../utils/scoring';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
`;

const Card = styled.div`
  border-radius: 14px;
  border: 1.5px solid ${p => ({
    hot: '#FFCDB0', warm: '#FFE49A', cold: '#B0D4F8'
  })[p.$heat]};
  background: ${p => ({
    hot: '#FFF0E8', warm: '#FFF8E0', cold: '#E8F3FF'
  })[p.$heat]};
  overflow: hidden;
  transition: transform .18s, box-shadow .18s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,.10);
  }
`;

const Inner = styled.div`
  padding: 22px 24px 18px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Emoji = styled.span`
  font-size: 28px;
  line-height: 1;
`;

const Pill = styled.span`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  background: ${p => ({ hot: '#FFCDB0', warm: '#FFE49A', cold: '#B0D4F8' })[p.$heat]};
  color: ${p => ({ hot: '#B83000', warm: '#8A5500', cold: '#0D4E8A' })[p.$heat]};
`;

const Count = styled.div`
  font-size: 46px;
  font-weight: 900;
  line-height: 1;
  color: ${p => ({ hot: '#C03000', warm: '#A05800', cold: '#0D5EA8' })[p.$heat]};
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-top: 5px;
  color: ${p => ({ hot: '#C03000', warm: '#A05800', cold: '#0D5EA8' })[p.$heat]};
`;

const Desc = styled.div`
  font-size: 11px;
  margin-top: 2px;
  color: ${p => ({ hot: '#D4703A', warm: '#B07820', cold: '#4480B8' })[p.$heat]};
`;

const PhotoStrip = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid ${p => ({ hot: '#FFCDB0', warm: '#FFE49A', cold: '#B0D4F8' })[p.$heat]};
`;

const ThumbImg = styled.img`
  flex: 1;
  min-width: 0;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  border: 1.5px solid rgba(0,0,0,.07);
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  &:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 14px rgba(0,0,0,.22);
  }
`;

const MoreCount = styled.div`
  flex: 1;
  min-width: 0;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${p => ({ hot: '#FFCDB0', warm: '#FFE49A', cold: '#B0D4F8' })[p.$heat]};
  color: ${p => ({ hot: '#B83000', warm: '#8A5500', cold: '#0D4E8A' })[p.$heat]};
`;

const scoreRange = { hot: 'Score ≥ 70', warm: 'Score 35–69', cold: 'Score < 35' };

export default function HeatCards({ properties, onSelectProperty }) {
  const levels = ['hot', 'warm', 'cold'];
  const emoji  = { hot: '🔥', warm: '🌡️', cold: '❄️' };

  return (
    <Grid>
      {levels.map(heat => {
        const group = properties
          .filter(p => p.heat === heat)
          .sort((a, b) => b.score - a.score);
        const shown = group.slice(0, 3);
        const extra = group.length - shown.length;

        return (
          <Card key={heat} $heat={heat}>
            <Inner>
              <CardTop>
                <Emoji>{emoji[heat]}</Emoji>
                <Pill $heat={heat}>{scoreRange[heat]}</Pill>
              </CardTop>
              <Count $heat={heat}>{group.length}</Count>
              <Label $heat={heat}>{heatLabel[heat].replace(/^[^\s]+\s/, '')}</Label>
              <Desc $heat={heat}>propiedades activas</Desc>

              <PhotoStrip $heat={heat}>
                {shown.map(p => (
                  <ThumbImg
                    key={p.id}
                    src={p.primaryPhoto}
                    alt={p.title}
                    title={p.title}
                    onClick={() => onSelectProperty(p)}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ))}
                {extra > 0 && <MoreCount $heat={heat}>+{extra}</MoreCount>}
              </PhotoStrip>
            </Inner>
          </Card>
        );
      })}
    </Grid>
  );
}
