import React, { useState, useEffect } from 'react';
import { useETHProvider, useBTCProvider, useConnectModal } from '@particle-network/btc-connectkit';
import { chains } from '@particle-network/chains';
import NetworkIndicator from './networkIndicator';
import { notification } from 'antd';
import './App.css';

const App = () => {
  const { smartAccount, chainId } = useETHProvider();
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts, sendBitcoin } = useBTCProvider();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const setAddressAsync = async () => {
        const addr = await smartAccount.getAddress();
        setAddress(addr);
      };
      setAddressAsync();
    }
  }, [accounts, smartAccount]);

  const handleLogin = () => {
    if (!accounts.length) {
      openConnectModal();
    }
  };

  const executeTxEvm = async () => {
    const tx = {
      to: "0x00000000000000000000000000000000000dEAD0",
      value: '100000000000',
      data: "0x"
    };

    const feeQuotes = await smartAccount.getFeeQuotes(tx);
    const { userOp, userOpHash } = feeQuotes.verifyingPaymasterGasless;
    const hash = await smartAccount.sendUserOperation({ userOp, userOpHash });
    
    notification.success({
      message: 'Transaction Successful',
      description: (
        <div>
          Transaction Hash: <a href={`${chains.getEVMChainInfoById(chainId).blockExplorerUrl}/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
        </div>
      )
    });
  };

  const executeTxBtc = async () => {
    const hash = await sendBitcoin(accounts[0], 1);
    
    notification.success({
      message: 'Transaction Successful',
      description: (
        <div>
          Transaction Hash: <a href={`https://live.blockcypher.com/btc-testnet/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
        </div>
      )
    });
  };

  return (
    <div className="App">
      <div className="logo-section">
        <img src="https://i.imgur.com/EerK7MS.png" alt="Logo 1" className="logo logo-big" />
      </div>
      {!address ? (
      <button className="sign-button" onClick={handleLogin}>
        <img src="https://i.imgur.com/aTxNcXk.png" alt="Bitcoin Logo" className="bitcoin-logo" />
        Connect
      </button>
      ) : (
        <div className="profile-card">
          <NetworkIndicator />
          <h5>{address}</h5>
          <h5>{accounts[0]}</h5>
          <button className="sign-message-button" onClick={executeTxEvm}>Execute Transaction (EVM)</button>
          <button className="sign-message-button" onClick={executeTxBtc}>Execute Transaction (Bitcoin)</button>
          <button className="disconnect-button" onClick={() => {disconnect(); setAddress(null)}}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
