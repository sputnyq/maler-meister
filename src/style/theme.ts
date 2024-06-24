import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    shape: {
      borderRadius: 8,
    },
    palette: {
      background: {
        default: '#F3F6F9',
        paper: '#ffffff',
      },
    },
  },
  deDE,
);

export default theme;
