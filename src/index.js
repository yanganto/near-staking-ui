import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Wallet} from './helpers/near-wallet';
import {nearConfig} from "./helpers/nearConfig";
import theme from "./ui/components/theme";


const wallet = new Wallet({ createAccessKeyFor: nearConfig.contractId, network: nearConfig.networkId });

// Setup on page load
window.onload = async () => {
	const isSignedIn = await wallet.startUp();
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(
		<ThemeProvider theme={ theme }>
			<App isSignedIn={ isSignedIn } wallet={ wallet }/>
			<CssBaseline/>
		</ThemeProvider>
	);
}
