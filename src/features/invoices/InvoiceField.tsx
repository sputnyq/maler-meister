import { Checkbox, FormControl, FormControlLabel, FormGroup, InputProps, MenuItem } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppTextField } from '../../components/AppTextField';
import { AppDispatch, AppState } from '../../store';
import { setInvoiceProp } from '../../store/invoiceReducer';

type Path = keyof AppInvoice;

export interface InvoiceFieldProps {
  path: Path;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  multiline?: true;
  select?: true;
  selectOptions?: readonly string[];
  InputProps?: Partial<InputProps>;
  as?: 'checkbox';
}

export default function OfferField({
  select,
  multiline,
  type,
  label,
  selectOptions,
  path,
  InputProps,
  placeholder,
  as,
}: Readonly<InvoiceFieldProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const initValue = useOfferValue(path);

  const [value, setValue] = useState(initValue);

  const onBlur = useCallback(() => {
    const propPath: string[] = [path];

    dispatch(setInvoiceProp({ path: propPath, value }));
  }, [dispatch, path, value]);

  const handleChange = useCallback(
    (newValue: any) => {
      const propPath: string[] = [path];

      dispatch(setInvoiceProp({ path: propPath, value: newValue }));
    },
    [path, dispatch],
  );

  if (as === 'checkbox') {
    return (
      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={initValue as boolean}
                onChange={(ev) => {
                  handleChange(ev.target.checked);
                }}
              />
            }
            label={label}
          />
        </FormGroup>
      </FormControl>
    );
  }

  return (
    <AppTextField
      placeholder={placeholder}
      InputProps={InputProps}
      select={select}
      multiline={multiline}
      onChange={(ev) => setValue(ev.target.value)}
      type={type}
      label={label}
      value={value}
      onBlur={onBlur}
    >
      {selectOptions?.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </AppTextField>
  );
}

function useOfferValue(path: Path) {
  const offer = useSelector<AppState, Maybe<AppInvoice>>((s) => s.invoice.current);

  return offer?.[path] || '';
}
