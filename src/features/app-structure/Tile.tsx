import { Divider, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from '../../store';

interface Props {
  title: string;
  to: string;
  requiredRoles: UserRole[];
  hasDivider?: boolean;
}
export default function Tile({
  title,
  to,
  requiredRoles,
  hasDivider = true,
  children,
}: React.PropsWithChildren<Props>) {
  const currentRole = useSelector<AppState, UserRole | undefined>((s) => s.login.user?.userRole);

  const hasRight = currentRole && requiredRoles.includes(currentRole);

  if (!hasRight) {
    return null;
  }

  return (
    <>
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemIcon>{children}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </Link>
      {hasDivider && <Divider />}
    </>
  );
}
