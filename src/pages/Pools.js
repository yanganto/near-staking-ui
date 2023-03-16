import {
	Button,
	Container,
	LinearProgress,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Table,
	Typography, Dialog, DialogContent, TextField, DialogActions, DialogTitle, IconButton
} from "@mui/material";
import {useEffect, useState} from "react";
import {getMyPools, getSignature} from "../helpers/staking";
import {Link} from 'react-router-dom';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Box from "@mui/material/Box";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {nearConfig} from "../helpers/nearConfig";
import {useTheme} from "@mui/material/styles";


const Pools = ({ wallet, isSignedIn }) => {
	const theme = useTheme();
	const [myPools, setMyPools] = useState({});
	const [myPoolsIsReady, setMyPoolsIsReady] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [existingValidator, setExistingValidator] = useState('');

	useEffect(() => {
		(async () => {
			setMyPoolsIsReady(false);
			const res = await getMyPools(wallet);
			setMyPools(res);
			setMyPoolsIsReady(true);
		})();
	}, [wallet]);

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}

	const addExistingValidator = async () => {
		const { signature, public_key } = await getSignature(wallet, existingValidator);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				network: nearConfig.networkId,
				account_id: wallet.accountId,
				pool_id: existingValidator,
				signature,
				public_key,
			})
		};
		await fetch(
			nearConfig.backendUrl + "add-existing-validator", requestOptions
		).then(async response => {
			await response.json();
		}).catch(error => {
			console.error('There was an error!', error);
		});
		setOpenDialog(false);
		setExistingValidator('');
		setMyPoolsIsReady(false);
		const res = await getMyPools(wallet);
		setMyPools(res);
		setMyPoolsIsReady(true);
	}

	return <Container>
		<Dialog open={ openDialog }>
			<DialogTitle id="alert-dialog-title">
				Add existing validator
			</DialogTitle>
			<DialogContent>
				<TextField
					type="text"
					margin="normal"
					required
					fullWidth
					id="validator"
					label="Validator name"
					autoComplete="off"
					value={ existingValidator }
					onChange={ (e) => setExistingValidator(e.target.value) }
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={ () => setOpenDialog(false) } variant="outlined">Close</Button>
				<Button onClick={ addExistingValidator } variant="contained" disabled={ !existingValidator }>Add</Button>
			</DialogActions>
		</Dialog>
		<Box sx={ { display: 'flex', alignItems: 'center' } }>
			<Typography component="h1" variant="h4" align="left">
				List of validators
			</Typography>
			<Box sx={ { flexGrow: 1 } }/>
			<Button onClick={ () => setOpenDialog(true) } startIcon={ <AddBoxOutlinedIcon/> } variant="text"
			        sx={ {
				        padding: '16px 32px',
				        boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
				        color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
				        border: 'inherit',
				        fontSize: '15px',
				        margin: '16px 4px 16px 8px',
			        } }>
				Add existing validator
			</Button>
			<Button to="/pools/create" component={ Link } startIcon={ <AddBoxOutlinedIcon/> } variant="text"
			        sx={ {
				        padding: '16px 32px',
				        boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
				        color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
				        border: 'inherit',
				        fontSize: '15px',
				        margin: '16px 4px 16px 8px',
			        } }>
				New validator
			</Button>
		</Box>
		<Table aria-label="Pools">
			<TableHead>
				<TableRow>
					<TableCell sx={ { borderRadius: '10px 0 0 10px' } }>Pool</TableCell>
					<TableCell>owner_id</TableCell>
					<TableCell>public_key</TableCell>
					<TableCell sx={ { borderRadius: '0 10px 10px 0' } }>Fee</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{ Object.keys(myPools).map((key, index) => (
					<TableRow
						key={ index }
						sx={ { '&:last-child td, &:last-child th': { border: 0 } } }
					>
						<TableCell component="th" scope="row" sx={ { borderRadius: '10px 0 0 10px' } }>
							{ key }
						</TableCell>
						<TableCell title={ "Click to Copy to Clipboard\n" + myPools[key].owner_id } onClick={ () => {
							navigator.clipboard.writeText(myPools[key].owner_id)
						} }>
							{ myPools[key].owner_id && myPools[key].owner_id.length > 24 ?
								myPools[key].owner_id.substring(0, 12) + '...' + myPools[key].owner_id.substring(myPools[key].owner_id.length - 12)
								: myPools[key].owner_id
							}
						</TableCell>
						<TableCell title={ "Click to Copy to Clipboard\n" + myPools[key].public_key } onClick={ () => {
							navigator.clipboard.writeText(myPools[key].public_key)
						} }>
							{ myPools[key].public_key && myPools[key].public_key.length > 24 ?
								myPools[key].public_key.substring(0, 12) + '...' + myPools[key].public_key.substring(myPools[key].public_key.length - 12)
								: myPools[key].public_key
							} <IconButton color="inherit">
								<ContentCopyIcon color="action" fontSize="small"/>
							</IconButton>
						</TableCell>
						<TableCell sx={ { borderRadius: '0 5px 5px 0' } }>{ myPools[key].fee }%</TableCell>
					</TableRow>
				)) }
			</TableBody>
		</Table>
		{ !myPoolsIsReady ?
			<LinearProgress/>
			: null }
	</Container>;
};

export default Pools;