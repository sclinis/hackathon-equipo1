import "@/styles/globals.css";
import { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; }
  a { text-decoration: none; }
  img { max-width: 100%; }
`;

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <GlobalStyle />
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
