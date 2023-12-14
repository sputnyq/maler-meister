import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../store';

interface Props {
  requiredRoles: UserRole[];
}

export function RoleBased({ requiredRoles, children }: Readonly<PropsWithChildren<Props>>) {
  const currentRole = useSelector<AppState, UserRole | undefined>((s) => s.login.user?.userRole);

  const hasRight = currentRole && requiredRoles.includes(currentRole);

  if (!hasRight) {
    return null;
  }
  return <>{children}</>;
}
