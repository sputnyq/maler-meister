import { Card, CardContent, CardHeader, Typography } from '@mui/material';

import { useDrop } from 'react-dnd';

import { ColFlexBox } from '../../../components/ColFlexBox';
import { useWorkers } from '../../../hooks/useWorkers';
import { userFullName } from '../../../utilities';
import { WorkerChip } from './WorkerChip';

interface Props {
  constructionPlan: ConstructionPlan;
  onDrop: (username: string) => void;
  onDelete: (username: string) => void;
}

export function ConstructionPlanCard({
  onDrop,
  onDelete,
  constructionPlan: { allocatedPersons, id, name, usernames },
}: Readonly<Props>) {
  const workers = useWorkers();

  const [{ isOver }, drop] = useDrop<{ username: string }, any, { isOver: boolean }>(() => ({
    accept: 'WORKER',
    drop: (arg) => onDrop(arg.username),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getFullWorkerName = (username: string) => {
    const user = workers.find((u) => u.username === username);
    return user ? userFullName(user) : username;
  };

  return (
    <Card ref={drop} data-cid={id} elevation={isOver ? 5 : 1}>
      <CardHeader title={<Typography>{`[${allocatedPersons}] ${name}`}</Typography>} />

      <CardContent sx={{ p: 1 }}>
        <ColFlexBox gap={1} flexDirection={'row'} flexWrap="wrap">
          {usernames.map((username) => (
            <WorkerChip key={username} label={getFullWorkerName(username)} onDelete={() => onDelete(username)} />
          ))}
        </ColFlexBox>
      </CardContent>
    </Card>
  );
}
