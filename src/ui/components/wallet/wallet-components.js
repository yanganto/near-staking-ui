import React from 'react';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container/Container";


export function SignInPrompt({ onClick }) {
	return (
		<Container maxWidth="sm">
			<Box sx={ {
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			} }>
				<Typography component="h1" variant="h5">
					Welcome to NEAR!
				</Typography>
				<Typography variant="h4" component="h1">
					<Button onClick={ onClick } variant="contained">Sign in with NEAR Wallet</Button>
				</Typography>
			</Box>
		</Container>
	);
}

export function SignOutButton({ accountId, onClick }) {
	return (
		<Button onClick={ onClick } variant="outlined">
			Sign out { accountId }
		</Button>
	);
}

