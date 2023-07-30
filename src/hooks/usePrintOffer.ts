import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { createOfferPdf } from '../pdf/OfferPdf';
import { AppState } from '../store';
import { loadConstructionById } from './../fetch/api';
import { useCurrentOffer } from './useCurrentOffer';

export function usePrintOffer() {
  const offer = useCurrentOffer();

  const allPrintSettings = useSelector<AppState, PrintSettingsRoot[] | undefined>((s) => s.prinSettings.all);

  const printOffer = useCallback(
    async (printSettingId: number, type: string) => {
      const selectedPS = allPrintSettings?.find((ps) => ps.id === printSettingId);
      if (offer !== null && selectedPS) {
        let construction = undefined;
        if (offer.constructionId) {
          construction = await loadConstructionById(offer.constructionId);
        }
        createOfferPdf({ offer: offer, printSettings: selectedPS.settings, construction, type });
      }
    },
    [allPrintSettings, offer],
  );

  return printOffer;
}
