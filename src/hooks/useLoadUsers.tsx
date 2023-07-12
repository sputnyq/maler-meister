import { useEffect, useState } from 'react';

import { appRequest } from '../fetch/fetch-client';
import { buildQuery } from '../utilities';
import { useCurrentUser } from './useCurrentUser';

export function useLoadUsers() {
  const user = useCurrentUser();
  const [usersByTenant, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const query = buildQuery({
      filters: {
        tenant: user?.tenant,
      },
      sort: { '0': 'firstName:asc' },
    });
    appRequest('get')(`users?${query}`).then((res) => {
      setUsers(res);
    });
  }, [user]);

  return usersByTenant;
}
