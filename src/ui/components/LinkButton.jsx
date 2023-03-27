import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCustomThemeStyles } from '../styles/theme';

const LinkButton = ({ to, onClick, title, text, icon }) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box
      sx={{
        marginInline: '13%',
        marginBottom: '24px',

        '&:last-of-type': {
          marginBottom: '104px',
        },
      }}
    >
      {title && (
        <Typography
          sx={{ fontSize: '16px', color: 'text.primary', marginBottom: '8px' }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          background: 'text.primary',
          border: 1,
          borderColor: 'primary.main',
          padding: '15px 24px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: '0.3s',

          '&:hover, &:active': {
            boxShadow: customTheme.shadows.main,
          },
        }}
        to={to}
        component={to ? Link : 'div'}
        onClick={onClick}
      >
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: '400',
            lineHeight: 1,
            fontSize: {
              xs: '16px',
              sm: '18px',
              md: '20px',
              lg: '24px',
              xl: '26px',
            },
            flexGrow: 1,
          }}
        >
          {text}
          <Box component="span" sx={{ width: '24px', height: 1 }}>
            {icon}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default LinkButton;
