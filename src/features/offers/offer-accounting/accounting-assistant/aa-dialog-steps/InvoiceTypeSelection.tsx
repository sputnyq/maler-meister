import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

import React, { useId } from 'react';

import { InvoiceTypeArray } from '../../../../../constants';
import { capitalizeFirstLetter } from '../../../../../utilities';

interface Props {
  invoiceType: InvoiceType;
  onInvoiceTypeChanged: (invoiceType: InvoiceType) => void;
}

export function InvoiceTypeSelection({ invoiceType, onInvoiceTypeChanged: onInvoiceTypeChnanged }: Readonly<Props>) {
  const id = useId();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInvoiceTypeChnanged((event.target as HTMLInputElement).value as InvoiceType);
  };

  return (
    <FormControl>
      <FormLabel id={id}>Welche Rechnung möchtest du erstellen?</FormLabel>
      <RadioGroup aria-labelledby={id} value={invoiceType} onChange={handleChange}>
        {InvoiceTypeArray.map((invT) => (
          <FormControlLabel key={invT} value={invT} control={<Radio />} label={capitalizeFirstLetter(invT)} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
