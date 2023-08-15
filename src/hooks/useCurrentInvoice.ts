import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useCurrentInvoice() {
  const currentInvoice = useSelector<AppState, AppInvoice | null>((s) => s.invoice.current);
  return currentInvoice;
}
