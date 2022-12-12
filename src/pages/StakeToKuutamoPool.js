import {
	Chip,
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
import {getKuutamoValidators, stakeToKuutamoPool} from "../helpers/staking";
import {Balances, YourCurrentValidators} from "../ui/components/Balances";


const StakeToKuutamoPool = ({ wallet, isSignedIn }) => {
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState('');
	const [validators, setValidators] = useState([]);
	const [poolName, setPoolName] = useState(null);
	const [amount, setAmount] = useState(0);


	useEffect(() => {
		(async () => {
			const kuutamoValidators = await getKuutamoValidators(wallet);
			setValidators(kuutamoValidators);
		})();
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
			if (wallet.wallet.id === 'ledger' || wallet.wallet.id === 'wallet-connect') {
				try {
					setHelperText('Please confirm transaction on ' + wallet.wallet.id);
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
			<Grid item xs={ 6 }>
				<Typography component="h1" variant="h5">
					Stake to a kuutamo pool
				</Typography>
				<Balances wallet={ wallet }/>
				<FormControl fullWidth error={ error } variant="standard">
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
					<RadioGroup aria-labelledby="pool-label" name="poolName" value={ poolName } align="left"
					            onChange={ (e) => setPoolName(e.target.value) }>
						{
							validators.map(v => (
								<FormControlLabel key={ v.account_id } value={ v.account_id } control={ <Radio/> }
								                  label={
									                  <>
										                  { v.account_id } <Chip size="small" label={ v.fee + '% Fee' } variant="outlined" />
									                  </>
								                  }/>
							))
						}
					</RadioGroup>
					<FormHelperText variant="outlined">{ helperText }</FormHelperText>
					<Button variant="contained" fullWidth onClick={ handleSubmit }>
						<span>Stake</span>
					</Button>
				</FormControl>
			</Grid>
		</Grid>
		<YourCurrentValidators wallet={ wallet }/>
	</Container>);
}

export default StakeToKuutamoPool;
