import {Button, Grid, TextField} from "@mui/material";
import {MenuItem} from "@mui/material/index";


export function NavBar({ isSignedIn, wallet }) {
	return (
		<>
			{ isSignedIn ?
				<Grid item>
					<Button onClick={ () => wallet.signOut() } variant="outlined">Sign out { wallet.accountId }</Button>
				</Grid>
				:
				<Grid item>
					<Button onClick={ () => wallet.signIn() } variant="contained">Sign in with NEAR Wallet</Button>
				</Grid>
			}
			<Grid item pl={ 1 }>
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
			</Grid>
		</>

	);
}
