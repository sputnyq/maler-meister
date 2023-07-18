import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useCurrentOffer() {
  const currentOffer = useSelector<AppState, AppOffer | null>((s) => s.offer.current);
  return currentOffer;
}
