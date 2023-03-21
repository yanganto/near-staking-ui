import {
	Alert,
	Chip,
	Container,
	FormControl,
	FormControlLabel,
	Stack,
	Grid,
	Radio,
	RadioGroup,
	TextField,
	Button,
	Box,
	Link,
	Typography
} from "@mui/material";
import {useTheme} from '@mui/material/styles';
import {useEffect, useState} from "react";
import {getKuutamoValidators, getMyPools, stakeToKuutamoPool} from "../helpers/staking";
import {YourCurrentDelegations} from "../ui/components/YourCurrentDelegations";
import * as nearAPI from "near-api-js";
import Decimal from "decimal.js";


const StakeToKuutamoPool = ({ wallet, isSignedIn }) => {
	const theme = useTheme();
	const [isSubmit, setIsSubmit] = useState(false);
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('info');
	const [transactionHashes, setTransactionHashes] = useState(null);
	const [validators, setValidators] = useState([]);
	const [myPools, setMyPools] = useState({});
	const [poolName, setPoolName] = useState(null);
	const [amount, setAmount] = useState(0);
	const [balance, setBalance] = useState(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("transactionHashes")) {
			window.history.replaceState(null, '', 'stake');
			setHelperText("Success!");
			setTransactionHashes(params.get("transactionHashes"));
		}
		(async () => {
			const myValidators = await getMyPools(wallet);
			setMyPools(myValidators);
			const kuutamoValidators = await getKuutamoValidators(wallet);
			setValidators(kuutamoValidators);
			const balance = await wallet.getAccountBalance(wallet.accountId);
			setBalance(balance);
		})();
	}, [wallet]);

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const amountStake = event.target.name === 'stakeMax' ?
			new Decimal(nearAPI.utils.format.formatNearAmount(balance.available, 5)).minus('0.2').toFixed(5) : amount;
		if (!poolName) {
			setHelperText('Please select a pool');
			setError(true);
		} else if (event.target.name === 'stake' && amountStake <= 0) {
			setHelperText('Please enter the amount');
			setError(true);
		} else {
			setHelperText('');
			setError(false);
			setIsSubmit(true);
			if (wallet.wallet.id === 'ledger' || wallet.wallet.id === 'wallet-connect') {
				try {
					setHelperText('Please confirm transaction on ' + wallet.wallet.id);
					setAlertSeverity('info');
					const r = await stakeToKuutamoPool(wallet, poolName, amountStake);
					if (r.status.hasOwnProperty('SuccessValue')) {
						setPoolName(null);
						setAmount(0);
						setHelperText("Success!");
						setTransactionHashes(r.transaction.hash);
						setAlertSeverity('success');
					}
					if (r.status.hasOwnProperty('Failure')) {
						setError(true);
						setHelperText(JSON.stringify(r.status.Failure.ActionError));
					}
				} catch (e) {
					setHelperText(e.message);
					setError(true);
				}
			} else {
				await stakeToKuutamoPool(wallet, poolName, amountStake);
			}
			setIsSubmit(false);
		}
	};


	return (<Container align="center">
		<Grid container justifyContent="center">
			<Grid item xs={ 8 }>
				<Typography component="h1" variant="h4">
					Stake to a kuutamo pool
				</Typography>
				<Typography component="h1" variant="h6">
					Balance: { balance ? nearAPI.utils.format.formatNearAmount(balance.available, 5) : '-' } NEAR
				</Typography>
				<FormControl error={ error } variant="standard">
					<Box display="flex" alignItems="stretch" pt={ 1 } pb={ 1 }>
						<TextField
							type="number"
							required
							id="amount"
							label="Amount"
							autoComplete="off"
							value={ amount }
							sx={ { maxWidth: '420px' } }
							InputProps={ { sx: { height: '48px', borderRadius: '10px' } } }
							onChange={ (e) => {
								setAmount(e.target.value);
								setIsSubmit(false)
							} }
						/>
						<Button variant="outlined" onClick={ handleSubmit } disabled={ isSubmit } name="stake" sx={ {
							marginLeft: '10px',
							marginRight: '10px',
							width: '140px',
							height: '48px'
						} }>Stake</Button>
						<Button variant="outlined" onClick={ handleSubmit } disabled={ isSubmit } name="stakeMax" sx={ {
							width: '140px',
							height: '48px'
						} }>Stake max</Button>
					</Box>
					{ helperText ?
						<Stack sx={ { width: '100%' } } pb={ 1 }>
							<Alert severity={ error ? 'error' : alertSeverity } mb={ 2 }>{ helperText }{ " " }
								{ !error && transactionHashes ?
									<Link
										href={ wallet.walletSelector.options.network.explorerUrl + '/transactions/' + transactionHashes }
										target="_blank"
										rel="noreferrer">
										View on Explorer
									</Link> : null }
							</Alert>
						</Stack>
						: null }
					{ Object.keys(myPools).length > 0 ?
						<>
							<Typography component="h1" variant="h6" pt={ 1 }>Your pools</Typography>
							<Stack sx={ {
								width: '100%', borderRadius: '15px',
								border: theme.palette.mode === 'dark' ? '1px solid #565c6c' : '1px solid #D2D1DA'
							} } pl={ 1 }>
								<RadioGroup aria-labelledby="pool-label" name="poolName" value={ poolName } align="left"
								            onChange={ (e) => setPoolName(e.target.value) }>
									{
										Object.keys(myPools).map((key, index) => (
											<FormControlLabel key={ key } value={ key } control={ <Radio size="small"/> }
											                  label={
												                  <>
													                  { key } <Chip size="small" label={ myPools[key].fee + '% Fee' }
													                                variant="outlined"/>
												                  </>
											                  }/>
										))
									}
								</RadioGroup>
							</Stack></> : <></> }
					<Typography component="h1" variant="h6" pt={ 1 }>kuutamo pools</Typography>
					<Stack sx={ {
						width: '100%', borderRadius: '15px',
						border: theme.palette.mode === 'dark' ? '1px solid #565c6c' : '1px solid #D2D1DA'
					} } pl={ 1 }>
						<RadioGroup aria-labelledby="pool-label" name="poolName" value={ poolName } align="left"
						            onChange={ (e) => setPoolName(e.target.value) }>
							{
								validators.map(v => (
									<FormControlLabel key={ v.account_id } value={ v.account_id } control={ <Radio size="small"/> }
									                  label={
										                  <>
											                  { v.account_id } <Chip size="small" label={ v.fee + '% Fee' }
											                                         variant="outlined"/>
										                  </>
									                  }/>
								))
							}
						</RadioGroup>
					</Stack>
				</FormControl>
			</Grid>
			<Grid item xs={ 12 }>
				<YourCurrentDelegations wallet={ wallet } transactionHashes={ transactionHashes }/>
			</Grid>
		</Grid>
	</Container>);
}

export default StakeToKuutamoPool;
