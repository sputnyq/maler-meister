import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { loadConstructionById } from '../fetch/api';
import { createInvoicePdf } from '../pdf/InvoicePdf';
import { AppState } from '../store';
import { useCurrentInvoice } from './useCurrentInvoice';

export function usePrintInvoice() {
  const invoice = useCurrentInvoice();

  const allPrintSettings = useSelector<AppState, PrintSettingsRoot[] | undefined>((s) => s.prinSettings.all);

  const printInvoice = useCallback(
    async (printSettingId: number) => {
      const selectedPS = allPrintSettings?.find((ps) => ps.id === printSettingId);
      if (invoice !== null && selectedPS) {
        let construction = undefined;
        if (invoice.constructionId) {
          construction = await loadConstructionById(invoice.constructionId);
        }
        createInvoicePdf({ invoice, printSettings: selectedPS.settings, construction });
      }
    },
    [allPrintSettings, invoice],
  );

  return printInvoice;
}
