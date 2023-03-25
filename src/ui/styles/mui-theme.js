import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = (isDarkTheme) => {
  return createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
      ...(isDarkTheme
        ? {
            background: {
              default: '#091429',
            },
            text: {
              primary: '#FEFEFF',
            },
            primary: {
              main: '#36DFD3',
            },
          }
        : {
            background: { default: '#FEFEFF' },
            text: { primary: '#002147' },
            primary: { main: '#802FF3' },
          }),
      secondary: {
        main: '#19857b',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: ['Quicksand', 'sans-serif'].join(','),
      ...(isDarkTheme
        ? {
            h4: { color: '#FEFEFF' },
            h5: { color: '#FEFEFF' },
            h6: { color: '#FEFEFF' },
          }
        : {
            h4: { color: '#002147' },
            h5: { color: '#002147' },
            h6: { color: '#002147' },
          }),
      h4: {
        fontSize: '32px',
        fontWeight: '600',
      },
      h5: {
        fontSize: '24px',
        fontWeight: '600',
      },
      h6: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkTheme ? '#011124' : '#FCFDFF',
            backgroundImage: 'none',
            borderRadius: 8,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: isDarkTheme ? '#D2D1DA' : '#002147',
            backgroundColor: isDarkTheme ? '#151C2B' : '#D6DBF0',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkTheme ? '#151C2B' : '#D6DBF0',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontWeight: '500',
            fontSize: '18px',
            backgroundColor: isDarkTheme ? '#151C2B' : 'inherit',
            borderColor: isDarkTheme ? '#091429' : '#D2D1DA',
          },
          body: {
            fontWeight: '400',
            fontSize: '16px',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: 'inherit',
          },
        },
      },
    },
  });
};

export default theme;
