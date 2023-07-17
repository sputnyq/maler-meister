import { Box, Button, Grid, Typography } from '@mui/material';

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import AppGrid from '../../../components/AppGrid';
import { AppDispatch } from '../../../store';
import { deletePrintSettings, updatePrintSettings } from '../../../store/printSettingsReducer';
import { PSField } from './PSField';

interface Props {
  ps: PrintSettingsRoot;
}

export function PrintSettingsEdit({ ps }: Props) {
  const [settings, setSettings] = useState(ps.settings || {});

  const dispatch = useDispatch<AppDispatch>();
  const Field = (prop: keyof PrintSettings) => {
    return <PSField prop={prop} settings={settings} setSettings={setSettings} />;
  };

  const handleSave = () => {
    dispatch(updatePrintSettings({ ...ps, settings }));
  };

  const handleDelete = () => {
    const text = 'Einstellungen löschen?';
    if (confirm(text)) {
      dispatch(deletePrintSettings(ps.id));
    }
  };

  return (
    <AppGrid>
      <Grid item xs={12} sm={6} md={3}>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <Typography variant="h5" align="right">
            Über
          </Typography>
          {[Field('companyName'), Field('ownerName'), Field('taxNumber')]}
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <Typography variant="h5" align="right">
            Bank
          </Typography>
          {[Field('bank'), Field('iban'), Field('bic')]}
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <Typography variant="h5" align="right">
            Kontakt
          </Typography>
          {[Field('phone'), Field('mobile'), Field('fax'), Field('email'), Field('web')]}
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <Typography variant="h5" align="right">
            Adresse
          </Typography>
          {[Field('addressStreet'), Field('addressNumber'), Field('addressZip'), Field('addressCity')]}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} justifyContent="space-between">
          <Button color="error" onClick={handleDelete}>
            Löschen
          </Button>
          <Button variant="contained" disableElevation onClick={handleSave}>
            Speichern
          </Button>
        </Box>
      </Grid>
    </AppGrid>
  );
}
