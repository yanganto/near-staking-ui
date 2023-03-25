import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Step,
  StepButton,
  Box,
  Stepper,
  Button,
  Link,
  Typography,
  TextField,
} from '@mui/material';
import { nearConfig } from '../helpers/nearConfig';
import { createStakingPool, generateKey } from '../helpers/staking';
import * as zip from '@zip.js/zip.js';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

const DataForm = (props) => {
  const [statusData, setStatusData] = useState({ open: false });
  const [poolName, setPoolName] = useState('');
  const [ownerAccount, setOwnerAccount] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [percentageFee, setPercentageFee] = useState('');
  const [poolNameErrorText, setPoolNameErrorText] = useState('');
  const [ownerAccountErrorText, setOwnerAccountErrorText] = useState('');
  const [publicKeyErrorText, setPublicKeyErrorText] = useState('');
  const [percentageFeeErrorText, setPercentageFeeErrorText] = useState('');
  const [keyPairErrorText, setKeyPairErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');
  const [isKeyPairDownloaded, setIsKeyPairDownloaded] = useState(true);
  const [contractPool, setContractPool] = useState(2);

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
    return zipWriter.close();
  };

  const downloadFile = (blob) => {
    if (!blob) return false;
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
        props.setActiveStep(2);
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

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} p={2}>
        <Typography component="h1" variant="h5" align={'center'}>
          Create a new pool
        </Typography>
        {props.activeStep < 2 ? (
          <>
            <Grid container>
              <Grid item xs={8}>
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
              <Grid item xs={4}>
                <TextField
                  margin="normal"
                  fullWidth
                  select
                  id="contractPool"
                  value={contractPool}
                  onChange={(e) => {
                    setContractPool(e.target.value);
                  }}
                >
                  <MenuItem value={2}>{nearConfig.contractPool}</MenuItem>
                  <MenuItem value={1}>{nearConfig.contractPoolV1}</MenuItem>
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
            {props.activeStep === 0 ? (
              <>
                <Grid container justifyContent="flex-end">
                  <Button onClick={handleGenerateKey} variant="outlined">
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
                        onClick={() =>
                          getZipFileBlob(keyPair).then(downloadFile)
                        }
                        variant="outlined"
                      >
                        Download Key pair
                      </Button>
                    </Grid>
                  </>
                ) : null}
              </>
            ) : null}
            {props.activeStep === 1 ? (
              <>
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
                <TextField
                  type="number"
                  margin="normal"
                  required
                  fullWidth
                  id="percentageFee"
                  label="Percentage fee"
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  helperText={percentageFeeErrorText}
                  error={!!percentageFeeErrorText}
                  value={percentageFee}
                  onChange={(e) => {
                    setPercentageFee(e.target.value);
                    setPercentageFeeErrorText('');
                  }}
                />
                <div>
                  <Button
                    onClick={submitCreateStakingPool}
                    variant="contained"
                    fullWidth
                  >
                    LAUNCH POOL
                  </Button>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Grid container align={'center'}>
                <Grid item xs={12}>
                  <Box>
                    <WarningIcon
                      color={statusData.hasError ? 'error' : 'primary'}
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
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Generate Key pair', 'Pool settings', 'Launch pool'];
  let navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 2) navigate('/pools');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) navigate('/pools');
    else setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (step <= 1) setActiveStep(step);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('transactionHashes')) setActiveStep(2);
  }, [isSignedIn]);

  if (!isSignedIn) {
    wallet.signIn();
    return false;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <DataForm
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        wallet={wallet}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          //disabled={ activeStep === 0 }
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep < 1 ? <Button onClick={handleNext}>Next</Button> : <></>}
        {activeStep === 2 ? (
          <Button onClick={handleNext}>Finish</Button>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
