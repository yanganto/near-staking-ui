import {Button, Container, Typography, Box, TextField, Divider} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {nearConfig} from "../helpers/nearConfig";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import zoomPlugin from 'chartjs-plugin-zoom';
import {Line} from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend,
	zoomPlugin
);

const Rewards = ({ wallet, isSignedIn }) => {
	const [delegationsPools, setDelegationsPools] = useState([]);
	const [myPools, setMyPools] = useState([]);

	useEffect(() => {
		(async () => {
			const addedPools = [];
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					network: nearConfig.networkId,
					account_id: wallet.accountId
				})
			};
			const mp = await fetch(
				nearConfig.backendUrl + "pools", requestOptions
			).then(async response => {
				return response.json();
			}).then(data => {
				const pools = [];
				for (const v of data.myPools) {
					if (v.owner_id === wallet.accountId)
						pools.push(v.pool_id);
					else
						addedPools.push(v.pool_id);
				}
				return (pools);
			}).catch(error => {
				console.error('There was an error!', error);
			});

			const kp = await fetch(nearConfig.backendUrl + 'validators.' + nearConfig.networkId + '.json').then(response => {
				return response.json();
			}).then(data => {
				const pools = [];
				for (const v of data) {
					if (v.is_enabled && !mp.includes(v.account_id)) pools.push(v.account_id);
				}
				return (pools);
			}).catch(err => {
				console.error("Error Reading data " + err);
			});
			setMyPools(mp);
			setDelegationsPools(addedPools.concat(kp));
		})();

	}, [wallet]);


	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}


	return <><Container>
		<Typography component="h1" variant="h5" align="center">
			Pool rewards
		</Typography>
		{ myPools.map((pool) =>
			<RewardsLine key={ pool } pool={ pool } accountId={ wallet.accountId }/>
		) }
		<Divider/>
		<Typography component="h1" variant="h5" align="center" pt={ 2 }>
			Delegations rewards
		</Typography>
		{ delegationsPools.map((pool) =>
			<RewardsLine key={ pool } pool={ pool } accountId={ wallet.accountId }/>
		) }

	</Container></>;
};

const RewardsLine = ({ pool, accountId }) => {
	const [rewards, setRewards] = useState({ labels: [], datasets: [] });
	const [group, setGroup] = useState("");
	const chartRef = useRef(null);
	const [dateFrom, setDateFrom] = useState(dayjs(new Date().setDate(new Date().getDate() - 90)));
	const [dateTo, setDateTo] = useState(dayjs(new Date()));

	const options = {
		plugins: {
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true
					},
					mode: 'x',
				}
			}
		}
	};

	useEffect(() => {
		(async () => {
			const getRewards = async (account_id, group, dateFrom, dateTo) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						network: nearConfig.networkId,
						account_id,
						pool,
						dateFrom,
						dateTo,
						group
					})
				};
				const r = await fetch(
					nearConfig.backendUrl + "rewards", requestOptions
				).then(async response => {
					const rs = await response.json();
					return (rs.dRewards);
				}).catch(error => {
					console.error('There was an error!', error);
				});
				return (r);
			};

			const r = await getRewards(accountId, group, dateFrom, dateTo);
			setRewards(r);
		})();
	}, [accountId, pool, group, dateFrom, dateTo]);

	return <>
		{ rewards.labels.length > 0 ?
			<>
				<Box align="right" sx={ { m: 2 } }>
					<LocalizationProvider dateAdapter={ AdapterDayjs }>
						<DesktopDatePicker
							label="From"
							inputFormat="MM/DD/YYYY"
							value={ dateFrom }
							onChange={ (date) => {
								setDateFrom(date)
							} }
							renderInput={ (params) => <TextField { ...params } size="small"/> }
						/>
						<DesktopDatePicker
							label="To"
							inputFormat="MM/DD/YYYY"
							value={ dateTo }
							onChange={ (date) => {
								setDateTo(date)
							} }
							renderInput={ (params) => <TextField { ...params } size="small" sx={ { ml: 1 } }/> }
						/>
					</LocalizationProvider>
					<Button onClick={ () => {
						setGroup("");
						chartRef.current.resetZoom()
					} }
					        variant={ group === "" ? "contained" : "outlined" } size="small" sx={ { ml: 2 } }>Epoch</Button>
					<Button onClick={ () => {
						setGroup("%Y-%m-%d");
						chartRef.current.resetZoom()
					} }
					        variant={ group === "%Y-%m-%d" ? "contained" : "outlined" } size="small" sx={ { ml: 1 } }>Day</Button>
					<Button onClick={ () => {
						setGroup("%Y-%m");
						chartRef.current.resetZoom()
					} } size="small" sx={ { ml: 1 } }
					        variant={ group === "%Y-%m" ? "contained" : "outlined" }>Month</Button>
					<Button onClick={ () => {
						setGroup("%Y");
						chartRef.current.resetZoom()
					} } size="small" sx={ { ml: 1 } }
					        variant={ group === "%Y" ? "contained" : "outlined" }>Year</Button>
				</Box>
				<Line data={ rewards } options={ options } ref={ chartRef }/>
			</> :
			<></>
		}
	</>
}

export default Rewards;
