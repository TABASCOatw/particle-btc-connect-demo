import React, { useState, useEffect } from 'react';
import { useBTCProvider } from '@particle-network/btc-connectkit';

const NetworkIndicator = () => {
  const { getNetwork } = useBTCProvider();
  const [network, setNetwork] = useState('testnet');

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const currentNetwork = await getNetwork();
      if (currentNetwork !== network) {
        setNetwork(currentNetwork);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [network, getNetwork]);

  const networkColor = network === 'livenet' ? 'green' : 'grey';

  return (
    <div style={{ 
      position: 'absolute', 
      top: 17, 
      right: 17, 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <span style={{ marginRight: '10px', fontSize: '12px' }}>{network}</span>
      <div style={{ 
        height: '15px', 
        width: '15px', 
        borderRadius: '50%', 
        backgroundColor: networkColor 
      }}></div>
    </div>
  );
};

export default NetworkIndicator;
