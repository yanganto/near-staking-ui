import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCustomThemeStyles } from '../styles/theme';

const LinkButton = ({ to, text }) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
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
        marginInline: '13%',
        transition: '0.3s',

        '&:hover, &:active': {
          boxShadow: customTheme.shadows.main,
        },
        '&:first-of-type': {
          marginBottom: '24px',
        },
        '&:last-of-type': {
          marginBottom: '104px',
        },
      }}
      to={to}
      component={Link}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '400',
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
      </Typography>
    </Box>
  );
};

export default LinkButton;
