import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  Box,
  Button,
  Link,
  Typography,
  TextField,
  useTheme,
  selectClasses,
} from '@mui/material';
import { Link as LinkRouter } from 'react-router-dom';
import { nearConfig } from '../helpers/nearConfig';
import { createStakingPool, generateKey } from '../helpers/staking';
import * as zip from '@zip.js/zip.js';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '../svg/refresh';
import { getCustomThemeStyles } from '../ui/styles/theme';
import PercentageIcon from '../svg/percentage';
import InputNumberArrowIcon from '../svg/inputNumberArrow';
import SelectArrow from '../svg/selectArrow';

const DataForm = (props) => {
  const [statusData, setStatusData] = useState({ open: false });
  const [poolName, setPoolName] = useState('');
  const [ownerAccount, setOwnerAccount] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [percentageFee, setPercentageFee] = useState(0);
  const [poolNameErrorText, setPoolNameErrorText] = useState('');
  const [ownerAccountErrorText, setOwnerAccountErrorText] = useState('');
  const [publicKeyErrorText, setPublicKeyErrorText] = useState('');
  const [percentageFeeErrorText, setPercentageFeeErrorText] = useState('');
  const [keyPairErrorText, setKeyPairErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');
  const [isKeyPairDownloaded, setIsKeyPairDownloaded] = useState(true);
  const [contractPool, setContractPool] = useState(2);
  const theme = useTheme();

  const handleClickArropUp = () => {
    setPercentageFee((old) => old + 1);
  };

  const handleClickArropDown = () => {
    setPercentageFee((old) => {
      if (old - 1 >= 0) {
        return old - 1;
      }
      return old;
    });
  };

  const handlePublicKeyChange = (e) => {
    setPublicKey(e.target.value);
    setPublicKeyErrorText('');
    setKeyPair(null);
    localStorage.setItem('publicKey', e.target.value);
  };

  const handleGenerateKey = () => {
    if (poolName) {
      const kp = generateKey(
        poolName +
          '.' +
          (contractPool === 2
            ? nearConfig.contractPool
            : nearConfig.contractPoolV1)
      );
      setKeyPair(kp);
      setPublicKey(kp.public_key);
      localStorage.setItem('publicKey', kp.public_key);
      setIsKeyPairDownloaded(false);
      setPublicKeyErrorText('');
    } else {
      setPoolNameErrorText('Please enter Pool Name');
    }
  };

  const getZipFileBlob = async (keyPair) => {
    if (!comparePasswords()) return false;
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
    await Promise.all([
      zipWriter.add(
        'validator_key.json',
        new zip.TextReader(JSON.stringify(keyPair, null, 2)),
        { password }
      ),
      zipWriter.add(
        'node_key.json',
        new zip.TextReader(JSON.stringify(generateKey('node'), null, 2)),
        { password }
      ),
    ]);
    return await zipWriter.close();
  };

  const saveKeyPair2Storage = (blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      localStorage.setItem(
        'key_' +
          poolName +
          '.' +
          (contractPool === 2
            ? nearConfig.contractPool
            : nearConfig.contractPoolV1),
        event.target.result
      );
    };
    reader.readAsDataURL(blob);
    return blob;
  };

  const downloadFile = (blob) => {
    if (!blob) return false;
    saveKeyPair2Storage(blob);
    const a = document.createElement('a');
    a.download =
      poolName +
      '.' +
      (contractPool === 2
        ? nearConfig.contractPool
        : nearConfig.contractPoolV1) +
      '.zip';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
    setKeyPairErrorText('');
    setIsKeyPairDownloaded(true);
  };

  const comparePasswords = () => {
    if (!password || !confirmPassword) {
      setConfirmPasswordErrorText('Please enter passwords');
      return false;
    }
    if (password === confirmPassword) {
      setConfirmPasswordErrorText('');
      return true;
    } else {
      setConfirmPasswordErrorText('Passwords do not match');
      return false;
    }
  };

  const chekForm = async () => {
    if (!poolName) {
      setPoolNameErrorText('Please enter Pool Name');
      return false;
    }
    if (
      await props.wallet.accountExists(
        poolName +
          '.' +
          (contractPool === 2
            ? nearConfig.contractPool
            : nearConfig.contractPoolV1)
      )
    ) {
      setPoolNameErrorText('The pool already exists');
      return false;
    }
    if (!ownerAccount) {
      setOwnerAccountErrorText('Please enter Owner account');
      return false;
    }
    if (!publicKey) {
      setPublicKeyErrorText('Please enter Public key');
      return false;
    }
    if (!percentageFee) {
      setPercentageFeeErrorText('Please enter Percentage fee');
      return false;
    }
    if (keyPair && !isKeyPairDownloaded) {
      setKeyPairErrorText('Please download Key Pair');
      setPublicKeyErrorText('Please download Key Pair');
      return false;
    }
    return true;
  };

  const onPoolCreated = (transactionHashes, account_id) => {
    (async () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network: nearConfig.networkId,
          account_id: account_id,
        }),
      };
      await fetch(nearConfig.backendUrl + 'pools/update', requestOptions)
        .then(async (response) => {
          await response.json();
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    })();
    setStatusData({
      open: true,
      hash: transactionHashes,
      description: 'The pool is Live!',
    });
  };

  const submitCreateStakingPool = async (e) => {
    e.preventDefault();
    if (await chekForm()) {
      if (
        props.wallet.wallet.id === 'ledger' ||
        props.wallet.wallet.id === 'wallet-connect'
      ) {
        try {
          setStatusData({
            open: true,
            description:
              'Please confirm transaction on ' + props.wallet.wallet.id,
          });
          const r = await createStakingPool(
            props.wallet,
            contractPool,
            poolName,
            ownerAccount,
            publicKey,
            percentageFee
          );
          if (r.status.hasOwnProperty('SuccessValue'))
            onPoolCreated(r.transaction.hash, props.wallet.accountId);
          if (r.status.hasOwnProperty('Failure'))
            setStatusData({
              open: true,
              hash: r.transaction.hash,
              description: JSON.stringify(r.status.Failure.ActionError),
              hasError: true,
            });
        } catch (e) {
          setStatusData({ open: true, description: e.message, hasError: true });
        }
      } else {
        await createStakingPool(
          props.wallet,
          contractPool,
          poolName,
          ownerAccount,
          publicKey,
          percentageFee
        );
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('transactionHashes') && props.wallet.accountId)
      onPoolCreated(params.get('transactionHashes'), props.wallet.accountId);
    setOwnerAccount(props.wallet.accountId);
  }, [props.wallet.accountId]);

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} p={2}>
        <Typography component="h1" variant="h5" align={'center'}>
          Create a new pool
        </Typography>
        {!statusData.open ? (
          <>
            <Grid container spacing={{ xs: '12px', sm: '24px', md: '48px' }}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  margin="normal"
                  required
                  fullWidth
                  id="poolName"
                  label="Pool Name"
                  autoComplete="off"
                  helperText={poolNameErrorText}
                  error={!!poolNameErrorText}
                  value={poolName}
                  onChange={(e) => {
                    setPoolName(e.target.value);
                    localStorage.setItem('poolName', e.target.value);
                    setPoolNameErrorText('');
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  select
                  id="contractPool"
                  value={contractPool}
                  onChange={(e) => {
                    setContractPool(e.target.value);
                  }}
                  SelectProps={{
                    IconComponent: (props) => <SelectArrow {...props} />,
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          padding: '0',
                          borderRadius: '10px',
                          boxShadow: customTheme.shadows.light,
                          backgroundColor: 'primary.light',
                          backgroundImage: 'none',
                          border: 1,
                          borderColor: 'primary.dark',
                        },
                      },
                    },
                  }}
                  sx={{
                    [`& .${selectClasses.icon}`]: {
                      top: 0,
                      bottom: 0,
                      right: '20px',
                      marginBlock: 'auto',
                      color: theme.palette.text.primary,
                      transition: '0.15s',
                    },
                  }}
                >
                  <MenuItem
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1,
                      padding: '8px 16px',
                    }}
                    value={2}
                  >
                    {nearConfig.contractPool}
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1,
                      padding: '8px 16px',
                    }}
                    value={1}
                  >
                    {nearConfig.contractPoolV1}
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              type="text"
              margin="normal"
              required
              fullWidth
              id="publicKey"
              label="Public key"
              autoComplete="off"
              helperText={publicKeyErrorText}
              error={!!publicKeyErrorText}
              value={publicKey}
              onChange={handlePublicKeyChange}
            />
            <Grid container justifyContent="flex-end" sx={{ marginTop: '8px' }}>
              <Button
                onClick={handleGenerateKey}
                variant="text"
                sx={{
                  padding: '16px 32px',
                  boxShadow: customTheme.shadows.light,
                  fontSize: '15px',
                  color: 'text.primary',
                  border: 0,
                }}
              >
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    marginRight: '16px',
                    color: 'primary.main',
                  }}
                >
                  <RefreshIcon />
                </Box>
                Generate Key pair
              </Button>
            </Grid>
            {keyPair ? (
              <>
                <TextField
                  type="password"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  autoComplete="off"
                  error={!!confirmPasswordErrorText}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <TextField
                  type="password"
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm password"
                  autoComplete="off"
                  helperText={confirmPasswordErrorText}
                  error={!!confirmPasswordErrorText}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <Grid container justifyContent="flex-end">
                  <Box sx={{ color: 'error.main' }} p={1}>
                    {keyPairErrorText}
                  </Box>
                  <Button
                    onClick={() => getZipFileBlob(keyPair).then(downloadFile)}
                    variant="outlined"
                  >
                    Download Key pair
                  </Button>
                </Grid>
              </>
            ) : null}

            <TextField
              margin="normal"
              required
              fullWidth
              id="ownerAccount"
              label="Owner account"
              autoComplete="off"
              helperText={ownerAccountErrorText}
              error={!!ownerAccountErrorText}
              value={ownerAccount}
              onChange={(e) => {
                setOwnerAccount(e.target.value);
                setOwnerAccountErrorText('');
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: '16px',
                marginTop: '16px',
              }}
            >
              <TextField
                type="number"
                required
                id="percentageFee"
                label="Percentage fee"
                autoComplete="off"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                helperText={percentageFeeErrorText}
                error={!!percentageFeeErrorText}
                value={percentageFee}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                  '& input[type="number"]::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                }}
                onChange={(e) => {
                  setPercentageFee(e.target.value);
                  setPercentageFeeErrorText('');
                }}
              />
              <Box
                sx={{
                  width: '64px',
                  height: '56px',
                  border: 1,
                  borderColor: 'info.main',
                  borderRadius: '10px',
                  display: 'flex',
                  columnGap: '2px',
                  alignItems: 'center',
                  padding: '4px 8px 4px 4px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      width: '24px',
                      height: '24px',
                      padding: '4px',
                      color: 'text.primary',
                      borderRadius: '4px',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor: 'success.main',
                      },
                    }}
                    onClick={handleClickArropUp}
                  >
                    <InputNumberArrowIcon />
                  </Box>
                  <Box
                    sx={{
                      color: 'text.primary',
                      width: '24px',
                      height: '24px',
                      padding: '4px',
                      borderRadius: '4px',
                      transform: 'rotate(-180deg)',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor: 'success.main',
                      },
                    }}
                    onClick={handleClickArropDown}
                  >
                    <InputNumberArrowIcon />
                  </Box>
                </Box>
                <Box sx={{ width: '24px', height: '24px' }}>
                  <PercentageIcon
                    frameColor={theme.palette.text.primary}
                    percentageColor={theme.palette.primary.main}
                  />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '24px',
              }}
            >
              <Button
                onClick={submitCreateStakingPool}
                variant="contained"
                sx={{ padding: '16px 32px', lineHeight: 1 }}
              >
                LAUNCH POOL
              </Button>
            </Box>
          </>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Grid container align={'center'}>
                <Grid item xs={12}>
                  <Box>
                    <WarningIcon
                      color={statusData.hasError ? 'error' : 'primary.main'}
                      fontSize="large"
                    />
                  </Box>
                  {statusData.description}
                </Grid>
                {statusData.hash ? (
                  <Grid item xs={12}>
                    <Link
                      href={
                        props.wallet.walletSelector.options.network
                          .explorerUrl +
                        '/transactions/' +
                        statusData.hash
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Explorer
                    </Link>
                    <Box p={2}>
                      <Button
                        to="/pools"
                        component={LinkRouter}
                        variant="contained"
                      >
                        Finish
                      </Button>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default function CreateStakingPool({ wallet, isSignedIn }) {
  if (!isSignedIn) {
    wallet.signIn();
    return false;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataForm wallet={wallet} />
    </Box>
  );
}
