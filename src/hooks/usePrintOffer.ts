import { useCallback } from 'react';

import { createOfferPdf } from '../pdf/OfferPdf';
import { useCurrentOffer } from './useCurrentOffer';

export function usePrintOffer() {
  const offer = useCurrentOffer();
  const printOffer = useCallback(() => {
    if (offer !== null) {
      createOfferPdf({ offer: offer });
    }
  }, [offer]);

  return printOffer;
}
