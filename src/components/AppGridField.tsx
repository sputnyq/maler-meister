import { Grid } from '@mui/material';

export function AppGridField(props: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {props.children}
    </Grid>
  );
}
