import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    shape: {
      borderRadius: 4,
    },
    palette: {
      background: {
        default: '#EFEFF2',
        paper: '#FFF',
      },
      primary: {
        main: '#000205',
        contrastText: '#fff',
      },
      secondary: {
        main: '#FF5E7B',
        contrastText: '#fff',
      },
    },
    typography: {
      allVariants: { fontFamily: ['Source Sans Pro', 'sans-serif'].join(',') },
    },
  },
  deDE,
);

export default theme;
