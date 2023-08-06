import { Box, Card, CardContent } from '@mui/material';

import CreateInvoiceForOfferButton from './CreateInvoiceForOfferButton';
import OfferInvoices from './OfferInvoices';

export function OfferAccounting() {
  return (
    <Card>
      <CardContent>
        <Box display={'flex'} flexDirection="column" gap={2}>
          <Box>
            <CreateInvoiceForOfferButton />
          </Box>
          <OfferInvoices />
        </Box>
      </CardContent>
    </Card>
  );
}
