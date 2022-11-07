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
import * as zip from "@zip.js/zip.js";


const CreateStakingPool = ({ wallet }) => {
	const [poolName, setPoolName] = React.useState('');
	const [ownerAccount, setOwnerAccount] = React.useState('');
	const [publicKey, setPublicKey] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [keyPair, setKeyPair] = React.useState(null);
	const [percentageFee, setPercentageFee] = React.useState('');
	const [poolNameErrorText, setPoolNameErrorText] = React.useState('');
	const [ownerAccountErrorText, setOwnerAccountErrorText] = React.useState('');
	const [publicKeyErrorText, setPublicKeyErrorText] = React.useState('');
	const [percentageFeeErrorText, setPercentageFeeErrorText] = React.useState('');
	const [keyPairErrorText, setKeyPairErrorText] = React.useState('');
	const [confirmPasswordErrorText, setConfirmPasswordErrorText] = React.useState('');
	const [isKeyPairDownloaded, setIsKeyPairDownloaded] = React.useState(true);


	async function submitCreateStakingPool(e) {
		e.preventDefault();
		if (chekForm()) {
			await createStakingPool(wallet, poolName, ownerAccount, publicKey, percentageFee);
		}
	}

	const handlePublicKeyChange = event => {
		setPublicKey(event.target.value);
		setPublicKeyErrorText('');
		setKeyPair(null);
	};

	const handleGenerateKey = () => {
		if (poolName) {
			const kp = generateKey(poolName + '.' + process.env.REACT_APP_CONTRACT_POOL);
			setKeyPair(kp);
			setPublicKey(kp.public_key);
			setIsKeyPairDownloaded(false);
			setPublicKeyErrorText('');
		} else {
			setPoolNameErrorText('Please enter Pool Name');
		}
	};

	const chekForm = () => {
		if (!poolName) {
			setPoolNameErrorText('Please enter Pool Name');
			return false;
		}
		if (!ownerAccount) {
			setOwnerAccountErrorText('Please enter Owner account');
			return false;
		}
		if (!publicKey) {
			setPublicKeyErrorText('Please enter Public key');
			return false;
		}
		if (!percentageFee) {
			setPercentageFeeErrorText('Please enter Percentage fee');
			return false;
		}
		if (keyPair && !isKeyPairDownloaded) {
			setKeyPairErrorText('Please download Key Pair');
			return false;
		}
		return true;
	};

	const getZipFileBlob = async (keyPair) => {
		if (!comparePasswords()) return false;
		const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
		await Promise.all([
			zipWriter.add(poolName + '.' + process.env.REACT_APP_CONTRACT_POOL + '.json',
				new zip.TextReader(JSON.stringify(keyPair, null, 2)),
				{ password }
			),
		]);
		return zipWriter.close();
	}

	const downloadFile = (blob) => {
		if (!blob) return false;
		const a = document.createElement('a');
		a.download = poolName + '.' + process.env.REACT_APP_CONTRACT_POOL + '.zip';
		a.href = URL.createObjectURL(blob);
		a.addEventListener('click', (e) => {
			setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
		});
		a.click();
		setKeyPairErrorText('');
		setIsKeyPairDownloaded(true);
	}

	const comparePasswords = () => {
		if (!password || !confirmPassword) {
			setConfirmPasswordErrorText('Please enter passwords');
			return false;
		}
		if (password === confirmPassword) {
			setConfirmPasswordErrorText('');
			return true;
		} else {
			setConfirmPasswordErrorText('Passwords do not match');
			return false;
		}
	}


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
				{ keyPair ?
					<>
						<Grid container justifyContent="flex-end">
							<Link onClick={ () => {
								setKeyPair(null);
								setPublicKey('');
							} } href="#">I have an Key pair</Link>
						</Grid>
						<TextField
							type="password"
							margin="normal"
							required
							fullWidth
							id="password"
							label="Password"
							autoComplete="off"
							error={ !!confirmPasswordErrorText }
							value={ password } onChange={ e => {
							setPassword(e.target.value);
						} }/>
						<TextField
							type="password"
							margin="normal"
							required
							fullWidth
							id="confirmPassword"
							label="Confirm password"
							autoComplete="off"
							helperText={ confirmPasswordErrorText }
							error={ !!confirmPasswordErrorText }
							value={ confirmPassword } onChange={ e => {
							setConfirmPassword(e.target.value);
						} }/>
						<Grid container justifyContent="flex-end">
							<Box sx={ { color: 'error.main' } } p={ 1 }>{ keyPairErrorText }</Box>
							<Button onClick={ () => getZipFileBlob(keyPair).then(downloadFile) } variant="outlined">Download Key
								pair</Button>
						</Grid>
					</> :
					<Grid container justifyContent="flex-end">
						<Link onClick={ handleGenerateKey } href="#"> Generate Key pair</Link>
					</Grid>
				}
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
