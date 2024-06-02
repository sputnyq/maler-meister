import { Grid } from '@mui/material';

import { PropsWithChildren } from 'react';

export function AppGridField(props: Readonly<PropsWithChildren>) {
  return (
    <Grid item xs={12} sm={4} lg={2}>
      {props.children}
    </Grid>
  );
}
