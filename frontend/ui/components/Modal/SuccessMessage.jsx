import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function SuccessMessage({config}) {
	const params = new URLSearchParams(window.location.search);
	const [open, setOpen] = React.useState(!!params.get("transactionHashes"));
	const handleClose = () => setOpen(false);

	return (
		<>
			<Modal
				open={ open }
				onClose={ handleClose }
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={ style }>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						The pool is Live!
					</Typography>
					<Typography id="modal-modal-description" sx={ { mt: 2, textAlign: "center" } }>
						<a href={ config.explorerUrl + '/transactions/' + params.get("transactionHashes") } target="_blank" rel="noreferrer">
							<button>View on Explorer</button>
						</a>
					</Typography>
				</Box>
			</Modal>
		</>
	);
}
