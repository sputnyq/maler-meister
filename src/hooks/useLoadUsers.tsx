import { useEffect, useState } from 'react';

import { appRequest } from '../fetch/fetch-client';
import { buildQuery } from '../utils';
import { useCurrentUser } from './useCurrentUser';

export function useLoadUsers() {
  const user = useCurrentUser();
  const [userNames, setUserNames] = useState<User[]>([]);

  useEffect(() => {
    const query = buildQuery({
      filters: {
        tenant: user?.tenant,
      },
    });
    appRequest('get')(`users?${query}`).then((res) => {
      setUserNames(res);
    });
  }, [user]);

  return userNames;
}
