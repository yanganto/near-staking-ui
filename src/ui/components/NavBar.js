import * as React from 'react';
import {
	AppBar,
	Toolbar,
	Button,
	Box,
	List,
	ListItem,
	Drawer,
	IconButton,
	Chip,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField, Radio, DialogActions, CircularProgress
} from "@mui/material";
import {Link} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useConfirm} from "material-ui-confirm";
import {nearConfig} from "../../helpers/nearConfig.js";
import MainMenu from "./MainMenu";


const NavBar = ({ isSignedIn, wallet, drawerWidth }) => {
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
	const confirm = useConfirm();


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
			<MainMenu/>
			<List sx={{ paddingLeft: '12px'}}>
				<ListItem onClick={ () => setOpenRpcDialog(true) } component={ Link }>
					<Chip sx={ { width: 264, height: 32 } }
					      label={ !!useOwnRpcUrl && !!ownRpcUrl ? `rpc: custom` : `rpc: Pagoda` }
					      icon={ <ArrowDropDownIcon/> }/>
				</ListItem>
				<ListItem onClick={ () => setOpenBackendDialog(true) } component={ Link }>
					<Chip sx={ { width: 264, height: 32 } }
					      label={ !!useOwnBackendUrl && !!ownBackendUrl ? `backend: custom` : `backend: kuutamo` }
					      icon={ <ArrowDropDownIcon/> }/>
				</ListItem>
			</List>
		</>
	);


	return (
		<>
			<AppBar position="fixed" sx={ {
				zIndex: (theme) => theme.zIndex.drawer + 1,
				height: '96px',
				justifyContent: 'center',
				color: 'inherit',
				bgcolor: '#FEFEFF',
				borderBottom: '1px solid #D2D1DA',
				boxShadow: 'none'
			} }>
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
						<Box display="flex" alignItems="center">
							{ isSignedIn ?
								<Tooltip title="Click to Copy to Clipboard">
									<Button sx={ { color: '#002147', textTransform: 'none' } }
									        variant="text"
									        endIcon={ <ArrowDropDownIcon/> }
									        onClick={ () => {
										        navigator.clipboard.writeText(wallet.accountId)
									        } }>
										{ wallet.accountId.length > 16 ?
											wallet.accountId.substring(0, 8) + '...' + wallet.accountId.substring(wallet.accountId.length - 8)
											: wallet.accountId
										}
									</Button>
								</Tooltip>
								: <></>
							}
							<Typography pl={ 3 }>
								<img src="/dark-mode.png" alt="dark-mode"/>
							</Typography>
							<Typography pl={ 2 }>
								<img src="/notifications.png" alt="notifications"/>
							</Typography>
						</Box>
					</Typography>
					<Typography component="div" sx={ { flexGrow: 1 } }>
						<Box display="flex" alignItems="center" pl={2}>
							<img src="/kuutamo-logo.png" alt="kuutamo"/>
							<Typography pl={ 1 } pr={ 2 } sx={ {
								fontWeight: 600,
								fontSize: '32px'
							} }>kuutamo</Typography>
							<Typography pl={ 2 } sx={ { fontWeight: 400, fontSize: '16px', borderLeft: '1px solid #D2D1DA' } }>protocol
								infrastucture</Typography>
						</Box>
					</Typography>
					<Box align="right">
						{ isSignedIn ?
							<>
								<Button sx={ { color: '#002147', textTransform: 'none' } }
								        variant="text"
								        startIcon={ <LogoutIcon/> }
								        onClick={ () => signOut() }>Log out</Button>
							</>
							:
							<Button sx={ { color: '#002147', textTransform: 'none' } }
							        variant="text"
							        startIcon={ <LoginIcon/> } onClick={ () => wallet.signIn() }>
								Sign in
							</Button>
						}
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
				</Drawer>
				<Drawer
					variant="permanent"
					sx={ {
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderWidth: 0, background: 'none' },
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
