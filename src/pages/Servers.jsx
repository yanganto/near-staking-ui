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
import { navPageDialogData } from '../constants';
import ChooseDialog from '../ui/components/ChooseDialog';

const Servers = ({ isSignedIn, wallet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const servers = JSON.parse(localStorage.getItem('servers') || '[]');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <Container sx={{ marginLeft: { lg: '7.6%', md: '7%', xs: 'auto' } }}>
      <ChooseDialog
        title="Select an option"
        isOpen={isOpen}
        onClose={handleClose}
        data={navPageDialogData}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          fontSize={48}
          lineHeight={1}
          sx={{ marginBottom: '8px' }}
        >
          Servers
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
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
          Add server
        </Button>
      </Box>
      <Table aria-label="Servers">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>IPv4</TableCell>
            <TableCell>Gateway</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>SSH Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.Type}</TableCell>
              <TableCell>{s.IPv4}</TableCell>
              <TableCell>{s.Gateway}</TableCell>
              <TableCell>{s.Username}</TableCell>
              <TableCell>{s.key}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Servers;
