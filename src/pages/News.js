import {Box, Card, CardActions, CardContent, CardHeader, Container, Link, Typography} from "@mui/material";
import parse from 'html-react-parser'
import {useEffect, useState} from "react";
import {useTheme} from '@mui/material/styles';
import {nearConfig} from "../helpers/nearConfig";


const News = () => {
	const [news, setNews] = useState([]);
	const theme = useTheme();

	useEffect(() => {
		(async () => {
			const res = await fetch(nearConfig.backendUrl + 'news.json').then(response => {
				return response.json();
			}).then(data => {
				return (data);
			}).catch(err => {
				console.error("Error Reading data " + err);
			});
			setNews(res.reverse());
		})();
	}, []);


	return <Container>
		<Typography component="h1" variant="h5" align="center">
			News
		</Typography>
		{
			news.map((n, index) => (
				<Box p={ 1 } key={ index }>
					<Card variant="outlined">
						<CardHeader title={ n.title } style={ {
							backgroundColor: theme.palette.primary.main,
							color: theme.palette.primary.contrastText
						} }/>
						<CardContent>
							{ parse(n.description) }
						</CardContent>
						{ n.external_link ?
							<CardActions>
								<Link href={ n.external_link } target="_blank" rel="noreferrer">{ n.external_link }</Link>
							</CardActions>
							: null }
					</Card>
				</Box>
			))
		}
	</Container>;
};

export default News;