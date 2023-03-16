import {createTheme} from "@mui/material/styles";
import {red} from "@mui/material/colors";


const theme = (isDarkTheme) => {
	return createTheme({
		palette: {
			mode: isDarkTheme ? 'dark' : 'light',
			background: {
				default: isDarkTheme ? '#091429' : '#FEFEFF',
			},
			text: {
				primary: isDarkTheme ? '#FEFEFF' : '#002147',
			},
			primary: {
				main: isDarkTheme ? '#36DFD3' : '#802FF3',
			},
			secondary: {
				main: '#19857b',
			},
			error: {
				main: red.A400,
			},
		},
		typography: {
			fontFamily: [
				'Quicksand',
				'sans-serif',
			].join(','),
			h4: {
				color: isDarkTheme ? '#FEFEFF' : '#002147',
				fontSize: '32px',
				fontWeight: '600'
			},
			h5: {
				color: isDarkTheme ? '#FEFEFF' : '#002147',
				fontSize: '24px',
				fontWeight: '600'
			},
			h6: {
				color: isDarkTheme ? '#FEFEFF' : '#002147',
				fontSize: '18px',
				fontWeight: '600'
			},
		},
		components: {
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
}

export default theme;
