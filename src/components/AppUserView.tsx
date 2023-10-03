import { Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppState } from '../store';
import { userFullName } from '../utilities';

interface Props {
  user: string | User;
}

export function AppUserView({ user }: Props) {
  const allUsers = useSelector<AppState, User[]>((s) => s.users.all);

  if (typeof user === 'string') {
    const appUser = allUsers.find((u) => u.username === user);

    if (appUser) {
      return <UserObjectRender user={appUser} />;
    }
    return <>{user}</>;
  }

  return <UserObjectRender user={user} />;
}

interface UserObjectRenderProps {
  user: User;
}

function UserObjectRender({ user }: UserObjectRenderProps) {
  return <Typography variant="body2">{userFullName(user)}</Typography>;
}
