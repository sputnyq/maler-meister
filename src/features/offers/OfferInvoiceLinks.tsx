import { Box } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { loadInvoices } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  offerId: number;
}
export function OfferInvoiceLinks({ offerId }: Readonly<Props>) {
  const user = useCurrentUser();
  const [invoices, setInvoices] = useState<AppInvoice[]>([]);

  useEffect(() => {
    loadInvoices({ filters: { tenant: user?.tenant, offerId } }).then((res) => {
      setInvoices(res.appInvoices);
    });
  }, [offerId, user?.tenant]);
  if (invoices.length === 0) {
    return null;
  }

  return (
    <Box display="flex" gap={1}>
      {invoices.map((inv) => (
        <Link title={inv.invoiceType} target="_blank" key={inv.id} to={`/invoices/${inv.id}`}>
          {inv.invoiceType?.charAt(0) ?? 'R'}
        </Link>
      ))}
    </Box>
  );
}
