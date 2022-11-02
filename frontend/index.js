// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// NEAR
import { Wallet } from './helpers/near-wallet';

const wallet = new Wallet({ network: process.env.network });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(<App isSignedIn={isSignedIn} wallet={wallet} />);
}