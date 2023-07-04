import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import HandymanIcon from '@mui/icons-material/Handyman';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TuneIcon from '@mui/icons-material/Tune';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Grid } from '@mui/material';

import React from 'react';

import Tile from './aa-shared/Tile';

export default function MainNavigation() {
  return (
    <>
      <ViewGrid>
        <Tile requiredRoles={['accountant', 'admin']} to="offers" title="Angebote">
          <ArticleIcon fontSize="large" color="disabled" />
        </Tile>
        <Tile requiredRoles={['accountant', 'admin']} to="invoices" title="Rechnungen">
          <ReceiptLongIcon fontSize="large" color="disabled" />
        </Tile>

        <Tile requiredRoles={['accountant', 'admin']} to="time" title="Alle Stunden">
          <AccessTimeIcon fontSize="large" color="disabled" />
        </Tile>
        <Tile requiredRoles={['worker', 'admin']} to="time-capture" title="Zeiterfassung">
          <MoreTimeIcon fontSize="large" color="disabled" />
        </Tile>

        <Tile requiredRoles={['admin']} to="constructions" title="Baustellen">
          <HandymanIcon fontSize="large" color="disabled" />
        </Tile>
        <Tile requiredRoles={['worker', 'admin', 'accountant']} to="upload" title="Datei Upload">
          <UploadFileIcon fontSize="large" color="disabled" />
        </Tile>

        <Tile requiredRoles={['admin']} to="options" title="Optionen">
          <TuneIcon fontSize="large" color="disabled" />
        </Tile>
      </ViewGrid>
    </>
  );
}

function ViewGrid({ children }: React.PropsWithChildren) {
  return (
    <Grid container spacing={3} p={2}>
      {children}
    </Grid>
  );
}
