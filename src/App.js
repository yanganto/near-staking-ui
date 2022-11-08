import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {SignInPrompt, SignOutButton} from "./ui/components/wallet/wallet-components";
import CreateStakingPool from "./ui/components/staking/CreateStakingPool";
import {Card, CardContent} from "@mui/material";


export default function App({ isSignedIn, wallet }) {
	if (!isSignedIn) {
		return (
			<Container component="main">
				<SignInPrompt onClick={ () => wallet.signIn() }/>
			</Container>
		);
	}

	return (
		<Container component="main">
			<Grid container p={ 2 } justifyContent="flex-end">
				<Grid item>
					<SignOutButton accountId={ wallet.accountId } onClick={ () => wallet.signOut() }/>
				</Grid>
			</Grid>
			<Grid item>
				<Card variant="outlined">
					<CardContent>
						<CreateStakingPool wallet={ wallet }/>
					</CardContent>
				</Card>
			</Grid>
		</Container>
	);

}


