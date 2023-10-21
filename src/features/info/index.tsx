import { Box, Typography } from '@mui/material';

import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Info() {
  const user = useCurrentUser();
  return (
    <Box>
      <Typography variant="h6">Maler Meister</Typography>
      <Typography color={'GrayText'} variant="subtitle2">{`Version: ${import.meta.env.PACKAGE_VERSION}`}</Typography>
      <Typography color={'GrayText'} variant="subtitle2">{`Angemeldet als: ${user?.username}`}</Typography>
    </Box>
  );
}
