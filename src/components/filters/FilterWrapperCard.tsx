import { Card, CardContent } from '@mui/material';

import React from 'react';

import AppGrid from '../AppGrid';

export function FilterWrapperCard({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <Card elevation={0}>
      <CardContent>
        <AppGrid>{children}</AppGrid>
      </CardContent>
    </Card>
  );
}
