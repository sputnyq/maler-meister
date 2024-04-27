import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { InvoiceActions } from '../invoices/InvoiceActions';
import Logout from '../log-in-out/Logout';
import OfferActions from '../offers/OfferActions';
import PageName from './PageName';

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
    if (location.pathname.startsWith('/offers/')) {
      return <OfferActions />;
    }
    if (location.pathname.startsWith('/invoices/')) {
      return <InvoiceActions />;
    }
    if (isRootLocation) {
      return <Logout />;
    }
    return <Box width={40} />;
  }, [location, isRootLocation]);

  return (
    <Box flexGrow={1}>
      <AppBar position="fixed" elevation={0} color="transparent">
        <Toolbar variant="dense">
          {homeButton}
          <PageName />
          <Box display="flex" justifyContent={'flex-end'}>
            {actions}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
