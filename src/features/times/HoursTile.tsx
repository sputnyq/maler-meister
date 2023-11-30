import { Box, Typography } from '@mui/material';

import { useIsSmall } from '../../hooks/useIsSmall';
import { HoursType } from './HoursOverviewCard';

export function HoursTile({ amount, title }: Readonly<HoursType>) {
  const small = useIsSmall();

  return (
    <Box display="flex" flexDirection={small ? 'row' : 'column'} justifyContent="space-between" alignItems={'cent'}>
      <Typography color={'GrayText'} align="center" variant="subtitle1">
        {title}
      </Typography>
      <Typography align="center" variant={small ? 'h6' : 'h4'}>
        {String(amount).replace('.', ',')}
      </Typography>
    </Box>
  );
}
