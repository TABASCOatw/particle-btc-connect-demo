import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ConnectProvider as BTCConnectProvider,
  OKXConnector,
  UnisatConnector,
  BitgetConnector,
} from '@particle-network/btc-connectkit';
import App from './App';
import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

function ConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <BTCConnectProvider
      options={{
        projectId: process.env.REACT_APP_PROJECT_ID,
        clientKey: process.env.REACT_APP_CLIENT_KEY,
        appId: process.env.REACT_APP_APP_ID,
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: [686868],
                version: '1.0.0',
              },
            ],
          },
        },
        walletOptions: {
          visible: true,
        }
      }}
      connectors={[new UnisatConnector(), new OKXConnector(), new BitgetConnector()]}
    >
      {children}
    </BTCConnectProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConnectProvider>
      <App />
    </ConnectProvider>
  </React.StrictMode>
);
