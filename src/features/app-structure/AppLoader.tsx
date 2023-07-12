import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AppDispatch } from '../../store';
import { loadActiveConstructions } from '../../store/constructionReducer';
import { loadAllJobs } from '../../store/jobsReducer';
import { LoadingScreen } from './LoadingScreen';

type LoadingState = 'loading' | 'ready';

export default function AppLoader({ children }: React.PropsWithChildren) {
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');

  const user = useCurrentUser();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user !== null) {
      Promise.allSettled([dispatch(loadAllJobs()), dispatch(loadActiveConstructions())])
        .then(() => {
          console.log('OK');
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoadingState('ready');
        });
    }
  }, [dispatch, user]);

  switch (loadingState) {
    case 'loading': {
      return <LoadingScreen />;
    }
    case 'ready': {
      return <>{children}</>;
    }
    default:
      return null;
  }
}
