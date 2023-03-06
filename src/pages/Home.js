import {Box, Button, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


const Home = ({ isSignedIn, wallet }) => {
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
			<Box sx={{ position: 'fixed', top: '0', right: '0' }}>
				<Button sx={ { color: '#002147', border: '0px', textTransform: 'none' } }
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
			: <></> }
		<Container align="center">
			<img src="kuutamo.png" alt="kuutamo"/>
			<Typography sx={ { width: '758px', fontSize: '30px', color: '#5D636A', padding: '20px' } }>
				Illuminate your world with Kuutamo: beautiful, innovative products designed to enhance and inspire your everyday
				experience.
			</Typography>
			{ !isSignedIn ?
				<Stack spacing={ 6 } direction="row" alignItems="center" justifyContent="center" pt={ 2 }>
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
							color: '#002147',
							borderRadius: '15px',
							border: '1px solid #802FF3'
						} }
						onClick={ () => wallet.signIn() }
					>Log in</Button>
				</Stack> : <></> }
		</Container>
	</>;
};

export default Home;
