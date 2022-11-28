import NavBar from "./ui/components/NavBar";
import Home from "./pages/Home";
import CreateStakingPool from "./pages/CreateStakingPool";
import StakeToKuutamoPool from "./pages/StakeToKuutamoPool";
import {Grid, Container, Card, CardContent} from "@mui/material";
import {BrowserRouter, Routes, Route} from 'react-router-dom';


export default function App({ isSignedIn, wallet }) {
	return (
		<BrowserRouter>
			<Container component="main">
				<Grid container pt={ 2 } pb={ 2 } justifyContent="flex-end">
					<NavBar isSignedIn={ isSignedIn } wallet={ wallet }/>
				</Grid>
				<Grid item pt={6}>
					<Card variant="outlined">
						<CardContent>
							<Routes>
								<Route index element={ <Home/> }/>
								<Route path="/pool" element={ <CreateStakingPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/stake" element={ <StakeToKuutamoPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							</Routes>
						</CardContent>
					</Card>
				</Grid>
			</Container>
		</BrowserRouter>
	);
}
