import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../store';
import { loadAllJobs } from '../store/jobsReducer';

export function useLoadJobs() {
  const appJobs = useSelector<AppState, AppJob[] | undefined>((s) => s.jobs.jobs);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!appJobs) {
      dispatch(loadAllJobs({}));
    }
  });
}
