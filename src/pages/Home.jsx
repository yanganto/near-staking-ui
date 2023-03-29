import {
  Box,
  Button,
  Container,
  DialogTitle,
  DialogContent,
  Dialog,
  Stack,
} from '@mui/material';
import * as React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ArrowLeftIcon from '../svg/arrow-left';
import { getCustomThemeStyles } from '../ui/styles/theme';
import LinkButton from '../ui/components/LinkButton';

const Home = ({ isSignedIn, wallet }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = React.useState(false);

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleClickNetwork = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleLoginClick = () => {
    wallet.signIn();
  };

  const changeNetwork = (networkId) => {
    localStorage.setItem('networkId', networkId);
    window.location.replace(window.location.origin);
  };

  return (
    <>
      {!isSignedIn ? (
        <>
          <Dialog open={openDialog} fullWidth maxWidth="sm">
            <Button
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                width: 'fit-content',
                margin: '18px 0 0 18px',
                fontSize: { lg: '16px', xl: '18px' },
              }}
              onClick={() => setOpenDialog(false)}
            >
              <Box
                sx={{
                  width: '28px',
                  height: '28px',
                  [theme.breakpoints.down('xl')]: {
                    width: '24px',
                    height: '24px',
                  },

                  marginRight: '11.5px',
                  color: 'primary.main',
                }}
              >
                <ArrowLeftIcon />
              </Box>
              back
            </Button>
            <DialogContent sx={{ padding: 0 }}>
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  marginBlock: '14px 1em',
                  padding: '0',
                  textAlign: 'center',
                  fontWeight: 500,
                  lineHeight: {
                    xl: '52px',
                    lg: '48px',
                    md: '44px',
                    sm: '38px',
                    xs: '32px',
                  },
                  fontSize: {
                    xl: '52px',
                    lg: '48px',
                    md: '44px',
                    sm: '38px',
                    xs: '32px',
                  },
                }}
              >
                Select an option
              </DialogTitle>
              <LinkButton text="Just stake" to="/stake" />
              <LinkButton text="Setup a node" to="/navpage" />
            </DialogContent>
          </Dialog>
          <Box sx={{ position: 'fixed', top: '0', right: '0' }}>
            <Button
              sx={{
                color: 'text.primary',
                border: '0px',
                textTransform: 'none',
              }}
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickNetwork}
            >
              <ArrowDropDownIcon />
              Network: {localStorage.getItem('networkId') || 'testnet'}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                value="testnet"
                onClick={() => changeNetwork('testnet')}
              >
                testnet
              </MenuItem>
              <MenuItem
                value="mainnet"
                onClick={() => changeNetwork('mainnet')}
              >
                mainnet
              </MenuItem>
            </Menu>
          </Box>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 1,
              alignItems: 'center',
              justifyContent: 'center',
              '@media (min-width:600px)': { paddingBottom: '100px' },
            }}
          >
            <Stack
              spacing={6}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                  },
                }}
              >
                <img src="/kuutamo-logo.png" alt="kuutamo" />
                <Typography
                  sx={{
                    '@media (min-width:600px)': { padding: '30px' },
                    fontWeight: 600,
                    fontSize: '58px',
                  }}
                >
                  kuutamo
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '32px',
                    '@media (min-width:600px)': {
                      borderLeft: '1px solid #D2D1DA',
                      paddingLeft: '30px',
                    },
                  }}
                >
                  protocol infrastucture
                </Typography>
              </Box>
            </Stack>
            <Stack
              spacing={6}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent="center"
              pt={5}
            >
              <Button
                variant="contained"
                sx={{
                  background: 'primary',
                  width: '280px',
                  height: '77px',
                  borderRadius: '15px',
                  fontSize: '23px',
                  color: '#FFFFFF',
                  boxShadow: customTheme.shadows.btn,
                }}
                onClick={handleDialogOpen}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: '280px',
                  height: '77px',
                  fontSize: '23px',
                  color: theme.palette.text.primary,
                  borderRadius: '15px',
                  border: 1,
                  borderColor:
                    theme.palette.mode === 'dark' ? '#36DFD3' : '#802FF3',
                }}
                onClick={handleLoginClick}
              >
                Log in
              </Button>
            </Stack>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
