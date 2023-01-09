import NavBar from "./ui/components/NavBar";
import Home from "./pages/Home";
import CreateStakingPool from "./pages/CreateStakingPool";
import Pools from "./pages/Pools";
import StakeToKuutamoPool from "./pages/StakeToKuutamoPool";
import News from "./pages/News";
import {Card, CardContent, Toolbar} from "@mui/material";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Box from "@mui/material/Box";
import Rewards from "./pages/Rewards";

const drawerWidth = 220;

export default function App({ isSignedIn, wallet }) {
	return (
		<BrowserRouter>
			<Box sx={ { display: 'flex', zIndex: (theme) => theme.zIndex.drawer + 1 } }>
				<NavBar isSignedIn={ isSignedIn } wallet={ wallet } drawerWidth={ drawerWidth }/>
				<Box component="main"
				     sx={ { flexGrow: 1, p: 3, width: { sm: `calc(100% - ${ drawerWidth }px)` } } }
				>
					<Toolbar/>
					<Card variant="outlined">
						<CardContent>
							<Routes>
								<Route index element={ <Home/> }/>
								<Route path="/pools" element={ <Pools isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/pools/create" element={ <CreateStakingPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/stake" element={ <StakeToKuutamoPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/news" element={ <News/> }/>
								<Route path="/rewards" element={ <Rewards isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							</Routes>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</BrowserRouter>
	);
}
