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
import { useNavigate } from 'react-router-dom';
import SnackbarAlert from '../ui/components/SnackbarAlert';

const AddServer = ({ isSignedIn, wallet }) => {
  let navigate = useNavigate();
  const [servers, setServers] = useState(
    JSON.parse(localStorage.getItem('servers') || '[]')
  );
  const [keys, setKeys] = useState(
    JSON.parse(localStorage.getItem('keys') || '[]')
  );
  const [warningMount, setWarningMount] = useState('');
  const [newKey, setNewKey] = useState({ name: '', key: '' });
  const [newServer, setNewServer] = useState({
    id: '',
    Provider: 'Other',
    Type: 'NEAR',
    IPv4: '',
    CIDR: '',
    Gateway: '',
    Username: '',
    disks: '1',
    key: '',
  });

  const addNewServer = () => {
    setNewServer({ ...newServer, key: newKey.name });
    const areAllFilledKey = Object.values(newKey).every(
      (val) => val !== undefined && val !== null && val !== ''
    );
    const areAllFilledServer = Object.values(newServer).every(
      (val) => val !== undefined && val !== null && val !== ''
    );
    if (!areAllFilledKey || !areAllFilledServer) {
      setWarningMount('Please make sure to fill out all the required fields');
    } else if (keys.filter((element) => element.name === newKey.name)[0]) {
      setWarningMount('Key with this name already exists');
    } else if (servers.filter((element) => element.id === newServer.id)[0]) {
      setWarningMount('Server with this ID already exists');
    } else {
      servers.push(newServer);
      localStorage.setItem('servers', JSON.stringify(servers));
      setServers(servers);
      keys.push(newKey);
      localStorage.setItem('keys', JSON.stringify(keys));
      setKeys(keys);
      navigate('/servers');
    }
  };

  return (
    <Container>
      <SnackbarAlert
        msg={warningMount}
        setMsg={setWarningMount}
        severity="error"
      />
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
        value={newKey.name}
        onChange={(e) => {
          setNewKey({
            ...newKey,
            name: e.target.value.replace(/[^a-zA-Z0-9]/g, ''),
          });
          setNewServer({
            ...newServer,
            key: e.target.value.replace(/[^a-zA-Z0-9]/g, ''),
          });
        }}
      />
      <TextField
        type="text"
        margin="normal"
        required
        id="key"
        label="Public key"
        autoComplete="off"
        value={newKey.key}
        onChange={(e) =>
          setNewKey({
            ...newKey,
            key: e.target.value,
          })
        }
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
                value={newServer.id}
                onChange={(e) =>
                  setNewServer({
                    ...newServer,
                    id: e.target.value.replace(/[^a-zA-Z0-9]/g, ''),
                  })
                }
              />
            </TableCell>
            <TableCell>
              <Select
                labelId="provider-select-label"
                id="provider-select"
                value={newServer.Provider}
                onChange={(e) =>
                  setNewServer({ ...newServer, Provider: e.target.value })
                }
              >
                <MenuItem value="OVH">OVH</MenuItem>
                <MenuItem value="Latitude">Latitude</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={newServer.Type}
                onChange={(e) => {
                  console.log(e.target.value);
                  setNewServer({ ...newServer, Type: e.target.value });
                }}
              >
                <MenuItem value="NEAR">NEAR</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="IPv4"
                autoComplete="off"
                value={newServer.IPv4}
                onChange={(e) =>
                  setNewServer({
                    ...newServer,
                    IPv4: e.target.value,
                  })
                }
              />
            </TableCell>
            <TableCell>
              <TextField
                type="number"
                variant="standard"
                margin="normal"
                required
                id="CIDR"
                autoComplete="off"
                value={newServer.CIDR}
                onChange={(e) =>
                  setNewServer({
                    ...newServer,
                    CIDR: e.target.value,
                  })
                }
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="Gateway"
                autoComplete="off"
                value={newServer.Gateway}
                onChange={(e) =>
                  setNewServer({
                    ...newServer,
                    Gateway: e.target.value,
                  })
                }
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                variant="standard"
                margin="normal"
                required
                id="Username"
                autoComplete="off"
                value={newServer.Username}
                onChange={(e) =>
                  setNewServer({
                    ...newServer,
                    Username: e.target.value,
                  })
                }
              />
            </TableCell>
            <TableCell>
              <Select
                labelId="disks-select-label"
                id="disks-select"
                value={newServer.disks}
                onChange={(e) =>
                  setNewServer({ ...newServer, disks: e.target.value })
                }
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button onClick={addNewServer} variant="contained">
        Add
      </Button>
    </Container>
  );
};

export default AddServer;
