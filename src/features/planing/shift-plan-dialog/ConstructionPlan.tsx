import { Avatar, Box, Card, CardContent, CardHeader, Chip } from '@mui/material';

import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';

import { ColFlexBox } from '../../../components/ColFlexBox';
import { AppState } from '../../../store';
import { userFullName } from '../../../utilities';

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
  const users = useSelector<AppState, User[]>((s) => s.users.all);

  const [, drop] = useDrop<{ username: string }>(() => ({
    accept: 'WORKER',
    drop: (arg) => onDrop(arg.username),
  }));

  const getFullWorkerName = (username: string) => {
    const user = users.find((u) => u.username === username);
    return user ? userFullName(user) : username;
  };

  return (
    <Card ref={drop} data-cid={id}>
      <CardHeader avatar={<Avatar>{allocatedPersons}</Avatar>} title={name} />

      <CardContent>
        <ColFlexBox>
          {usernames.map((username) => (
            <Box key={username}>
              <Chip label={getFullWorkerName(username)} onDelete={() => onDelete(username)} />
            </Box>
          ))}
        </ColFlexBox>
      </CardContent>
    </Card>
  );
}
