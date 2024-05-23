import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { loadInvoices } from '../../../fetch/api';
import { useCurrentOffer } from '../../../hooks/useCurrentOffer';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { calculatePriceSummary, euroValue } from '../../../utilities';

interface Props {
  full?: boolean;
}

export default function OfferInvoices({ full = true }: Readonly<Props>) {
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

  const all = invoices.map((invoice) => invoice.offerServices).flat();
  const { brutto: allBrutto, netto: allNetto } = calculatePriceSummary(all);
  const { brutto: offerBrutto, netto: offerNetto } = calculatePriceSummary(offer.offerServices);

  return (
    <>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {full && <TableCell>ID</TableCell>}
              {full && <TableCell>Typ</TableCell>}
              {full ? <TableCell>Aktualisiert</TableCell> : <TableCell />}
              <TableCell>Netto</TableCell>
              <TableCell>Brutto</TableCell>
              {full && <TableCell>Bezahlt</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {full === true &&
              invoices.map(({ id, updatedAt, offerServices, invoiceType, isPaid }) => {
                const { netto, brutto } = calculatePriceSummary(offerServices);
                return (
                  <TableRow key={id}>
                    <TableCell sx={{ padding: 0 }}>
                      <Link to={`/invoices/${id}`}>
                        <Button>{id}</Button>
                      </Link>
                    </TableCell>
                    <TableCell>{invoiceType ?? 'RECHNUNG'}</TableCell>
                    <TableCell>{dtFormat.format(new Date(updatedAt))}</TableCell>
                    <TableCell>{euroValue(netto)}</TableCell>

                    <TableCell>{euroValue(brutto)}</TableCell>
                    <TableCell>{isPaid ? <CheckOutlinedIcon /> : <CloseOutlinedIcon />}</TableCell>
                  </TableRow>
                );
              })}
            <TableRow>
              <StrongCell colSpan={full ? 3 : 1}>Summe aller Rechnungen</StrongCell>
              <StrongCell>{euroValue(allNetto)}</StrongCell>
              <StrongCell colSpan={full ? 2 : 1}>{euroValue(allBrutto)}</StrongCell>
            </TableRow>
            <TableRow>
              <StrongCell colSpan={full ? 3 : 1}>Angebot</StrongCell>
              <StrongCell>{euroValue(offerNetto)}</StrongCell>
              <StrongCell colSpan={full ? 2 : 1}>{euroValue(offerBrutto)}</StrongCell>
            </TableRow>
            <TableRow>
              <StrongCell colSpan={full ? 3 : 1}>Differenz</StrongCell>
              <StrongCell>{euroValue(offerNetto - allNetto)}</StrongCell>
              <StrongCell colSpan={full ? 2 : 1}>{euroValue(offerBrutto - allBrutto)}</StrongCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

const StrongCell = (props: TableCellProps) => <TableCell sx={{ fontWeight: 'bold', ...(props.sx || {}) }} {...props} />;
