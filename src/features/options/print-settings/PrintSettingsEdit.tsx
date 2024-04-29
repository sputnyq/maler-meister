import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AppGrid from '../../../components/AppGrid';
import { ColFlexBox } from '../../../components/ColFlexBox';
import { AppDispatch } from '../../../store';
import { deletePrintSettings, updatePrintSettings } from '../../../store/printSettingsReducer';
import { PSField } from './PSField';

interface Props {
  ps: PrintSettingsRoot;
}

export function PrintSettingsEdit({ ps }: Props) {
  const [settings, setSettings] = useState(ps.settings || {});

  const dispatch = useDispatch<AppDispatch>();

  const Field = (params: {
    prop: keyof PrintSettings;
    multiline?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    select?: true;
    selectOptions?: string[];
  }) => {
    const { multiline, prop, type, select, selectOptions } = params;
    return (
      <PSField
        multiline={multiline}
        key={prop}
        prop={prop}
        settings={settings}
        setSettings={setSettings}
        type={type}
        select={select}
        selectOptions={selectOptions}
      />
    );
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
  const multiline = true;

  return (
    <ColFlexBox>
      <Card elevation={0}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Löschen
            </Button>

            <Button variant="contained" disableElevation onClick={handleSave}>
              Speichern
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Wrapper title="Aussehen">
        {[
          Field({ prop: 'primaryColor', type: 'color' }),
          Field({ prop: 'highlightColor', type: 'color' }),
          Field({ prop: 'font', select: true, selectOptions: ['Helvetica', 'Courier', 'Times'] }),
        ]}
      </Wrapper>
      <Wrapper title="Über">
        {[
          Field({ prop: 'companyName' }),
          Field({ prop: 'ownerName' }),
          Field({ prop: 'taxNumber' }),
          Field({ prop: 'web' }),
        ]}
      </Wrapper>
      <Wrapper title="Bankverbindung">
        {[Field({ prop: 'bank' }), Field({ prop: 'iban' }), Field({ prop: 'bic' })]}
      </Wrapper>
      <Wrapper title="Kontakt">
        {[Field({ prop: 'phone' }), Field({ prop: 'mobile' }), Field({ prop: 'fax' }), Field({ prop: 'email' })]}
      </Wrapper>
      <Wrapper title="Adresse">
        {[
          Field({ prop: 'addressStreet' }),
          Field({ prop: 'addressNumber' }),
          Field({ prop: 'addressZip' }),
          Field({ prop: 'addressCity' }),
        ]}
      </Wrapper>
      <Wrapper title="Logo">
        {[Field({ prop: 'logoUrl' }), Field({ prop: 'logoWidth' }), Field({ prop: 'logoHeight' })]}
      </Wrapper>

      <Wrapper title="Angebot | Textblöcke">
        {[Field({ prop: 'textBefore', multiline }), Field({ prop: 'textAfter', multiline })]}
      </Wrapper>
      <Wrapper title="Rechnung | Textblöcke">
        {[Field({ multiline, prop: 'invoiceTextBefore' }), Field({ prop: 'invoiceTextAfter', multiline })]}
      </Wrapper>
    </ColFlexBox>
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
