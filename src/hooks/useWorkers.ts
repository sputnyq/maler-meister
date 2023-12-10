import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useWorkers() {
  const allUsers = useSelector<AppState, User[]>((s) => s.users.all);

  const workers = allUsers.filter((user) => user.userRole === 'worker');
  return workers;
}
