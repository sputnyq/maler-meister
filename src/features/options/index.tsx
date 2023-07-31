import { Box, Card, CardContent, Divider, Link as MuiLink, Stack } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';

import { useIsSmall } from '../../hooks/useIsSmall';

export default function Options() {
  const isSmall = useIsSmall();
  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction={isSmall ? 'column' : 'row'}
            divider={isSmall ? undefined : <Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <Link style={{ textDecoration: 'none' }} to="">
              <MuiLink component={'p'}>Tätigkeiten</MuiLink>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="bgb-services">
              <MuiLink component={'p'}>Leistungen</MuiLink>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="print-settings">
              <MuiLink component={'p'}>PDF Einstellungen</MuiLink>
            </Link>
          </Stack>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Outlet />
      </Box>
    </>
  );
}
