import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {red} from "@mui/material/colors";
import {Wallet} from './helpers/near-wallet';


const wallet = new Wallet({ network: process.env.REACT_APP_NETWORK });


const theme = createTheme({
	palette: {
		primary: {
			main: '#5e30eb',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
	},
});


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
