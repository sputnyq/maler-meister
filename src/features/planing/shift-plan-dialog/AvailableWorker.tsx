import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import { Box } from '@mui/material';

import { useDrag } from 'react-dnd';

import { userFullName } from '../../../utilities';
import { WorkerChip } from './WorkerChip';

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
      <WorkerChip
        sx={
          isDragging
            ? {
                backgroundColor: (theme) => theme.palette.grey[500],
                position: 'relative',
                zIndex: 9999,
                transform: `translate(${difference?.x}px, ${difference?.y}px)`,
                pointerEvents: 'none',
              }
            : undefined
        }
        label={userFullName(user)}
        deleteIcon={<DragIndicatorOutlinedIcon />}
        onDelete={() => {}}
      />
    </Box>
  );
}
