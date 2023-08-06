import { Grid } from '@mui/material';

export function AppGridField(props: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={4} lg={2}>
      {props.children}
    </Grid>
  );
}
