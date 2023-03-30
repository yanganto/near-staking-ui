import { TextField } from '@mui/material';
import React from 'react';

const MuiTextField = ({ field, form, ...props }) => {
  return <TextField {...field} {...props} />;
};

export default MuiTextField;
