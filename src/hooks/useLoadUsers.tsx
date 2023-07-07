import { useEffect, useState } from 'react';

import { appRequest } from '../fetch/fetch-client';

export function useLoadUsers() {
  const [userNames, setUserNames] = useState<User[]>([]);

  useEffect(() => {
    appRequest('get')('users').then((res) => {
      setUserNames(res);
    });
  }, []);

  return userNames;
}
