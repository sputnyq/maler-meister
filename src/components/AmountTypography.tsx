import { Typography } from '@mui/material';

import { PropsWithChildren } from 'react';

export default function AmountTypography({ children }: PropsWithChildren) {
  return (
    <Typography variant="inherit" align="right" fontFamily="monospace">
      {children}
    </Typography>
  );
}
