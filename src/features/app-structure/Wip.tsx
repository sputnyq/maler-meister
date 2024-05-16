import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import { Box, Typography } from '@mui/material';

export default function Wip() {
  return (
    <Box height={'60vh'} display={'flex'} justifyContent="center" alignItems={'center'} flexDirection="column" gap={4}>
      <Typography variant="h5">Wir arbeiten dran...</Typography>
      <EngineeringOutlinedIcon fontSize="large" />
    </Box>
  );
}
