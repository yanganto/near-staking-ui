import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const Layout = ({ isSignedIn, wallet, changeTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((old) => !old);
  };

  const vh = window.innerHeight;

  return (
    <Box
      sx={{
        '@media (min-width: 2000px)': {
          width: '2000px',
          margin: 'auto',
          position: 'relative',
        },
      }}
    >
      {isSignedIn && (
        <NavBar
          wallet={wallet}
          changeTheme={changeTheme}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}

      <Box
        sx={{
          width: 1,
          minHeight: `calc(${vh}px - ${isSignedIn ? '136' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {isSignedIn && (
          <Sidebar
            wallet={wallet}
            sidebarMobileOpen={mobileOpen}
            changeTheme={changeTheme}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        <Box
          component="main"
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            width: 1,
            paddingTop: '53px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          width: '100%',
          height: '40px',
          fontFamily: "'Roboto', sans-serif",
          lineHeight: 1,
        }}
      >
        © 2023 kuutamo. All rights reserved
      </Box>
    </Box>
  );
};

export default Layout;
