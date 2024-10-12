import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { useCurrentOffer } from '../../../hooks/useCurrentOffer';
import { createInvoice, initInvoice } from './accounting-assistant/accounting-utils';

export default function CreateInvoiceForOfferButton() {
  const offer = useCurrentOffer();
  const navigate = useNavigate();

  const onCreateRequest = async (offer: AppOffer) => {
    if (confirm('Möchtest du eine Rechnung für dieses Angebot erstellen?')) {
      const invoice = await initInvoice({
        invoiceType: 'RECHNUNG',
        offer,
      });

      const invoiceId = await createInvoice({ invoice });

      if (invoiceId !== null) {
        navigate(`/invoices/${invoiceId}`);
      }
    }
  };

  if (!offer) {
    return null;
  }

  return (
    <Button
      onClick={() => onCreateRequest(offer)}
      disableElevation
      variant="outlined"
      endIcon={<PostAddOutlinedIcon />}
    >
      Erstellen
    </Button>
  );
}
