import { Chip, ChipProps } from '@mui/material';

export function WorkerChip(props: ChipProps) {
  return (
    <Chip
      {...props}
      color="info"
      sx={{
        minWidth: '140px',
        justifyContent: 'space-between',
        ...props.sx,
      }}
    ></Chip>
  );
}
