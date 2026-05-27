import { useState } from 'react';
import styled from 'styled-components';

const Aside = styled.aside`
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  padding: 20px 0;
`;

const AgencyCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
`;

const AgencyLogoImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
`;

const AgencyLogoFallback = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

const AgencyInfo = styled.div``;
const AgencyName = styled.div`font-weight: 600; font-size: 13px; color: #333; line-height: 1.3;`;
const AgencyType = styled.div`font-size: 11px; color: #aaa; margin-top: 1px;`;

const SideLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  text-decoration: none;
  color: ${p => p.$active ? '#FF5A00' : '#555'};
  font-size: 14px;
  font-weight: ${p => p.$active ? 600 : 400};
  border-left: 3px solid ${p => p.$active ? '#FF5A00' : 'transparent'};
  background: ${p => p.$active ? '#fff5f0' : 'transparent'};
  cursor: pointer;
  transition: all .15s;
  &:hover {
    background: #fff5f0;
    color: #FF5A00;
  }
`;

const navItems = [
  {
    label: 'Reputación',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Rendimiento',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'TermoProp 🔥',
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>
    ),
  },
];

function AgencyLogo() {
  const [broken, setBroken] = useState(false);
  if (broken) return <AgencyLogoFallback>FP</AgencyLogoFallback>;
  return (
    <AgencyLogoImg
      src="./facciolo-logo.png"
      alt="Facciolo Propiedades"
      onError={() => setBroken(true)}
    />
  );
}

export default function Sidebar() {
  return (
    <Aside>
      <AgencyCard>
        <AgencyLogo />
        <AgencyInfo>
          <AgencyName>Facciolo Propiedades</AgencyName>
          <AgencyType>Inmobiliaria</AgencyType>
        </AgencyInfo>
      </AgencyCard>
      <nav>
        {navItems.map(item => (
          <SideLink key={item.label} href="#" $active={item.active}>
            {item.icon}
            {item.label}
          </SideLink>
        ))}
      </nav>
    </Aside>
  );
}
