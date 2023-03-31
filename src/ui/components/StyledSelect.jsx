import { MenuItem, selectClasses, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(TextField)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  color: theme.palette.text.primary,

  '&:focus-visible': {
    outline: 'none',
  },

  '& .MuiSelect-select': {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },

  [`& .${selectClasses.icon}`]: {
    top: 0,
    bottom: 0,
    right: '5px',
    marginBlock: 'auto',
    color: theme.palette.text.primary,
    transition: '0.15s',
    transform: 'rotate(90deg)',
  },

  [`& .${selectClasses.iconOpen}`]: {
    transform: 'rotate(0deg)',
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 700,
  fontSize: '16px',
}));

export const MuiStyledSelect = ({ field, form, ...props }) => {
  return <StyledSelect inputProps={{ ...field }} {...props} />;
};
