import AddIcon from '@mui/icons-material/AddOutlined';
import { Box, Fab, useTheme } from '@mui/material';

interface Props {
  onClick?(): void;
}

export default function AddFab({ onClick }: Readonly<Props>) {
  const theme = useTheme();

  return (
    <Box position={'fixed'} zIndex={100} bottom={theme.spacing(4)} right={theme.spacing(4)}>
      <Fab onClick={onClick} size="large" color="primary">
        <AddIcon />
      </Fab>
    </Box>
  );
}
