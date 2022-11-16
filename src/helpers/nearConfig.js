const testnet = {
	networkId: 'testnet',
	contractPool: process.env.REACT_APP_TESTNET_CONTRACT_POOL,
	contractPoolV1: process.env.REACT_APP_TESTNET_CONTRACT_POOL_V1,
	poolCodeHash: process.env.REACT_APP_TESTNET_POOL_CODE_HASH,
	walletConnectProjectId: process.env.REACT_APP_TESTNET_WALLET_CONNECT_PROJECT_ID,
	isTestnet: true,
};

const mainnet = {
	networkId: 'mainnet',
	contractPool: process.env.REACT_APP_MAINNET_CONTRACT_POOL,
	contractPoolV1: process.env.REACT_APP_MAINNET_CONTRACT_POOL_V1,
	poolCodeHash: process.env.REACT_APP_MAINNET_POOL_CODE_HASH,
	walletConnectProjectId: process.env.REACT_APP_MAINNET_WALLET_CONNECT_PROJECT_ID,
	isTestnet: false,
};

const configs = {
	testnet,
	mainnet,
};

const getNearConfig = (network) => {
	const config = configs[network];
	return {
		...config,
	};
};

export const nearConfig = getNearConfig(localStorage.getItem("networkId") || 'testnet');
