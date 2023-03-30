import {
  Button,
  Container,
  LinearProgress,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  DialogTitle,
  IconButton,
  FormControl,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getMyPools, getSignature } from '../helpers/staking';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { nearConfig } from '../helpers/nearConfig';
import { useTheme } from '@mui/material/styles';
import ChooseDialog from '../ui/components/ChooseDialog';
import FileLinkIcon from '../svg/link';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import CopyIcon from '../svg/сopy';
import { StyledMenuItem, StyledSelect } from '../ui/components/StyledSelect';
import SelectArrow from '../svg/selectArrow';

const Pools = ({ wallet, isSignedIn }) => {
  const theme = useTheme();
  const [myPools, setMyPools] = useState({});
  const [myPoolsIsReady, setMyPoolsIsReady] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMountDialog, setOpenMountDialog] = useState(false);
  const [warningMount, setWarningMount] = useState('');
  const [existingValidator, setExistingValidator] = useState('');
  const servers = JSON.parse(localStorage.getItem('servers') || '[]');
  const keys = JSON.parse(localStorage.getItem('keys') || '[]');
  const [selectedPool, setSelectedPool] = useState(false);
  const [mountedPools, setMountedPools] = useState(
    JSON.parse(localStorage.getItem('mountedPools') || '{}')
  );

  useEffect(() => {
    (async () => {
      setMyPoolsIsReady(false);
      const res = await getMyPools(wallet);
      setMyPools(res);
      setMyPoolsIsReady(true);
    })();
  }, [wallet]);

  if (!isSignedIn) {
    wallet.signIn();
    return false;
  }

  const addExistingValidator = async () => {
    const { signature, public_key } = await getSignature(
      wallet,
      existingValidator
    );
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        network: nearConfig.networkId,
        account_id: wallet.accountId,
        pool_id: existingValidator,
        signature,
        public_key,
      }),
    };
    await fetch(
      nearConfig.backendUrl + 'add-existing-validator',
      requestOptions
    )
      .then(async (response) => {
        await response.json();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
    setOpenDialog(false);
    setExistingValidator('');
    setMyPoolsIsReady(false);
    const res = await getMyPools(wallet);
    setMyPools(res);
    setMyPoolsIsReady(true);
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }
    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  const downloadKeyFile = () => {
    const key = localStorage.getItem('key_' + selectedPool);
    if (!key) {
      setWarningMount('Key file not found');
      return false;
    }
    const blob = dataURItoBlob(key);
    const a = document.createElement('a');
    a.download = selectedPool + '.zip';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const downloadConfigFile = () => {
    const server = servers.filter(
      (element) => element.id === mountedPools[selectedPool]
    )[0];
    const sshKey = keys.filter((element) => element.name === server.key)[0];
    if (!sshKey) {
      setWarningMount('SSH Public Key not found');
      return false;
    }
    const devicePaths = [];
    for (let i = 0; i < server.disks; i++) {
      devicePaths.push(`/dev/nvme${i}n1`);
    }
    const disks = devicePaths.map((path) => `'${path}'`).join(', ');

    let txt = `[host_defaults]
public_ssh_keys = [
 '''${sshKey.key}'''
]
install_ssh_user = "${server.Username}"
nixos_module = "single-node-validator-${nearConfig.networkId}"
[hosts]
[hosts.validator-00]
ipv4_address = "${server.IPv4}"
ipv4_cidr = ${server.CIDR}
ipv4_gateway = "${server.Gateway}"
disks = [${disks}]
encrypted_kuutamo_app_file = "${selectedPool}.zip"
`;
    if (server.Provider === 'Latitude') txt += 'interface = "enp1s0f0"\n';

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.download = 'kneard.toml';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const mountServer = (pool) => {
    setSelectedPool(pool);
    setWarningMount('');
    setOpenMountDialog(true);
  };

  const handleChangeMountPool = (server, pool) => {
    const mp = mountedPools;
    mp[pool] = server;
    localStorage.setItem('mountedPools', JSON.stringify(mp));
    setMountedPools({ ...mountedPools, pool: server });
  };

  const handleDialogClose = () => setOpenMountDialog(false);

  const frameColor = theme.palette.text.primary;
  const arrowColor = theme.palette.primary.main;
  const isServersExists = !!localStorage.getItem('servers');
  const isKeysExists = !!localStorage.getItem('keys');
  const poolDialogData = [
    {
      id: 1,
      onClick: downloadKeyFile,
      title: 'Step 1',
      text: 'Key file',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
    {
      id: 2,
      onClick: downloadConfigFile,
      title: 'Step 2',
      text: 'Config file',
      disabled: !(isServersExists && isKeysExists),
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
    {
      id: 3,
      title: 'Step 3',
      text: 'Follow CLI guide to install',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
  ];

  return (
    <Container sx={{ marginLeft: { lg: '7.6%', md: '7%', xs: 'auto' } }}>
      <SnackbarAlert
        msg={warningMount}
        setMsg={setWarningMount}
        severity="error"
      />
      <ChooseDialog
        title="Follow the steps"
        isOpen={openMountDialog}
        onClose={handleDialogClose}
        data={poolDialogData}
      />
      <Dialog open={openDialog}>
        <DialogTitle id="alert-dialog-title">
          Add existing validator
        </DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="validator"
            label="Validator name"
            autoComplete="off"
            value={existingValidator}
            onChange={(e) => setExistingValidator(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Close
          </Button>
          <Button
            onClick={addExistingValidator}
            variant="contained"
            disabled={!existingValidator}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontSize: '48px', marginBottom: '8px' }}
          lineHeight={1}
          component="h1"
          variant="h4"
          align="left"
        >
          List of validators
        </Typography>
        <Button
          to="/pools/create"
          component={Link}
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
          New validator
        </Button>
      </Box>
      <Table aria-label="Pools">
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell>Owner_id</TableCell>
            <TableCell>Public_key</TableCell>
            <TableCell>Fee</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(myPools).map((key, index) => (
            <TableRow
              key={index}
              sx={{
                height: '63px',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell scope="row">{key}</TableCell>
              <TableCell
                title={'Click to Copy to Clipboard\n' + myPools[key].owner_id}
                onClick={() => {
                  navigator.clipboard.writeText(myPools[key].owner_id);
                }}
              >
                {myPools[key].owner_id && myPools[key].owner_id.length > 24
                  ? myPools[key].owner_id.substring(0, 12) +
                    '...' +
                    myPools[key].owner_id.substring(
                      myPools[key].owner_id.length - 12
                    )
                  : myPools[key].owner_id}
              </TableCell>
              <TableCell
                title={'Click to Copy to Clipboard\n' + myPools[key].public_key}
                onClick={() => {
                  navigator.clipboard.writeText(myPools[key].public_key);
                }}
              >
                {myPools[key].public_key && myPools[key].public_key.length > 24
                  ? myPools[key].public_key.substring(0, 12) + '...'
                  : myPools[key].public_key}{' '}
                <IconButton
                  color="inherit"
                  sx={{
                    paddingLeft: '8px',
                    width: '32px',
                    height: '32px',
                    color: 'primary.main',
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </TableCell>
              <TableCell>{myPools[key].fee}%</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '24px',
                  }}
                >
                  <FormControl sx={{ minWidth: 173 }} size="small">
                    <StyledSelect
                      IconComponent={(props) => <SelectArrow {...props} />}
                      labelId="server-select-label"
                      id={'server-select' + key}
                      value={mountedPools[key] ? mountedPools[key] : ''}
                      placeholder="server"
                      displayEmpty
                      onChange={(event) =>
                        handleChangeMountPool(event.target.value, key)
                      }
                      sx={{
                        borderRadius: '5px',
                        '& .MuiInputBase-input': {
                          height: '16px',
                          padding: '4px 30px 4px 8px',
                          fontSize: '16px',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                        },

                        '& .MuiSelect-icon': {
                          right: '8px',
                        },
                      }}
                    >
                      <StyledMenuItem value="">Server</StyledMenuItem>
                      {/* TODO: filter choosen values */}
                      {servers.map((s) => (
                        <StyledMenuItem value={s.id} key={s.id}>
                          {s.id}
                        </StyledMenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      onClick={() => mountServer(key)}
                      disabled={!mountedPools[key]}
                    >
                      Mount
                    </Button>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!myPoolsIsReady ? <LinearProgress /> : null}
    </Container>
  );
};

export default Pools;
