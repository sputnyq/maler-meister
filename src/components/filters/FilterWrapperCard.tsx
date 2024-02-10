import { CardContent } from '@mui/material';

import React from 'react';

import { AppCard } from '../AppCard';
import AppGrid from '../AppGrid';

export function FilterWrapperCard({ children }: React.PropsWithChildren) {
  return (
    <AppCard>
      <CardContent>
        <AppGrid>{children}</AppGrid>
      </CardContent>
    </AppCard>
  );
}
