import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button } from '@mui/material';

interface Props {
  onAdd: () => void;
}

export function AddButtonWidget({ onAdd }: Props) {
  return (
    <Button color="primary" variant="outlined" disableElevation onClick={onAdd}>
      <AddOutlinedIcon />
    </Button>
  );
}
