import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Button } from '@mui/material';

interface Props {
  value: any;
  onClick(): void;
}

export function RequestDailyViewButton({ value, onClick }: Props) {
  const = useInt
  
  return (
    <Button color="info" startIcon={<OpenInNewOutlinedIcon />} onClick={onClick}>
      {new Intl.DateTimeFormat('de-DE', {
        month: 'short',
        weekday: 'short',
        day: 'numeric',
      }).format(new Date(value))}
    </Button>
  );
}
