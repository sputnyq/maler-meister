import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AppDispatch, AppState } from '../../store';
import { loadActiveConstructions } from '../../store/constructionReducer';
import { loadAllJobs } from '../../store/jobsReducer';
import { setAppLoaded } from '../../store/loginReducer';
import { loadPrintSettings } from '../../store/printSettingsReducer';
import { loadServices } from '../../store/servicesReducer';
import { loadUsers } from '../../store/usersReducer';
import { LoadingScreen } from './LoadingScreen';

export default function AppLoader({ children }: React.PropsWithChildren) {
  const appLoaded = useSelector<AppState, boolean>((s) => s.login.appLoaded);

  const user = useCurrentUser();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user !== null && !appLoaded) {
      const { userRole } = user;

      const actions: any[] = [loadAllJobs];
      if (userRole === 'worker') {
        actions.push(loadActiveConstructions);
      }

      if (['admin', 'accountant'].includes(userRole)) {
        actions.push(loadServices);
        actions.push(loadPrintSettings);
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
          dispatch(setAppLoaded());
        });
    }
  }, [appLoaded, dispatch, user]);

  if (appLoaded) {
    return <>{children}</>;
  }

  return <LoadingScreen />;
}
