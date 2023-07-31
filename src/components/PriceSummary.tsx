import { Box, Typography, useTheme } from '@mui/material';

import { calculatePriceSummary, euroValue } from '../utilities';

interface Props {
  offerServices: OfferService[];
}

export function PriceSummary({ offerServices }: Props) {
  const { brutto, netto, tax } = calculatePriceSummary(offerServices);
  const theme = useTheme();

  return (
    <Box
      margin={-1}
      padding={2}
      sx={{
        flex: 1,
        background: theme.palette.background.default,
      }}
    >
      <Box display={'flex'} gap={2} alignItems="center" justifyContent={'flex-end'} flexWrap={'wrap'}>
        <Typography color={'primary'}>Netto: {euroValue(netto)}</Typography>
        <Typography>MwSt: {euroValue(tax)}</Typography>
        <Typography>Brutto: {euroValue(brutto)}</Typography>
      </Box>
    </Box>
  );
}
