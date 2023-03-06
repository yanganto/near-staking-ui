import {
	Button,
	Container,
	LinearProgress,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Table,
	Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {getMyPools} from "../helpers/staking";
import {Link} from 'react-router-dom';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Box from "@mui/material/Box";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


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

	return <Container>
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Typography component="h1" variant="h4"  align="left">
				List of validators
			</Typography>
			<Box sx={{ flexGrow: 1 }} />
			<Button to="/pools/add" component={ Link } startIcon={ <AddBoxOutlinedIcon/> } variant="text"
			        sx={ {
				        padding: '16px 32px',
				        boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
				        color: '#002147',
				        border: 'inherit',
				        fontSize: '15px',
			        } }>
				Add existing validator
			</Button>
			<Button to="/pools/create" component={ Link } startIcon={ <AddBoxOutlinedIcon/> } variant="text"
			        sx={ {
				        padding: '16px 32px',
				        boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
				        color: '#002147',
				        border: 'inherit',
				        fontSize: '15px',
				        margin: '16px 4px 16px 16px',
			        } }>
				New validator
			</Button>
		</Box>




		<Table aria-label="Pools">
			<TableHead>
				<TableRow>
					<TableCell sx={ { borderRadius: '10px 0 0 10px' } }>Pool</TableCell>
					<TableCell>owner_id</TableCell>
					<TableCell>public_key</TableCell>
					<TableCell sx={ { borderRadius: '0 10px 10px 0' } }>Fee</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{ Object.keys(myPools).map((key, index) => (
					<TableRow
						key={ index }
						sx={ { '&:last-child td, &:last-child th': { border: 0 } } }
					>
						<TableCell component="th" scope="row" sx={ { borderRadius: '10px 0 0 10px' } }>
							{ key }
						</TableCell>
						<TableCell title={ "Click to Copy to Clipboard\n" + myPools[key].owner_id } onClick={ () => {
							navigator.clipboard.writeText(myPools[key].owner_id)
						} }>
							{ myPools[key].owner_id && myPools[key].owner_id.length > 24 ?
								myPools[key].owner_id.substring(0, 12) + '...' + myPools[key].owner_id.substring(myPools[key].owner_id.length - 12)
								: myPools[key].owner_id
							}
						</TableCell>
						<TableCell title={ "Click to Copy to Clipboard\n" + myPools[key].public_key } onClick={ () => {
							navigator.clipboard.writeText(myPools[key].public_key)
						} }>
							{ myPools[key].public_key && myPools[key].public_key.length > 24 ?
								myPools[key].public_key.substring(0, 12) + '...' + myPools[key].public_key.substring(myPools[key].public_key.length - 12)
								: myPools[key].public_key
							} <ContentCopyIcon color="action" fontSize="small" />
						</TableCell>
						<TableCell sx={ { borderRadius: '0 5px 5px 0' } }>{ myPools[key].fee }%</TableCell>
					</TableRow>
				)) }
			</TableBody>
		</Table>
		{ !myPoolsIsReady ?
			<LinearProgress/>
			: null }
	</Container>;
};

export default Pools;