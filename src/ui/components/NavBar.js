import * as React from 'react';
import {
	AppBar,
	Toolbar,
	Button,
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText, Drawer, IconButton, ListItemIcon, Divider, Chip, Tooltip
} from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Link} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import AddIcon from '@mui/icons-material/Add';
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const NavBar = ({ isSignedIn, wallet, drawerWidth }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};
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
		<>
			<Toolbar/>
			<List onClick={ handleDrawerToggle }>
				<ListItem disablePadding to="/" component={ Link }
				          selected={ selectedIndex === 1 }
				          onClick={ (event) => handleListItemClick(event, 1) }>
					<ListItemButton>
						<ListItemIcon>
							<HomeIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Home"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/pool" component={ Link }
				          selected={ selectedIndex === 2 }
				          onClick={ (event) => handleListItemClick(event, 2) }>
					<ListItemButton>
						<ListItemIcon>
							<AddIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Create pool"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/stake" component={ Link }
				          selected={ selectedIndex === 3 }
				          onClick={ (event) => handleListItemClick(event, 3) }>
					<ListItemButton>
						<ListItemIcon>
							<SavingsIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Stake"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/news" component={ Link }
				          selected={ selectedIndex === 4 }
				          onClick={ (event) => handleListItemClick(event, 4) }>
					<ListItemButton>
						<ListItemIcon>
							<FeedIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="News"/>
					</ListItemButton>
				</ListItem>
			</List>
		</>
	);


	return (
		<>
			<AppBar position="fixed" sx={ { zIndex: (theme) => theme.zIndex.drawer + 1 } }>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={ handleDrawerToggle }
						sx={ { mr: 2, display: { sm: 'none' } } }
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
					<Box align="right">
						{ isSignedIn ?
							<>
								<Tooltip title="Click to Copy to Clipboard">
									<Button sx={ { color: '#fff' } } onClick={ () => {
										navigator.clipboard.writeText(wallet.accountId)
									} }>
										{ wallet.accountId.length > 16 ?
											wallet.accountId.substring(0, 8) + '...' + wallet.accountId.substring(wallet.accountId.length - 8)
											: wallet.accountId
										}
									</Button>
								</Tooltip>
								<Button sx={ { color: '#fff', border: '1px solid' } }
								        endIcon={ <LogoutIcon/> }
								        onClick={ () => {
									        wallet.signOut();
								        } }>Sign out</Button>
							</>
							:
							<Button sx={ { color: '#fff', border: '1px solid' } }
							        startIcon={ <LoginIcon/> } onClick={ () => wallet.signIn() }>
								Sign in
							</Button>
						}
					</Box>
					<Box pl={ 1 } sx={ { display: { xs: 'none', sm: 'block' } } }>

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
			<Box
				component="nav"
				sx={ { width: { sm: drawerWidth }, flexShrink: { sm: 0 } } }
			>
				<Drawer
					variant="temporary"
					open={ mobileOpen }
					onClose={ handleDrawerToggle }
					ModalProps={ {
						keepMounted: true, // Better open performance on mobile.
					} }
					sx={ {
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					} }
				>
					{ drawer }
					{ !isSignedIn ?
						<>
							<Divider/>
							<List>
								<ListItem disablePadding onClick={ handleClickNetwork } component={ Link }>
									<ListItemButton>
										<ListItemText>
											<Chip label={ `Network: ${ localStorage.getItem("networkId") || 'testnet' } ` } variant="outlined"
											      color="primary" icon={ <ArrowDropDownIcon/> }/>
										</ListItemText>
									</ListItemButton>
								</ListItem>
							</List>
						</> : null }
				</Drawer>
				<Drawer
					variant="permanent"
					sx={ {
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					} }
					open
				>
					{ drawer }
				</Drawer>
			</Box>
		</>

	);
}

export default NavBar;
