import {Container, Typography} from "@mui/material";

const Home = () => {
	return <Container align="center">
		<Typography component="h1" variant="h4">
			Welcome to kuutamo!
		</Typography>
		<img src="kuutamo.png" alt="kuutamo"/>
	</Container>;
};

export default Home;