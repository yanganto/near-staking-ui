import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ArrowLeftIcon from '../svg/arrow-left';

const Keys = ({ isSignedIn, wallet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newNameKey, setNewNameKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [helperTextName, setHelperTextName] = useState('');
  const [helperTextKey, setHelperTextKey] = useState('');
  const [keys, setKeys] = useState(
    JSON.parse(localStorage.getItem('keys') || '[]')
  );
  const [selectedKey, setSelectedKey] = useState(false);

  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const addKey = () => {
    if (!newNameKey) {
      setHelperTextName('This field is required');
    } else if (!newKey) {
      setHelperTextKey('This field is required');
    } else if (keys.filter((element) => element.name === newNameKey)[0]) {
      setHelperTextName('Key with this name already exists');
    } else {
      keys.push({ name: newNameKey, key: newKey });
      localStorage.setItem('keys', JSON.stringify(keys));
      setKeys(keys);
      setNewKey('');
      setNewNameKey('');
      setIsOpen(false);
    }
  };

  const updateKey = (name, key) => {
    const updatedArray = keys.map((item) => {
      if (item.name === name) {
        return { ...item, key: key };
      }
      return item;
    });
    setKeys(updatedArray);
    localStorage.setItem('keys', JSON.stringify(updatedArray));
  };

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.keyCode === 27) setSelectedKey(false);
  }

  return (
    <Container sx={{ marginLeft: { lg: '7.6%', md: '7%', xs: 'auto' } }}>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <Button
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            width: 'fit-content',
            margin: '18px 0 0 18px',
            fontSize: { lg: '16px', xl: '18px' },
          }}
          onClick={handleClose}
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
        <DialogContent>
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              marginBlock: '14px 1em',
              padding: '0',
              textAlign: 'center',
              lineHeight: {
                xl: '52px',
                lg: '48px',
                md: '44px',
                sm: '38px',
                xs: '32px',
              },
              fontSize: '32px',
            }}
          >
            Add Public key
          </DialogTitle>
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="key"
            label="Key name"
            autoComplete="off"
            helperText={helperTextName}
            error={!!helperTextName}
            value={newNameKey}
            onChange={(e) => {
              setNewNameKey(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
              setHelperTextName('');
            }}
          />
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="key"
            label="Public key"
            autoComplete="off"
            helperText={helperTextKey}
            error={!!helperTextKey}
            value={newKey}
            onChange={(e) => {
              setNewKey(e.target.value);
              setHelperTextKey('');
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={addKey}
              variant="text"
              sx={{
                padding: '16px 32px',
                boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
                color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
                border: 'inherit',
                fontSize: '15px',
                margin: '16px 4px 16px 8px',
              }}
            >
              <img
                style={{ marginRight: '18px' }}
                src={'/icons/addsquare-' + theme.palette.mode + '.png'}
                alt="add"
              />
              Add Key
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          fontSize={48}
          lineHeight={1}
          sx={{ marginBottom: '8px' }}
        >
          Keys
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleOpen}
          variant="text"
          sx={{
            padding: '16px 32px',
            boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
            color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
            border: 'inherit',
            fontSize: '15px',
            margin: '16px 4px 16px 8px',
          }}
        >
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          Add Key
        </Button>
      </Box>
      <Table aria-label="Keys">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ width: '200px', padding: '21px 29px 24px' }}
            >
              Name
            </TableCell>
            <TableCell>Public Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((k) => (
            <TableRow key={k.name} onClick={() => setSelectedKey(k.name)}>
              <TableCell
                align="center"
                sx={{
                  padding: 0,
                  height: '43px',
                  width: '200px',
                }}>{k.name}</TableCell>
              <TableCell>
                {selectedKey === k.name ? (
                  <TextField
                    sx={{ height: '43px', paddingBlock: 0 }}
                    type="text"
                    margin="normal"
                    fullWidth
                    variant="standard"
                    autoComplete="off"
                    value={k.key}
                    onBlur={() => setSelectedKey(false)}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateKey(k.name, e.target.value)}
                  />
                ) : (
                  k.key
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Keys;
