import { Button } from '@mui/material';

interface Props {
  invoiceType: InvoiceType;
}

export function CreateInvoiceStep({ invoiceType }: Readonly<Props>) {
  console.log(invoiceType);
  return (
    <Button variant="contained" disableElevation>
      Jetzt Rechnung erstellen
    </Button>
  );
}
