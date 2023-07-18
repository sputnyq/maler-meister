import { AppTextField } from '../../../components/aa-shared/AppTextField';

interface Props {
  prop: keyof PrintSettings;
  settings: PrintSettings;
  setSettings(ps: PrintSettings): void;
}

export function PSField({ settings, prop, setSettings }: Props) {
  return (
    <AppTextField
      label={LABELS[prop]}
      value={settings[prop]}
      onChange={(ev) => {
        setSettings({ ...settings, [prop]: ev.target.value });
      }}
    />
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
};
