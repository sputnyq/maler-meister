import { Box, BoxProps } from '@mui/material';

export function ColFlexBox(props: BoxProps) {
  return <Box display="flex" flexDirection="column" gap={2} {...props}></Box>;
}
