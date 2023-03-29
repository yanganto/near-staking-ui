import { useEffect, useState } from 'react';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Link,
  Button,
  Table,
  Typography,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { getStakedValidators, unstakeWithdraw } from '../../helpers/staking';
import { useTheme } from '@mui/material/styles';

export const YourCurrentDelegations = ({ wallet, transactionHashes }) => {
  const theme = useTheme();
  const [yourCurrentDelegations, setYourCurrentDelegations] = useState([]);
  const [validatorsIsReady, setValidatorsIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataUnstakeWithdraw, setDataUnstakeWithdraw] = useState({});
  const [helperText, setHelperText] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [transactionHashesUW, setTransactionHashesUW] = useState(null);

  const confirm = useConfirm();
  const handleClickOpen = () => {
    setHelperText('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const submitUnstakeWithdraw = async (all, data = false) => {
    const dataJson = data !== false ? data : dataUnstakeWithdraw;
    if (
      wallet.wallet.id === 'ledger' ||
      wallet.wallet.id === 'wallet-connect'
    ) {
      try {
        setHelperText('Please confirm transaction on ' + wallet.wallet.id);
        setAlertSeverity('info');
        const r = await unstakeWithdraw(wallet, { ...dataJson, all: all });
        if (r.status.hasOwnProperty('SuccessValue')) {
          setHelperText('Success!');
          setTransactionHashesUW(r.transaction.hash);
          setAlertSeverity('success');
        }
        if (r.status.hasOwnProperty('Failure')) {
          setHelperText(JSON.stringify(r.status.Failure.ActionError));
          setAlertSeverity('error');
        }
      } catch (e) {
        setHelperText(e.message);
        setAlertSeverity('error');
      }
    } else {
      setHelperText('Approve Transaction. Redirect...');
      await unstakeWithdraw(wallet, { ...dataJson, all: all });
    }
  };

  useEffect(() => {
    setValidatorsIsReady(false);
    (async () => {
      const stakedValidators = await getStakedValidators(wallet);
      setYourCurrentDelegations(stakedValidators);
      setValidatorsIsReady(true);
    })();
  }, [wallet, transactionHashes, transactionHashesUW]);

  return (
    <Grid container justifyContent="center" pt={1}>
      <Grid item xs={12}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: 'left' }}
          p={1}
        >
          Your current delegations
        </Typography>
        <Dialog open={open}>
          <DialogTitle id="alert-dialog-title">
            Please confirm {dataUnstakeWithdraw.cmd}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dataUnstakeWithdraw.pool}
            </DialogContentText>
            {!helperText ? (
              <TextField
                type="number"
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Amount"
                autoComplete="off"
                value={dataUnstakeWithdraw.amount || 0}
                onChange={(e) =>
                  setDataUnstakeWithdraw({
                    ...dataUnstakeWithdraw,
                    amount: e.target.value,
                  })
                }
              />
            ) : (
              <></>
            )}
          </DialogContent>
          {helperText ? (
            <Stack sx={{ width: '100%' }} pb={1}>
              <Alert severity={alertSeverity} mb={2}>
                {helperText}{' '}
                {transactionHashesUW ? (
                  <Link
                    href={
                      wallet.walletSelector.options.network.explorerUrl +
                      '/transactions/' +
                      transactionHashesUW
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Explorer
                  </Link>
                ) : null}
              </Alert>
            </Stack>
          ) : null}
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
            {!helperText ? (
              <>
                <Button
                  onClick={() => {
                    submitUnstakeWithdraw(false).then();
                  }}
                  variant="contained"
                >
                  {dataUnstakeWithdraw.cmd}
                </Button>
                <Button
                  onClick={() => {
                    submitUnstakeWithdraw(true).then();
                  }}
                  variant="contained"
                >
                  {dataUnstakeWithdraw.cmd} all
                </Button>
              </>
            ) : (
              <></>
            )}
          </DialogActions>
        </Dialog>
        <Table aria-label="Your Current Validators">
          <TableHead>
            <TableRow>
              <TableCell>Validator</TableCell>
              <TableCell align="right">Fee</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Staked</TableCell>
              <TableCell align="right">Unstaked</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {yourCurrentDelegations.map((row) => (
              <TableRow key={row.account_id}>
                <TableCell component="th" scope="row">
                  {row.account_id}
                </TableCell>
                <TableCell align="right">{row.fee}%</TableCell>
                <TableCell align="right">{row.totalBalance}</TableCell>
                <TableCell align="right">{row.stakedBalance}</TableCell>
                <TableCell align="right">{row.unstakedBalance}</TableCell>
                <TableCell align="center" sx={{ maxWidth: '200px' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ maxWidth: '200px' }}
                    disabled={row.stakedBalance <= 0}
                    onClick={() => {
                      setDataUnstakeWithdraw({
                        cmd: 'unstake',
                        pool: row.account_id,
                      });
                      if (row.canWithdraw && row.unstakedBalance > 0)
                        confirm({
                          confirmationText: 'Continue',
                          confirmationButtonProps: { autoFocus: true },
                          description:
                            'You have funds available to widthdraw now, if you unstake more, these funds will be locked for 4 epochs',
                        })
                          .then(() => {
                            handleClickOpen();
                          })
                          .catch(() => {});
                      else handleClickOpen();
                    }}
                  >
                    unstake
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1, maxWidth: '200px' }}
                    disabled={row.stakedBalance <= 0}
                    onClick={() => {
                      setDataUnstakeWithdraw({
                        cmd: 'unstake',
                        pool: row.account_id,
                      });
                      if (row.canWithdraw && row.unstakedBalance > 0) {
                        confirm({
                          confirmationText: 'Continue',
                          confirmationButtonProps: { autoFocus: true },
                          description:
                            'You have funds available to widthdraw now, if you unstake more, these funds will be locked for 4 epochs',
                        })
                          .then(() => {
                            setDataUnstakeWithdraw({
                              cmd: 'unstake',
                              pool: row.account_id,
                            });
                            handleClickOpen();
                            submitUnstakeWithdraw(true, {
                              cmd: 'unstake',
                              pool: row.account_id,
                            }).then();
                          })
                          .catch(() => {});
                      } else {
                        setDataUnstakeWithdraw({
                          cmd: 'unstake',
                          pool: row.account_id,
                        });
                        handleClickOpen();
                        submitUnstakeWithdraw(true, {
                          cmd: 'unstake',
                          pool: row.account_id,
                        }).then();
                      }
                    }}
                  >
                    unstake max
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1, maxWidth: '200px' }}
                    disabled={!row.canWithdraw || row.unstakedBalance <= 0}
                    onClick={() => {
                      setDataUnstakeWithdraw({
                        cmd: 'withdraw',
                        pool: row.account_id,
                      });
                      handleClickOpen();
                    }}
                  >
                    withdraw
                  </Button>
                  {!row.canWithdraw && row.unstakedBalance > 0 && (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color:
                          theme.palette.mode === 'dark' ? '#D2D1DA' : '#002147',
                      }}
                    >
                      {row.leftToWithdraw}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!validatorsIsReady ? (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};
