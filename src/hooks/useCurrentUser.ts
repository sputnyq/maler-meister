import { useSelector } from 'react-redux';

import { AppState } from '../store';

export function useCurrentUser() {
  const user = useSelector<AppState, Maybe<User>>((s) => s.login.user);
  return user;
}
