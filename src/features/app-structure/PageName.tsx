import { Typography } from '@mui/material';

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageName() {
  const location = useLocation();
  const { pathname } = location;

  const pageName = useMemo(() => {
    switch (pathname) {
      case '/':
        return 'Willkommen';
      case '/login':
        return 'Maler Meister';
      case '/offers':
        return 'Angebote';
      case '/planing':
        return 'Planung';
      case '/time':
        return 'Alle Stunden';
      case '/my-vacations':
        return 'Mein Urlaub';
      case '/constructions':
        return 'Baustellen';
      case '/options':
        return 'Tätigkeiten';
      case '/options/bgb-services':
        return 'Leistungen';
      case '/options/print-settings':
        return 'PDF Einstellungen';
      case '/time-capture':
        return 'Zeiterfassung';
      case '/info':
        return 'Informationen';
      default:
        return '';
    }
  }, [pathname]);
  return (
    <Typography variant="h6" flex={1} align="center">
      {pageName}
    </Typography>
  );
}
