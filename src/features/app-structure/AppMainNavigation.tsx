import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTimeOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Card, Grid, List, Typography } from '@mui/material';

import { useMemo } from 'react';

import { ColFlexBox } from '../../components/ColFlexBox';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { MyShifts } from '../my-shifts';
import { RoleBased } from './RoleBased';
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
    <ColFlexBox marginTop={8}>
      <Typography color="GrayText" variant="h4" align="center">
        {`${text} ${currentUser?.firstName}!`}
      </Typography>

      <Grid container justifyContent={'center'}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
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

              <Tile requiredRoles={['worker']} to="time-capture" title="Zeiterfassung">
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

          <RoleBased requiredRoles={['worker']}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Meine Schichten</AccordionSummary>
              <AccordionDetails>
                <MyShifts />
              </AccordionDetails>
            </Accordion>
          </RoleBased>
        </Grid>
      </Grid>
    </ColFlexBox>
  );
}
