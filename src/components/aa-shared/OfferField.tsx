import { MenuItem } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../../store';
import { setOfferProp } from '../../store/offerReducer';
import { AppTextField } from './AppTextField';

type Path = keyof AppOffer;

export interface OfferFieldProps {
  path: Path;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  multiline?: true;
  select?: true;
  selectOptions?: string[];
  capitalize?: true;
}

export default function OfferField({ select, multiline, type, label, selectOptions, path }: OfferFieldProps) {
  const dispatch = useDispatch<AppDispatch>();
  const initValue = useOfferValue(path);

  const [value, setValue] = useState(initValue);

  const onBlur = useCallback(() => {
    const propPath: string[] = [path];

    dispatch(setOfferProp({ path: propPath, value }));
  }, [dispatch, path, value]);

  return (
    <AppTextField
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
  const offer = useSelector<AppState, AppOffer | null>((s) => s.offer.current);

  return offer?.[path] || '';
}
