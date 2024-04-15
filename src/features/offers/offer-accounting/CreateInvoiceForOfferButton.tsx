import { Button } from '@mui/material';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { invoiceById } from '../../../fetch/endpoints';
import { appRequest } from '../../../fetch/fetch-client';
import { useCurrentOffer } from '../../../hooks/useCurrentOffer';

export default function CreateInvoiceForOfferButton() {
  const offer = useCurrentOffer();
  const navigate = useNavigate();

  const onCreateRequest = useCallback(
    async (offer: AppOffer) => {
      try {
        const nextInvoice: AppInvoice = { ...offer, offerId: offer.id, isPaid: false, invoiceType: 'SCHLUSSRECHNUNG' };
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
    <Button onClick={() => onCreateRequest(offer)} disableElevation variant="contained">
      Neue Rechnung erstellen
    </Button>
  );
}
