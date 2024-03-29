import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useConfirm } from 'material-ui-confirm';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '../../svg/logout';
import Logo from '../../svg/logo';

export const MyButton = styled(Button)(({ theme }) => ({
  minWidth: '20px',
  padding: '5px',
  fontSize: '20px',
  color: theme.palette.text.primary,
  backgroundColor: 'none',
  textTransform: 'none',
}));

const NavBar = ({ wallet, changeTheme, handleDrawerToggle }) => {
  let navigate = useNavigate();
  const theme = useTheme();

  const confirm = useConfirm();

  const signOut = () => {
    if (wallet.wallet.id === 'wallet-connect') {
      confirm({
        confirmationText: 'Force sign out',
        confirmationButtonProps: { autoFocus: true },
        title: 'Please confirm this action in your wallet',
        content: (
          <Box align="center">
            <CircularProgress />
          </Box>
        ),
      })
        .then(() => {
          localStorage.setItem('wc@2:client:0.3//session', '[]');
          window.location.replace(window.location.origin);
        })
        .catch(() => {});
    }
    wallet.signOut();
    navigate('/');
  };

  const firstLogoColor = theme.palette.mode === 'dark' ? '#FEFEFF' : '#4D4DFF';

  const secondLogoColor = theme.palette.mode === 'dark' ? '#FEFEFF' : '#9900FF';

  return (
    <>
      <AppBar
        position="relative"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '96px',
          justifyContent: 'center',
          color: 'inherit',
          bgcolor: theme.palette.mode === 'dark' ? '#091429' : '#FEFEFF',
          borderBottom: '1px solid ',
          borderColor: 'info.main',
          backgroundImage: 'none',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {handleDrawerToggle && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <Box display="flex" alignItems="center">
              <IconButton sx={{ ml: 1 }} onClick={changeTheme} color="inherit">
                {theme.palette.mode === 'dark' ? (
                  <img src="/icons/ic-sun.png" alt="dark mode" />
                ) : (
                  <img src="/icons/ic-circular.png" alt="light mode" />
                )}
              </IconButton>
              <IconButton sx={{ ml: 1 }} color="inherit">
                <img
                  src={'/icons/ic-notifications-' + theme.palette.mode + '.png'}
                  alt="notifications"
                />
              </IconButton>
            </Box>
          </Typography>
          <Typography component="div" sx={{ flexGrow: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
              pl={2}
            >
              <Box width={49} height={49}>
                <Logo
                  firstColor={firstLogoColor}
                  secondColor={secondLogoColor}
                />
              </Box>
              <Typography
                pl={1}
                pr={2}
                sx={{
                  fontWeight: 600,
                  fontSize: '32px',
                }}
              >
                kuutamo
              </Typography>
              <Typography
                pl={2}
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  borderLeft: '1px solid #D2D1DA',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                protocol infrastucture
              </Typography>
            </Box>
          </Typography>
          <Box align="right" display="flex">
            <MyButton onClick={() => signOut()}>
              <LogoutIcon
                arrowColor={theme.palette.primary.main}
                doorColor={theme.palette.text.primary}
              />
            </MyButton>
            <Tooltip
              title="Click to Copy to Clipboard"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              <MyButton
                onClick={() => {
                  navigator.clipboard.writeText(wallet.accountId);
                }}
              >
                {wallet.accountId.length > 16
                  ? wallet.accountId.substring(0, 8) +
                    '...' +
                    wallet.accountId.substring(wallet.accountId.length - 8)
                  : wallet.accountId}
              </MyButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
