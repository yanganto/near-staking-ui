import * as React from 'react';
import {
	AppBar,
	Toolbar,
	Button,
	Box,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText, Drawer, IconButton
} from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Link} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";


const NavBar = ({ isSignedIn, wallet }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleClickNetwork = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const changeNetwork = (networkId) => {
		localStorage.setItem("networkId", networkId);
		if (isSignedIn) {
			wallet.signOut();
			window.location.replace(window.location.origin + window.location.pathname);
		} else {
			window.location.replace(window.location.origin);
		}
	};
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box sx={ { textAlign: 'center' } }>
			<Typography variant="h6" sx={ { my: 2 } }>
				kuutamo
			</Typography>
			<Divider/>
			<List onClick={ handleDrawerToggle }>
				<ListItem disablePadding to="/" component={ Link }>
					<ListItemButton sx={ { textAlign: 'center' } }>
						<ListItemText primary="Home"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/pool" component={ Link }>
					<ListItemButton sx={ { textAlign: 'center' } }>
						<ListItemText primary="Create a new pool"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/stake" component={ Link }>
					<ListItemButton sx={ { textAlign: 'center' } }>
						<ListItemText primary="Stake to a kuutamo pool"/>
					</ListItemButton>
				</ListItem>
			</List>
			{ !isSignedIn ?
				<List>
					<ListItem disablePadding onClick={ handleClickNetwork }>
						<ListItemButton sx={ { textAlign: 'center' } }>
							<ListItemText primary={ 'Network: ' + localStorage.getItem("networkId") || 'testnet' }/>
						</ListItemButton>
					</ListItem>
				</List> : null }
		</Box>
	);


	return (
		<>
			<AppBar component="nav">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={ handleDrawerToggle }
						sx={ { mr: 2, display: { lg: "none" } } }
					>
						<MenuIcon/>
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={ { flexGrow: 1 } }
					>
						kuutamo
					</Typography>
					<Box sx={ { flexGrow: 1, display: { xs: 'none', lg: 'block' } } }>
						<Button sx={ { color: '#fff' } } to="/" component={ Link }>Home</Button>
						<Button sx={ { color: '#fff' } } to="/pool" component={ Link }>Create a new pool</Button>
						<Button sx={ { color: '#fff' } } to="/stake" component={ Link }>Stake to a kuutamo pool</Button>
					</Box>
					<Box>
						{ isSignedIn ?
							<>
								<Box component="span" sx={ { p: 2 } }>
									{ wallet.accountId }
								</Box>
								<Button sx={ { color: '#fff', border: '1px solid' } }
								        endIcon={ <LogoutIcon/> }
								        onClick={ () => {
									        wallet.signOut();
								        } }>Sign out</Button>
							</>
							:
							<Button sx={ { color: '#fff', border: '1px solid' } }
							        startIcon={ <LoginIcon/> } onClick={ () => wallet.signIn() }>
								Sign in with NEAR Wallet
							</Button>
						}
					</Box>
					<Box pl={ 1 } sx={ { display: { xs: 'none', lg: 'block' } } }>

						{ !isSignedIn ?
							<Button sx={ { color: '#fff', border: '1px solid' } }
							        aria-controls={ open ? 'basic-menu' : undefined }
							        aria-haspopup="true"
							        aria-expanded={ open ? 'true' : undefined }
							        onClick={ handleClickNetwork }
							>
								Network: { localStorage.getItem("networkId") || 'testnet' }
							</Button> : null }
						<Menu
							id="basic-menu"
							anchorEl={ anchorEl }
							open={ open }
							onClose={ handleClose }
							MenuListProps={ {
								'aria-labelledby': 'basic-button',
							} }
						>
							<MenuItem value="testnet" onClick={ () => changeNetwork('testnet') }>testnet</MenuItem>
							<MenuItem value="mainnet" onClick={ () => changeNetwork('mainnet') }>mainnet</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<Box component="nav">
				<Drawer
					variant="temporary"
					open={ mobileOpen }
					onClose={ handleDrawerToggle }
					ModalProps={ {
						keepMounted: true, // Better open performance on mobile.
					} }
					sx={ {
						display: { xs: 'block', lg: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
					} }
				>
					{ drawer }
				</Drawer>
			</Box>
		</>

	);
}

export default NavBar;
