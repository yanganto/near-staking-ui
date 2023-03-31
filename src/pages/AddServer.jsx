import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addServerInitialValues } from '../constants';
import ArrowLeftIcon from '../svg/arrow-left';
import InfoCircle from '../svg/infoCircle';
import SelectArrow from '../svg/selectArrow';
import DialogCopyLinkEl from '../ui/components/DialogCopyLinkEl';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { StyledMenuItem, MuiStyledSelect } from '../ui/components/StyledSelect';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { addServerValidator } from '../validators/addServerValidator';

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

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (values) => {
    const newServer = values.server;
    const newKey = values.key;
    newServer.key = newKey.name;
    const newServers = [...servers, newServer];
    const newKeys = [...keys, newKey];
    setServers(newServers);
    setKeys(newKeys);
    localStorage.setItem('servers', JSON.stringify(newServers));
    localStorage.setItem('keys', JSON.stringify(newKeys));
    navigate('/servers');
  };

  useEffect(() => {
    if (!isSignedIn) {
      wallet.signIn();
    }
  });

  const customThemes = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleInfoClick = () => {
    setDialogOpen((prev) => !prev);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  return isSignedIn ? (
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
              target="_blank"
            >
              Latitude -c3.medium.x86 with Ubuntu
            </Box>
            &nbsp;- use code <br /> “kuutamo” at checkout for 20% off
          </DialogCopyLinkEl>
          <DialogCopyLinkEl to="https://www.ovhcloud.com/en-gb/bare-metal/advance/adv-1/">
            <Box
              component={Link}
              to="https://www.ovhcloud.com/en-gb/bare-metal/advance/adv-1/"
              target="_blank"
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
      <Formik
        initialValues={addServerInitialValues}
        onSubmit={handleSubmit}
        validationSchema={addServerValidator}
        validateOnChange={false}
      >
        {({ values, handleChange, setFieldValue, errors, validateForm }) => (
          <Form>
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
                Step 1: Get a server, install ubuntu on it. Enable sshd and add
                a root key.
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '24px',
                }}
              >
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
                  <Field
                    component={MuiTextField}
                    name="key.name"
                    fontSize="24px"
                    type="text"
                    margin="normal"
                    required
                    placeholder="Key Name"
                    autoComplete="off"
                    inputProps={{
                      style: { fontSize: 24 },
                    }}
                    InputLabelProps={{ style: { fontSize: 24 } }}
                    FormHelperTextProps={{
                      sx: {
                        fontWeight: '400',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '14px',
                        position: 'absolute',
                        bottom: '-25px',
                      },
                    }}
                    error={errors['key'] && !!errors['key'].name}
                    helperText={errors['key'] && errors['key'].name}
                    sx={{
                      height: '84px',
                      border: 1,
                      borderColor: 'primary.main',
                      borderRadius: '10px',
                      transition: '0.3s',
                      '& fieldset': { border: 'none' },

                      '& .MuiInputBase-root': {
                        minHeight: '100%',
                      },

                      '&:hover, &:focus, &:focus-visible': {
                        boxShadow: customThemes.shadows.main,
                      },
                    }}
                  />
                  <Field
                    component={MuiTextField}
                    name="key.value"
                    type="text"
                    margin="normal"
                    required
                    autoComplete="off"
                    FormHelperTextProps={{
                      sx: {
                        fontWeight: '400',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '14px',
                        position: 'absolute',
                        bottom: '-25px',
                      },
                    }}
                    error={errors['key'] && !!errors['key'].value}
                    helperText={errors['key'] && errors['key'].value}
                    placeholder="Public Key"
                    inputProps={{ style: { fontSize: 24 } }}
                    InputLabelProps={{ style: { fontSize: 24 } }}
                    sx={{
                      height: '84px',
                      border: 1,
                      borderColor: 'primary.main',
                      borderRadius: '10px',
                      transition: '0.3s',

                      '& .MuiInputBase-root': {
                        minHeight: '100%',
                      },
                      '& fieldset': { border: 'none' },

                      '&:hover, &:focus, &:focus-visible': {
                        boxShadow: customThemes.shadows.main,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Table aria-label="Servers" sx={{ marginTop: '24px' }}>
              <TableHead>
                <TableRow sx={{}}>
                  <TableCell
                    sx={{ borderTopLeftRadius: '10px' }}
                    align="center"
                  >
                    ID
                  </TableCell>
                  <TableCell align="center">Provider</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">IPv4</TableCell>
                  <TableCell align="center">CIDR</TableCell>
                  <TableCell align="center">Gateway</TableCell>
                  <TableCell align="center">Root Username</TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderTopRightRadius: '10px' }}
                  >
                    № of disks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Field
                      component={MuiTextField}
                      name="server.id"
                      type="text"
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].id}
                      helperText={errors['server'] && errors['server'].id}
                      variant="standard"
                      margin="normal"
                      required
                      id="key"
                      autoComplete="off"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiStyledSelect}
                      name="server.Provider"
                      variant="standard"
                      id="provider-select"
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].Provider}
                      helperText={errors['server'] && errors['server'].Provider}
                      onChange={(e) => {
                        if (
                          e &&
                          e.target &&
                          e.target.value &&
                          (e.target.value === 'OVH' ||
                            e.target.value === 'Latitude')
                        ) {
                          setFieldValue('server.CIDR', 24);

                          if (
                            values.server.IPv4 &&
                            (!errors || !errors.server || !errors.server.IPv4)
                          ) {
                            const arr = values.server.IPv4.split('.');
                            arr.pop();
                            if (e.target.value === 'OVH') {
                              setFieldValue(
                                'server.Gateway',
                                `${arr.join('.')}.254`
                              );
                            } else if (e.target.value === 'Latitude') {
                              setFieldValue(
                                'server.Gateway',
                                `${arr.join('.')}.1`
                              );
                            }
                          }
                        }

                        handleChange('server.Provider');
                      }}
                      select
                      SelectProps={{
                        displayEmpty: true,
                        disableUnderline: true,
                        IconComponent: (props) => <SelectArrow {...props} />,
                        sx: {
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '18px',
                        },
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              padding: '0',
                              borderRadius: '10px',
                              boxShadow:
                                theme.palette.mode === 'dark'
                                  ? '0px 0px 8px rgba(7, 9, 14, 0.1);'
                                  : '0px 0px 8px rgb(0 33 71 / 10%)',
                              backgroundColor: 'primary.light',
                              backgroundImage: 'none',
                              border: 1,
                              borderColor: 'primary.dark',
                            },
                          },
                        },
                      }}
                    >
                      <StyledMenuItem disabled value="">
                        Select
                      </StyledMenuItem>
                      <StyledMenuItem value="OVH">OVH</StyledMenuItem>
                      <StyledMenuItem value="Latitude">Latitude</StyledMenuItem>
                      <StyledMenuItem value="Other">Other</StyledMenuItem>
                    </Field>
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiStyledSelect}
                      variant="standard"
                      id="type-select"
                      name="server.Type"
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].Type}
                      helperText={errors['server'] && errors['server'].Type}
                      select
                      SelectProps={{
                        disableUnderline: true,
                        IconComponent: (props) => <SelectArrow {...props} />,
                        sx: {
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '18px',
                        },
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              padding: '0',
                              borderRadius: '10px',
                              boxShadow:
                                theme.palette.mode === 'dark'
                                  ? '0px 0px 8px rgba(7, 9, 14, 0.1);'
                                  : '0px 0px 8px rgb(0 33 71 / 10%)',
                              backgroundColor: 'primary.light',
                              backgroundImage: 'none',
                              border: 1,
                              borderColor: 'primary.dark',
                            },
                          },
                        },
                      }}
                    >
                      <StyledMenuItem value="NEAR">NEAR</StyledMenuItem>
                    </Field>
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiTextField}
                      type="text"
                      name="server.IPv4"
                      variant="standard"
                      margin="normal"
                      required
                      id="IPv4"
                      autoComplete="off"
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].IPv4}
                      helperText={errors['server'] && errors['server'].IPv4}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiTextField}
                      type="number"
                      name="server.CIDR"
                      disabled={
                        values.server.Provider === 'OVH' ||
                        values.server.Provider === 'Latitude'
                      }
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].CIDR}
                      helperText={errors['server'] && errors['server'].CIDR}
                      variant="standard"
                      margin="normal"
                      required
                      id="CIDR"
                      autoComplete="off"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiTextField}
                      name="server.Gateway"
                      disabled={
                        (values.server.Provider === 'OVH' ||
                          values.server.Provider === 'Latitude') &&
                        (!errors || !errors.server || !errors.server.IPv4)
                      }
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].Gateway}
                      helperText={errors['server'] && errors['server'].Gateway}
                      type="text"
                      variant="standard"
                      margin="normal"
                      required
                      id="Gateway"
                      autoComplete="off"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiTextField}
                      name="server.Username"
                      type="text"
                      variant="standard"
                      margin="normal"
                      required
                      id="Username"
                      autoComplete="off"
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].Username}
                      helperText={errors['server'] && errors['server'].Username}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      component={MuiStyledSelect}
                      name="server.disks"
                      variant="standard"
                      id="disks-select"
                      select
                      FormHelperTextProps={{
                        sx: {
                          fontWeight: '400',
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '14px',
                          position: 'absolute',
                          bottom: '-25px',
                        },
                      }}
                      error={errors['server'] && !!errors['server'].disks}
                      helperText={errors['server'] && errors['server'].disks}
                      SelectProps={{
                        displayEmpty: true,
                        disableUnderline: true,
                        IconComponent: (props) => <SelectArrow {...props} />,
                        sx: {
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '18px',
                        },

                        MenuProps: {
                          PaperProps: {
                            sx: {
                              padding: '0',
                              borderRadius: '10px',
                              boxShadow:
                                theme.palette.mode === 'dark'
                                  ? '0px 0px 8px rgba(7, 9, 14, 0.1);'
                                  : '0px 0px 8px rgb(0 33 71 / 10%)',
                              backgroundColor: 'primary.light',
                              backgroundImage: 'none',
                              border: 1,
                              borderColor: 'primary.dark',
                            },
                          },
                        },
                      }}
                    >
                      <StyledMenuItem disabled value="">
                        Select
                      </StyledMenuItem>
                      <StyledMenuItem value="1">1</StyledMenuItem>
                      <StyledMenuItem value="2">2</StyledMenuItem>
                      <StyledMenuItem value="3">3</StyledMenuItem>
                    </Field>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="text"
                component={Link}
                to="/servers"
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
                <Box
                  width={24}
                  height={24}
                  color="primary.main"
                  sx={{ marginRight: '16px' }}
                >
                  <ArrowLeftIcon />
                </Box>
                Back
              </Button>
              <Button
                onClick={() => {
                  validateForm();
                }}
                type="submit"
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
                Add
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  ) : null;
};

export default AddServer;
