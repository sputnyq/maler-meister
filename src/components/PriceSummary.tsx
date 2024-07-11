import { Box, Table, TableBody, TableCell, TableRow } from '@mui/material';

import { calculatePriceSummary, euroValue } from '../utilities';
import AmountTypography from './AmountTypography';
import { Wrapper } from './Wrapper';

interface Props {
  offerServices: OfferService[];
}

export function PriceSummary({ offerServices }: Readonly<Props>) {
  const { brutto, netto, tax } = calculatePriceSummary(offerServices);

  const sx = { border: 'none' };
  return (
    <Wrapper title="Summe" cardProps={{ sx: { flexGrow: 1 } }}>
      <Box display="flex" justifyContent="end">
        <Table size="small" sx={{ width: 250 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={sx}>
                <strong>Netto</strong>
              </TableCell>
              <TableCell sx={sx}>
                <AmountTypography>{euroValue(netto)}</AmountTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={sx}>
                <strong>MwSt.</strong>
              </TableCell>
              <TableCell sx={sx}>
                <AmountTypography>{euroValue(tax)}</AmountTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={sx}>
                <strong>Brutto</strong>
              </TableCell>
              <TableCell sx={sx}>
                <AmountTypography>{euroValue(brutto)}</AmountTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Wrapper>
  );
}
