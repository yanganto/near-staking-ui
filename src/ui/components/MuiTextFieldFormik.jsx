import { TextField } from '@mui/material';
import React from 'react';

const MuiTextField = ({ field, form, ...props }) => {
  return (
    <TextField
      inputProps={{ sx: { fontFamily: "'Roboto', sans-serif" } }}
      {...field}
      {...props}
    />
  );
};

export default MuiTextField;
