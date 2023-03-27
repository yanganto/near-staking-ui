import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';

const AddServer = ({ isSignedIn, wallet }) => {
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" align="left" fontSize={48}>
          Bring your own server
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
      <Typography>
        Step 1: Get a server, install ubuntu on it. Enable sshd and add a root
        key.
      </Typography>
      <Typography>Step 2: Enter details of your server...</Typography>
      <Typography>SSH Public Key:</Typography>
      <TextField
        type="text"
        margin="normal"
        required
        id="key"
        label="Key name"
        autoComplete="off"
      />
      <TextField
        type="text"
        margin="normal"
        required
        id="key"
        label="Public key"
        autoComplete="off"
      />
      <Table aria-label="Servers" sx={{ marginTop: '24px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderTopLeftRadius: '10px' }} align="center">
              ID
            </TableCell>
            <TableCell align="center">Provider</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">IPv4</TableCell>
            <TableCell align="center">CIDR</TableCell>
            <TableCell align="center">Gateway</TableCell>
            <TableCell align="center">Root Username</TableCell>
            <TableCell align="center" sx={{ borderTopRightRadius: '10px' }}>
              № of disks
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell>
              <Select labelId="provider-select-label" id="provider-select">
                <MenuItem value="OVH">OVH</MenuItem>
                <MenuItem value="Latitude">Latitude</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <Select labelId="type-select-label" id="type-select">
                <MenuItem value="NEAR">NEAR</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell>
            <Select labelId="type-select-label" id="type-select">
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

export default AddServer;
