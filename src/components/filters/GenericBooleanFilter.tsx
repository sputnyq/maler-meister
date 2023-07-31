import { MenuItem } from '@mui/material';

import { AppTextField } from '../AppTextField';

interface Props {
  label: string;
  value: boolean | undefined;
  setValue: (v: boolean | undefined) => void;
}

export function GenericBooleanFilter({ setValue, label, value }: Props) {
  return (
    <AppTextField
      label={label}
      select
      value={value === undefined ? 'all' : value}
      onChange={(ev) => {
        if (ev.target.value === 'all') {
          setValue(undefined);
          return;
        }
        setValue(ev.target.value === 'true');
      }}
    >
      <MenuItem value={'all'}>Alle</MenuItem>
      <MenuItem value={'true'}>Ja</MenuItem>
      <MenuItem value={'false'}>Nein</MenuItem>
    </AppTextField>
  );
}
