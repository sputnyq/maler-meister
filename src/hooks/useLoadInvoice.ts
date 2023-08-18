import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch } from '../store';
import { initInvoice, loadInvoice } from '../store/invoiceReducer';

export function useLoadInvoice() {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (Number(id) === -1) {
      dispatch(initInvoice());
    } else if (id) {
      dispatch(loadInvoice(id));
    }
  }, [id, dispatch]);
}
