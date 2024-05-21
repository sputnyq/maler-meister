import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useCurrentOffer() {
  const currentOffer = useSelector<AppState, Maybe<AppOffer>>((s) => s.offer.current);
  return currentOffer;
}
