import { Box, Typography, TypographyProps } from '@mui/material';

import { useMemo } from 'react';

import { euroValue } from '../../utilities';

interface Props {
  offerServices: BgbOfferService[];
}

function calculatePriceSummary(offerServices: BgbOfferService[]) {
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

  const grayTextProps = useMemo(() => {
    return {
      align: 'right',
      color: 'GrayText',
      variant: 'subtitle1',
    } as TypographyProps;
  }, []);

  return (
    <Box>
      <Typography align="right" color="InfoText" variant="h5">
        Netto: {euroValue(netto)}
      </Typography>
      <Typography {...grayTextProps}>MwSt 19%: {euroValue(tax)}</Typography>
      <Typography {...grayTextProps}>Brutto: {euroValue(brutto)}</Typography>
    </Box>
  );
}
