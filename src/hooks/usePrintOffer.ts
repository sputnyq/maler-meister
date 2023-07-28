import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { createOfferPdf } from '../pdf/OfferPdf';
import { AppState } from '../store';
import { useCurrentOffer } from './useCurrentOffer';

export function usePrintOffer() {
  const offer = useCurrentOffer();

  const allPrintSettings = useSelector<AppState, PrintSettingsRoot[] | undefined>((s) => s.prinSettings.all);
  const printOffer = useCallback(
    (printSettingId: number) => {
      const selectedPS = allPrintSettings?.find((ps) => ps.id === printSettingId);
      if (offer !== null && selectedPS) {
        createOfferPdf({ offer: offer, printSettings: selectedPS.settings });
      }
    },
    [allPrintSettings, offer],
  );

  return printOffer;
}
