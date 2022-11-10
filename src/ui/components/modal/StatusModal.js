import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import WarningIcon from '@mui/icons-material/Warning';


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	textAlign: 'center',
};

export default function StatusModal(props) {
	const handleClose = () => props.setData({ ...props.data, open: false });

	return (
		<div>
			<Modal open={ props.data.open } onClose={ handleClose }>
				<Box sx={ style }>
					<Grid container>
						<Grid item xs={ 12 }>
							<Box><WarningIcon color={ props.data.hasError ? "error" : "primary" } fontSize="large"/></Box>
							{ props.data.description }
						</Grid>
						{ props.data.hash ?
							<Grid item xs={ 12 }>
								<Link href={ props.config.explorerUrl + '/transactions/' + props.data.hash } target="_blank"
								      rel="noreferrer">
									View on Explorer
								</Link>
							</Grid>
							: null }
					</Grid>
					<Grid item xs={ 12 } pt={ 2 }>
						<Button onClick={ handleClose } variant="outlined">Close</Button>
					</Grid>
				</Box>
			</Modal>
		</div>
	);
}