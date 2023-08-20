import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch } from '../store';
import { initOffer, loadOffer } from '../store/offerReducer';

export function useLoadOffer() {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (Number(id) === -1) {
      dispatch(initOffer());
    } else if (id) {
      dispatch(loadOffer(id));
    }
  }, [id, dispatch]);
}
