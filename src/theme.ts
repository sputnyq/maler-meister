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
  },
  typography: {
    allVariants: { fontFamily: ['Source Sans Pro', 'sans-serif'].join(',') },
  },
});

export default theme;
