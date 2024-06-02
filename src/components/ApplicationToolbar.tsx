import { AppBar, AppBarProps, Toolbar, useTheme } from '@mui/material';

export default function ApplicationToolbar(props: Readonly<AppBarProps>) {
  const { palette } = useTheme();
  return (
    <AppBar
      elevation={0}
      sx={{ borderBottom: `1px solid ${palette.divider}` }}
      color="inherit"
      {...props}
    >
      <Toolbar variant="dense">{props.children}</Toolbar>
    </AppBar>
  );
}
