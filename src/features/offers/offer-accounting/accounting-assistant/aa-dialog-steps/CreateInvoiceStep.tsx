import { Button } from '@mui/material';

import { useNavigate } from 'react-router';

import { useCurrentOffer } from '../../../../../hooks/useCurrentOffer';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser';
import { createInvoice, initInvoice } from '../accounting-utils';

import { capitalize } from 'lodash';

interface Props {
  invoiceType: InvoiceType;
  vorauszahlungPercent: number;
  services: OfferService[];
}

export function CreateInvoiceStep({
  invoiceType,
  vorauszahlungPercent,
  services,
}: Readonly<Props>) {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const offer = useCurrentOffer();

  if (!offer) return null;

  if (!user) return null;

  const onClickCreateInvoice = async () => {
    const invoice = await initInvoice({
      invoiceType,
      vorauszahlungPercent,
      services,
      offer,
      tenant: user.tenant,
    });

    const invoiceId = await createInvoice({ invoice });

    if (invoiceId !== null) {
      navigate(`/invoices/${invoiceId}`);
    }
  };

  return (
    <Button variant="contained" onClick={onClickCreateInvoice} disableElevation>
      Jetzt Rechnung ({capitalize(invoiceType)}) erstellen.
    </Button>
  );
}
