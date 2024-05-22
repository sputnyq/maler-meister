import { Button } from '@mui/material';

import { ColFlexBox } from '../../../../../components/ColFlexBox';

interface Props {
  invoiceType: InvoiceType;
}

export function CreateInvoiceStep({ invoiceType }: Readonly<Props>) {
  console.log(invoiceType);
  return (
    <ColFlexBox>
      <Button variant="contained" disableElevation>
        Jetzt Rechnung erstellen
      </Button>
    </ColFlexBox>
  );
}
