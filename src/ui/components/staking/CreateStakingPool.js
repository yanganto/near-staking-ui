import SuccessMessage from "../modal/SuccessMessage";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import React from "react";
import {createStakingPool, generateKey} from "../../../helpers/staking";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import {InputAdornment} from "@mui/material/index";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";


const CreateStakingPool = ({ wallet }) => {
	const [poolName, setPoolName] = React.useState('');
	const [ownerAccount, setOwnerAccount] = React.useState('');
	const [publicKey, setPublicKey] = React.useState('');
	const [percentageFee, setPercentageFee] = React.useState('');
	const [poolNameErrorText, setPoolNameErrorText] = React.useState('');
	const [ownerAccountErrorText, setOwnerAccountErrorText] = React.useState('');
	const [publicKeyErrorText, setPublicKeyErrorText] = React.useState('');
	const [percentageFeeErrorText, setPercentageFeeErrorText] = React.useState('');


	async function submitCreateStakingPool(e) {
		e.preventDefault();
		if (chekForm()) {
			await createStakingPool(wallet, poolName, ownerAccount, publicKey, percentageFee);
		}
	}

	const handlePublicKeyChange = event => {
		setPublicKey(event.target.value);
		setPublicKeyErrorText('');
	};

	const handleGenerateKey = () => {
		if (poolName) {
			const kp = generateKey(poolName + '.' + process.env.REACT_APP_CONTRACT_POOL);
			setPublicKey(kp.public_key);
		} else {
			setPoolNameErrorText('Please enter Pool Name');
		}
	};

	const chekForm = () => {
		if (!poolName) setPoolNameErrorText('Please enter Pool Name');
		if (!ownerAccount) setOwnerAccountErrorText('Please enter Owner account');
		if (!publicKey) setPublicKeyErrorText('Please enter Public key');
		if (!percentageFee) setPercentageFeeErrorText('Please enter Percentage fee');
		return poolName && ownerAccount && publicKey && percentageFee;
	};


	return (
		<Box
			sx={ {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			} }
		>
			<Box component="form">
				<Typography component="h1" variant="h5" align={ "center" }>
					Create staking pool
				</Typography>
				<SuccessMessage config={ wallet.walletSelector.options.network }/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="poolName"
					label="Pool Name"
					autoComplete="off"
					autoFocus
					InputProps={ {
						endAdornment: <InputAdornment position="end">.{ process.env.REACT_APP_CONTRACT_POOL }</InputAdornment>,
					} }
					helperText={ poolNameErrorText }
					error={ !!poolNameErrorText }
					value={ poolName } onChange={ e => {
					setPoolName(e.target.value);
					setPoolNameErrorText("")
				} }/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="ownerAccount"
					label="Owner account"
					autoComplete="off"
					InputProps={ {
						endAdornment: <InputAdornment position="end">.{ process.env.REACT_APP_NETWORK }</InputAdornment>,
					} }
					helperText={ ownerAccountErrorText }
					error={ !!ownerAccountErrorText }
					value={ ownerAccount } onChange={ e => {
					setOwnerAccount(e.target.value);
					setOwnerAccountErrorText("")
				} }/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="publicKey"
					label="Public key"
					autoComplete="off"
					helperText={ publicKeyErrorText }
					error={ !!publicKeyErrorText }
					value={ publicKey } onChange={ handlePublicKeyChange }/>
				<Grid container justifyContent="flex-end">
					<Link onClick={ handleGenerateKey } href="#">Don't have an Public key? Generate Key</Link>
				</Grid>
				<TextField
					type="number"
					margin="normal"
					required
					fullWidth
					id="percentageFee"
					label="Percentage fee"
					autoComplete="off"
					InputProps={ {
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					} }
					helperText={ percentageFeeErrorText }
					error={ !!percentageFeeErrorText }
					value={ percentageFee } onChange={ e => {
					setPercentageFee(e.target.value);
					setPercentageFeeErrorText('')
				} }/>
				<div>
					<Button onClick={ submitCreateStakingPool } variant="contained" fullWidth>
						<span>LAUNCH POOL</span>
						<div className="loader"/>
					</Button>
				</div>
			</Box>
		</Box>);
}

export default CreateStakingPool;
