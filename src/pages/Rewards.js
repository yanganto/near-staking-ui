import {Button, Container, Typography, Box} from "@mui/material";
import {useEffect, useState} from "react";
import {nearConfig} from "../helpers/nearConfig";
import {Bar} from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Rewards = ({ wallet, isSignedIn }) => {
	const [rewards, setRewards] = useState({ labels: [], datasets: [] });
	const [group, setGroup] = useState("%Y-%m-%d");

	useEffect(() => {
		(async () => {
			await getRewards(wallet.accountId, group);
		})();
	}, [wallet, group]);

	const getRewards = async (account_id, group) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				network: nearConfig.networkId,
				account_id,
				group
			})
		};
		await fetch(
			nearConfig.backendUrl + "rewards", requestOptions
		).then(async response => {
			const rs = await response.json();
			console.log(rs.myRewards);
			setRewards({
				labels: rs.myRewards.map((data) => data._id), datasets: [{
					label: "Near",
					data: rs.myRewards.map((data) => data.totalAmount.$numberDecimal / 1000000000000000000000000),
					backgroundColor: 'rgba(94, 48, 235, 0.8)',
				}]
			});
			//setRewards();
		}).catch(error => {
			console.error('There was an error!', error);
		});
	};

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}


	return <Container>
		<Typography component="h1" variant="h5" align="center">
			Delegations rewards
		</Typography>
		<Box align="right">
			<Button onClick={ () => setGroup("%Y-%m-%d") } variant="outlined" size="small"
			        disabled={ group === "%Y-%m-%d" }>Day</Button>
			<Button onClick={ () => setGroup("%Y-%m") } variant="outlined" size="small" sx={ { m: 1 } }
			        disabled={ group === "%Y-%m" }>Month</Button>
			<Button onClick={ () => setGroup("%Y") } variant="outlined" size="small"
			        disabled={ group === "%Y" }>Year</Button>
		</Box>
		<Bar data={ rewards }/>
	</Container>;
};

export default Rewards;
