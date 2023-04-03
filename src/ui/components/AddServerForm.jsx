import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { Field, Form, useFormikContext } from 'formik';
import React from 'react';
import InfoCircle from '../../svg/infoCircle';
import SelectArrow from '../../svg/selectArrow';

import ArrowLeftIcon from '../../svg/arrow-left';
import MuiTextField from './MuiTextFieldFormik';
import { getCustomThemeStyles } from '../styles/theme';
import { MuiStyledSelect, StyledMenuItem } from './StyledSelect';
import { Link } from 'react-router-dom';
import DependentIPField from './DependentIPField';
import DependentDiskField from './DependentDiskField';

const AddServerForm = ({ handleInfoClick }) => {
  const theme = useTheme();
  const { values, errors } = useFormikContext();

  const customThemes = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
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
                <StyledMenuItem value="kuutamo">kuutamo</StyledMenuItem>
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
                inputProps={{
                  min: 0,
                }}
                error={errors['server'] && !!errors['server'].CIDR}
                helperText={errors['server'] && errors['server'].CIDR}
                variant="standard"
                margin="normal"
                id="CIDR"
                autoComplete="off"
              />
            </TableCell>
            <TableCell align="center">
              <DependentIPField
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
              <DependentDiskField
                name="server.disks"
                variant="standard"
                id="disks-select"
                select
                disabled={
                  values.server.Provider && values.server.Provider !== 'Other'
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
              </DependentDiskField>
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
  );
};

export default AddServerForm;
