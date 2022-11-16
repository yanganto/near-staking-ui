import Button from "@mui/material/Button";
import {TextField} from "@mui/material";
import {MenuItem} from "@mui/material/index";


export function SignInPrompt({ onClick }) {
	return (
		<>
			<TextField
				select
				label="Network"
				id="networkId"
				size="small"
				value={ localStorage.getItem("networkId") || 'testnet' }
				onChange={ e => {
					localStorage.setItem("networkId", e.target.value);
					window.location.replace(window.location.origin + window.location.pathname);
				} }
			>
				<MenuItem value="testnet">testnet</MenuItem>
				<MenuItem value="mainnet">mainnet</MenuItem>
			</TextField>
			<Button onClick={ onClick } variant="contained">Sign in with NEAR Wallet</Button>
		</>

	);
}

export function SignOutButton({ accountId, onClick }) {
	return (
		<>
			<TextField
				select
				label="Network"
				id="networkId"
				size="small"
				value={ localStorage.getItem("networkId") || 'testnet' }
				onChange={ e => {
					localStorage.setItem("networkId", e.target.value);
					window.location.replace(window.location.origin + window.location.pathname);
					onClick();
				} }
			>
				<MenuItem value="testnet">testnet</MenuItem>
				<MenuItem value="mainnet">mainnet</MenuItem>
			</TextField>
			<Button onClick={ onClick } variant="outlined">
				Sign out { accountId }
			</Button>
		</>
	);
}

