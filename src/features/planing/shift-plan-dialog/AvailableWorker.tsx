import { Chip } from '@mui/material';

import { DragEventHandler } from 'react';

import { userFullName } from '../../../utilities';

interface Props {
  user: User;
  onDragStart: DragEventHandler<HTMLDivElement>;
}

export function AvailableWorker({ onDragStart, user }: Readonly<Props>) {
  return <Chip key={user.username} label={userFullName(user)} onDragStart={onDragStart} draggable></Chip>;
}
