import { useEffect, useState } from 'react';

import { appRequest } from '../fetch/fetch-client';

export function useUsernames() {
  const [userNames, setUserNames] = useState<string[]>([]);

  useEffect(() => {
    appRequest('get')('users').then((res) => {
      const userNames = res.map((user: User) => user.username);
      setUserNames(userNames);
    });
  }, []);

  return userNames;
}
