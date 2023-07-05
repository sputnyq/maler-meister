import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

interface Props {
  onAdd: () => void;
}

export function AddButton({ onAdd }: Props) {
  return (
    <Button size="large" variant="outlined" disableElevation onClick={onAdd}>
      <AddIcon />
    </Button>
  );
}
