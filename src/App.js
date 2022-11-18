import {NavBar} from "./ui/components/wallet/wallet-components";
import CreateStakingPool from "./ui/components/staking/CreateStakingPool";
import {Grid, Container, Card, CardContent, Typography} from "@mui/material";


export default function App({ isSignedIn, wallet }) {
	return (
		<Container component="main">
			<Grid container pt={ 2 } pb={ 2 } justifyContent="flex-end">
				<NavBar isSignedIn={ isSignedIn } wallet={ wallet }/>
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
