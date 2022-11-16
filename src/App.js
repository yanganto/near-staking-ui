import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {SignInPrompt, SignOutButton} from "./ui/components/wallet/wallet-components";
import CreateStakingPool from "./ui/components/staking/CreateStakingPool";
import {Card, CardContent, Typography} from "@mui/material";


export default function App({ isSignedIn, wallet }) {
	return (
		<Container component="main">
			<Grid container p={ 2 } justifyContent="flex-end">
				<Grid item>
					{ isSignedIn ? <SignOutButton accountId={ wallet.accountId } onClick={ () => wallet.signOut() }/>
						: <SignInPrompt onClick={ () => wallet.signIn() }/>
					}
				</Grid>
			</Grid>
			<Grid item>
				<Card variant="outlined">
					<CardContent>
						{ isSignedIn ?
							<CreateStakingPool isSignedIn={ isSignedIn } wallet={ wallet }/>
							: <Container align="center">
									<Typography component="h1" variant="h5">
										Welcome to kuutamo!
									</Typography>
							</Container>
						}
					</CardContent>
				</Card>
			</Grid>
		</Container>
	);
}
