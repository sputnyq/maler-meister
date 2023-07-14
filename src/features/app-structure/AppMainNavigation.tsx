import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
// import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import HandymanIcon from '@mui/icons-material/HandymanOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTimeOutlined';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
// import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';
import { Grid, SvgIconProps, Typography } from '@mui/material';

import { useMemo } from 'react';

import Tile from '../../components/aa-shared/Tile';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function MainNavigation() {
  const currentUser = useCurrentUser();

  const iconProps = useMemo((): SvgIconProps => ({ fontSize: 'large', color: 'primary' }), []);

  return (
    <>
      <Typography color={'GrayText'} p={3} variant="h4" align="center">{`Hallo ${currentUser?.firstName}!`}</Typography>

      <Grid container spacing={3} p={2}>
        {/* <Tile requiredRoles={['accountant', 'admin']} to="offers" title="Angebote">
          <ArticleIcon {...iconProps} />
        </Tile>
        <Tile requiredRoles={['accountant', 'admin']} to="invoices" title="Rechnungen">
          <ReceiptLongIcon {...iconProps} />
        </Tile> */}

        <Tile requiredRoles={['admin']} to="planing" title="Planung">
          <EventOutlinedIcon {...iconProps} />
        </Tile>

        <Tile requiredRoles={['accountant', 'admin']} to="time" title="Alle Stunden">
          <AccessTimeIcon {...iconProps} />
        </Tile>
        <Tile requiredRoles={['worker']} to="time-capture" title="Zeiterfassung">
          <MoreTimeIcon {...iconProps} />
        </Tile>
        <Tile requiredRoles={['worker']} to="my-vacations" title="Mein Urlaub">
          <BeachAccessIcon {...iconProps} />
        </Tile>

        <Tile requiredRoles={['admin']} to="constructions" title="Baustellen">
          <HandymanIcon {...iconProps} />
        </Tile>
        {/* <Tile requiredRoles={['worker', 'admin', 'accountant']} to="upload" title="Upload">
          <UploadFileIcon {...iconProps} />
        </Tile> */}

        <Tile requiredRoles={['admin']} to="options" title="Optionen">
          <TuneIcon {...iconProps} />
        </Tile>
        <Tile requiredRoles={['worker', 'admin', 'accountant']} to="info" title="Info">
          <InfoOutlinedIcon {...iconProps} />
        </Tile>
      </Grid>
    </>
  );
}
