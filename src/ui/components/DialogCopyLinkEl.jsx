import { Box, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import CopyIcon from '../../svg/сopy';

const DialogCopyLinkEl = ({ children, to }) => {
  const [tooltipText, setTooltipText] = useState('Copy link');

  const onIconClick = () => {
    navigator.clipboard.writeText(to);
    setTooltipText('Copied!');
  };

  const handleTooltipClose = () => {
    setTimeout(() => setTooltipText('Copy link'), 100);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        columnGap: '8px',
      }}
    >
      <Tooltip
        arrow
        title={tooltipText}
        leaveDelay={300}
        onClose={handleTooltipClose}
      >
        <Box
          onClick={onIconClick}
          sx={{
            color: 'text.main',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
          }}
        >
          <CopyIcon />
        </Box>
      </Tooltip>
      <Typography>{children}</Typography>
    </Box>
  );
};

export default DialogCopyLinkEl;
