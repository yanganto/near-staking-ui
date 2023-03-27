import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SimpleNavBar from './SimpleNavBar';

const NavPageLayout = ({ isSignedIn, wallet, changeTheme }) => {
  return (
    <>
      {isSignedIn && <SimpleNavBar wallet={wallet} changeTheme={changeTheme} />}

      <Box
        sx={{
          width: 1,
          minHeight: `calc(100vh - ${isSignedIn ? '136' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
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
    </>
  );
};

export default NavPageLayout;
