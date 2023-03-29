import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import CopyIcon from '../../svg/сopy';

const DialogCopyLinkEl = ({ children, to }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        columnGap: '8px',
      }}
    >
      <Tooltip arrow title="Follow the link" leaveDelay={100}>
        <Box
          sx={{
            color: 'text.primary',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
          }}
          component={Link}
          to={to}
          target="_blank"
        >
          <CopyIcon />
        </Box>
      </Tooltip>
      <Typography>{children}</Typography>
    </Box>
  );
};

export default DialogCopyLinkEl;
