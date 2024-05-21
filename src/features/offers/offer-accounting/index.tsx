import { Box, Card, CardContent } from '@mui/material';

import { ColFlexBox } from '../../../components/ColFlexBox';
import CreateInvoiceForOfferButton from './CreateInvoiceForOfferButton';
import OfferInvoices from './OfferInvoices';
import { AccountingAssistant } from './accounting-assistant';

export function OfferAccounting() {
  return (
    <Card>
      <CardContent>
        <ColFlexBox>
          <Box display="flex" justifyContent="start" gap={2} flexWrap={'wrap'}>
            <AccountingAssistant />
            <CreateInvoiceForOfferButton />
          </Box>
          <OfferInvoices />
        </ColFlexBox>
      </CardContent>
    </Card>
  );
}
