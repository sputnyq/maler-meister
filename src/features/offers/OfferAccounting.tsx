import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { invoiceById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';

export default function OfferAccounting() {
  const offer = useCurrentOffer();
  const navigate = useNavigate();

  const onCreateRequest = useCallback(
    async (offer: AppOffer) => {
      try {
        const nextInvoice: AppInvoice = { ...offer, offerId: offer.id };
        //@ts-ignore
        delete nextInvoice.id;
        const response = await appRequest('post')(invoiceById(''), { data: nextInvoice });
        const invoiceId = response.data.id;

        navigate(`/invoices/${invoiceId}`);
      } catch (e) {
        console.log(e);
        alert('Rechnung konnte nicht erstellt werden.\n Bitte versuche später erneut!');
      }
    },
    [navigate],
  );

  if (!offer) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display={'flex'} flexDirection="column" gap={2}>
          <Box>
            <Button onClick={() => onCreateRequest(offer)} disableElevation variant="contained">
              Neue Rechnung erstellen
            </Button>
          </Box>
          <Typography variant="h6">Rechnungen zum Angebot</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
