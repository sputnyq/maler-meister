import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AppDispatch } from '../../store';
import { loadActiveConstructions } from '../../store/constructionReducer';
import { loadAllJobs } from '../../store/jobsReducer';
import { loadPrintSettings } from '../../store/printSettingsReducer';
import { loadServices } from '../../store/servicesReducer';
import { loadUsers } from '../../store/usersReducer';
import { LoadingScreen } from './LoadingScreen';

type LoadingState = 'loading' | 'ready';

export default function AppLoader({ children }: React.PropsWithChildren) {
  const [loadingState, setLoadingState] = useState<LoadingState>('ready');

  const user = useCurrentUser();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user !== null) {
      const { userRole } = user;
      setLoadingState('loading');

      const actions: any[] = [loadAllJobs];
      if (userRole === 'worker') {
        actions.push(loadActiveConstructions);
      }

      if (userRole === 'admin') {
        actions.push(loadPrintSettings);
        actions.push(loadServices);
        actions.push(loadUsers);
      }
      Promise.allSettled(actions.map((a) => dispatch(a())))
        .then(() => {
          console.log('all done');
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
