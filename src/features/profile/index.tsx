import { Box } from '@mui/material';

import { Wrapper } from '../../components/Wrapper';
import Info from '../info';
import Logout from '../log-in-out/Logout';

export default function Profile() {
  return (
    <Wrapper title="Maler Meister">
      <Info />
      <Box>
        <Logout />
      </Box>
    </Wrapper>
  );
}
