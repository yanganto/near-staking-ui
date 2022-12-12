import {useEffect, useState} from "react";
import {
	Divider,
	Grid,
	LinearProgress,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import * as nearAPI from "near-api-js";
import {getStakedValidators} from "../../helpers/staking";
import Table from "@mui/material/Table/Table";
import Paper from "@mui/material/Paper/Paper";


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

export const YourCurrentValidators = ({ wallet }) => {
	const [yourCurrentValidators, setYourCurrentValidators] = useState([]);
	const [validatorsIsReady, setValidatorsIsReady] = useState(false);

	useEffect(() => {
		(async () => {
			const stakedValidators = await getStakedValidators(wallet);
			setYourCurrentValidators(stakedValidators);
			setValidatorsIsReady(true);
		})();

	}, [wallet]);


	return (
		<Grid container justifyContent="center" pt={ 2 }>
			<Grid item xs={ 8 }>
				<Typography component="h1" variant="h5">
					Your Current Validators
					<Divider/>
				</Typography>

				<TableContainer component={ Paper }>
					<Table size="small" aria-label="Your Current Validators">
						<TableHead>
							<TableRow>
								<TableCell>Validator</TableCell>
								<TableCell align="right">Fee</TableCell>
								<TableCell align="right">Total</TableCell>
								<TableCell align="right">Staked</TableCell>
								<TableCell align="right">Unstaked</TableCell>
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
									<TableCell align="right">{ row.fee }</TableCell>
									<TableCell align="right">{ row.totalBalance }</TableCell>
									<TableCell align="right">{ row.stakedBalance }</TableCell>
									<TableCell align="right">{ row.unstakedBalance }</TableCell>
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

