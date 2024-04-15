import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { loadInvoices } from '../../../fetch/api';
import { useCurrentOffer } from '../../../hooks/useCurrentOffer';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { calculatePriceSummary, euroValue } from '../../../utilities';

export default function OfferInvoices() {
  const [invoices, setInvoices] = useState<AppInvoice[]>([]);
  const offer = useCurrentOffer();
  const user = useCurrentUser();

  useEffect(() => {
    loadInvoices({ filters: { tenant: user?.tenant, offerId: offer?.id } }).then((res) => {
      setInvoices(res.appInvoices);
    });
  }, [offer?.id, user?.tenant]);

  const dtFormat = useMemo(() => new Intl.DateTimeFormat('de-DE', { timeStyle: 'medium', dateStyle: 'medium' }), []);

  if (!offer?.id) {
    return null;
  }
  if (invoices.length === 0) {
    return (
      <Box>
        <Typography variant="h6">Es existieren keine Rechnungen zum Angebot.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5">Rechnungen zum Angebot</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Typ</TableCell>
            <TableCell>Erstellt</TableCell>
            <TableCell>Aktualisiert</TableCell>
            <TableCell>Netto / Brutto</TableCell>
            <TableCell>Bezahlt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(({ id, createdAt, updatedAt, offerServices, invoiceType, isPaid }) => {
            const { netto, brutto } = calculatePriceSummary(offerServices);
            return (
              <TableRow key={id}>
                <TableCell sx={{ height: '40px', padding: 0 }}>
                  <Link to={`/invoices/${id}`}>
                    <Button>{id}</Button>
                  </Link>
                </TableCell>
                <TableCell>{invoiceType ?? 'RECHNUNG'}</TableCell>
                <TableCell>{dtFormat.format(new Date(createdAt))}</TableCell>
                <TableCell>{dtFormat.format(new Date(updatedAt))}</TableCell>
                <TableCell>
                  {euroValue(netto)} / {euroValue(brutto)}
                </TableCell>
                <TableCell>{isPaid ? <CheckOutlinedIcon /> : <CloseOutlinedIcon />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
