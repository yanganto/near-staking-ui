const testnet = {
  networkId: 'testnet',
  contractId: process.env.REACT_APP_TESTNET_CONTRACT_ID,
  contractPool: process.env.REACT_APP_TESTNET_CONTRACT_POOL,
  contractPoolV1: process.env.REACT_APP_TESTNET_CONTRACT_POOL_V1,
  poolCodeHash: process.env.REACT_APP_TESTNET_POOL_CODE_HASH,
  walletConnectProjectId:
    process.env.REACT_APP_TESTNET_WALLET_CONNECT_PROJECT_ID,
  backendUrl:
    localStorage.getItem('use_own_backend_url') &&
    localStorage.getItem('own_backend_url')
      ? localStorage.getItem('own_backend_url')
      : process.env.REACT_APP_TESTNET_BACKEND_URL,
  defaultBackendUrl: process.env.REACT_APP_TESTNET_BACKEND_URL,
  isTestnet: true,
};

const mainnet = {
  networkId: 'mainnet',
  contractId: process.env.REACT_APP_MAINNET_CONTRACT_ID,
  contractPool: process.env.REACT_APP_MAINNET_CONTRACT_POOL,
  contractPoolV1: process.env.REACT_APP_MAINNET_CONTRACT_POOL_V1,
  poolCodeHash: process.env.REACT_APP_MAINNET_POOL_CODE_HASH,
  walletConnectProjectId:
    process.env.REACT_APP_MAINNET_WALLET_CONNECT_PROJECT_ID,
  backendUrl:
    localStorage.getItem('use_own_backend_url') &&
    localStorage.getItem('own_backend_url')
      ? localStorage.getItem('own_backend_url')
      : process.env.REACT_APP_MAINNET_BACKEND_URL,
  defaultBackendUrl: process.env.REACT_APP_MAINNET_BACKEND_URL,
  isTestnet: false,
};

const configs = {
  testnet,
  mainnet,
};

const getNearConfig = (network) => {
  if (!network) {
    network = 'mainnet';
    localStorage.setItem('networkId', network);
  }
  const config = configs[network];
  return {
    ...config,
  };
};

export const nearConfig = getNearConfig(localStorage.getItem('networkId'));
