import { Box, Card, CardContent, Typography } from '@mui/material';

import { calculatePriceSummary, euroValue } from '../utilities';

interface Props {
  offerServices: OfferService[];
}

export function PriceSummary({ offerServices }: Props) {
  const { brutto, netto, tax } = calculatePriceSummary(offerServices);

  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        background: 'rgba(255,255,255,0.90)',
        borderRadius: 0,
      }}
    >
      <CardContent>
        <Box display={'flex'} gap={2} alignItems="center" justifyContent={'flex-end'} flexWrap={'wrap'}>
          <Typography color={'primary'}>Netto: {euroValue(netto)}</Typography>
          <Typography>MwSt: {euroValue(tax)}</Typography>
          <Typography>Brutto: {euroValue(brutto)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
