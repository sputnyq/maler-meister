import { Grid } from '@mui/material';

import { AppTextField } from '../../../components/AppTextField';

interface Props {
  prop: keyof PrintSettings;
  settings: PrintSettings;
  setSettings(ps: PrintSettings): void;
  multiline?: boolean;
}

export function PSField({ settings, prop, setSettings, multiline }: Props) {
  return (
    <Grid item xs={12} sm={6} md={3}>
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
};
