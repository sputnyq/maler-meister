import { Avatar, Card, CardContent, CardHeader, Chip } from '@mui/material';

import { DragEventHandler } from 'react';
import { useSelector } from 'react-redux';

import { ColFlexBox } from '../../../components/ColFlexBox';
import { AppState } from '../../../store';
import { userFullName } from '../../../utilities';

interface Props {
  constructionPlan: ConstructionPlan;
  drop: DragEventHandler<HTMLDivElement>;
  onDelete: (username: string) => void;
}

export function ConstructionPlanCard({
  drop,
  onDelete,
  constructionPlan: { allocatedPersons, id, name, usernames },
}: Readonly<Props>) {
  const users = useSelector<AppState, User[]>((s) => s.users.all);

  const getFullWorkerName = (username: string) => {
    const user = users.find((u) => u.username === username);
    return user ? userFullName(user) : username;
  };

  return (
    <Card onDrop={drop} key={id} data-cid={id} onDragOver={(ev) => ev.preventDefault()}>
      <CardHeader avatar={<Avatar>{allocatedPersons}</Avatar>} title={name} />

      <CardContent>
        <ColFlexBox>
          {usernames.map((username) => (
            <Chip key={username} label={getFullWorkerName(username)} onDelete={() => onDelete(username)} />
          ))}
        </ColFlexBox>
      </CardContent>
    </Card>
  );
}
