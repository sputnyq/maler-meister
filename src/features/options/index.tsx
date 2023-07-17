import { Box, Card, CardContent, Divider, Stack } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';

export default function Options() {
  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            <Link to="">Tätigkeiten</Link>
            <Link to="bgb-services">BGB Leistungen</Link>
            <Link to="print-settings">Druck Einstellungen</Link>
          </Stack>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Outlet />
      </Box>
    </>
  );
}
