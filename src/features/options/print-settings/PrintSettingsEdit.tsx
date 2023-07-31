import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';

import React, { useState } from 'react';
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
    return <PSField key={prop} prop={prop} settings={settings} setSettings={setSettings} />;
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
    <Box display={'flex'} flexDirection="column" gap={2}>
      <Wrapper title="Über">{[Field('companyName'), Field('ownerName'), Field('taxNumber'), Field('web')]}</Wrapper>
      <Wrapper title="Bankverbindung">{[Field('bank'), Field('iban'), Field('bic')]}</Wrapper>
      <Wrapper title="Kontakt">{[Field('phone'), Field('mobile'), Field('fax'), Field('email')]}</Wrapper>
      <Wrapper title="Adresse">
        {[Field('addressStreet'), Field('addressNumber'), Field('addressZip'), Field('addressCity')]}
      </Wrapper>
      <Wrapper title="Logo">{[Field('logoUrl'), Field('logoWidth'), Field('logoHeight')]}</Wrapper>
      <Box display={'flex'} justifyContent="space-between">
        <Button color="error" onClick={handleDelete}>
          Löschen
        </Button>

        <Button variant="contained" disableElevation onClick={handleSave}>
          Speichern
        </Button>
      </Box>
    </Box>
  );
}

interface WrapperProps {
  title?: string;
}
const Wrapper = ({ children, title }: React.PropsWithChildren<WrapperProps>) => {
  return (
    <Card elevation={0}>
      <CardHeader title={title} />
      <CardContent>
        <AppGrid>{children}</AppGrid>
      </CardContent>
    </Card>
  );
};
