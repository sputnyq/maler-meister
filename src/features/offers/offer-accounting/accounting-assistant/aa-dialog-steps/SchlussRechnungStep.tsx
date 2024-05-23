import { Card, CardContent, Typography } from '@mui/material';

import { ColFlexBox } from '../../../../../components/ColFlexBox';
import OfferInvoices from '../../OfferInvoices';

export function SchlussRechnungStep() {
  return (
    <ColFlexBox>
      <OfferInvoices full={false} />

      <Card variant="outlined">
        <CardContent>
          <Typography textAlign="center" variant="h6">
            Für die Schlussrechnung wird die <strong>Differenz</strong> aus Angebot und Summe aller Rechnungen gebildet.
          </Typography>
        </CardContent>
      </Card>
    </ColFlexBox>
  );
}
