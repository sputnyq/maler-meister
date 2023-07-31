import { Box } from '@mui/system';

import React from 'react';

export function RootBox(props: React.PropsWithChildren) {
  return (
    <Box p={1.5} m={'auto'} sx={{ maxWidth: '2000px' }} paddingBottom={8}>
      {props.children}
    </Box>
  );
}
