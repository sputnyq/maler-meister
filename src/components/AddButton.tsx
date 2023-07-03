import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
