import { Box, Typography } from '@mui/material';
import React from 'react';

const SimpleNavBar = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        height: '96px',
        backgroundColor: 'background.default',
        borderBottom: 1,
        borderColor: 'info.main',
        position: 'relative',
        zIndex: '1301',
      }}
    >
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
    </Box>
  );
};

export default SimpleNavBar;
