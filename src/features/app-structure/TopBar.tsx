import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Box, IconButton } from '@mui/material';

import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ApplicationToolbar from '../../components/ApplicationToolbar';
import { InvoiceActions } from '../invoices/InvoiceActions';
import OfferActions from '../offers/OfferActions';
import PageName from './PageName';

export default function TopBar() {
  const location = useLocation();
  const isRootLocation = location.pathname === '/';
  const isLoginLocation = location.pathname === '/login';

  const homeButton = useMemo(() => {
    if (isRootLocation || isLoginLocation) {
      //align text to center
      return <Box width={40} />;
    }

    return (
      <Link to="/">
        <IconButton>
          <HomeOutlinedIcon />
        </IconButton>
      </Link>
    );
  }, [isRootLocation, isLoginLocation]);

  const actions = useMemo(() => {
    if (location.pathname.startsWith('/offers/')) {
      return <OfferActions />;
    }
    if (location.pathname.startsWith('/invoices/')) {
      return <InvoiceActions />;
    }
    if (isRootLocation) {
      return (
        <Link to="profile">
          <IconButton>
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Link>
      );
    }
    return <Box width={40} />;
  }, [location, isRootLocation]);

  return (
    <Box flexGrow={1}>
      <ApplicationToolbar position="fixed">
        {homeButton}
        <PageName />
        <Box display="flex" justifyContent={'flex-end'}>
          {actions}
        </Box>
      </ApplicationToolbar>
    </Box>
  );
}
