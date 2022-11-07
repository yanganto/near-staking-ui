import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {SignInPrompt, SignOutButton} from "./ui/components/wallet/wallet-components";
import CreateStakingPool from "./ui/components/staking/CreateStakingPool";


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
			<Grid container pt={ 2 } justifyContent="flex-end">
				<Grid item>
					<SignOutButton accountId={ wallet.accountId } onClick={ () => wallet.signOut() }/>
				</Grid>
			</Grid>
			<Grid item>
				<CreateStakingPool wallet={ wallet }/>
			</Grid>
		</Container>
	);

}


