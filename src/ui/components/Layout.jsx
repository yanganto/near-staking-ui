import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const Layout = ({ isSignedIn, wallet, changeTheme }) => {
  return (
    <>
      {isSignedIn && <NavBar wallet={wallet} changeTheme={changeTheme} />}

      <Box
        sx={{
          width: 1,
          minHeight: `calc(100vh - ${isSignedIn ? '136' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {isSignedIn && <Sidebar wallet={wallet} />}
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
      <Box sx={{ textAlign: 'center', width: '100%', height: '40px' }}>
        © 2023 kuutamo. All rights reserved
      </Box>
    </>
  );
};

export default Layout;
