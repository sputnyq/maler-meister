import { useMediaQuery, useTheme } from '@mui/material';

export function useIsSmall() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  return small;
}
