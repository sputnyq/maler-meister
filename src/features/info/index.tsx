import { Box, Typography } from '@mui/material';

import { useCurrentUser } from '../../hooks/useCurrentUser';

const version = import.meta.env.PACKAGE_VERSION;

export default function Info() {
  const user = useCurrentUser();
  return (
    <Box>
      <Typography variant="h6" color="HighlightText">
        Maler Meister
      </Typography>
      <Typography color={'GrayText'} variant="subtitle2">{`Version: ${version}`}</Typography>
      <Typography color={'GrayText'} variant="subtitle2">{`Angemeldet als: ${user?.username}`}</Typography>
    </Box>
  );
}
