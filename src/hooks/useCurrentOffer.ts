import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useCurrentOffer() {
  const currentOffer = useSelector<AppState, Offer | null>((s) => s.offer.current);
  return currentOffer;
}
