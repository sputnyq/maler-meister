import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DocumentActions from '../../components/DocumentActions';
import { invoiceById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentInvoice } from '../../hooks/useCurrentInvoice';
import { AppDispatch, AppState } from '../../store';
import { createInvoice, updateInvoice } from '../../store/invoiceReducer';
import { genericConverter } from '../../utilities';

export function InvoiceActions() {
  const invoice = useCurrentInvoice();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const isDraft = useMemo(() => {
    return typeof invoice?.id === 'undefined';
  }, [invoice?.id]);
  const unsavedChanges = useSelector<AppState, boolean>((s) => s.invoice.unsavedChanges);

  const onDelete = useCallback(async () => {
    if (invoice) {
      await appRequest('delete')(invoiceById(invoice.id));
      navigate('invoices');
    }
  }, [navigate, invoice]);

  const onCopy = useCallback(async () => {
    const res = await appRequest('post')(invoiceById(''), { data: { ...invoice, id: undefined } });
    const next = genericConverter<AppOffer>(res.data);
    navigate(`invoices/${next.id}`);
  }, [invoice, navigate]);

  const onSave = useCallback(async () => {
    if (invoice?.id) {
      dispatch(updateInvoice());
    } else {
      await dispatch(
        createInvoice({
          cb: (id: string | number) => {
            navigate(`/offers/${id}`);
          },
        }),
      );
    }
  }, [invoice, dispatch, navigate]);

  return (
    <DocumentActions
      isDraft={isDraft}
      unsavedChanges={unsavedChanges}
      onDelete={onDelete}
      onCopy={onCopy}
      onSave={onSave}
    />
  );
}
