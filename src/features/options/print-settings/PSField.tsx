import { Grid } from '@mui/material';

import { AppGridField } from '../../../components/AppGridField';
import { AppTextField } from '../../../components/AppTextField';

interface Props {
  prop: keyof PrintSettings;
  settings: PrintSettings;
  setSettings(ps: PrintSettings): void;
  multiline?: boolean;
}

export function PSField({ settings, prop, setSettings, multiline }: Props) {
  if (multiline) {
    return (
      <Grid item xs={12}>
        <AppTextField
          multiline={multiline}
          minRows={10}
          label={LABELS[prop]}
          value={settings[prop]}
          onChange={(ev) => {
            setSettings({ ...settings, [prop]: ev.target.value });
          }}
        />
      </Grid>
    );
  }

  return (
    <AppGridField>
      <AppTextField
        label={LABELS[prop]}
        value={settings[prop]}
        onChange={(ev) => {
          setSettings({ ...settings, [prop]: ev.target.value });
        }}
      />
    </AppGridField>
  );
}

const LABELS = {
  ownerName: 'Inhaber',
  taxNumber: 'Steuernummer',
  companyName: 'Firmenname',
  addressStreet: 'Straße',
  addressNumber: 'Hausnummer',
  addressZip: 'PLZ',
  addressCity: 'Ort',
  phone: 'Telefon',
  mobile: 'Handy',
  fax: 'Fax',
  email: 'E-Mail',
  web: 'WEB',
  bank: 'Bank',
  iban: 'IBAN',
  bic: 'BIC',
  logoHeight: 'Höhe',
  logoWidth: 'Breite',
  logoUrl: 'Logo Url',
  textBefore: 'Anfangstext',
  textAfter: 'Schlußtext',
  invoiceTextBefore: 'Anfangstext',
  invoiceTextAfter: 'Schlußtext',
};
