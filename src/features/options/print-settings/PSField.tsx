import { Grid, MenuItem } from '@mui/material';

import { AppGridField } from '../../../components/AppGridField';
import { AppTextField } from '../../../components/AppTextField';

interface Props {
  prop: keyof PrintSettings;
  settings: PrintSettings;
  setSettings(ps: PrintSettings): void;
  multiline?: boolean;
  type?: React.InputHTMLAttributes<unknown>['type'];
  select?: true;
  selectOptions?: string[];
}

export function PSField({ settings, prop, setSettings, multiline, type, select, selectOptions }: Props) {
  if (multiline) {
    return (
      <Grid item xs={12}>
        <AppTextField
          type={type}
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
        select={select}
        type={type}
        label={LABELS[prop]}
        value={settings[prop]}
        onChange={(ev) => {
          setSettings({ ...settings, [prop]: ev.target.value });
        }}
      >
        {selectOptions?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </AppTextField>
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
  primaryColor: 'Farbe',
  highlightColor: 'Titel Farbe',
  font: 'Schrift',
};
