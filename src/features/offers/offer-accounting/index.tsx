import { Box, Card, CardContent } from '@mui/material';

import { ColFlexBox } from '../../../components/ColFlexBox';
import CreateInvoiceForOfferButton from './CreateInvoiceForOfferButton';
import OfferInvoices from './OfferInvoices';

export function OfferAccounting() {
  return (
    <Card>
      <CardContent>
        <ColFlexBox>
          <Box>
            <CreateInvoiceForOfferButton />
          </Box>
          <OfferInvoices />
        </ColFlexBox>
      </CardContent>
    </Card>
  );
}
