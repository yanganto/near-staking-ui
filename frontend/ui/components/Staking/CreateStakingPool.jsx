import SuccessMessage from "../Modal/SuccessMessage";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import React from "react";
import {createStakingPool, generateKey} from "../../../helpers/staking";


const CreateStakingPool = ({wallet}) => {
	const [uiPleaseWait, setUiPleaseWait] = React.useState(false);
	const [poolName, setPoolName] = React.useState('');
	const [ownerAccount, setOwnerAccount] = React.useState('');
	const [publicKey, setPublicKey] = React.useState('');
	const [percentageFee, setPercentageFee] = React.useState('');
	const [msg, setMsg] = React.useState('');


	async function submitCreateStakingPool(e) {
		e.preventDefault();
		if (chekForm()) {
			setUiPleaseWait(true);
			await createStakingPool(wallet, poolName, ownerAccount, publicKey, percentageFee);
			setUiPleaseWait(false);
		}
	}

	const handlePublicKeyChange = event => {
		setPublicKey(event.target.value);
	};

	const handleGenerateKey = () => {
		if (poolName) {
			const kp = generateKey(poolName + '.' + process.env.contractPool);
			setPublicKey(kp.public_key);
		}else{
			setMsg('Please fill in the pool name');
		}
	};

	const chekForm = () => {
		let warningMsg = '';
		if (!poolName || !ownerAccount || !publicKey || !percentageFee) warningMsg ='Please fill in all fields';
		setMsg(warningMsg);
		return !warningMsg;
	};

	React.useEffect(() => {
		setMsg('');
	}, [poolName, ownerAccount, publicKey, percentageFee]);


	return (<main className={ uiPleaseWait ? 'please-wait' : '' }>
		<h1>
			kuutamo
		</h1>
		<SuccessMessage config={wallet.walletSelector.options.network} />
		<form className="createStakingPool">
			<label>Pool Name:</label>
			<div>
				<input autoComplete="off" id="poolName" value={ poolName } onChange={ e => setPoolName(e.target.value) }/>
				<span>.{ process.env.contractPool }</span>
			</div>
			<label>Owner account:</label>
			<div>
				<input autoComplete="off" id="ownerAccount" value={ ownerAccount }
				       onChange={ e => setOwnerAccount(e.target.value) }/>
				<span>.{ process.env.network }</span>
			</div>
			<label>Public key:</label>
			<div>
				<input autoComplete="off" id="publicKey" value={ publicKey } onChange={ handlePublicKeyChange }/>
			</div>
			<div>
				<Button onClick={ handleGenerateKey }>Generate Key</Button>
			</div>
			<label>Percentage fee:</label>
			<div>
				<input autoComplete="off" id="percentageFee" value={ percentageFee } type="number"
				       onChange={ e => setPercentageFee(e.target.value) }/>
				<span>%</span>
			</div>
			{ msg ?
				<Box sx={{ color: 'error.main' }}>{msg}</Box>
				: null
			}
			<div>
				<button onClick={ submitCreateStakingPool }>
					<span>LAUNCH POOL</span>
					<div className="loader" />
				</button>
			</div>
		</form>
	</main>);
}

export default CreateStakingPool;
