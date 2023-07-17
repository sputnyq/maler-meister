import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTimeOutlined';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
// import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';
import { Grid, SvgIconProps, Typography } from '@mui/material';

import { useMemo } from 'react';

import Tile from '../../components/aa-shared/Tile';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const COLORS = [
  '#75d8db',
  '#5ed2d5',
  '#47cbcf',
  '#30c5c9',
  '#19bec3',
  '#19bec3',
  '#17abb0',
  '#14989c',
  '#128589',
  '#0f7275',
  '#0d5f62',
  '#0a4c4e', //10
];
export default function MainNavigation() {
  const currentUser = useCurrentUser();

  const iconProps = useMemo((): SvgIconProps => ({ fontSize: 'large', sx: { color: 'white' } }), []);

  return (
    <>
      <Typography color="GrayText" p={3} variant="h4" align="center">{`Hallo ${currentUser?.firstName}!`}</Typography>

      <Grid container rowSpacing={3} columnSpacing={0} p={2}>
        <Tile color={COLORS[11]} requiredRoles={['accountant', 'admin']} to="offers" title="Angebote">
          <ArticleIcon {...iconProps} />
        </Tile>
        <Tile color={COLORS[0]} requiredRoles={['admin']} to="planing" title="Planung">
          <EventOutlinedIcon {...iconProps} />
        </Tile>
        {/*<Tile requiredRoles={['accountant', 'admin']} to="invoices" title="Rechnungen">
          <ReceiptLongIcon {...iconProps} />
        </Tile> */}

        <Tile color={COLORS[6]} requiredRoles={['accountant', 'admin']} to="time" title="Alle Stunden">
          <AccessTimeIcon {...iconProps} />
        </Tile>
        <Tile color={COLORS[1]} requiredRoles={['worker']} to="time-capture" title="Zeiterfassung">
          <MoreTimeIcon {...iconProps} />
        </Tile>
        <Tile color={COLORS[10]} requiredRoles={['worker', 'admin']} to="my-vacations" title="Mein Urlaub">
          <BeachAccessIcon {...iconProps} />
        </Tile>

        <Tile color={COLORS[3]} requiredRoles={['admin']} to="constructions" title="Baustellen">
          <FormatPaintOutlinedIcon {...iconProps} />
        </Tile>
        {/* <Tile requiredRoles={['worker', 'admin', 'accountant']} to="upload" title="Upload">
          <UploadFileIcon {...iconProps} />
        </Tile> */}

        <Tile color={COLORS[7]} requiredRoles={['admin']} to="options" title="Optionen">
          <TuneIcon {...iconProps} />
        </Tile>
        <Tile color={COLORS[8]} requiredRoles={['worker', 'admin', 'accountant']} to="info" title="Info">
          <InfoOutlinedIcon {...iconProps} />
        </Tile>
      </Grid>
    </>
  );
}
