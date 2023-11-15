import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTimeOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import { Box, Card, Grid, List, Typography } from '@mui/material';

import { useMemo } from 'react';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import Tile from './Tile';

export default function MainNavigation() {
  const currentUser = useCurrentUser();

  const text = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 11) {
      return 'Guten Morgen';
    }
    if (hours < 17) {
      return 'Hallo';
    }
    return 'Guten Abend';
  }, []);

  return (
    <>
      <Box marginTop={9} marginBottom={2}>
        <Typography color="GrayText" variant="h4" align="center">
          {`${text} ${currentUser?.firstName}!`}
        </Typography>
      </Box>

      <Grid container justifyContent={'center'}>
        <Grid item xs={12} md={6}>
          <Card>
            <List sx={{ padding: 0 }}>
              <Tile requiredRoles={['accountant', 'admin']} to="offers" title="Angebote">
                <ArticleIcon />
              </Tile>

              <Tile requiredRoles={['accountant', 'admin']} to="invoices" title="Rechnungen">
                <ReceiptLongIcon />
              </Tile>

              <Tile requiredRoles={['admin']} to="planing" title="Planung">
                <EventOutlinedIcon />
              </Tile>

              <Tile requiredRoles={['accountant', 'admin']} to="time" title="Alle Stunden">
                <AccessTimeIcon />
              </Tile>

              <Tile requiredRoles={['worker', 'admin']} to="time-capture" title="Zeiterfassung">
                <MoreTimeIcon />
              </Tile>

              <Tile requiredRoles={['worker', 'admin']} to="my-vacations" title="Mein Urlaub">
                <BeachAccessIcon />
              </Tile>

              <Tile requiredRoles={['admin']} to="constructions" title="Baustellen">
                <FormatPaintOutlinedIcon />
              </Tile>

              <Tile requiredRoles={['admin']} to="options" title="Optionen">
                <TuneIcon />
              </Tile>

              <Tile hasDivider={false} requiredRoles={['worker', 'admin', 'accountant']} to="info" title="Info">
                <InfoOutlinedIcon />
              </Tile>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
