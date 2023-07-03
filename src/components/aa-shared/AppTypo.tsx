import { Typography } from '@mui/material';

import React from 'react';

export default function AppTypo(props: React.PropsWithChildren) {
  return <Typography variant="h5">{props.children}</Typography>;
}
