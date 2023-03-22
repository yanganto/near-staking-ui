import React from "react";
import {Toolbar} from "@mui/material";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Box from "@mui/material/Box";
import {ConfirmProvider} from "material-ui-confirm";
import theme from "./ui/components/theme";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "./ui/components/NavBar";
import CreateStakingPool from "./pages/CreateStakingPool";
import StakeToKuutamoPool from "./pages/StakeToKuutamoPool";
import Home from "./pages/Home";
import Pools from "./pages/Pools";
import Rewards from "./pages/Rewards";
import News from "./pages/News";


const drawerWidth = 340;

export default function App({ isSignedIn, wallet }) {
	const [isDarkTheme, setIsDarkTheme] = React.useState(localStorage.getItem('isDarkTheme') || '');
	const changeTheme = () => {
		setIsDarkTheme(!isDarkTheme);
		localStorage.setItem('isDarkTheme', isDarkTheme ? '' : 'true');
	};

	return (
		<ThemeProvider theme={ theme(isDarkTheme) }>
			<BrowserRouter>
				<ConfirmProvider>
					<Box sx={ { display: 'flex', zIndex: (theme) => theme.zIndex.drawer + 1, minHeight: `calc(100vh - 40px)` } }>
						{ isSignedIn ? <NavBar wallet={ wallet } drawerWidth={ drawerWidth } changeTheme={ changeTheme }/> : <></> }
						<Box component="main" sx={ { flexGrow: 1, p: 3, pt: 8, width: { sm: `calc(100% - ${ drawerWidth }px)` } } }>
							<Toolbar/>
							<Routes>
								<Route index element={ <Home isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/pools" element={ <Pools isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/pools/create"
								       element={ <CreateStakingPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/stake" element={ <StakeToKuutamoPool isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
								<Route path="/news" element={ <News/> }/>
								<Route path="/rewards" element={ <Rewards isSignedIn={ isSignedIn } wallet={ wallet }/> }/>
							</Routes>
						</Box>
					</Box>
					<Box sx={ { textAlign: "center", width: '100%', height: '40px' } }>© 2023 kuutamo. All rights reserved</Box>
				</ConfirmProvider>
			</BrowserRouter>
			<CssBaseline/>
		</ThemeProvider>
	);
}
