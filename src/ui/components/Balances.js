import {useEffect, useState} from "react";
import {
	Alert,
	Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Grid,
	LinearProgress, Stack,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import * as nearAPI from "near-api-js";
import {getStakedValidators, unstakeWithdraw} from "../../helpers/staking";
import Table from "@mui/material/Table/Table";
import Paper from "@mui/material/Paper/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";


export const Balances = ({ wallet }) => {
	const [balance, setBalance] = useState(null);

	useEffect(() => {
		(async () => {
			const balance = await wallet.getAccountBalance(wallet.accountId);
			setBalance(balance);
		})();
	}, [wallet]);

	return (
		<>
			<Typography component="h1" variant="h6">
				Balance: { balance ? nearAPI.utils.format.formatNearAmount(balance.available, 4) : '-' } NEAR
			</Typography>
		</>
	)
}

export const YourCurrentValidators = ({ wallet, transactionHashes }) => {
	const [yourCurrentValidators, setYourCurrentValidators] = useState([]);
	const [validatorsIsReady, setValidatorsIsReady] = useState(false);
	const [open, setOpen] = useState(false);
	const [dataUnstakeWithdraw, setDataUnstakeWithdraw] = useState({});
	const [helperText, setHelperText] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('info');
	const [transactionHashesUW, setTransactionHashesUW] = useState(null);

	const handleClickOpen = () => {
		setHelperText('');
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const submitUnstakeWithdraw = async (all) => {
		if (all)
			setDataUnstakeWithdraw({ ...dataUnstakeWithdraw, all: all, amount: all ? '' : dataUnstakeWithdraw.amount });
		if (wallet.wallet.id === 'ledger' || wallet.wallet.id === 'wallet-connect') {
			try {
				setHelperText('Please confirm transaction on ' + wallet.wallet.id);
				setAlertSeverity('info');
				const r = await unstakeWithdraw(wallet, { ...dataUnstakeWithdraw, all: all });
				if (r.status.hasOwnProperty('SuccessValue')) {
					setHelperText("Success!");
					setTransactionHashesUW(r.transaction.hash);
					setAlertSeverity('success');
				}
				if (r.status.hasOwnProperty('Failure')) {
					setHelperText(JSON.stringify(r.status.Failure.ActionError));
					setAlertSeverity('error');
				}
			} catch (e) {
				setHelperText(e.message);
				setAlertSeverity('error');
			}
		} else {
			await unstakeWithdraw(wallet, { ...dataUnstakeWithdraw, all: all });
		}
	};

	useEffect(() => {
		setValidatorsIsReady(false);
		(async () => {
			const stakedValidators = await getStakedValidators(wallet);
			setYourCurrentValidators(stakedValidators);
			setValidatorsIsReady(true);
		})();

	}, [wallet, transactionHashes, transactionHashesUW]);

	return (
		<Grid container justifyContent="center" pt={ 2 }>
			<Grid item xs={ 8 }>
				<Typography component="h1" variant="h5">
					Your Current Validators
				</Typography>
				<Dialog open={ open }>
					<DialogTitle id="alert-dialog-title">
						Please confirm { dataUnstakeWithdraw.cmd }
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{ dataUnstakeWithdraw.pool }
						</DialogContentText>
						<TextField
							type="number"
							margin="normal"
							required
							fullWidth
							id="amount"
							label="Amount"
							autoComplete="off"
							value={ dataUnstakeWithdraw.amount || 0 }
							onChange={ (e) => setDataUnstakeWithdraw({ ...dataUnstakeWithdraw, amount: e.target.value }) }
						/>
					</DialogContent>
					{ helperText ?
						<Stack sx={ { width: '100%' } } pb={ 1 }>
							<Alert severity={ alertSeverity } mb={ 2 }>{ helperText }{ " " }
								{ transactionHashesUW ?
									<Link
										href={ wallet.walletSelector.options.network.explorerUrl + '/transactions/' + transactionHashesUW }
										target="_blank"
										rel="noreferrer">
										View on Explorer
									</Link> : null }
							</Alert>
						</Stack>
						: null }
					<DialogActions>
						<Button onClick={ handleClose } variant="outlined">Close</Button>
						<Button onClick={ () => {
							submitUnstakeWithdraw(false).then();
						} } variant="contained">{ dataUnstakeWithdraw.cmd }</Button>
						<Button onClick={ () => {
							submitUnstakeWithdraw(true).then();
						} } variant="contained">{ dataUnstakeWithdraw.cmd } all</Button>
					</DialogActions>
				</Dialog>
				<TableContainer component={ Paper } variant="outlined">
					<Table size="small" aria-label="Your Current Validators">
						<TableHead>
							<TableRow>
								<TableCell>Validator</TableCell>
								<TableCell align="right">Fee</TableCell>
								<TableCell align="right">Total</TableCell>
								<TableCell align="right">Staked</TableCell>
								<TableCell align="right">Unstaked</TableCell>
								<TableCell/>
							</TableRow>
						</TableHead>
						<TableBody>
							{ yourCurrentValidators.map((row) => (
								<TableRow
									key={ row.account_id }
									sx={ { '&:last-child td, &:last-child th': { border: 0 } } }
								>
									<TableCell component="th" scope="row">
										{ row.account_id }
									</TableCell>
									<TableCell align="right">{ row.fee }%</TableCell>
									<TableCell align="right">{ row.totalBalance }</TableCell>
									<TableCell align="right">{ row.stakedBalance }</TableCell>
									<TableCell align="right">{ row.unstakedBalance }</TableCell>
									<TableCell>
										<Button size="small" variant="outlined" fullWidth onClick={ () => {
											setDataUnstakeWithdraw({ cmd: 'unstake', pool: row.account_id });
											handleClickOpen();
										} }>unstake</Button>
										<Button size="small" variant="contained" fullWidth sx={ { mt: 1 } } onClick={ () => {
											setDataUnstakeWithdraw({ cmd: 'withdraw', pool: row.account_id });
											handleClickOpen();
										} }>withdraw</Button>
									</TableCell>
								</TableRow>
							)) }
						</TableBody>
					</Table>
				</TableContainer>
				{ !validatorsIsReady ?
					<Grid item xs={ 12 }>
						<LinearProgress/>
					</Grid>
					: null }
			</Grid>
		</Grid>
	)

}

