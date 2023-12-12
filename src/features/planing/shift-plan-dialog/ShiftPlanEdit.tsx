import { Grid } from '@mui/material';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import AppGrid from '../../../components/AppGrid';
import { ColFlexBox } from '../../../components/ColFlexBox';
import { useWorkers } from '../../../hooks/useWorkers';
import { AvailableWorker } from './AvailableWorker';
import { ConstructionPlanCard } from './ConstructionPlan';

interface Props {
  shift: Shift;
  setShift(shift: Shift): void;
}

export function ShiftPlanEdit({ shift, setShift }: Readonly<Props>) {
  const workers = useWorkers();

  const isAvailable = (user: User) => !shift.constructionsPlan.some((cp) => cp.usernames.includes(user.username));
  const availableWorkers = workers.filter(isAvailable);

  const onDrop = (username: string, cid: number) => {
    const nextShift = { ...shift };
    const entry = nextShift.constructionsPlan.find((cp) => Number(cp.id) === Number(cid));
    if (entry) {
      entry.usernames.push(username);
      setShift({ ...shift, ...nextShift });
    }
  };

  const onDelete = (username: string) => {
    const nextShift = { ...shift };
    const entry = nextShift.constructionsPlan.find((cp) => cp.usernames.includes(username));
    if (entry) {
      entry.usernames = entry.usernames.filter((u) => u !== username);
      setShift(nextShift);
    }
  };

  return (
    <ColFlexBox>
      <AppGrid>
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <Grid item xs={6}>
            <ColFlexBox>
              {shift.constructionsPlan.map((cp) => (
                <ConstructionPlanCard
                  key={cp.id}
                  onDelete={onDelete}
                  constructionPlan={cp}
                  onDrop={(username) => onDrop(username, cp.id)}
                />
              ))}
            </ColFlexBox>
          </Grid>

          <Grid item xs={6}>
            <ColFlexBox>
              {availableWorkers.map((user) => (
                <AvailableWorker key={user.username} user={user} />
              ))}
            </ColFlexBox>
          </Grid>
        </DndProvider>
      </AppGrid>
    </ColFlexBox>
  );
}
