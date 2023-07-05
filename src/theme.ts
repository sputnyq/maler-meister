import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: {
    borderRadius: 4,
  },
  palette: {
    background: {
      default: '#F3F6F9',
      paper: '#fff',
    },
    primary: {
      main: '#19BEC3',
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
});

export default theme;
