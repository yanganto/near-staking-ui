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
import { useState } from 'react';

export const MyButton = styled(Button)(({ theme }) => ({
  minWidth: '20px',
  padding: '5px',
  fontSize: '20px',
  color: theme.palette.text.primary,
  backgroundColor: 'none',
  textTransform: 'none',
}));

const NavBar = ({ wallet, changeTheme }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const confirm = useConfirm();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
  };

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
          borderBottom:
            theme.palette.mode === 'dark'
              ? '1px solid #4F4B6D'
              : '1px solid #D2D1DA',
          backgroundImage: 'none',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
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
            <Box display="flex" alignItems="center" pl={2}>
              <img src="/kuutamo-logo.png" alt="kuutamo" width="50px" />
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
              <img
                src={'/icons/logout-' + theme.palette.mode + '.png'}
                alt="logout"
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
