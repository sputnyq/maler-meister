import { Grid } from '@mui/material';

import React from 'react';

export default function FilterGridItem({ children }: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {children}
    </Grid>
  );
}
