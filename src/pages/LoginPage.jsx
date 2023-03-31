import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authInitialValues } from '../constants';
import EyeIcon from '../svg/eye';
import ModalWrapper from '../ui/components/ModalWrapper';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import { getCustomThemeStyles } from '../ui/styles/theme';

const LoginPage = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <ModalWrapper isOpen={true} title="Welcome back">
      <Formik initialValues={authInitialValues} onSubmit={handleSubmit}>
        <Box sx={{ marginInline: '9%' }} component={Form}>
          <Field
            name="email"
            component={MuiTextField}
            type="email"
            required
            label="E-mail"
            fullWidth
            sx={{ marginBottom: '32px', fontSize: '16px' }}
            InputProps={{ name: 'email' }}
          />
          <Field
            name="password"
            component={MuiTextField}
            type={showPassword ? 'text' : 'password'}
            required
            label="Password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <EyeIcon /> : <EyeIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              sx={{
                marginTop: '16px',
                color: 'text.secondary',
                textDecoration: 'none',

                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              component={Link}
            >
              Forgot Password?
            </Typography>
          </Box>
          <Box
            sx={{
              marginBlock: '32px 64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: '16px',
            }}
          >
            <Button
              type="submit"
              sx={{
                backgroundColor: 'primary.main',
                textTransform: 'uppercase',
                color: 'primary.light',
                padding: '16px 32px',
                lineHeight: 1,
                fontSize: '15px',
                boxShadow: customTheme.shadows.light,
              }}
            >
              log in
            </Button>
            <Typography>OR</Typography>
            <Button
              component={Link}
              to="/signup"
              sx={{
                padding: '16px 32px',
                lineHeight: 1,
                fontSize: '15px',
                border: 1,
                borderColor: 'primary.main',
                color: 'secondary.dark',
              }}
            >
              create account
            </Button>
          </Box>
        </Box>
      </Formik>
    </ModalWrapper>
  );
};

export default LoginPage;
