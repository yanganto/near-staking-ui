import {createTheme} from "@mui/material/styles";
import {red} from "@mui/material/colors";


const theme = createTheme({
	palette: {
		background: {
			default: "#FEFEFF"
		},
		primary: {
			main: '#802FF3',
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
			color: '#002147',
			fontSize: '32px',
			fontWeight: '600'
		},
		h5: {
			color: '#002147',
			fontSize: '24px',
			fontWeight: '600'
		},
		h6: {
			color: '#002147',
			fontSize: '18px',
			fontWeight: '600'
		},
	},
	components: {
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					color: '#002147',
					backgroundColor: '#D6DBF0'
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
					backgroundColor: '#D6DBF0',
				},

			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					fontWeight: '500',
					fontSize: '18px',
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

export default theme;
