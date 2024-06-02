import { Divider, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { RoleBased } from './RoleBased';

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
}: PropsWithChildren<Props>) {
  return (
    <RoleBased requiredRoles={requiredRoles}>
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemIcon>{children}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </Link>
      {hasDivider && <Divider />}
    </RoleBased>
  );
}
