import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch } from '../store';
import { initOffer } from '../store/offerReducer';

export function useLoadOffer() {
  const params = useParams();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    //TODO: load offer
    if (Number(params.id) === -1) {
      dispatch(initOffer());
    }
  }, [params, dispatch]);
}
