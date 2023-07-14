import { Card, CardContent } from '@mui/material';

import React from 'react';

import AppGrid from '../AppGrid';

export function FilterWrapperCard({ children }: React.PropsWithChildren) {
  return (
    <Card>
      <CardContent>
        <AppGrid>{children}</AppGrid>
      </CardContent>
    </Card>
  );
}
