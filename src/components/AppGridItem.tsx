import { Grid } from '@mui/material';

export function AppGridItem(props: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={4}>
      {props.children}
    </Grid>
  );
}
