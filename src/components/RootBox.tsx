import { Box } from '@mui/system';

import React, { PropsWithChildren } from 'react';

export function RootBox(props: PropsWithChildren) {
  return (
    <Box p={1.5} m={'auto'} sx={{ maxWidth: '2000px' }} paddingBottom={8}>
      {props.children}
    </Box>
  );
}
