import { Typography } from '@mui/material';

import { calculatePriceSummary, euroValue } from '../utilities';

interface Props {
  offerServices: OfferService[] | undefined;
}
export default function OfferServicesAmountGridCell({ offerServices = [] }: Readonly<Props>) {
  const { netto } = calculatePriceSummary(offerServices);

  return (
    <Typography variant="inherit" align="right" fontFamily={'monospace'}>
      {euroValue(netto)}
    </Typography>
  );
}
