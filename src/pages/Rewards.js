import {Button, Container, Typography, Box, TextField} from "@mui/material";
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
	const [rewards, setRewards] = useState({ labels: [], datasets: [] });
	const [group, setGroup] = useState("");
	const chartRef = useRef(null);
	const [dateFrom, setDateFrom] = useState(dayjs(new Date().setDate(new Date().getDate() - 90)));
	const [dateTo, setDateTo] = useState(dayjs(new Date()));


	useEffect(() => {
		(async () => {
			await getRewards(wallet.accountId, group, dateFrom, dateTo);
		})();
	}, [wallet, group, dateFrom, dateTo]);

	const getRewards = async (account_id, group, dateFrom, dateTo) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				network: nearConfig.networkId,
				account_id,
				dateFrom,
				dateTo,
				group
			})
		};
		await fetch(
			nearConfig.backendUrl + "rewards", requestOptions
		).then(async response => {
			const rs = await response.json();
			console.log(rs.dRewards);
			setRewards(rs.dRewards);
		}).catch(error => {
			console.error('There was an error!', error);
		});
	};

	if (!isSignedIn) {
		wallet.signIn();
		return false;
	}

	const options = {
		radius: 0,
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


	return <Container>
		<Typography component="h1" variant="h5" align="center">
			Delegations rewards
		</Typography>
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
	</Container>;
};

export default Rewards;
