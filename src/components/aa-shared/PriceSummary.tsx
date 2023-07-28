import { Box, Typography, useTheme } from '@mui/material';

import { euroValue } from '../../utilities';

interface Props {
  offerServices: OfferService[];
}

function calculatePriceSummary(offerServices: OfferService[]) {
  const netto = offerServices.reduce((prev, os) => {
    return prev + Number(os.netto || 0);
  }, 0);

  const tax = offerServices
    .filter((os) => os.taxRate > 0)
    .reduce((prev, os) => {
      return prev + Number(os.taxValue || 0);
    }, 0);

  const brutto = netto + tax;

  return { brutto, tax, netto };
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
