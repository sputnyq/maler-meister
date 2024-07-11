import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTimeOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import { Card, Grid, List } from '@mui/material';

import { ColFlexBox } from '../../components/ColFlexBox';
import { MyShifts } from '../my-shifts';
import { RoleBased } from './RoleBased';
import Tile from './Tile';

export default function MainNavigation() {
  return (
    <ColFlexBox marginTop={8}>
      <Grid gap={2} container justifyContent={'center'}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
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

              <Tile requiredRoles={['worker', 'admin']} to="my-vacations" title="Mein Urlaub">
                <BeachAccessIcon />
              </Tile>

              <Tile requiredRoles={['admin']} to="constructions" title="Baustellen">
                <FormatPaintOutlinedIcon />
              </Tile>

              <Tile requiredRoles={['admin']} to="options" title="Optionen">
                <TuneIcon />
              </Tile>

              <Tile
                hasDivider={false}
                requiredRoles={['accountant', 'admin']}
                to="time"
                title="Alle Stunden"
              >
                <AccessTimeIcon />
              </Tile>

              <Tile
                hasDivider={false}
                requiredRoles={['worker']}
                to="time-capture"
                title="Zeiterfassung"
              >
                <MoreTimeIcon />
              </Tile>
            </List>
          </Card>
        </Grid>
        <RoleBased requiredRoles={['worker']}>
          <Grid item xs={12} md={6}>
            <MyShifts />
          </Grid>
        </RoleBased>
      </Grid>
    </ColFlexBox>
  );
}
