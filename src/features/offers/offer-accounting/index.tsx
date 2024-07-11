import { Box } from '@mui/material';

import { Wrapper } from '../../../components/Wrapper';
import CreateInvoiceForOfferButton from './CreateInvoiceForOfferButton';
import OfferInvoices from './OfferInvoices';
import { AccountingAssistant } from './accounting-assistant';

export function OfferAccounting() {
  return (
    <Wrapper title="Rechnungen zum Angebot">
      <Box display="flex" justifyContent="start" gap={2} flexWrap={'wrap'}>
        <AccountingAssistant />
        <CreateInvoiceForOfferButton />
      </Box>
      <OfferInvoices />
    </Wrapper>
  );
}
