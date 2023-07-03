import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../store';
import { loadActiveConstructions } from '../store/constructionReducer';

export function useLoadActiveConstructions() {
  const activeConstructions = useSelector<AppState, Construction[] | undefined>(
    (s) => s.construction.activeConstructions,
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!activeConstructions) {
      dispatch(loadActiveConstructions());
    }
  }, [dispatch, activeConstructions]);
}
