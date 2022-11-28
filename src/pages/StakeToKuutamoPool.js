import {
	Container,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	Radio,
	RadioGroup,
	Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {nearConfig} from "../helpers/nearConfig";
import * as nearAPI from "near-api-js";
import {stakeToKuutamoPool} from "../helpers/staking";


const StakeToKuutamoPool = ({ wallet, isSignedIn }) => {
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState('');
	const [validators, setValidators] = useState([]);
	const [balance, setBalance] = useState(null);
	const [poolName, setPoolName] = useState(null);
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		fetch('validators.' + nearConfig.networkId + '.json').then(response => {
			return response.json();
		}).then(data => {
			setValidators(data);
		}).catch(err => {
			console.log("Error Reading data " + err);
		});

		const getAccountBalance = async () => {
			const balance = await wallet.getAccountBalance(wallet.accountId);
			setBalance(balance);
		}
		getAccountBalance().catch(console.error);
	}, [wallet]);

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!poolName || amount <= 0) {
			setHelperText('Please select a pool and enter the amount.');
			setError(true);
		} else {
			setHelperText('');
			setError(false);
			if (wallet.wallet.id === 'ledger') {
				try {
					setHelperText('Please confirm transaction on ledger');
					const r = await stakeToKuutamoPool(wallet, poolName, amount);
					if (r.status.hasOwnProperty('SuccessValue')) {
						setPoolName(null);
						setAmount(0);
						setHelperText('Success!');
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
				await stakeToKuutamoPool(wallet, poolName, amount);
			}
		}
	};


	return (<Container align="center">
		<Grid container justifyContent="center">
			<Grid item xs={ 4 } p={ 2 }>
				<Typography component="h1" variant="h5">
					Stake to a kuutamo pool
				</Typography>
				<Typography component="h1" variant="h6">
					Balance: { balance ? nearAPI.utils.format.formatNearAmount(balance.available, 4) : '-' } Ⓝ
				</Typography>
				<FormControl fullWidth sx={ { m: 3 } } error={ error } variant="standard">
					<TextField
						type="number"
						margin="normal"
						required
						fullWidth
						id="amount"
						label="Amount"
						autoComplete="off"
						value={ amount }
						onChange={ (e) => setAmount(e.target.value) }
					/>
					<RadioGroup aria-labelledby="pool-label" name="poolName" value={ poolName }
					            onChange={ (e) => setPoolName(e.target.value) }>
						{
							validators.map(v => (
								v.is_enabled ?
									<FormControlLabel key={ v.account_id } value={ v.account_id } control={ <Radio/> }
									                  label={ v.account_id }/> : null
							))
						}
					</RadioGroup>
					<FormHelperText variant="outlined">{ helperText }</FormHelperText>
					<Button variant="contained" fullWidth onClick={ handleSubmit } sx={ { mt: 1, mr: 1 } }>
						<span>Stake</span>
					</Button>
				</FormControl>
			</Grid>
		</Grid>
	</Container>);
}

export default StakeToKuutamoPool;
