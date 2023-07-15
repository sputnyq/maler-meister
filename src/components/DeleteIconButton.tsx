import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, IconButtonProps } from '@mui/material';

export function DeleteIconButton(props: IconButtonProps) {
  return (
    <IconButton color="error" {...props}>
      <DeleteIcon />
    </IconButton>
  );
}
