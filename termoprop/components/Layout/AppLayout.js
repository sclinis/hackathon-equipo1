import styled from 'styled-components';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

const Wrapper = styled.div`
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  color: #333;
  font-size: 14px;
`;

const Body = styled.div`
  display: flex;
  min-height: calc(100vh - 56px);
`;

const Main = styled.main`
  flex: 1;
  padding: 28px 32px;
  min-width: 0;
`;

export default function AppLayout({ children }) {
  return (
    <Wrapper>
      <TopNav />
      <Body>
        <Sidebar />
        <Main>{children}</Main>
      </Body>
    </Wrapper>
  );
}
