import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

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
      //align text to center
      return <Box width={40} />;
    }

    return (
      <IconButton color="inherit" onClick={() => navigate('/')}>
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

  const pageName = useMemo(() => {
    if (isLoginLocation) {
      return 'Maler Meister';
    }
    if (isRootLocation) {
      return 'Willkommen';
    }

    return null;
  }, [isLoginLocation, isRootLocation]);

  return (
    <Box flexGrow={1}>
      <AppBar position="fixed" elevation={1} color="primary">
        <Toolbar variant="regular">
          {homeButton}
          <Typography variant="h6" flex={1} align="center">
            {pageName}
          </Typography>
          <Box display="flex" justifyContent={'flex-end'}>
            {actions}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
