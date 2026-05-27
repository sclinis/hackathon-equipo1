import styled from 'styled-components';

const Nav = styled.header`
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 28px;
  height: 62px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 40px;
  cursor: pointer;
  flex-shrink: 0;
`;

const NavLinks = styled.nav`
  display: flex;
  height: 62px;
`;

const NavLink = styled.a`
  padding: 0 14px;
  height: 62px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${p => p.$active ? '#222' : '#555'};
  font-size: 14px;
  font-weight: ${p => p.$active ? 600 : 400};
  border-bottom: 2px solid ${p => p.$active ? '#FF5A00' : 'transparent'};
  cursor: pointer;
  transition: color .15s;
  white-space: nowrap;
  &:hover { color: #222; }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RightLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: ${p => p.$bold ? 600 : 400};
  color: #222;
  cursor: pointer;
  text-decoration: none;
  border-radius: 6px;
  white-space: nowrap;
  transition: background .15s;
  &:hover { background: #f5f5f5; }
`;

const Chevron = styled.span`
  font-size: 10px;
  color: #888;
  margin-left: 2px;
`;

const BellBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  color: #444;
  transition: background .15s;
  &:hover { background: #f5f5f5; }
`;

const BtnPub = styled.button`
  background: #FF5A00;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  transition: background .15s;
  &:hover { background: #E04800; }
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  margin-left: 2px;
  transition: background .15s;
  &:hover { background: #f5f5f5; }
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background: #fff;
  color: #333;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Bell SVG matching the outlined style in the reference
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

export default function TopNav() {
  return (
    <Nav>
      <Logo>
        <img src="./zonaprop.52ab5274.svg" alt="zonaprop" style={{ height: 46, display: 'block' }} />
      </Logo>

      <NavLinks>
        <NavLink href="#">Mis avisos</NavLink>
        <NavLink href="#">Interesados</NavLink>
        <NavLink href="#" $active>Estadísticas</NavLink>
      </NavLinks>

      <Right>
        <RightLink href="#">
          Mi ejecutivo <Chevron>▾</Chevron>
        </RightLink>
        <RightLink href="#" $bold>Comprar</RightLink>
        <BellBtn>
          <BellIcon />
        </BellBtn>
        <BtnPub>Publicar</BtnPub>
        <AvatarWrap>
          <Avatar>P</Avatar>
          <Chevron>▾</Chevron>
        </AvatarWrap>
      </Right>
    </Nav>
  );
}
