import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  selectClasses,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InfoCircle from '../svg/infoCircle';
import SelectArrow from '../svg/selectArrow';
import DialogCopyLinkEl from '../ui/components/DialogCopyLinkEl';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { getCustomThemeStyles } from '../ui/styles/theme';

const StyledSelect = styled(Select)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  color: theme.palette.text.primary,

  '&:focus-visible': {
    outline: 'none',
  },

  '& .MuiSelect-select': {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },

  [`& .${selectClasses.icon}`]: {
    top: 0,
    bottom: 0,
    right: '5px',
    marginBlock: 'auto',
    color: theme.palette.text.primary,
  },

  [`& .${selectClasses.iconOpen}`]: {
    transform: 'rotate(90deg)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 700,
  fontSize: '16px',
}));

const AddServer = ({ isSignedIn, wallet }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
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
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  const customThemes = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleInfoClick = () => {
    setDialogOpen((prev) => !prev);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Container
      sx={{
        '@media (min-width: 1200px)': { maxWidth: '1512px' },
      }}
    >
      <SnackbarAlert
        msg={warningMount}
        setMsg={setWarningMount}
        severity="error"
      />
      <Dialog
        onClose={handleCloseDialog}
        open={isDialogOpen}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: '523px' },
            paddingTop: '32px',
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            marginBlock: '0 32px',
            padding: '0',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: '30px',
            fontSize: '24px',
            paddingInline: '32px',
          }}
        >
          kuutamo NEAR is tested and <br /> supported on:
        </DialogTitle>
        <DialogContent
          sx={{
            overflow: 'hidden',
            padding: '0 32px 32px 32px',
            '& > div:first-child': {
              marginBottom: '24px',
            },
          }}
        >
          <DialogCopyLinkEl to="https://www.latitude.sh/dashboard">
            <Box
              component={Link}
              to="https://www.latitude.sh/dashboard"
              sx={{ color: 'info.secondary', textUnderlineOffset: '3px' }}
            >
              Latitude -c3.medium.x86 with Ubuntu
            </Box>
            - use code <br /> “kuutamo” at checkout for 20% off
          </DialogCopyLinkEl>
          <DialogCopyLinkEl to="https://miro.com/app/board/uXjVMeQRhrk=/?moveToWidget=3458764549184340446&cot=14">
            <Box
              component={Link}
              to="https://miro.com/app/board/uXjVMeQRhrk=/?moveToWidget=3458764549184340446&cot=14"
              sx={{ color: 'info.secondary', textUnderlineOffset: '3px' }}
            >
              OVH - Advance 1 Gen, 64GB RAM, 2 x 960GB NVMe,
            </Box>
            &nbsp;with Ubuntu
          </DialogCopyLinkEl>
        </DialogContent>
      </Dialog>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h4" fontSize={48} lineHeight={1}>
          Bring your own server
        </Typography>
      </Box>
      <Box sx={{ marginLeft: '156px' }}>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '16px',
            marginTop: '56px',
            fontFamily: "'Roboto', sans-serif",
            fontSize: '24px',
            lineHeight: 1,
            marginBottom: '1em',
          }}
          lineHeight={1}
        >
          Step 1: Get a server, install ubuntu on it. Enable sshd and add a root
          key.
          <Box
            component="span"
            sx={{
              color: 'primary.main',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
            }}
            onClick={handleInfoClick}
          >
            <InfoCircle />
          </Box>
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '24px',
            lineHeight: 1,
            marginBottom: '1em',
          }}
        >
          Step 2: Enter details of your server...
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '24px' }}>
          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '24px',
              lineHeight: 1,
            }}
          >
            SSH Public Key:
          </Typography>
          <Box sx={{ display: 'flex', columnGap: '24px' }}>
            <TextField
              fontSize="24px"
              type="text"
              margin="normal"
              required
              placeholder="Key Name"
              autoComplete="off"
              value={newKey.name}
              inputProps={{ style: { fontSize: 24 } }}
              InputLabelProps={{ style: { fontSize: 24 } }}
              sx={{
                height: '84px',
                border: 1,
                borderColor: 'primary.main',
                borderRadius: '10px',
                transition: '0.3s',
                '& fieldset': { border: 'none' },

                '& .MuiInputBase-root': {
                  height: '100%',
                },

                '&:hover, &:focus, &:focus-visible': {
                  boxShadow: customThemes.shadows.main,
                },
              }}
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
              autoComplete="off"
              placeholder="Public Key"
              value={newKey.key}
              inputProps={{ style: { fontSize: 24 } }}
              InputLabelProps={{ style: { fontSize: 24 } }}
              sx={{
                height: '84px',
                border: 1,
                borderColor: 'primary.main',
                borderRadius: '10px',
                transition: '0.3s',

                '& .MuiInputBase-root': {
                  height: '100%',
                },
                '& fieldset': { border: 'none' },

                '&:hover, &:focus, &:focus-visible': {
                  boxShadow: customThemes.shadows.main,
                },
              }}
              onChange={(e) =>
                setNewKey({
                  ...newKey,
                  key: e.target.value,
                })
              }
            />
          </Box>
        </Box>
      </Box>
      <Table aria-label="Servers" sx={{ marginTop: '24px' }}>
        <TableHead>
          <TableRow sx={{}}>
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
            <TableCell align="center">
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
            <TableCell align="center">
              <StyledSelect
                variant="standard"
                labelId="provider-select-label"
                id="provider-select"
                value={newServer.Provider}
                onChange={(e) =>
                  setNewServer({ ...newServer, Provider: e.target.value })
                }
                disableUnderline
                IconComponent={(props) => <SelectArrow {...props} />}
              >
                <StyledMenuItem value="OVH">OVH</StyledMenuItem>
                <StyledMenuItem value="Latitude">Latitude</StyledMenuItem>
                <StyledMenuItem value="Other">Other</StyledMenuItem>
              </StyledSelect>
            </TableCell>
            <TableCell align="center">
              <StyledSelect
                variant="standard"
                labelId="type-select-label"
                id="type-select"
                value={newServer.Type}
                onChange={(e) => {
                  console.log(e.target.value);
                  setNewServer({ ...newServer, Type: e.target.value });
                }}
                disableUnderline
                IconComponent={(props) => <SelectArrow {...props} />}
              >
                <StyledMenuItem value="NEAR">NEAR</StyledMenuItem>
              </StyledSelect>
            </TableCell>
            <TableCell align="center">
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
            <TableCell align="center">
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
            <TableCell align="center">
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
            <TableCell align="center">
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
            <TableCell align="center">
              <StyledSelect
                variant="standard"
                labelId="disks-select-label"
                id="disks-select"
                value={newServer.disks}
                onChange={(e) =>
                  setNewServer({ ...newServer, disks: e.target.value })
                }
                disableUnderline
                IconComponent={(props) => <SelectArrow {...props} />}
              >
                <StyledMenuItem value="1">1</StyledMenuItem>
                <StyledMenuItem value="2">2</StyledMenuItem>
                <StyledMenuItem value="3">3</StyledMenuItem>
              </StyledSelect>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
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
          onClick={addNewServer}
        >
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          Add
        </Button>
      </Box>
    </Container>
  );
};

export default AddServer;
