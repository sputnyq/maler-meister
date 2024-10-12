import { Box } from '@mui/material';

import { Wrapper } from '../../../components/Wrapper';
import { useIsSmall } from '../../../hooks/useIsSmall';
import CreateInvoiceForOfferButton from './CreateInvoiceForOfferButton';
import OfferInvoices from './OfferInvoices';
import { AccountingAssistant } from './accounting-assistant';

export function OfferAccounting() {
  const isSmall = useIsSmall();

  return (
    <Wrapper title="Rechnungen zum Angebot">
      <Box
        display="flex"
        justifyContent={isSmall ? 'space-between' : 'start'}
        gap={2}
        flexWrap={'wrap'}
      >
        <AccountingAssistant />
        <CreateInvoiceForOfferButton />
      </Box>
      <OfferInvoices />
    </Wrapper>
  );
}
