import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addServerInitialValues } from '../constants';
import DialogCopyLinkEl from '../ui/components/DialogCopyLinkEl';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { addServerValidator } from '../validators/addServerValidator';
import AddServerForm from '../ui/components/AddServerForm';

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
        validateOnBlur={false}
      >
        <AddServerForm handleInfoClick={handleInfoClick} />
      </Formik>
    </Container>
  ) : null;
};

export default AddServer;
