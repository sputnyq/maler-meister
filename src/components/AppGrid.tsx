import { Grid } from '@mui/material';

import React from 'react';

export default function AppGrid(props: React.PropsWithChildren) {
  return (
    <Grid container spacing={2} alignItems="flex-start">
      {props.children}
    </Grid>
  );
}
