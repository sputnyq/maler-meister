import { Avatar, Box, Card, Typography } from '@mui/material';

import { useCurrentUser } from '../../hooks/useCurrentUser';

const version = import.meta.env.PACKAGE_VERSION;

export default function Info() {
  const user = useCurrentUser();
  return (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Box width={'max-content'}>
        <Card elevation={3}>
          <Box p={1}>
            <Avatar sx={{ width: 150, height: 150 }} variant="square" src={'icon1024.png'}></Avatar>
          </Box>
        </Card>
      </Box>

      <Box>
        <Typography color={'GrayText'} variant="subtitle2">{`Version: ${version}`}</Typography>
        <Typography color={'GrayText'} variant="subtitle2">{`Angemeldet als: ${user?.username}`}</Typography>
      </Box>
    </Box>
  );
}
