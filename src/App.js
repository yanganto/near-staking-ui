import NavBar from "./ui/components/NavBar";
import Home from "./pages/Home";
import CreateStakingPool from "./pages/CreateStakingPool";
import Pools from "./pages/Pools";
import StakeToKuutamoPool from "./pages/StakeToKuutamoPool";
import News from "./pages/News";
import {Toolbar} from "@mui/material";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Box from "@mui/material/Box";
import Rewards from "./pages/Rewards";
import {ConfirmProvider} from "material-ui-confirm";

const drawerWidth = 340;

export default function App({ isSignedIn, wallet }) {
	return (
		<BrowserRouter>
			<ConfirmProvider>
				<Box sx={ { display: 'flex', zIndex: (theme) => theme.zIndex.drawer + 1, minHeight: `calc(100vh - 40px)` } }>
					{ isSignedIn ? <NavBar isSignedIn={ isSignedIn } wallet={ wallet } drawerWidth={ drawerWidth }/> : <></>}
					<Box component="main" sx={ { flexGrow: 1, p: 3, pt: 8, width: { sm: `calc(100% - ${ drawerWidth }px)` } } }>
						<Toolbar/>
						<Routes>
							<Route index element={ <Home isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							<Route path="/pools" element={ <Pools isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							<Route path="/pools/create" element={ <CreateStakingPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							<Route path="/stake" element={ <StakeToKuutamoPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							<Route path="/news" element={ <News/> }/>
							<Route path="/rewards" element={ <Rewards isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
						</Routes>
					</Box>
				</Box>
				<Box sx={ { textAlign: "center", width: '100%', height: '40px' } }>© 2023 Sephora USA, Inc. All rights
					reserved</Box>
			</ConfirmProvider>
		</BrowserRouter>
	);
}
