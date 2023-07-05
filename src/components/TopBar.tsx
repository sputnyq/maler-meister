import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Logout from '../features/log-in-out/Logout';
import OfferActions from './OfferActions';

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootLocation = location.pathname === '/';
  const isLoginLocation = location.pathname === '/login';

  const homeButton = useMemo(() => {
    if (isRootLocation || isLoginLocation) {
      return null;
    }

    return (
      <IconButton color="primary" onClick={() => navigate('/')}>
        <HomeOutlinedIcon />
      </IconButton>
    );
  }, [isRootLocation, isLoginLocation, navigate]);

  const actions = useMemo(() => {
    if (location.pathname.startsWith('/offers/edit')) {
      return <OfferActions />;
    }
    if (isRootLocation) {
      return <Logout />;
    }
    return null;
  }, [location, isRootLocation]);

  return (
    <Box flexGrow={1}>
      <AppBar position="fixed" elevation={0} variant="outlined" color="inherit">
        <Toolbar variant="dense">
          {homeButton}
          <Box flex={1} display="flex" justifyContent={'flex-end'}>
            {actions}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
