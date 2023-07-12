import { Box, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import AddFab from '../components/aa-shared/AddFab';
import OffersGrid from '../features/offers/OffersGrid';

export default function Offers() {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h6">Angebote</Typography>
      <OffersGrid />
      <AddFab onClick={() => navigate('edit/-1')} />
    </Box>
  );
}
