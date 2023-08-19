import { InputProps, MenuItem } from '@mui/material';

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
  selectOptions?: string[];
  capitalize?: true;
  InputProps?: Partial<InputProps>;
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
}: InvoiceFieldProps) {
  const dispatch = useDispatch<AppDispatch>();
  const initValue = useOfferValue(path);

  const [value, setValue] = useState(initValue);

  const onBlur = useCallback(() => {
    const propPath: string[] = [path];

    dispatch(setInvoiceProp({ path: propPath, value }));
  }, [dispatch, path, value]);

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
  const offer = useSelector<AppState, AppInvoice | null>((s) => s.invoice.current);

  return offer?.[path] || '';
}
