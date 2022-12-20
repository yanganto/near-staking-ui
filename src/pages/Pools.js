import {
	Container,
	LinearProgress,
	TableBody,
	TableCell, tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {getMyPools} from "../helpers/staking";
import Paper from "@mui/material/Paper/Paper";
import Table from "@mui/material/Table/Table";
import {styled} from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${ tableCellClasses.head }`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	},
	[`&.${ tableCellClasses.body }`]: {
		fontSize: 14
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

const Pools = ({ wallet, isSignedIn }) => {
	const [myPools, setMyPools] = useState({});
	const [myPoolsIsReady, setMyPoolsIsReady] = useState(false);

	useEffect(() => {
		(async () => {
			const res = await getMyPools(wallet);
			setMyPools(res);
			setMyPoolsIsReady(true);
		})();
	}, [wallet]);

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}

	return <Container align="center">
		<Typography component="h1" variant="h4">
			My Pools
		</Typography>
		<TableContainer component={ Paper } variant="outlined">
			<Table size="small" aria-label="Pools">
				<TableHead>
					<TableRow>
						<StyledTableCell sx={ { typography: 'subtitle2' } }>Pool</StyledTableCell>
						<StyledTableCell>owner_id</StyledTableCell>
						<StyledTableCell>public_key</StyledTableCell>
						<StyledTableCell>Fee</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{ Object.keys(myPools).map((key, index) => (
						<StyledTableRow
							key={ index }
							sx={ { '&:last-child td, &:last-child th': { border: 0 } } }
						>
							<StyledTableCell component="th" scope="row">
								{ key }
							</StyledTableCell>
							<StyledTableCell title={ "Click to Copy to Clipboard\n" + myPools[key].owner_id } onClick={ () => {
								navigator.clipboard.writeText(myPools[key].owner_id)
							} }>
								{ myPools[key].owner_id && myPools[key].owner_id.length > 24 ?
									myPools[key].owner_id.substring(0, 12) + '...' + myPools[key].owner_id.substring(myPools[key].owner_id.length - 12)
									: myPools[key].owner_id
								}
							</StyledTableCell>
							<StyledTableCell title={ "Click to Copy to Clipboard\n" + myPools[key].public_key } onClick={ () => {
								navigator.clipboard.writeText(myPools[key].public_key)
							} }>
								{ myPools[key].public_key && myPools[key].public_key.length > 24 ?
									myPools[key].public_key.substring(0, 12) + '...' + myPools[key].public_key.substring(myPools[key].public_key.length - 12)
									: myPools[key].public_key
								}
							</StyledTableCell>
							<StyledTableCell>{ myPools[key].fee }%</StyledTableCell>
						</StyledTableRow>
					)) }
				</TableBody>
			</Table>
		</TableContainer>
		{ !myPoolsIsReady ?
			<LinearProgress/>
			: null }
	</Container>;
};

export default Pools;