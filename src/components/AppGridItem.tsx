import { Grid } from '@mui/material';

import { PropsWithChildren } from 'react';

export function AppGridItem(props: PropsWithChildren) {
  return (
    <Grid item xs={12} sm={4}>
      {props.children}
    </Grid>
  );
}
