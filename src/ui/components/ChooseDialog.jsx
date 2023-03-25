import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import React from 'react';
import ArrowLeftIcon from '../../svg/arrow-left';
import LinkButton from './LinkButton';

const ChooseDialog = ({ isOpen, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm">
      <Button
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          width: 'fit-content',
          margin: '18px 0 0 18px',
          fontSize: { lg: '16px', xl: '18px' },
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            width: '28px',
            height: '28px',
            [theme.breakpoints.down('xl')]: {
              width: '24px',
              height: '24px',
            },

            marginRight: '11.5px',
            color: 'primary.main',
          }}
        >
          <ArrowLeftIcon />
        </Box>
        back
      </Button>
      <DialogContent sx={{ padding: 0 }}>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            marginBlock: '14px 1em',
            padding: '0',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: {
              xl: '52px',
              lg: '48px',
              md: '44px',
              sm: '38px',
              xs: '32px',
            },
            fontSize: {
              xl: '52px',
              lg: '48px',
              md: '44px',
              sm: '38px',
              xs: '32px',
            },
          }}
        >
          Select an option
        </DialogTitle>

        <LinkButton text="Bring your own server" to="/stake" />
        <LinkButton text="kuutamo infrastructure platform" to="/pools" />
      </DialogContent>
    </Dialog>
  );
};

export default ChooseDialog;
