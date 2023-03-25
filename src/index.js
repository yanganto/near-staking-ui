import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Wallet } from './helpers/near-wallet';
import { nearConfig } from './helpers/nearConfig';

const wallet = new Wallet({
  createAccessKeyFor: nearConfig.contractId,
  network: nearConfig.networkId,
});

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App isSignedIn={isSignedIn} wallet={wallet} />);
};
