import { Typography } from '@mui/material';

import { useMemo } from 'react';
import { useLocation } from 'react-router';

export default function PageName() {
  const { pathname } = useLocation();

  const retrieveId = (p: string) => {
    return p.split('/').reverse()[0];
  };

  const pageName = useMemo(() => {
    if (pathname == '/offers/-1') {
      return 'Angebot: Neu';
    }

    if (pathname == '/invoices/-1') {
      return 'Rechnung: Neu';
    }

    if (/\/offers\/\d/.test(pathname)) {
      return `Angebot: ${retrieveId(pathname)}`;
    }

    if (/\/invoices\/\d/.test(pathname)) {
      return `Rechnung: ${retrieveId(pathname)}`;
    }
    switch (pathname) {
      case '/':
        return 'Willkommen';
      case '/login':
        return 'Maler Meister';
      case '/offers':
        return 'Angebote';
      case '/invoices':
        return 'Rechnungen';
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
