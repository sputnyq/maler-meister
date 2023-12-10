import { Box, Chip } from '@mui/material';

import { useDrag } from 'react-dnd';

import { userFullName } from '../../../utilities';

interface Props {
  user: User;
}

export function AvailableWorker({ user }: Readonly<Props>) {
  const [{ isDragging, difference }, drag] = useDrag(
    () => ({
      type: 'WORKER',
      item: { username: user.username },
      collect(monitor) {
        return { isDragging: !!monitor.isDragging(), difference: monitor.getDifferenceFromInitialOffset() };
      },
    }),
    [user.username],
  );
  return (
    <Box ref={drag}>
      <Chip
        sx={
          isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
                transform: `translate(${difference?.x}px, ${difference?.y}px)`,
                pointerEvents: 'none',
              }
            : {}
        }
        color={isDragging ? 'secondary' : 'primary'}
        label={userFullName(user)}
      />
    </Box>
  );
}
