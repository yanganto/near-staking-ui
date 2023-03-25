import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ChooseDialog from '../ui/components/ChooseDialog';

const Servers = ({ isSignedIn, wallet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <Container sx={{ marginLeft: '120px' }}>
      <ChooseDialog isOpen={isOpen} onClose={handleClose} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" align="left" fontSize={48}>
          Servers
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          to="/servers/create"
          onClick={handleOpen}
          variant="text"
          sx={{
            padding: '16px 32px',
            boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
            color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
            border: 'inherit',
            fontSize: '15px',
            margin: '16px 4px 16px 8px',
          }}
        >
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          &nbsp;New validator
        </Button>
      </Box>
      <Table aria-label="Servers" sx={{ marginTop: '24px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderTopLeftRadius: '10px' }} align="center">
              ID
            </TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">IPv4</TableCell>
            <TableCell align="center">Gateway</TableCell>
            <TableCell align="center">Username</TableCell>
            <TableCell align="center" sx={{ borderTopRightRadius: '10px' }}>
              SSH Key
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

export default Servers;
