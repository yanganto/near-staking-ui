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
              secondary: '#9492A7',
            },
            primary: {
              main: '#36DFD3',
            },
            success: {
              main: '#0D1E3D',
            },
          }
        : {
            background: { default: '#FEFEFF' },
            text: { primary: '#002147', secondary: '#4F4B6D' },
            primary: { main: '#802FF3' },
            success: {
              main: '#D6DBF0',
            },
          }),
      info: { main: '#D2D1DA', secondary: '#324AB2' },
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
            backgroundColor: isDarkTheme ? '#0D1E3D' : '#D6DBF0',
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
            height: '63px',
            backgroundColor: isDarkTheme ? '#0D1E3D' : '#D6DBF0',
            fontFamily: "'Roboto', sans-serif",

            '& .MuiTableCell-root': {
              backgroundColor: isDarkTheme ? '#0D1E3D' : '#D6DBF0',
              border: 0,
            },

            '& .MuiTableCell-root:first-of-type': {
              borderTopLeftRadius: '10px',
            },
            '& .MuiTableCell-root:last-of-type': {
              borderTopRightRadius: '10px',
            },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            fontFamily: "'Roboto', sans-serif",
            fontWeight: '500',
            fontSize: '18px',
            backgroundColor: isDarkTheme ? '#151C2B' : 'inherit',
            borderColor: '#D2D1DA',
            height: '43px',
            color: isDarkTheme ? '#9492A7' : '#4F4B6D',
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
      MuiDrawer: {
        styleOverrides: {
          paper: {
            position: 'absolute',
          },
        },
      },
    },
  });
};

export default theme;
