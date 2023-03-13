import {useEffect, useState} from "react";
import {
	Alert,
	Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Grid,
	LinearProgress,
	Stack,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Link,
	Button,
	Table,
	Typography
} from "@mui/material";
import * as nearAPI from "near-api-js";
import {useConfirm} from "material-ui-confirm";
import {getStakedValidators, unstakeWithdraw} from "../../helpers/staking";


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

	const confirm = useConfirm();
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
		<Grid container justifyContent="center" pt={ 1 }>
			<Grid item xs={ 12 }>
				<Typography component="h1" variant="h5" sx={ { textAlign: 'left' } } p={ 1 }>
					Your current delegations
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
				<Table aria-label="Your Current Validators">
					<TableHead>
						<TableRow>
							<TableCell sx={ { borderRadius: '10px 0 0 10px' } }>Validator</TableCell>
							<TableCell align="right">Fee</TableCell>
							<TableCell align="right">Total</TableCell>
							<TableCell align="right">Staked</TableCell>
							<TableCell align="right">Unstaked</TableCell>
							<TableCell sx={ { borderRadius: '0 10px 10px 0' } }/>
						</TableRow>
					</TableHead>
					<TableBody>
						{ yourCurrentValidators.map((row) => (
							<TableRow
								key={ row.account_id }
							>
								<TableCell component="th" scope="row" sx={ { borderRadius: '5px 0 0 5px' } }>
									{ row.account_id }
								</TableCell>
								<TableCell align="right">{ row.fee }%</TableCell>
								<TableCell align="right">{ row.totalBalance }</TableCell>
								<TableCell align="right">{ row.stakedBalance }</TableCell>
								<TableCell align="right">{ row.unstakedBalance }</TableCell>
								<TableCell align="center" sx={ { borderRadius: '0 5px 5px 0' } }>
									<Button size="small" variant="outlined" fullWidth
									        sx={ { maxWidth: '200px' } }
									        disabled={ row.stakedBalance <= 0 }
									        onClick={ () => {
										        setDataUnstakeWithdraw({ cmd: 'unstake', pool: row.account_id });
										        if (row.canWithdraw && row.unstakedBalance > 0)
											        confirm({
												        confirmationText: "Continue", confirmationButtonProps: { autoFocus: true },
												        description: "You have funds available to widthdraw now, if you unstake more, these funds will be locked for 4 epochs"
											        })
												        .then(() => {
													        handleClickOpen();
												        }).catch(() => {
											        });
										        else
											        handleClickOpen();
									        } }>unstake</Button>
									<Button size="small" variant="contained" fullWidth sx={ { mt: 1,  maxWidth: '200px' } }
									        disabled={ !row.canWithdraw || row.unstakedBalance <= 0 }
									        onClick={ () => {
										        setDataUnstakeWithdraw({ cmd: 'withdraw', pool: row.account_id });
										        handleClickOpen();
									        } }>withdraw</Button>
									{ row.leftToWithdraw }
								</TableCell>
							</TableRow>
						)) }
					</TableBody>
				</Table>
				{ !validatorsIsReady ?
					<Grid item xs={ 12 }>
						<LinearProgress/>
					</Grid>
					: null }
			</Grid>
		</Grid>
	)

}

