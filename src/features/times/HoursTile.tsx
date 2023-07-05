import { Box, Typography } from '@mui/material';

interface Props {
  amount: number;
  title: string;
}
export default function HoursTile({ amount, title }: Props) {
  return (
    <Box>
      <Typography color={'GrayText'} align="center" variant="subtitle1">
        {title}
      </Typography>
      <Typography align="center" variant="h4">
        {String(amount).replace('.', ',')}
      </Typography>
    </Box>
  );
}
