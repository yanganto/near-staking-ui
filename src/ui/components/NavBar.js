import * as React from 'react';
import {
	AppBar,
	Toolbar,
	Button,
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Drawer,
	IconButton,
	ListItemIcon,
	Divider,
	Chip,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField, Radio, DialogActions, CircularProgress
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
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ShareIcon from '@mui/icons-material/Share';
import {useConfirm} from "material-ui-confirm";
import {nearConfig} from "../../helpers/nearConfig.js";


const NavBar = ({ isSignedIn, wallet, drawerWidth }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [openRpcDialog, setOpenRpcDialog] = React.useState(false);
	const [ownRpcUrl, setOwnRpcUrl] = React.useState(
		wallet.network === 'mainnet' ? localStorage.getItem('mainnet_rpc_url') :
			localStorage.getItem('testnet_rpc_url')
	);
	const [useOwnRpcUrl, setUseOwnRpcUrl] = React.useState(localStorage.getItem('use_own_rpc_url') || '');
	const [openBackendDialog, setOpenBackendDialog] = React.useState(false);
	const [ownBackendUrl, setOwnBackendUrl] = React.useState(localStorage.getItem('own_backend_url'));
	const [useOwnBackendUrl, setUseOwnBackendUrl] = React.useState(localStorage.getItem('use_own_backend_url') || '');
	const [selectedIndex, setSelectedIndex] = React.useState(window.location.pathname);
	const confirm = useConfirm();

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
		window.location.replace(window.location.origin);
	};
	const changeRpcUrl = (RpcUrl) => {
		setOwnRpcUrl(RpcUrl);
		if (wallet.network === 'mainnet')
			localStorage.setItem('mainnet_rpc_url', RpcUrl);
		else
			localStorage.setItem('testnet_rpc_url', RpcUrl);
	}
	const changeBackendUrl = (BackendUrl) => {
		setOwnBackendUrl(BackendUrl);
		localStorage.setItem('own_backend_url', BackendUrl);
	}

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const signOut = () => {
		if (wallet.wallet.id === 'wallet-connect') {
			confirm({
				confirmationText: "Force sign out", confirmationButtonProps: { autoFocus: true },
				title: "Please confirm this action in your wallet",
				content: <Box align="center"><CircularProgress/></Box>
			})
				.then(() => {
					localStorage.setItem('wc@2:client:0.3//session', '[]');
					window.location.replace(window.location.origin);
				}).catch(() => {
			});
		}
		wallet.signOut();
	};


	const drawer = (
		<>
			<Toolbar/>
			<List onClick={ () => {
				setMobileOpen(false);
			} }>
				<ListItem disablePadding to="/" component={ Link }
				          selected={ selectedIndex === "/" }
				          onClick={ (event) => handleListItemClick(event, "/") }>
					<ListItemButton>
						<ListItemIcon>
							<HomeIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Home"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/pools" component={ Link }
				          selected={ selectedIndex === "/pools" }
				          onClick={ (event) => handleListItemClick(event, "/pools") }>
					<ListItemButton>
						<ListItemIcon>
							<ShareIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="My Pools"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding disabled component={ Link }>
					<ListItemButton>
						<ListItemIcon>
							<NotInterestedIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Mount pool"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding disabled component={ Link }>
					<ListItemButton>
						<ListItemIcon>
							<NotInterestedIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Monitoring"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/stake" component={ Link }
				          selected={ selectedIndex === "/stake" }
				          onClick={ (event) => handleListItemClick(event, "/stake") }>
					<ListItemButton>
						<ListItemIcon>
							<SavingsIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Stake"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/rewards" component={ Link }
				          selected={ selectedIndex === "/rewards" }
				          onClick={ (event) => handleListItemClick(event, "/rewards") }>
					<ListItemButton>
						<ListItemIcon>
							<SavingsIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="Rewards"/>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding to="/news" component={ Link }
				          selected={ selectedIndex === "/news" }
				          onClick={ (event) => handleListItemClick(event, "/news") }>
					<ListItemButton>
						<ListItemIcon>
							<FeedIcon color="primary"/>
						</ListItemIcon>
						<ListItemText primary="News"/>
					</ListItemButton>
				</ListItem>
			</List>
			<Divider/>
			<List>
				<ListItem onClick={ () => setOpenRpcDialog(true) } component={ Link }>
					<Chip sx={ { width: 180 } } label={ !!useOwnRpcUrl && !!ownRpcUrl ? `rpc: custom` : `rpc: Pagoda` }
					      size="small"
					      color="primary" icon={ <ArrowDropDownIcon/> }/>
				</ListItem>
				<ListItem onClick={ () => setOpenBackendDialog(true) } component={ Link }>
					<Chip sx={ { width: 180 } } label={ !!useOwnBackendUrl && !!ownBackendUrl ? `backend: custom` : `backend: kuutamo` }
					      size="small"
					      color="primary" icon={ <ArrowDropDownIcon/> }/>
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
								        onClick={ () => signOut() }>Sign out</Button>
							</>
							:
							<Button sx={ { color: '#fff', border: '1px solid' } }
							        startIcon={ <LoginIcon/> } onClick={ () => wallet.signIn() }>
								Sign in
							</Button>
						}
					</Box>
					{ !isSignedIn ?
						<Box pl={ 1 } sx={ { display: { xs: 'none', sm: 'block' } } }>
							<Button sx={ { color: '#fff', border: '1px solid' } }
							        aria-controls={ open ? 'basic-menu' : undefined }
							        aria-haspopup="true"
							        aria-expanded={ open ? 'true' : undefined }
							        onClick={ handleClickNetwork }
							>
								<ArrowDropDownIcon/>
								Network: { localStorage.getItem("networkId") || 'testnet' }
							</Button>
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
						: null }
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
								<ListItem onClick={ handleClickNetwork } component={ Link }>
									<Chip sx={ { width: 180 } } label={ `Network: ${ localStorage.getItem("networkId") || 'testnet' } ` }
									      variant="outlined"
									      size="small" color="primary" icon={ <ArrowDropDownIcon/> }/>
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
			<Dialog open={ openRpcDialog } fullWidth>
				<DialogTitle id="alert-dialog-title">
					RPC
				</DialogTitle>
				<DialogContent>
					<List>
						<ListItem>
							<Radio
								checked={ !useOwnRpcUrl || !ownRpcUrl }
								onChange={ () => {
									setUseOwnRpcUrl(false);
									localStorage.setItem('use_own_rpc_url', '')
								} }
							/>
							<TextField
								type="text"
								margin="normal"
								fullWidth
								id="official_rpc"
								label="Pagoda RPC"
								disabled
								value={ wallet.walletSelector.options.network.officialRpc }
							/>
						</ListItem>
						<ListItem>
							<Radio
								checked={ !!useOwnRpcUrl && !!ownRpcUrl }
								onChange={ () => {
									setUseOwnRpcUrl(true);
									localStorage.setItem('use_own_rpc_url', 'true')
								} }
							/>
							<TextField
								type="text"
								margin="normal"
								fullWidth
								id="custom_rpc"
								label="Custom RPC"
								autoComplete="off"
								value={ ownRpcUrl || '' }
								onChange={ (e) => changeRpcUrl(e.target.value) }
							/>
						</ListItem>
					</List>
					<DialogActions>
						<Button onClick={ () => window.location.replace(window.location.origin + window.location.pathname) }
						        variant="outlined">Close</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
			<Dialog open={ openBackendDialog } fullWidth>
				<DialogTitle id="alert-dialog-title">
					Backend
				</DialogTitle>
				<DialogContent>
					<List>
						<ListItem>
							<Radio
								checked={ !useOwnBackendUrl || !ownBackendUrl }
								onChange={ () => {
									setUseOwnBackendUrl(false);
									localStorage.setItem('use_own_backend_url', '')
								} }
							/>
							<TextField
								type="text"
								margin="normal"
								fullWidth
								id="default_backend"
								label="kuutamo"
								disabled
								value={ nearConfig.defaultBackendUrl }
							/>
						</ListItem>
						<ListItem>
							<Radio
								checked={ !!useOwnBackendUrl && !!ownBackendUrl }
								onChange={ () => {
									setUseOwnBackendUrl(true);
									localStorage.setItem('use_own_backend_url', 'true')
								} }
							/>
							<TextField
								type="text"
								margin="normal"
								fullWidth
								id="custom_backend"
								label="custom"
								autoComplete="off"
								value={ ownBackendUrl || '' }
								onChange={ (e) => changeBackendUrl(e.target.value) }
							/>
						</ListItem>
					</List>
					<DialogActions>
						<Button onClick={ () => window.location.replace(window.location.origin + window.location.pathname) }
						        variant="outlined">Close</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</>

	);
}

export default NavBar;
