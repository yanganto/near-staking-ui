import {Box, Button, Container, Stack} from "@mui/material";
import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";


const Home = ({ isSignedIn, wallet }) => {
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

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

	return <>
		{ !isSignedIn ?
			<>
				<Box sx={ { position: 'fixed', top: '0', right: '0' } }>
					<Button sx={ { color: theme.palette.text.primary, border: '0px', textTransform: 'none' } }
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
				<Container align="center" sx={ { '@media (min-width:600px)': { paddingTop: '100px' } } }>
					<Stack spacing={ 6 } direction="row" alignItems="center" justifyContent="center">
						<Box alignItems="center" sx={ { display: { sm: 'flex' } } }>
							<img src="/kuutamo-logo.png" alt="kuutamo"/>
							<Typography sx={ {
								'@media (min-width:600px)': { padding: '30px' },
								fontWeight: 600,
								fontSize: '58px'
							} }>kuutamo</Typography>
							<Typography sx={ {
								fontWeight: 400,
								fontSize: '32px',
								'@media (min-width:600px)': { borderLeft: '1px solid #D2D1DA', paddingLeft: '30px' }
							} }>protocol
								infrastucture</Typography>
						</Box>
					</Stack>
					<Stack spacing={ 6 } direction={ { xs: 'column', sm: 'row' } } alignItems="center" justifyContent="center"
					       pt={ 5 }>
						<Button
							variant="contained"
							sx={ {
								background: '#802FF3',
								width: '280px',
								height: '77px',
								borderRadius: '15px',
								fontSize: '23px',
								color: '#FFFFFF',
								boxShadow: '0px 26.7143px 300.143px rgba(128, 47, 243, 0.24), 0px 13.3702px 150.218px rgba(128, 47, 243, 0.18248),' +
									' 0px 8.05357px 90.4843px rgba(128, 47, 243, 0.156381), 0px 5.16115px 57.9871px rgba(128, 47, 243, 0.137015),' +
									' 0px 3.34504px 37.5825px rgba(128, 47, 243, 0.12), 0px 2.10567px 23.6578px rgba(128, 47, 243, 0.102985), ' +
									'0px 1.20984px 13.5929px rgba(128, 47, 243, 0.0836187), 0px 0.53248px 5.98257px rgba(128, 47, 243, 0.0575202)'
							} }
							onClick={ () => wallet.signIn() }
						>Get started</Button>
						<Button
							variant="outlined"
							sx={ {
								width: '280px',
								height: '77px',
								fontSize: '23px',
								color: theme.palette.text.primary,
								borderRadius: '15px',
								border: '1px solid #802FF3'
							} }
							onClick={ () => wallet.signIn() }
						>Log in</Button>
					</Stack></Container></> : <></> }
	</>
}


export default Home;
